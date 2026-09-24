import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.dirname(fileURLToPath(import.meta.url));

function getSafeErrorMessage(error) {

    const message =
        error?.message ||
        "حصل خطأ أثناء الاتصال بالـAI";

    return String(message)
        .replace(/(?:sk|gsk)_[^\s"'`]+/g, "[redacted]")
        .slice(0, 300);
}

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
app.get("/css/styles.css", (req, res) => {
    res.sendFile(path.join(ROOT_DIR, "css", "style.css"));
});
app.get("/js/app.js", (req, res) => {
    res.sendFile(path.join(ROOT_DIR, "js", "script.js"));
});

// ===============================
// GROQ
// ===============================

let client;
let modelPromise;

function getGroqClient() {

    if (!client && process.env.GROQ_API_KEY) {

        client = new OpenAI({
            apiKey: process.env.GROQ_API_KEY,
            baseURL: "https://api.groq.com/openai/v1"
        });
    }

    return client;
}

async function getGroqModel(groq) {

    if (process.env.GROQ_MODEL) {
        return process.env.GROQ_MODEL;
    }

    if (!modelPromise) {
        modelPromise = groq.models.list().then((page) => {
            const excludedModel = /whisper|tts|speech|audio|embed|guard|safety|moderation|prompt-guard/i;
            const model = page.data.find((item) =>
                item?.id && !excludedModel.test(item.id)
            );

            if (!model) {
                throw new Error(
                    "لم يعثر Groq على موديل محادثة متاح للحساب. اضبط GROQ_MODEL يدويًا."
                );
            }

            return {
                id: model.id,
                supportsTools: Boolean(
                    model.supported_features?.includes("tools") ||
                    model.capabilities?.tools ||
                    model.supports_tools
                )
            };
        });
    }

    return modelPromise;
}

// ===============================
// GROVIA AI TOOLS
// ===============================

const tools = [
    {
        type: "function",

        function: {
            name: "get_grovia_snapshot",
            description:
                "Get current GROVIA data about employees, departments, attendance, leave, followups, companies, returns and tasks.",
            parameters: {
                type: "object",
                properties: {},
                additionalProperties: false
            }
        }
    },

    {
        type: "function",

        function: {
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
            process.env.GROQ_API_KEY
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

        const groq = getGroqClient();

        if (!groq) {

            return res.status(500).json({

                ok: false,

                error:
                    "GROQ_API_KEY غير موجود في إعدادات الخادم"
            });
        }

        const model = await getGroqModel(groq);

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

        const messages = [

            {
                role: "system",

                content:
                    `${SYSTEM_PROMPT}

بيانات GROVIA الحالية:
${JSON.stringify(snapshot)}

إذا لم تكن أدوات استدعاء الدوال متاحة، استخدم هذه البيانات للإجابة مباشرة.
لا تدّعي حفظ أي تعديل؛ اطلب من المشرف استخدام نماذج GROVIA لتسجيل التغييرات.`
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
            await groq.chat.completions.create({

                model: model.id,

                    messages,

                    ...(model.supportsTools ? { tools, tool_choice: "auto" } : {}),

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
            const item of             response.choices?.[0]?.message?.tool_calls || []
        ) {

            const args =
                item.function?.arguments
                    ? JSON.parse(
                        item.function.arguments
                    )
                    : {};

            // ---------------------------
            // READ GROVIA DATA
            // ---------------------------

            if (
                item.function?.name ===
                "get_grovia_snapshot"
            ) {

                toolOutputs.push({

                    role:
                        "tool",

                    tool_call_id:
                        item.id,

                    content:
                        JSON.stringify(
                            snapshot
                        )
                });
            }

            // ---------------------------
            // SAVE GROVIA UPDATE
            // ---------------------------

            if (
                item.function?.name ===
                "save_grovia_update"
            ) {

                updates.push(args);

                toolOutputs.push({

                    role:
                        "tool",

                    tool_call_id:
                        item.id,

                    content:
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
                await groq.chat.completions.create({

                    model: model.id,

                    messages: [
                        ...messages,
                        response.choices[0].message,
                        ...toolOutputs
                    ],

                    tools
                });
        }

        // -------------------------------
        // SEND RESPONSE
        // -------------------------------

        res.json({

            ok: true,

            text:
                response.choices?.[0]?.message?.content ||
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
                getSafeErrorMessage(error)
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