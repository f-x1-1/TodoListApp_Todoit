//This section of the code uses the Document Object ModeElement_CountListl to find and manipulate parts of the webpage, such as the task list title and count. It also uses variables like new_form_task and btn_clear_complete_tasks to control various aspects of the task list.

const Element_ListTitle = document.querySelector("[title-list]");
const Element_CountList = document.querySelector("[count-list]");
const task_container = document.querySelector("[tasks-data]");
const template_task = document.getElementById("template-task");
const new_form_task = document.querySelector("[new-form-data-task]");
const new_task_entry = document.querySelector("[new-input-task-data]");
const btn_clear_complete_tasks = document.querySelector(
  "[btn-clear-complete-tasks]"
);

//This section of the code selects and stores references to specific areas on a webpage where lists and tasks are displayed using variables. These include a container, form, input area, delete button, and display area for the selected list's tasks.

const Element_container = document.querySelector("[lists-data-container]");
const Element_new_List_Form = document.querySelector("[new-list]");
const Element_new_List_entry = document.querySelector("[new-list-data-input ]");
const Element_delete_List_btn = document.querySelector("[delete-list]");
const Element_listDisplay_container = document.querySelector(
  "[list-display-data-container]"
);

//This code stores and retrieves data in the user's web browser using two keys for task lists and the selected list's ID. It retrieves any existing task lists data from the browser's storage and assigns it to the lists variable after parsing it from JSON format. If no data exists, it assigns an empty array to the lists variable. The ID_ListSelected variable is also retrieved from storage using its key and assigned a null value if no data exists.
const LOCAL_KEY_LIST_STORAGE = "task.lists";
const LOCAL_SELECTED_KEY_ID_LIST_STORAGE = "task.IDListSelected";
let lists = JSON.parse(localStorage.getItem(LOCAL_KEY_LIST_STORAGE)) || [];
let ID_ListSelected = localStorage.getItem(LOCAL_SELECTED_KEY_ID_LIST_STORAGE);

Element_container.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "li") {
    ID_ListSelected = e.target.dataset.listId;
    saveAndRender();
  }
});

task_container.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "input") {
    const selectedList = lists.find((list) => list.id === ID_ListSelected);
    const selectedTask = selectedList.tasks.find(
      (task) => task.id === e.target.id
    );
    selectedTask.complete = e.target.checked;
    save();
    renderTaskCount(selectedList);
  } else if (e.target.tagName.toLowerCase() === "label") {
    // add this block
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

btn_clear_complete_tasks.addEventListener("click", (e) => {
  const selectedList = lists.find((list) => list.id === ID_ListSelected);
  selectedList.tasks = selectedList.tasks.filter((task) => !task.complete);
  saveAndRender();
});

Element_delete_List_btn.addEventListener("click", (e) => {
  lists = lists.filter((list) => list.id !== ID_ListSelected);
  ID_ListSelected = null;
  saveAndRender();
});

Element_new_List_Form.addEventListener("submit", (e) => {
  e.preventDefault();
  const listName = Element_new_List_entry.value;
  if (listName == null || listName === "") return;
  const list = createList(listName);
  Element_new_List_entry.value = null;
  lists.push(list);
  saveAndRender();
});

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

function createList(name) {
  return {
    id: Date.now().toString(),
    name: name,
    tasks: [],
  };
}

function createTask(name) {
  return {
    id: Date.now().toString(),
    name: name,
    complete: false,
  };
}

function saveAndRender() {
  save();
  render();
}

function save() {
  localStorage.setItem(LOCAL_KEY_LIST_STORAGE, JSON.stringify(lists));
  localStorage.setItem(LOCAL_SELECTED_KEY_ID_LIST_STORAGE, ID_ListSelected);
}

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
  // edit task_container

  selectedList.tasks.forEach((task) => {
    const taskElement = document.importNode(template_task.content, true);
    const checkbox = taskElement.querySelector("input");
    checkbox.id = task.id;
    checkbox.checked = task.complete;
    const label = taskElement.querySelector("label");
    label.htmlFor = task.id;
    label.append(task.name);

    const editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.classList.add("edit-button");
    editButton.addEventListener("click", () => {
      const newTaskName = prompt("Enter new task name", task.name);
      if (newTaskName != null && newTaskName !== "") {
        task.name = newTaskName;
        saveAndRender();
      }
    });
    taskElement.querySelector(".task").appendChild(editButton);
    task_container.appendChild(taskElement);
  });
}

function renderTaskCount(selectedList) {
  const incompleteTaskCount = selectedList.tasks.filter(
    (task) => !task.complete
  ).length;
  const taskString = incompleteTaskCount === 1 ? "task" : "tasks";
  Element_CountList.innerText = `${incompleteTaskCount} ${taskString} remaining`;
}

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

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

render();

//dark and light mode
const toggle = document.getElementById("toggle");
const body = document.body;

toggle.addEventListener("change", function () {
  if (this.checked) {
    body.style.backgroundColor = "black";
    body.style.color = "white";
  } else {
    body.style.backgroundColor = " rgb(66, 25, 131)";
    body.style.color = "white";
  }
});

//time and date functions
setInterval(function () {
  var date = new Date();
  var options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  document.getElementById("date").innerHTML = date.toLocaleDateString(
    "en-US",
    options
  );
  var timeOptions = {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };
  document.getElementById("time").innerHTML = date.toLocaleTimeString(
    "en-US",
    timeOptions
  );
}, 1000);

// settings

const settingsBtn = document.getElementById("settings-btn");
const settingsPopup = document.getElementById("settings-popup");

settingsBtn.addEventListener("click", function () {
  if (settingsPopup.hasAttribute("hidden")) {
    settingsPopup.removeAttribute("hidden");
  } else {
    settingsPopup.setAttribute("hidden", "hidden");
  }
});
