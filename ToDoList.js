const dialog = document.getElementById("dialog");

function showDialog() {
  ["task-name", "task-category", "task-priority"].forEach((input) => {
    resetErrorMessage(input);
  });
  dialog.showModal();
}
function closeDialog() {
  dialog.close();
}

function addTask() {
  ["task-name", "task-category", "task-priority"].forEach((input) => {
    resetField(input);
  });
  showDialog();
}

const dialogDelete = document.getElementById("dialogDelete");

function showDialogDelete() {
  dialogDelete.showModal();
}
function closeDialogDelete() {
  dialogDelete.close();
}

function confirmDelete(index) {
  showDialogDelete();
  document.getElementById("confirm-delete").onclick = () => {
    deleteTask(index);
    closeDialogDelete();
  };
}

window.onload = function () {
  renderTasks("", "");
};

const renderTasks = (
  selectedPriority,
  selectedCategory,
  selectedName,
  selectedStatus
) => {
  const tasksContainer = document.getElementById("tasks-container");
  tasksContainer.innerHTML = "";
  const tasks = JSON.parse(localStorage.getItem("tasks")) ?? [];

  const filteredTasks = getFilteredTasks(
    tasks,
    selectedPriority,
    selectedCategory,
    selectedName,
    selectedStatus
  );

  if (filteredTasks.length === 0) {
    tasksContainer.innerHTML = "";
    return;
  }

  filteredTasks.forEach((task, index) => {
    const taskContainer = document.createElement("div");
    const textContainer = document.createElement("div");
    const categoryContainer = document.createElement("p");
    const priorityContainer = document.createElement("p");
    const taskName = document.createElement("h3");
    taskName.innerText = task.taskName;
    categoryContainer.innerText = task.taskCategory;
    priorityContainer.innerText = task.taskPriority;

    if (task.completed) {
      taskContainer.classList.add("tarea-completada");
    }

    taskContainer.classList.add("cuadros-de-tarea");
    textContainer.classList.add("tarea");

    tasksContainer.appendChild(taskContainer);
    taskContainer.appendChild(textContainer);
    textContainer.appendChild(taskName);
    textContainer.appendChild(categoryContainer);
    textContainer.appendChild(priorityContainer);
    renderIconsBlock(taskContainer, index, task.completed);
  });
};

const getFilteredTasks = (
  tasks,
  selectedPriority,
  selectedCategory,
  selectedName,
  selectedStatus
) => {
  const filteredTasks = tasks.filter((task) => {
    const categoryMatch = selectedCategory
      ? task.taskCategory.toLowerCase().includes(selectedCategory.toLowerCase())
      : true;

    const priorityMatch = selectedPriority
      ? task.taskPriority === selectedPriority
      : true;
    const nameMatch = selectedName
      ? task.taskName.toLowerCase().includes(selectedName.toLowerCase())
      : true;
    const statusMatch = selectedStatus
      ? selectedStatus === "completas"
        ? task.completed
        : !task.completed
      : true;

    return categoryMatch && priorityMatch && nameMatch && statusMatch;
  });

  return filteredTasks;
};

const renderIconsBlock = (taskContainer, index, taskCompleted) => {
  const iconContainer = document.createElement("div");
  const trashIcon = document.createElement("i");
  const pencilIcon = document.createElement("i");
  const checkIcon = document.createElement("i");

  iconContainer.classList.add("iconos");
  trashIcon.classList.add("bi", "bi-trash", "icono-equis");
  pencilIcon.classList.add("bi", "bi-pencil-square", "icono-editar");
  checkIcon.classList.add(
    "bi",
    `bi-check-circle${taskCompleted ? "-fill" : ""}`,
    "icono-completo"
  );

  pencilIcon.addEventListener("click", () => editTask(index));
  trashIcon.addEventListener("click", () => confirmDelete(index));
  checkIcon.addEventListener("click", () => completeTask(index));

  iconContainer.appendChild(trashIcon);
  iconContainer.appendChild(pencilIcon);
  iconContainer.appendChild(checkIcon);
  taskContainer.appendChild(iconContainer);
};

document.getElementById("priority-filter").addEventListener("change", (ev) => {
  const categoryFilter = document.getElementById("category-filter").value;
  const nameFilter = document.getElementById("name-filter").value;
  const completeFilter = document.getElementById("complete-filter").value;
  const priorityFilter = ev.target.value;

  renderTasks(priorityFilter, categoryFilter, nameFilter, completeFilter);
});

document.getElementById("category-filter").addEventListener("input", (ev) => {
  const priorityFilter = document.getElementById("priority-filter").value;
  const nameFilter = document.getElementById("name-filter").value;
  const completeFilter = document.getElementById("complete-filter").value;

  const categoryFilter = ev.target.value;

  renderTasks(priorityFilter, categoryFilter, nameFilter, completeFilter);
});

