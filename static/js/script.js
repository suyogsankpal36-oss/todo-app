const apiURL = "/api/tasks";


// LOAD TASKS
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
        <h4>No Tasks Available 🚀</h4>
        `;
        return;
    }

    tasks.forEach(task => {

        container.innerHTML += `
        <div class="col-md-4">

            <div class="card p-3 shadow">

                <div class="d-flex justify-content-between">

                    <h4>
                        ${task.title}
                    </h4>

                    <span class="badge
                    ${task.completed ?
                    'bg-success' :
                    'bg-warning'}">

                    ${task.completed ?
                    'Completed' :
                    'Pending'}

                    </span>

                </div>

                <p class="mt-3">
                    ${task.description}
                </p>

                <small>
                    ${task.created_at}
                </small>

                <div class="mt-3 d-flex gap-2">

                    <button
                    class="btn btn-success"
                    onclick="toggleTask(
                    ${task.id},
                    ${task.completed}
                    )">

                    ✔

                    </button>

                    <button
                    class="btn btn-info"
                    onclick="editTask(
                    ${task.id},
                    '${task.title}',
                    \`${task.description}\`
                    )">

                    ✏

                    </button>

                    <button
                    class="btn btn-danger"
                    onclick="deleteTask(
                    ${task.id}
                    )">

                    🗑

                    </button>

                </div>

            </div>

        </div>
        `;
    });
}


// ADD TASK
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


// COMPLETE TASK
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


// DELETE TASK
async function deleteTask(id) {

    await fetch(
        `${apiURL}/${id}`,
        {
            method: "DELETE"
        }
    );

    loadTasks();
}


// EDIT TASK
async function editTask(
    id,
    oldTitle,
    oldDescription
) {

    const title =
        prompt(
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

loadTasks();