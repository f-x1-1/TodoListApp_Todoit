// Select DOM elements
const Element_ListTitle = document.querySelector("[title-list]");
const Element_CountList = document.querySelector("[count-list]");
const task_container = document.querySelector("[tasks-data]");
const template_task = document.getElementById("template-task");
const new_form_task = document.querySelector("[new-form-data-task]");
const new_task_entry = document.querySelector("[new-input-task-data]");
const btn_clear_complete_tasks = document.querySelector(
    "[btn-clear-complete-tasks]"
);

const Element_container = document.querySelector("[lists-data-container]");
const Element_new_List_Form = document.querySelector("[new-list]");
const Element_new_List_entry = document.querySelector("[new-list-data-input ]");
const Element_delete_List_btn = document.querySelector("[delete-list]");
const Element_listDisplay_container = document.querySelector(
    "[list-display-data-container]"
);

// Local storage keys and values
const LOCAL_KEY_LIST_STORAGE = "task.lists";
const LOCAL_SELECTED_KEY_ID_LIST_STORAGE = "task.IDListSelected";
let lists = JSON.parse(localStorage.getItem(LOCAL_KEY_LIST_STORAGE)) || [];
let ID_ListSelected = localStorage.getItem(LOCAL_SELECTED_KEY_ID_LIST_STORAGE);

// Event listeners
Element_container.addEventListener("click", (e) => {
    if (e.target.tagName.toLowerCase() === "li") {
        ID_ListSelected = e.target.dataset.listId;
        saveAndRender();
    }
});

task_container.addEventListener("click", (e) => {
    if (e.target.tagName.toLowerCase() === "input") {
        // Update task completion status
        const selectedList = lists.find((list) => list.id === ID_ListSelected);
        const selectedTask = selectedList.tasks.find(
            (task) => task.id === e.target.id
        );
        selectedTask.complete = e.target.checked;
        save();
        renderTaskCount(selectedList);
    } else if (e.target.tagName.toLowerCase() === "label") {
        // Edit task name
        const selectedList = lists.find((list) => list.id === ID_ListSelected);
        const selectedTask = selectedList.tasks.find(
            (task) => task.id === e.target.htmlFor
        );
        const newTaskName = prompt("Enter new task name", selectedTask.name);
        if (newTaskName != null && newTaskName !== "") {
            selectedTask.name = newTaskName;
            saveAndRender();
        }
    }
});

// Event listener to clear completed tasks
btn_clear_complete_tasks.addEventListener("click", (e) => {
    const selectedList = lists.find((list) => list.id === ID_ListSelected);
    selectedList.tasks = selectedList.tasks.filter((task) => !task.complete);
    saveAndRender();
});

// Event listener to delete list
Element_delete_List_btn.addEventListener("click", (e) => {
    lists = lists.filter((list) => list.id !== ID_ListSelected);
    ID_ListSelected = null;
    saveAndRender();
});

// Event listener to create new list
Element_new_List_Form.addEventListener("submit", (e) => {
    e.preventDefault();
    const listName = Element_new_List_entry.value;
    if (listName == null || listName === "") return;
    const list = createList(listName);
    Element_new_List_entry.value = null;
    lists.push(list);
    saveAndRender();
});

// Event listener to create new task
new_form_task.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskName = new_task_entry.value;
    if (taskName == null || taskName === "") return;
    const task = createTask(taskName);
    new_task_entry.value = null;
    const selectedList = lists.find((list) => list.id === ID_ListSelected);
    selectedList.tasks.push(task);
    saveAndRender();
});

// Helper function to create a new list object
function createList(name) {
    return {
        id: Date.now().toString(),
        name: name,
        tasks: [],
    };
}

// Helper function to create a new task object
function createTask(name) {
    return {
        id: Date.now().toString(),
        name: name,
        complete: false,
    };
}

// Helper function to save and render changes
function saveAndRender() {
    save();
    render();
}

