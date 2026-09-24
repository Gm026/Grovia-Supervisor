/* =========================================================
   GROVIA 2.0
   Grocery Supervisor Assistant
========================================================= */

/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEY = "grovIA_supervisor_data_v2";

/* =========================================================
   DEFAULT DATA
========================================================= */

const defaultData = {
  employees: [
    {
      id: 1,
      name: "يوسف حسين",
      department: "حلويات",
      role: "مسؤول قسم الحلويات",
      rest: "الاثنين",
      status: "present",
    },

    {
      id: 2,
      name: "اسلام محمد",
      department: "ساخنة والباردة",
      role: "مسؤول المشروبات الساخنة والباردة",
      rest: "الجمعة",
      status: "present",
    },

    {
      id: 3,
      name: "امين",
      department: "استراتيجي ومعلبات وهوم بيك",
      role: "مسؤول القسم",
      rest: "الأحد",
      status: "present",
    },

    {
      id: 4,
      name: "حسين",
      department: "فريشات ومخبوزات وبيض",
      role: "مسؤول الفريش والمخبوزات",
      rest: "الجمعة",
      status: "present",
    },

    {
      id: 5,
      name: "جومانة",
      department: "كوزماتيكس وورقيات",
      role: "مسؤولة القسم",
      rest: "الأربعاء",
      status: "present",
    },

    {
      id: 6,
      name: "حسن ابراهيم",
      department: "اغذائي",
      role: "مسؤول الأغذية",
      rest: "راحة مجمعة",
      status: "present",
    },

    {
      id: 7,
      name: "احمد عصام",
      department: "دريسنج وبقوليات وزيوت وخلطات",
      role: "مسؤول القسم",
      rest: "الجمعة",
      status: "present",
    },

    {
      id: 8,
      name: "هاني محمد",
      department: "افطار",
      role: "مسؤول الإفطار",
      rest: "راحة مجمعة",
      status: "present",
    },

    {
      id: 9,
      name: "علاء فوزي",
      department: "مشروبات غازية ومالتي",
      role: "مسؤول المشروبات",
      rest: "راحة مجمعة",
      status: "present",
    },
  ],

  followups: [
    {
      id: 1,
      department: "حلويات",
      responsible: "يوسف حسين",
      checks: {
        cleanliness: false,
        arrangement: true,
        prices: false,
        expiry: true,
      },
    },

    {
      id: 2,
      department: "مشروبات",
      responsible: "علاء فوزي",
      checks: {
        cleanliness: false,
        arrangement: false,
        prices: true,
        expiry: false,
      },
    },

    {
      id: 3,
      department: "اغذائي",
      responsible: "حسن ابراهيم",
      checks: {
        cleanliness: true,
        arrangement: true,
        prices: true,
        expiry: true,
      },
    },

    {
      id: 4,
      department: "فريشات ومخبوزات",
      responsible: "حسين",
      checks: {
        cleanliness: false,
        arrangement: false,
        prices: false,
        expiry: true,
      },
    },

    {
      id: 5,
      department: "كوزماتيكس وورقيات",
      responsible: "جومانة",
      checks: {
        cleanliness: true,
        arrangement: false,
        prices: true,
        expiry: false,
      },
    },

    {
      id: 6,
      department: "دريسنج وبقوليات",
      responsible: "احمد عصام",
      checks: {
        cleanliness: true,
        arrangement: true,
        prices: false,
        expiry: true,
      },
    },
  ],

  companies: [
    {
      id: 1,
      name: "شركة النور",
      returns: true,
      items: "حلويات - بسكويت - منتجات غذائية",
      note: "تقبل المرتجع طبقًا لشروط الشركة.",
    },

    {
      id: 2,
      name: "شركة الخير",
      returns: false,
      items: "معلبات - صلصات",
      note: "لا تقبل المرتجع بعد الاستلام.",
    },

    {
      id: 3,
      name: "شركة الأمل",
      returns: true,
      items: "زيوت - خل - خلطات",
      note: "المرتجع يحتاج مراجعة الفاتورة.",
    },
  ],

  tasks: [
    {
      id: 1,
      title: "مراجعة أسعار قسم الأغذية",
      description: "مراجعة الأسعار والتأكد من مطابقتها.",
      status: "todo",
      priority: "high",
    },

    {
      id: 2,
      title: "متابعة نظافة قسم المشروبات",
      description: "عمل جولة على القسم.",
      status: "doing",
      priority: "medium",
    },

    {
      id: 3,
      title: "مراجعة تواريخ الصلاحية",
      description: "فحص المنتجات القريبة من الانتهاء.",
      status: "todo",
      priority: "high",
    },

    {
      id: 4,
      title: "متابعة ترتيب الرفوف",
      description: "التأكد من شكل العرض.",
      status: "done",
      priority: "low",
    },
  ],
};

