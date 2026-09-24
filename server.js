import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.dirname(fileURLToPath(import.meta.url));

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());

app.use(
    express.json({
        limit: "1mb"
    })
);

// Serve the GROVIA frontend
app.use(express.static(ROOT_DIR));
app.get("/", (req, res) => {
    res.sendFile(path.join(ROOT_DIR, "index.html"));
});

// ===============================
// OPENAI
// ===============================

let client;

function getOpenAIClient() {

    if (!client && process.env.OPENAI_API_KEY) {

        client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    return client;
}

// ===============================
// GROVIA AI TOOLS
// ===============================

const tools = [
    {
        type: "function",

        name: "get_grovia_snapshot",

        description:
            "Get current GROVIA data about employees, departments, attendance, leave, followups, companies, returns and tasks.",

        parameters: {
            type: "object",

            properties: {},

            additionalProperties: false
        }
    },

    {
        type: "function",

        name: "save_grovia_update",

        description:
            "Save an update when the supervisor explicitly asks to record or modify something in GROVIA.",

        parameters: {
            type: "object",

            properties: {

                type: {
                    type: "string",

                    enum: [
                        "followup",
                        "task",
                        "attendance",
                        "leave",
                        "company",
                        "note"
                    ]
                },

                title: {
                    type: "string"
                },

                target: {
                    type: "string"
                },

                status: {
                    type: "string"
                },

                note: {
                    type: "string"
                },

                date: {
                    type: "string"
                }
            },

            required: [
                "type",
                "title"
            ],

            additionalProperties: false
        }
    }
];

// ===============================
// SYSTEM PROMPT
// ===============================

const SYSTEM_PROMPT = `
أنت GROVIA AI.

أنت مساعد ذكي لمشرف Grocery.

تتعامل مع المشرف باللهجة المصرية بشكل طبيعي
ومحترم ومختصر وعملي.

وظيفتك مساعدة المشرف في:

- الموظفين
- الأقسام
- الحضور والغياب
- الإجازات
- أيام الراحة
- النظافة والمتابعة
- الشركات
- المرتجعات
- المهام
- التقارير
- أولويات اليوم

القواعد المهمة:

1. لا تخترع أي معلومة.

2. لو السؤال يحتاج بيانات من GROVIA
استخدم get_grovia_snapshot.

3. لو المشرف طلب تسجيل أو تعديل شيء
استخدم save_grovia_update.

4. لا تقل إنك سجلت أو عدلت شيئاً
إلا بعد استخدام أداة الحفظ.

5. لو الطلب غير واضح اسأل سؤالاً واحداً محدداً.

6. افهم الكلام المصري الطبيعي حتى لو مكتوب بالعامية.

7. لا تكرر كلام المشرف بدون فائدة.

8. أعطِ الإجابة العملية مباشرة.
`;

// ===============================
// NORMALIZE DATA
// ===============================

function normalizeSnapshot(snapshot) {

    if (!snapshot || typeof snapshot !== "object") {

        return {
            employees: [],
            followups: [],
            companies: [],
            tasks: []
        };
    }

    return {

        employees: Array.isArray(snapshot.employees)
            ? snapshot.employees
            : [],

        followups: Array.isArray(snapshot.followups)
            ? snapshot.followups
            : [],

        companies: Array.isArray(snapshot.companies)
            ? snapshot.companies
            : [],

        tasks: Array.isArray(snapshot.tasks)
            ? snapshot.tasks
            : []
    };
}

// ===============================
// HEALTH CHECK
// ===============================

app.get("/api/health", (req, res) => {

    res.json({

        ok: true,

        service: "GROVIA AI",

        configured: Boolean(
            process.env.OPENAI_API_KEY
        )
    });
});

// ===============================
// AI ENDPOINT
// ===============================

app.post("/api/ai", async (req, res) => {

    try {

        // -------------------------------
        // CHECK API KEY
        // -------------------------------

        const openai = getOpenAIClient();

        if (!openai) {

            return res.status(500).json({

                ok: false,

                error:
                    "OPENAI_API_KEY غير موجود في ملف .env"
            });
        }

        // -------------------------------
        // USER MESSAGE
        // -------------------------------

        const message = String(
            req.body?.message || ""
        ).trim();

        if (!message) {

            return res.status(400).json({

                ok: false,

                error:
                    "اكتب رسالة أولاً"
            });
        }

        // -------------------------------
        // GROVIA DATA
        // -------------------------------

        const snapshot =
            normalizeSnapshot(
                req.body?.snapshot
            );

        // -------------------------------
        // CHAT HISTORY
        // -------------------------------

        const history =
            Array.isArray(req.body?.history)
                ? req.body.history.slice(-8)
                : [];

        // -------------------------------
        // AI INPUT
        // -------------------------------

        const input = [

            {
                role: "developer",

                content:
                    SYSTEM_PROMPT
            },

            ...history.map((item) => ({

                role:
                    item.role === "assistant"
                        ? "assistant"
                        : "user",

                content:
                    String(
                        item.content || ""
                    )
            })),

            {
                role: "user",

                content: message
            }
        ];

        // -------------------------------
        // FIRST AI REQUEST
        // -------------------------------

        let response =
            await openai.responses.create({

                model:
                    process.env.OPENAI_MODEL ||
                    "gpt-5.6-luna",

                input,

                tools,

                tool_choice: "auto"
            });

        // -------------------------------
        // TOOL OUTPUTS
        // -------------------------------

        const toolOutputs = [];

        const updates = [];

        // -------------------------------
        // PROCESS AI TOOLS
        // -------------------------------

        for (
            const item of response.output || []
        ) {

            if (
                item.type !==
                "function_call"
            ) {
                continue;
            }

            const args =
                item.arguments
                    ? JSON.parse(
                        item.arguments
                    )
                    : {};

            // ---------------------------
            // READ GROVIA DATA
            // ---------------------------

            if (
                item.name ===
                "get_grovia_snapshot"
            ) {

                toolOutputs.push({

                    type:
                        "function_call_output",

                    call_id:
                        item.call_id,

                    output:
                        JSON.stringify(
                            snapshot
                        )
                });
            }

            // ---------------------------
            // SAVE GROVIA UPDATE
            // ---------------------------

            if (
                item.name ===
                "save_grovia_update"
            ) {

                updates.push(args);

                toolOutputs.push({

                    type:
                        "function_call_output",

                    call_id:
                        item.call_id,

                    output:
                        JSON.stringify({

                            ok: true,

                            message:
                                "تم تجهيز التعديل ليقوم GROVIA بتطبيقه داخل النظام.",

                            update: args
                        })
                });
            }
        }

        // -------------------------------
        // SECOND AI REQUEST
        // -------------------------------

        if (
            toolOutputs.length > 0
        ) {

            response =
                await openai.responses.create({

                    model:
                        process.env.OPENAI_MODEL ||
                        "gpt-5.6-luna",

                    previous_response_id:
                        response.id,

                    input:
                        toolOutputs,

                    tools
                });
        }

        // -------------------------------
        // SEND RESPONSE
        // -------------------------------

        res.json({

            ok: true,

            text:
                response.output_text ||
                "تمام، محتاج تفاصيل أكتر عشان أساعدك.",

            updates
        });

    } catch (error) {

        console.error(
            "GROVIA AI ERROR:",
            error
        );

        res.status(500).json({

            ok: false,

            error:
                error?.message ||
                "حصل خطأ أثناء الاتصال بالـAI"
        });
    }
});

// ===============================
// LOCAL SERVER
// ===============================

if (process.env.NODE_ENV !== "production") {

    app.listen(PORT, () => {

        console.log("");
        console.log(
            "================================="
        );

        console.log(
            "       GROVIA AI ONLINE"
        );

        console.log(
            "================================="
        );

        console.log(
            `Server: http://localhost:${PORT}`
        );

        console.log("");
    });
}

// ===============================
// EXPORT FOR VERCEL
// ===============================

export default app;