// Helper function to save changes to local storage
function save() {
    localStorage.setItem(LOCAL_KEY_LIST_STORAGE, JSON.stringify(lists));
    localStorage.setItem(LOCAL_SELECTED_KEY_ID_LIST_STORAGE, ID_ListSelected);
}

// Helper function to render the page
function render() {
    clearElement(Element_container);
    renderLists();

    const selectedList = lists.find((list) => list.id === ID_ListSelected);
    if (ID_ListSelected == null) {
        Element_listDisplay_container.style.display = "none";
    } else {
        Element_listDisplay_container.style.display = "";
        Element_ListTitle.innerText = selectedList.name;
        renderTaskCount(selectedList);
        clearElement(task_container);
        renderTasks(selectedList);
    }
}

function renderTasks(selectedList) {
    task_container.innerHTML = "";
    // Clear the task_container element so we can re-render the tasks

    selectedList.tasks.forEach((task) => {
        const taskElement = document.importNode(template_task.content, true);
        // Clone the task template

        const checkbox = taskElement.querySelector("input");
        checkbox.id = task.id;
        checkbox.checked = task.complete;
        // Update checkbox input element with task details

        const label = taskElement.querySelector("label");
        label.htmlFor = task.id;
        label.append(task.name);
        // Update label element with task name

        const editButton = document.createElement("button");
        editButton.innerText = "Edit";
        editButton.classList.add("edit-button");
        editButton.addEventListener("click", () => {
            const newTaskName = prompt("Enter new task name", task.name);
            // Show prompt to get new task name from user

            if (newTaskName != null && newTaskName !== "") {
                task.name = newTaskName;
                saveAndRender();
                // Update task name and re-render the tasks
            }
        });
        taskElement.querySelector(".task").appendChild(editButton);
        // Add edit button to task element

        task_container.appendChild(taskElement);
        // Add task element to task container
    });
}

function renderTaskCount(selectedList) {
    const incompleteTaskCount = selectedList.tasks.filter(
        (task) => !task.complete
    ).length;
    const taskString = incompleteTaskCount === 1 ? "task" : "tasks";
    Element_CountList.innerText = `${incompleteTaskCount} ${taskString} remaining`;
}

// Helper function to render the list names
function renderLists() {
    lists.forEach((list) => {
        const listElement = document.createElement("li");
        listElement.dataset.listId = list.id;
        listElement.classList.add("list-name");
        listElement.innerText = list.name;
        if (list.id === ID_ListSelected) {
            listElement.classList.add("active-list");
        }
        Element_container.appendChild(listElement);
    });
}

// Helper function to clear an element's child nodes
function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

// Render the page on load
render();

//dark and light mode
// Select DOM elements
const toggle = document.getElementById("toggle");
const body = document.body;

// Add event listener to toggle dark mode
toggle.addEventListener("change", function() {
    if (this.checked) {
        // Set dark mode styles
        body.style.backgroundColor = "black";
        body.style.color = "white";
    } else {
        // Set light mode styles
        body.style.backgroundColor = " rgb(66, 25, 131)";
        body.style.color = "white";
    }
});

//time and date functions
// Update the date and time elements every second
setInterval(function() {
    // Get current date and format options
    var date = new Date();
    var options = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    // Update the date element
    document.getElementById("date").innerHTML = date.toLocaleDateString(
        "en-US",
        options
    );
    // Format time options
    var timeOptions = {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
    };
    // Update the time element
    document.getElementById("time").innerHTML = date.toLocaleTimeString(
        "en-US",
        timeOptions
    );
}, 1000);

// settings
// Select DOM elements
const settingsBtn = document.getElementById("settings-btn");
const settingsPopup = document.getElementById("settings-popup");

// Add event listener to toggle settings popup visibility
settingsBtn.addEventListener("click", function() {
    if (settingsPopup.hasAttribute("hidden")) {
        settingsPopup.removeAttribute("hidden");
    } else {
        settingsPopup.setAttribute("hidden", "hidden");
    }
});