/* =========================================================
   LOAD DATA
========================================================= */

let data = loadData();

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error(error);
    }
  }

  return JSON.parse(JSON.stringify(defaultData));
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  renderAll();
}

/* =========================================================
   HELPERS
========================================================= */

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => document.querySelectorAll(selector);

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function todayName() {
  const days = [
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];

  return days[new Date().getDay()];
}

function currentDate() {
  return new Intl.DateTimeFormat("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());
}

function getEmployee(id) {
  return data.employees.find((employee) => employee.id == id);
}

function statusText(status) {
  const map = {
    present: "حاضر",
    absent: "غائب",
    leave: "إجازة",
  };

  return map[status] || status;
}

function statusClass(status) {
  return status;
}

/* =========================================================
   NAVIGATION
========================================================= */

const pageNames = {
  dashboard: "لوحة التحكم",

  employees: "الموظفين",

  followups: "المتابعات",

  schedule: "الحضور والإجازات",

  companies: "الشركات والمرتجعات",

  tasks: "المهام",

  reports: "التقارير",
};

function navigate(page) {
  $$(".page").forEach((p) => p.classList.remove("active"));

  $(`#${page}Page`)?.classList.add("active");

  $$(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.page === page);
  });

  $$(".mobile-nav-item[data-page]").forEach((item) => {
    item.classList.toggle("active", item.dataset.page === page);
  });

  $("#pageTitle").textContent = pageNames[page] || "GROVIA";

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  renderAll();
}

$$(".nav-item").forEach((item) => {
  item.addEventListener("click", () => {
    navigate(item.dataset.page);
  });
});

$$("[data-page]").forEach((button) => {
  if (button.classList.contains("nav-item")) return;

  button.addEventListener("click", () => {
    navigate(button.dataset.page);
  });
});

/* =========================================================
   DASHBOARD
========================================================= */

function renderDashboard() {
  const total = data.employees.length;

  const present = data.employees.filter((e) => e.status === "present").length;

  const absent = data.employees.filter((e) => e.status === "absent").length;

  const leave = data.employees.filter((e) => e.status === "leave").length;

  const incompleteFollowups = data.followups.filter((f) => {
    const values = Object.values(f.checks);

    return values.some((v) => !v);
  }).length;

  const lateTasks = data.tasks.filter((task) => task.status !== "done").length;

  $("#totalEmployees").textContent = total;

  $("#presentCount").textContent = present;

  $("#attentionCount").textContent = incompleteFollowups;

  $("#lateTasksCount").textContent = lateTasks;

  $("#briefAttendance").textContent =
    `${present} حاضر · ${absent} غائب · ${leave} إجازة`;

  $("#briefFollowups").textContent = `${incompleteFollowups} قسم يحتاج متابعة`;

  $("#briefTasks").textContent = `${lateTasks} مهمة غير مكتملة`;

  $("#briefAlerts").textContent = buildAlerts().length;

  renderAttention();

  renderMiniEmployees();

  updateNotificationCount();

  $("#currentDate").textContent = currentDate();
}

/* =========================================================
   ATTENTION CENTER
========================================================= */

function buildAlerts() {
  const alerts = [];

  data.employees.forEach((employee) => {
    if (employee.status === "absent") {
      alerts.push({
        type: "red",
        title: `${employee.name} غائب اليوم`,
        description: `قسم ${employee.department}`,
      });
    }

    if (employee.status === "leave") {
      alerts.push({
        type: "orange",
        title: `${employee.name} في إجازة`,
        description: `قسم ${employee.department}`,
      });
    }
  });

  data.followups.forEach((followup) => {
    const incomplete = Object.values(followup.checks).filter((v) => !v).length;

    if (incomplete > 0) {
      alerts.push({
        type: "orange",

        title: `متابعة ${followup.department}`,

        description: `${incomplete} نقاط تحتاج مراجعة`,
      });
    }
  });

  data.tasks.forEach((task) => {
    if (task.status !== "done") {
      alerts.push({
        type: task.priority === "high" ? "red" : "blue",

        title: task.title,

        description: task.status === "doing" ? "جاري العمل" : "لم تبدأ بعد",
      });
    }
  });

  return alerts;
}

function renderAttention() {
  const container = $("#attentionList");

  const alerts = buildAlerts();

  if (!alerts.length) {
    container.innerHTML = `
            <div class="empty">
                ممتاز 👌<br>
                مفيش حاجة محتاجة تدخل منك دلوقتي.
            </div>
        `;

    return;
  }

  container.innerHTML = alerts
    .slice(0, 7)
    .map(
      (alert) => `

                <div class="attention-item">

                    <span class="attention-marker ${alert.type}">
                    </span>

                    <div class="attention-copy">

                        <b>${escapeHTML(alert.title)}</b>

                        <span>
                            ${escapeHTML(alert.description)}
                        </span>

                    </div>

                    <button class="attention-action">
                        →
                    </button>

                </div>

            `,
    )
    .join("");
}

