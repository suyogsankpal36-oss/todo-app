const apiURL = "/api/tasks";

// ==========================
// LOAD TASKS
// ==========================
async function loadTasks() {

    const response = await fetch(apiURL);
    const tasks = await response.json();

    const container =
        document.getElementById(
            "taskContainer"
        );

    const taskCount =
        document.getElementById(
            "taskCount"
        );

    container.innerHTML = "";

    taskCount.innerText =
        `${tasks.length} Tasks`;

    if (tasks.length === 0) {
        container.innerHTML = `
        <div class="empty-message">
            No Tasks Available 🚀
        </div>
        `;
        return;
    }

    tasks.forEach(task => {

        container.innerHTML += `
        <div class="col-md-6 col-lg-4">

            <div class="card shadow-lg task-card
            ${task.completed ?
            'completed-task' : ''}">

                <div class="card-body">

                    <div class="d-flex
                    justify-content-between">

                        <h5 class="
                        ${task.completed ?
                        'completed-text' : ''}
                        ">
                            ${task.title}
                        </h5>

                        <span class="badge
                        ${task.completed ?
                        'bg-success' :
                        'bg-warning text-dark'}
                        status-badge">

                        ${task.completed ?
                        'Completed' :
                        'Pending'}

                        </span>

                    </div>

                    <p class="
                    mt-3
                    ${task.completed ?
                    'completed-text' : ''}
                    ">
                        ${task.description}
                    </p>

                    <p class="task-time">
                        Created:
                        ${task.created_at}
                    </p>

                    <div class="d-flex
                    gap-2 mt-3">

                        <button
                        class="btn btn-success
                        action-btn"
                        onclick="toggleTask(
                        ${task.id},
                        ${task.completed}
                        )">

                        <i class="bi
                        bi-check-circle"></i>

                        </button>

                        <button
                        class="btn btn-info
                        text-white action-btn"
                        onclick="editTask(
                        ${task.id},
                        '${task.title}',
                        \`${task.description}\`
                        )">

                        <i class="bi
                        bi-pencil-square"></i>

                        </button>

                        <button
                        class="btn btn-danger
                        action-btn"
                        onclick="deleteTask(
                        ${task.id}
                        )">

                        <i class="bi
                        bi-trash"></i>

                        </button>

                    </div>

                </div>

            </div>

        </div>
        `;
    });
}


// ==========================
// ADD TASK
// ==========================
async function addTask() {

    const title =
        document.getElementById(
            "title"
        ).value.trim();

    const description =
        document.getElementById(
            "description"
        ).value.trim();

    if (!title || !description) {
        alert(
            "Please fill all fields"
        );
        return;
    }

    await fetch(apiURL, {
        method: "POST",

        headers: {
            "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
            title,
            description
        })
    });

    document.getElementById(
        "title"
    ).value = "";

    document.getElementById(
        "description"
    ).value = "";

    loadTasks();
}


// ==========================
// DELETE TASK
// ==========================
async function deleteTask(id) {

    const confirmDelete =
        confirm(
            "Delete this task?"
        );

    if (!confirmDelete) return;

    await fetch(
        `${apiURL}/${id}`,
        {
            method: "DELETE"
        }
    );

    loadTasks();
}


// ==========================
// COMPLETE TASK
// ==========================
async function toggleTask(
    id,
    completed
) {

    await fetch(
        `${apiURL}/${id}`,
        {
            method: "PUT",

            headers: {
                "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
                completed:
                !completed
            })
        }
    );

    loadTasks();
}


// ==========================
// EDIT TASK
// ==========================
async function editTask(
    id,
    oldTitle,
    oldDescription
) {

    const title = prompt(
        "Edit Title",
        oldTitle
    );

    if (!title) return;

    const description =
        prompt(
            "Edit Description",
            oldDescription
        );

    if (!description) return;

    await fetch(
        `${apiURL}/${id}`,
        {
            method: "PUT",

            headers: {
                "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
                title,
                description
            })
        }
    );

    loadTasks();
}


// Auto Load
loadTasks();