document.getElementById("name-filter").addEventListener("input", (ev) => {
  const priorityFilter = document.getElementById("priority-filter").value;
  const categoryFilter = document.getElementById("category-filter").value;
  const completeFilter = document.getElementById("complete-filter").value;
  const nameFilter = ev.target.value;

  renderTasks(priorityFilter, categoryFilter, nameFilter, completeFilter);
});

document.getElementById("complete-filter").addEventListener("change", (ev) => {
  const categoryFilter = document.getElementById("category-filter").value;
  const nameFilter = document.getElementById("name-filter").value;
  const priorityFilter = document.getElementById("priority-filter").value;
  const completeFilter = ev.target.value;

  renderTasks(priorityFilter, categoryFilter, nameFilter, completeFilter);
});

const editTask = (index) => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) ?? [];

  const priorityFilter = document.getElementById("priority-filter").value;
  const nameFilter = document.getElementById("name-filter").value;
  const completeFilter = document.getElementById("complete-filter").value;
  const categoryFilter = document.getElementById("category-filter").value;

  const filteredTasks = getFilteredTasks(
    tasks,
    priorityFilter,
    categoryFilter,
    nameFilter,
    completeFilter
  );
  const taskToEdit = filteredTasks[index];
  document.getElementById("task-category").value = taskToEdit.taskCategory;
  document.getElementById("task-name").value = taskToEdit.taskName;
  document.getElementById("task-priority").value = taskToEdit.taskPriority;

  let url = new URL(window.location.href);
  url.searchParams.set("taskIndex", index);
  window.history.pushState({}, "", url.toString());
  showDialog();
};

const deleteTask = (index) => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) ?? [];

  const priorityFilter = document.getElementById("priority-filter").value;
  const nameFilter = document.getElementById("name-filter").value;
  const completeFilter = document.getElementById("complete-filter").value;
  const categoryFilter = document.getElementById("category-filter").value;

  const filteredTasks = getFilteredTasks(
    tasks,
    priorityFilter,
    categoryFilter,
    nameFilter,
    completeFilter
  );

  const taskToDelete = filteredTasks[index];

  const updatedTaks = tasks.filter((task) => task.id !== taskToDelete.id);

  localStorage.setItem("tasks", JSON.stringify(updatedTaks));
  renderTasks(priorityFilter, categoryFilter, nameFilter, completeFilter);
};

const completeTask = (index) => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) ?? [];
  const priorityFilter = document.getElementById("priority-filter").value;
  const categoryFilter = document.getElementById("category-filter").value;
  const nameFilter = document.getElementById("name-filter").value;
  const completeFilter = document.getElementById("complete-filter").value;
  const filteredTasks = getFilteredTasks(
    tasks,
    priorityFilter,
    categoryFilter,
    nameFilter,
    completeFilter
  );

  const currentTask = filteredTasks[index];
  currentTask.completed = !currentTask.completed;
  const updatedTasks = tasks.map((task) => {
    if (task.id === currentTask.id) {
      return currentTask;
    }

    return task;
  });
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));

  renderTasks(priorityFilter, categoryFilter, nameFilter, completeFilter);
};

const taskNameInput = document.getElementById("task-name");
const taskCategoryInput = document.getElementById("task-category");
const taskPriorityInput = document.getElementById("task-priority");

taskNameInput.addEventListener("input", () => {
  resetErrorMessage("task-name");
});
taskCategoryInput.addEventListener("input", () => {
  resetErrorMessage("task-category");
});
taskPriorityInput.addEventListener("input", () => {
  resetErrorMessage("task-priority");
});

const taskForm = document.getElementById("add-task");

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  let allValuesAreValid = true;

  for (const [key, value] of formData.entries()) {
    if (!value) {
      setErrorMessage(key, "Este campo no puede estar vacio", "red");
      allValuesAreValid = false;
    } else {
      setErrorMessage(key, "");
    }
  }
  if (!allValuesAreValid) {
    return;
  }

  let url = new URL(window.location.href);

  const storedTasks = JSON.parse(localStorage.getItem("tasks")) ?? [];

  const newTask = {
    id: Math.floor(Math.random() * 1000),
    taskName: formData.get("task-name"),
    taskCategory: formData.get("task-category"),
    taskPriority: formData.get("task-priority"),
  };

  if (url.searchParams.has("taskIndex")) {
    let taskIndex = url.searchParams.get("taskIndex");
    storedTasks[Number(taskIndex)] = newTask;
    url.searchParams.delete("taskIndex");
    window.history.pushState({}, "", url.toString());
  } else {
    storedTasks.push(newTask);
  }

  localStorage.setItem("tasks", JSON.stringify(storedTasks));

  closeDialog();

  renderTasks("", "");

  taskForm.reset();
});

document.getElementById("task-category").addEventListener("input", (ev) => {
  resetErrorMessage("task-category");
});
function resetField(input) {
  document.getElementById(input).value = "";
  setErrorMessage(input, "", "");
}

function resetErrorMessage(input) {
  setErrorMessage(input, "", "");
}

function setErrorMessage(input, message, color) {
  document.getElementById(input).style.borderColor = color;
  document.getElementById(input + "_error").innerText = message;
}