/* =========================================================
   MINI EMPLOYEES
========================================================= */

function renderMiniEmployees() {
  const container = $("#dashboardEmployees");

  container.innerHTML = data.employees
    .slice(0, 8)
    .map(
      (employee) => `

                <div class="employee-mini">

                    <div class="employee-avatar">
                        ${escapeHTML(employee.name.charAt(0))}
                    </div>

                    <div>

                        <strong>
                            ${escapeHTML(employee.name)}
                        </strong>

                        <span>
                            ${escapeHTML(employee.department)}
                        </span>

                    </div>

                    <span
                        class="status-dot ${employee.status}">
                    </span>

                </div>

            `,
    )
    .join("");
}

/* =========================================================
   EMPLOYEES
========================================================= */

function renderEmployees() {
  const grid = $("#employeesGrid");

  if (!grid) return;

  const search = ($("#employeeSearch")?.value || "").trim().toLowerCase();

  const department = $("#departmentFilter")?.value || "all";

  const status = $("#statusFilter")?.value || "all";

  const filtered = data.employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(search) ||
      employee.department.toLowerCase().includes(search);

    const matchesDepartment =
      department === "all" || employee.department === department;

    const matchesStatus = status === "all" || employee.status === status;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  if (!filtered.length) {
    grid.innerHTML = `
            <div class="empty">
                مفيش نتائج.
            </div>
        `;

    return;
  }

  grid.innerHTML = filtered
    .map(
      (employee) => `

            <article class="employee-card">

                <div class="employee-top">

                    <div class="employee-avatar">
                        ${escapeHTML(employee.name.charAt(0))}
                    </div>

                    <div>

                        <b>
                            ${escapeHTML(employee.name)}
                        </b>

                        <span>
                            ${escapeHTML(employee.department)}
                        </span>

                    </div>

                </div>

                <div class="employee-role">

                    ${escapeHTML(employee.role)}

                </div>

                <div class="employee-footer">

                    <span class="rest">
                        راحة: ${escapeHTML(employee.rest)}
                    </span>

                    <span class="status-badge ${employee.status}">
                        ${statusText(employee.status)}
                    </span>

                </div>

                <div class="card-actions">

                    <button
                        class="employee-edit-btn"
                        onclick="editEmployee(${employee.id})">
                        تعديل
                    </button>

                    <button
                        class="employee-delete-btn"
                        onclick="deleteEmployee(${employee.id})">
                        حذف
                    </button>

                    <button
                        onclick="changeEmployeeStatus(${employee.id},'present')">
                        حاضر
                    </button>

                    <button
                        onclick="changeEmployeeStatus(${employee.id},'absent')">
                        غياب
                    </button>

                    <button
                        onclick="changeEmployeeStatus(${employee.id},'leave')">
                        إجازة
                    </button>

                </div>

            </article>

        `,
    )
    .join("");

  updateDepartmentFilter();
}

function updateDepartmentFilter() {
  const select = $("#departmentFilter");

  if (!select) return;

  const current = select.value;

  const departments = [
    ...new Set(data.employees.map((employee) => employee.department)),
  ];

  select.innerHTML = `
        <option value="all">كل الأقسام</option>
        ${departments
          .map(
            (department) =>
              `<option value="${escapeHTML(department)}">
                        ${escapeHTML(department)}
                    </option>`,
          )
          .join("")}
    `;

  select.value = departments.includes(current) ? current : "all";
}

function changeEmployeeStatus(id, status) {
  const employee = getEmployee(id);

  if (!employee) return;

  employee.status = status;

  saveData();

  toast(`${employee.name}: ${statusText(status)}`);
}

/* SEARCH */

$("#employeeSearch")?.addEventListener("input", renderEmployees);

$("#departmentFilter")?.addEventListener("change", renderEmployees);

$("#statusFilter")?.addEventListener("change", renderEmployees);

/* =========================================================
   FOLLOWUPS
========================================================= */

const checkLabels = {
  cleanliness: "النظافة",

  arrangement: "ترتيب الرفوف",

  prices: "الأسعار",

  expiry: "الصلاحية",
};

function renderFollowups() {
  const container = $("#followupsGrid");

  if (!container) return;

  let completed = 0;
  let total = 0;

  container.innerHTML = data.followups
    .map((followup) => {
      const checks = Object.entries(followup.checks);

      checks.forEach(([key, value]) => {
        total++;

        if (value) completed++;
      });

      const done = checks.filter(([key, value]) => value).length;

      return `

                <article class="follow-card">

                    <div class="follow-head">

                        <div>

                            <b>
                                ${escapeHTML(followup.department)}
                            </b>

                            <span>
                                المسؤول:
                                ${escapeHTML(followup.responsible)}
                            </span>

                        </div>

                        <span>
                            ${done}/${checks.length}
                        </span>

                    </div>


                    ${checks
                      .map(
                        ([key, value]) => `

                            <label class="check">

                                <input
                                    type="checkbox"
                                    ${value ? "checked" : ""}
                                    onchange="
                                        toggleFollowup(
                                            ${followup.id},
                                            '${key}'
                                        )
                                    "
                                >

                                ${checkLabels[key]}

                            </label>

                        `,
                      )
                      .join("")}


                    <div class="follow-status">

                        <span>
                            حالة المتابعة
                        </span>

                        <strong>
                            ${
                              done === checks.length
                                ? "مكتملة ✓"
                                : "تحتاج متابعة"
                            }
                        </strong>

                    </div>

                </article>

            `;
    })
    .join("");

  const percentage = total ? Math.round((completed / total) * 100) : 0;

  $("#followupProgress").style.width = `${percentage}%`;

  $("#followupProgressText").textContent = `${percentage}%`;
}

function toggleFollowup(id, key) {
  const followup = data.followups.find((f) => f.id == id);

  if (!followup) return;

  followup.checks[key] = !followup.checks[key];

  saveData();

  toast("تم تحديث المتابعة ✓");
}

/* =========================================================
   SCHEDULE
========================================================= */

function renderSchedule() {
  const tbody = $("#scheduleTable");

  if (!tbody) return;

  const present = data.employees.filter((e) => e.status === "present").length;

  const absent = data.employees.filter((e) => e.status === "absent").length;

  const leave = data.employees.filter((e) => e.status === "leave").length;

  $("#schedulePresent").textContent = present;

  $("#scheduleAbsent").textContent = absent;

  $("#scheduleLeave").textContent = leave;

  tbody.innerHTML = data.employees
    .map(
      (employee) => `

            <tr>

                <td>

                    <div class="employee-table-name">

                        <div class="employee-avatar">
                            ${escapeHTML(employee.name.charAt(0))}
                        </div>

                        ${escapeHTML(employee.name)}

                    </div>

                </td>

                <td>
                    ${escapeHTML(employee.department)}
                </td>

                <td>
                    ${escapeHTML(employee.rest)}
                </td>

                <td>

                    <span class="status-badge ${employee.status}">
                        ${statusText(employee.status)}
                    </span>

                </td>

                <td>

                    <button
                        class="table-action"
                        onclick="
                            changeEmployeeStatus(
                                ${employee.id},
                                'present'
                            )
                        "
                    >
                        حاضر
                    </button>

                    <button
                        class="table-action"
                        onclick="
                            changeEmployeeStatus(
                                ${employee.id},
                                'absent'
                            )
                        "
                    >
                        غياب
                    </button>

                </td>

            </tr>

        `,
    )
    .join("");
}

/* =========================================================
   COMPANIES
========================================================= */

function renderCompanies() {
  const grid = $("#companiesGrid");

  if (!grid) return;

  const total = data.companies.length;

  const yes = data.companies.filter((c) => c.returns).length;

  const no = total - yes;

  $("#totalCompanies").textContent = total;

  $("#returnCompanies").textContent = yes;

  $("#noReturnCompanies").textContent = no;

  grid.innerHTML = data.companies
    .map(
      (company) => `

            <article class="company-card">

                <div class="company-head">

                    <div>

                        <b>
                            ${escapeHTML(company.name)}
                        </b>

                        <span>
                            Supplier
                        </span>

                    </div>

                    <span class="return-badge ${
                      company.returns ? "return-yes" : "return-no"
                    }">

                        ${company.returns ? "تقبل المرتجع" : "لا تقبل المرتجع"}

                    </span>

                </div>


                <div class="company-items">

                    ${escapeHTML(company.items)}

                </div>


                <div class="company-note">

                    ${escapeHTML(company.note)}

                </div>

            </article>

        `,
    )
    .join("");
}

/* =========================================================
   TASKS
========================================================= */

function renderTasks() {
  const todo = data.tasks.filter((task) => task.status === "todo");

  const doing = data.tasks.filter((task) => task.status === "doing");

  const done = data.tasks.filter((task) => task.status === "done");

  $("#todoCount").textContent = todo.length;

  $("#doingCount").textContent = doing.length;

  $("#doneCount").textContent = done.length;

  $("#todoTasks").innerHTML = todo.map(taskHTML).join("");

  $("#doingTasks").innerHTML = doing.map(taskHTML).join("");

  $("#doneTasks").innerHTML = done.map(taskHTML).join("");
}

function taskHTML(task) {
  return `

        <article class="task-card">

            <b>
                ${escapeHTML(task.title)}
            </b>

            <p>
                ${escapeHTML(task.description)}
            </p>

            <div class="task-meta">

                <span>
                    أولوية:
                    ${
                      task.priority === "high"
                        ? "عالية"
                        : task.priority === "medium"
                          ? "متوسطة"
                          : "منخفضة"
                    }
                </span>

                <span>
                    ${
                      task.status === "todo"
                        ? "جديدة"
                        : task.status === "doing"
                          ? "جاري العمل"
                          : "مكتملة"
                    }
                </span>

            </div>


            ${
              task.status !== "done"
                ? `<div class="task-actions">

                    ${
                      task.status === "todo"
                        ? `<button
                            onclick="
                                changeTaskStatus(
                                    ${task.id},
                                    'doing'
                                )
                            "
                        >
                            بدء العمل
                        </button>`
                        : `<button
                            onclick="
                                changeTaskStatus(
                                    ${task.id},
                                    'done'
                                )
                            "
                        >
                            إكمال
                        </button>`
                    }

                </div>`
                : ""
            }

        </article>

    `;
}

function changeTaskStatus(id, status) {
  const task = data.tasks.find((task) => task.id == id);

  if (!task) return;

  task.status = status;

  saveData();

  toast("تم تحديث المهمة ✓");
}

/* =========================================================
   REPORTS
========================================================= */

function renderReports() {
  const followups = data.followups;

  let totalChecks = 0;
  let completedChecks = 0;

  followups.forEach((followup) => {
    Object.values(followup.checks).forEach((value) => {
      totalChecks++;

      if (value) completedChecks++;
    });
  });

  const followupScore = totalChecks
    ? Math.round((completedChecks / totalChecks) * 100)
    : 0;

  const completedTasks = data.tasks.filter(
    (task) => task.status === "done",
  ).length;

  const attendance = data.employees.length
    ? Math.round(
        (data.employees.filter((e) => e.status === "present").length /
          data.employees.length) *
          100,
      )
    : 0;

  $("#reportScore").textContent = `${followupScore}%`;

  $("#reportFollowups").textContent = `${completedChecks}/${totalChecks}`;

  $("#reportTasks").textContent = `${completedTasks}/${data.tasks.length}`;

  $("#reportAttendance").textContent = `${attendance}%`;

  $("#reportText").textContent = generateReport();
}

function generateReport() {
  const date = currentDate();

  const present = data.employees.filter((e) => e.status === "present").length;

  const absent = data.employees.filter((e) => e.status === "absent").length;

  const leave = data.employees.filter((e) => e.status === "leave").length;

  const pendingTasks = data.tasks.filter((t) => t.status !== "done").length;

  return `
تقرير GROVIA اليومي
====================

التاريخ:
${date}

الحضور:
${present} حاضر
${absent} غائب
${leave} إجازة

المهام غير المكتملة:
${pendingTasks}

المتابعات:
${buildAlerts().length} نقطة تحتاج مراجعة

ملاحظة المشرف:
يرجى مراجعة Action Center قبل نهاية اليوم والتأكد من إغلاق المتابعات والمهام ذات الأولوية العالية.
`;
}

/* =========================================================
   AI
========================================================= */

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[؟?!.,،]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

document.querySelectorAll("[data-question]").forEach(button => {

    button.addEventListener("click", async () => {

        const question = button.dataset.question;

        if (!question) return;

        addMessage(question, "user");

        addMessage("⏳ بفكر...", "ai");

        try {

            const result = await askGroviaAI(question);

            const messages = $("#chatMessages");

            if (messages && messages.lastElementChild) {
                messages.removeChild(messages.lastElementChild);
            }

            addMessage(
                result?.text || "مفيش رد.",
                "ai"
            );

        } catch (error) {

            console.error(error);

            const messages = $("#chatMessages");

            if (messages && messages.lastElementChild) {
                messages.removeChild(messages.lastElementChild);
            }

            addMessage(
                "حصلت مشكلة في الاتصال بالـAI.",
                "ai"
            );
        }
    });

});

function findEmployeeByQuestion(q) {
  return data.employees.find((employee) => {
    const name = normalize(employee.name);

    const department = normalize(employee.department);

    return (
      q.includes(name) ||
      department.split(" ").some((word) => word.length > 3 && q.includes(word))
    );
  });
}

function findCompanyByQuestion(q) {
  return data.companies.find((company) => {
    const name = normalize(company.name);

    const cleanName = name.replace("شركة", "").trim();

    return q.includes(name) || q.includes(cleanName);
  });
}

/* =========================================================
   CHAT
========================================================= */

function openAssistant() {
  $("#aiDrawer").classList.add("open");

  $("#overlay").classList.add("show");

  $("#chatInput").focus();
}

function closeAssistant() {
  $("#aiDrawer").classList.remove("open");

  $("#overlay").classList.remove("show");
}

$("#openAssistant").addEventListener("click", openAssistant);

$("#mobileOpenAssistant")?.addEventListener("click", openAssistant);

$("#closeAssistant").addEventListener("click", closeAssistant);

$("#overlay").addEventListener("click", closeAssistant);

function addMessage(text, type) {
  const container = $("#chatMessages");

  const message = document.createElement("div");

  message.className = `message ${type}`;

  message.innerHTML = escapeHTML(text).replace(/\n/g, "<br>");

  container.appendChild(message);

  container.scrollTop = container.scrollHeight;
}

$("#chatForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const input = $("#chatInput");
    const question = input.value.trim();

    if (!question) return;

    // رسالة المستخدم
    addMessage(question, "user");

    // تنظيف input
    input.value = "";

    // رسالة مؤقتة
    addMessage("⏳ بفكر في سؤالك...", "ai");

    try {

        // استخدام الـAI الحقيقي
        const result = await askGroviaAI(question);

        // إزالة رسالة الانتظار
        const messages = $("#chatMessages");

        if (messages && messages.lastElementChild) {
            messages.removeChild(messages.lastElementChild);
        }

        // عرض رد الـAI
        addMessage(
            result?.text || "محصلش رد من الـAI.",
            "ai"
        );

    } catch (error) {

        console.error("Chat error:", error);

        const messages = $("#chatMessages");

        if (messages && messages.lastElementChild) {
            messages.removeChild(messages.lastElementChild);
        }

        addMessage(
            "حصلت مشكلة وأنا بحاول أوصل للـAI.",
            "ai"
        );
    }
});

$$("[data-question]").forEach((button) => {
  button.addEventListener("click", () => {
    const question = button.dataset.question;

    openAssistant();

    addMessage(question, "user");

    setTimeout(() => {
      addMessage(aiAnswer(question), "ai");
    }, 250);
  });
});

/* =========================================================
   QUICK ACTIONS
========================================================= */

$$(".action-card").forEach((button) => {
  button.addEventListener("click", () => {
    openActionModal(button.dataset.action);
  });
});

/* =========================================================
   MODAL
========================================================= */

function openModal(title, label, fields, onSubmit) {
  $("#modalTitle").textContent = title;

  $("#modalLabel").textContent = label;

  $("#modalForm").innerHTML =
    fields
      .map(
        (field) => `

            <div class="form-group">

                <label>
                    ${field.label}
                </label>

                ${
                  field.type === "textarea"
                    ? `<textarea
                        name="${field.name}"
                        placeholder="${field.placeholder || ""}"
                        ${field.required ? "required" : ""}
                    ></textarea>`
                    : field.type === "select"
                      ? `<select
                        name="${field.name}"
                        ${field.required ? "required" : ""}
                    >
                        ${field.options
                          .map(
                            (option) =>
                              `<option value="${escapeHTML(option.value)}">
                                    ${escapeHTML(option.label)}
                                </option>`,
                          )
                          .join("")}
                    </select>`
                      : `<input
                        type="${field.type || "text"}"
                        name="${field.name}"
                        placeholder="${field.placeholder || ""}"
                        value="${escapeHTML(field.value || "")}"
                        ${field.required ? "required" : ""}
                    >`
                }

            </div>

        `,
      )
      .join("") +
    `<button class="form-submit">
            حفظ
        </button>`;

  $("#modalBackdrop").classList.add("show");

  $("#modalForm").onsubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const values = Object.fromEntries(formData.entries());

    onSubmit(values);

    closeModal();
  };
}

function closeModal() {
  $("#modalBackdrop").classList.remove("show");
}

$("#closeModal").addEventListener("click", closeModal);

$("#modalBackdrop").addEventListener("click", (event) => {
  if (event.target === $("#modalBackdrop")) {
    closeModal();
  }
});

/* =========================================================
   ACTION MODALS
========================================================= */

function openActionModal(action) {
  if (action === "employee") {
    openEmployeeModal();

    return;
  }

  if (action === "absence") {
    openStatusModal();

    return;
  }

  if (action === "followup") {
    openFollowupModal();

    return;
  }

  if (action === "task") {
    openTaskModal();

    return;
  }

  if (action === "leave") {
    openLeaveModal();

    return;
  }

  if (action === "company") {
    openCompanyModal();

    return;
  }
}

/* EMPLOYEE */

function openEmployeeModal(employee = null) {
  openModal(
    employee ? "تعديل بيانات الموظف" : "إضافة موظف",

    "TEAM",

    [
      {
        name: "name",
        label: "اسم الموظف",
        value: employee?.name,
        required: true,
      },

      {
        name: "department",
        label: "القسم",
        value: employee?.department,
        required: true,
      },

      {
        name: "role",
        label: "المسؤولية",
        value: employee?.role,
        required: true,
      },

      {
        name: "rest",
        label: "يوم الراحة",
        value: employee?.rest,
        required: true,
      },
    ],

    (values) => {
      const employeeData = {
        name: values.name.trim(),
        department: values.department.trim(),
        role: values.role.trim(),
        rest: values.rest.trim(),
      };

      if (Object.values(employeeData).some((value) => !value)) {
        toast("من فضلك أكمل بيانات الموظف");
        return;
      }

      if (employee) {
        Object.assign(employee, employeeData);
      } else {
        data.employees.push({
          id: Date.now(),
          ...employeeData,
          status: "present",
        });
      }

      saveData();

      toast(employee ? "تم تحديث بيانات الموظف ✓" : "تم إضافة الموظف ✓");
    },
  );
}

$("#addEmployeeBtn").addEventListener("click", openEmployeeModal);

function editEmployee(id) {
  const employee = getEmployee(id);

  if (employee) {
    openEmployeeModal(employee);
  }
}

function deleteEmployee(id) {
  const employee = getEmployee(id);

  if (!employee) return;

  const confirmed = window.confirm(
    `هل أنت متأكد من حذف الموظف "${employee.name}"؟ لا يمكن التراجع عن هذا الإجراء.`,
  );

  if (!confirmed) return;

  data.employees = data.employees.filter((item) => item.id != id);
  saveData();
  toast(`تم حذف ${employee.name} ✓`);
}

/* ABSENCE */

function openStatusModal() {
  openModal(
    "تسجيل حالة موظف",

    "ATTENDANCE",

    [
      {
        name: "employee",
        label: "الموظف",
        type: "select",
        required: true,

        options: data.employees.map((employee) => ({
          value: employee.id,
          label: employee.name,
        })),
      },

      {
        name: "status",
        label: "الحالة",
        type: "select",
        options: [
          {
            value: "absent",
            label: "غائب",
          },
          {
            value: "present",
            label: "حاضر",
          },
          {
            value: "leave",
            label: "إجازة",
          },
        ],
      },
    ],

    (values) => {
      const employee = getEmployee(Number(values.employee));

      if (employee) {
        employee.status = values.status;

        saveData();

        toast("تم تحديث الحالة ✓");
      }
    },
  );
}

/* FOLLOWUP */

function openFollowupModal() {
  openModal(
    "متابعة قسم جديدة",

    "FOLLOW UP",

    [
      {
        name: "department",
        label: "اسم القسم",
        required: true,
      },

      {
        name: "responsible",
        label: "المسؤول",
        required: true,
      },
    ],

    (values) => {
      data.followups.push({
        id: Date.now(),

        department: values.department,

        responsible: values.responsible,

        checks: {
          cleanliness: false,
          arrangement: false,
          prices: false,
          expiry: false,
        },
      });

      saveData();

      toast("تم إضافة المتابعة ✓");
    },
  );
}

$("#addFollowupBtn").addEventListener("click", openFollowupModal);

/* TASK */

function openTaskModal() {
  openModal(
    "إضافة مهمة",

    "TASK",

    [
      {
        name: "title",
        label: "اسم المهمة",
        required: true,
      },

      {
        name: "description",
        label: "الوصف",
        type: "textarea",
      },

      {
        name: "priority",
        label: "الأولوية",
        type: "select",

        options: [
          {
            value: "high",
            label: "عالية",
          },
          {
            value: "medium",
            label: "متوسطة",
          },
          {
            value: "low",
            label: "منخفضة",
          },
        ],
      },
    ],

    (values) => {
      data.tasks.push({
        id: Date.now(),

        title: values.title,

        description: values.description || "",

        status: "todo",

        priority: values.priority,
      });

      saveData();

      toast("تم إضافة المهمة ✓");
    },
  );
}

$("#addTaskBtn").addEventListener("click", openTaskModal);

/* LEAVE */

function openLeaveModal() {
  openModal(
    "تسجيل إجازة",

    "LEAVE",

    [
      {
        name: "employee",
        label: "الموظف",
        type: "select",
        required: true,

        options: data.employees.map((employee) => ({
          value: employee.id,
          label: employee.name,
        })),
      },

      {
        name: "note",
        label: "ملاحظة",
        type: "textarea",
      },
    ],

    (values) => {
      const employee = getEmployee(Number(values.employee));

      if (employee) {
        employee.status = "leave";

        saveData();

        toast(`تم تسجيل إجازة ${employee.name}`);
      }
    },
  );
}

$("#addLeaveBtn").addEventListener("click", openLeaveModal);

/* COMPANY */

function openCompanyModal() {
  openModal(
    "إضافة شركة",

    "SUPPLIER",

    [
      {
        name: "name",
        label: "اسم الشركة",
        required: true,
      },

      {
        name: "returns",
        label: "المرتجع",
        type: "select",

        options: [
          {
            value: "true",
            label: "تقبل المرتجع",
          },
          {
            value: "false",
            label: "لا تقبل المرتجع",
          },
        ],
      },

      {
        name: "items",
        label: "المنتجات",
      },

      {
        name: "note",
        label: "ملاحظات",
        type: "textarea",
      },
    ],

    (values) => {
      data.companies.push({
        id: Date.now(),

        name: values.name,

        returns: values.returns === "true",

        items: values.items || "",

        note: values.note || "",
      });

      saveData();

      toast("تم إضافة الشركة ✓");
    },
  );
}

$("#addCompanyBtn").addEventListener("click", openCompanyModal);

/* =========================================================
   NOTIFICATIONS
========================================================= */

function updateNotificationCount() {
  const count = buildAlerts().length;

  $("#notificationCount").textContent = count;
}

$("#notificationBtn").addEventListener("click", () => {
  const alerts = buildAlerts();

  if (!alerts.length) {
    toast("مفيش تنبيهات جديدة 👌");

    return;
  }

  openAssistant();

  addMessage(
    `
عندك ${alerts.length} تنبيه:

${alerts
  .slice(0, 6)
  .map((alert) => `• ${alert.title}`)
  .join("\n")}
                `,
    "ai",
  );
});

/* =========================================================
   SEARCH
========================================================= */

$("#globalSearch").addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;

  const query = event.target.value.trim().toLowerCase();

  if (!query) return;

  const employee = data.employees.find(
    (e) =>
      e.name.toLowerCase().includes(query) ||
      e.department.toLowerCase().includes(query),
  );

  if (employee) {
    navigate("employees");

    $("#employeeSearch").value = query;

    renderEmployees();

    return;
  }

  const company = data.companies.find((c) =>
    c.name.toLowerCase().includes(query),
  );

  if (company) {
    navigate("companies");

    toast(`تم العثور على ${company.name}`);

    return;
  }

  toast("ملقتش نتيجة مطابقة.");
});

/* CTRL K */

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();

    $("#globalSearch").focus();
  }

  if (event.key === "Escape") {
    closeAssistant();
    closeModal();
  }
});

/* =========================================================
   REFRESH
========================================================= */

$("#refreshDashboard").addEventListener("click", () => {
  renderAll();

  toast("تم تحديث لوحة التحكم ✓");
});

/* =========================================================
   REPORT COPY
========================================================= */

$("#copyReport").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText($("#reportText").textContent);

    toast("تم نسخ التقرير ✓");
  } catch {
    toast("تعذر النسخ تلقائيًا.");
  }
});

/* =========================================================
   TOAST
========================================================= */

function toast(message) {
  const container = $("#toastContainer");

  const element = document.createElement("div");

  element.className = "toast";

  element.textContent = message;

  container.appendChild(element);

  setTimeout(() => element.remove(), 3000);
}

/* =========================================================
   RENDER ALL
========================================================= */

function renderAll() {
  renderDashboard();

  renderEmployees();

  renderFollowups();

  renderSchedule();

  renderCompanies();

  renderTasks();

  renderReports();
}

/* =========================================================
   INITIALIZE
========================================================= */

renderAll();

/* =========================================================
   INITIAL AI MESSAGE
========================================================= */

setTimeout(() => {
  if (!$("#chatMessages").children.length) {
    addMessage(
      `
أهلًا بيك 👋

أنا GROVIA AI.

أقدر أساعدك في:
• الموظفين
• الحضور والغياب
• الإجازات
• المتابعات
• الشركات والمرتجعات
• المهام

اسألني بطريقتك العادية.
            `,
      "ai",
    );
  }
}, 300);

// ========================================
// GROVIA AI - REAL API CONNECTION
// ========================================

// ============================================
// GROVIA REAL AI CONNECTION
// ============================================

const AI_ENDPOINT = "/api/ai";

async function askGroviaAI(message) {
    if (!message || !message.trim()) {
        return {
            ok: false,
            text: "اكتبلي سؤالك الأول."
        };
    }

    try {
        // إرسال البيانات الحالية الموجودة داخل التطبيق
        // بدل الاعتماد على LocalStorage keys منفصلة
        const snapshot = {
            employees: Array.isArray(data?.employees) ? data.employees : [],
            followups: Array.isArray(data?.followups) ? data.followups : [],
            companies: Array.isArray(data?.companies) ? data.companies : [],
            tasks: Array.isArray(data?.tasks) ? data.tasks : []
        };

        const response = await fetch(AI_ENDPOINT, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message.trim(),
                snapshot: snapshot
            })
        });

        const result = await response.json();

        if (!response.ok || !result.ok) {
            throw new Error(
                result.error || "فشل الاتصال بالـ AI"
            );
        }

        return {
            ok: true,
            text: result.text || "الـAI رجع رد فاضي."
        };

    } catch (error) {

        console.error("GROVIA AI ERROR:", error);

        const reason =
            error instanceof Error && error.message
                ? error.message
                : "سبب غير معروف";

        return {
            ok: false,
            text:
                "مش قادر أوصل للـAI حالياً. السبب: " +
                reason
        };
    }
}