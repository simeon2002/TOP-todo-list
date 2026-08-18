import { capacitlizeString } from "./utils.js";

class View {
  #mainContainer = document.querySelector(".main-container");
  #projectContainer = document.querySelector(".project");
  #btnProjects = document.querySelector(".btn--projects");
  #btnAddTasks = document.querySelectorAll(".btn--create-task");
  #btnSubmitForm = document.querySelector(".btn--form-submit");
  #btnCloseForm = document.querySelector(".btn--close-form");
  #projectList = document.querySelector(".project-list");
  #inboxNav = document.querySelector(".btn--inbox");
  #taskForm = document.querySelector(".task-form");

  constructor() {
    // events that don't modify any state
    this.#addBtnTaskDetailsHandler();
    this.addBtnCloseHandler();
  }

  addPageLoadHandler(handler) {
    document.addEventListener("DOMContentLoaded", handler);
  }

  addBtnProjectsHandler(handler, eventType = "click") {
    this.#btnProjects.addEventListener(eventType, handler);
  }

  addBtnAddTaskHandler(handler, eventType = "click") {
    this.#btnAddTasks.forEach(btn => {
      btn.addEventListener(eventType, handler);
    });
  }

  addBtnFormSubmitHandler(handler, eventType = "click") {
    this.#taskForm.addEventListener(eventType, handler);
  }

  #addBtnTaskDetailsHandler() {
    document.body.addEventListener("click", e => {
      const btn = e.target.closest(".btn--task-details");
      const isTaskDetailsBtnClickedAgain = btn => {
        btn && btn.classList.contains("btn--task-details--open");
      };

      // case: button clicked again
      if (isTaskDetailsBtnClickedAgain(btn)) {
        btn.classList.remove("btn--task-details--open");
        return;
      }

      // case: outside of button clicked
      this.closeOpenedTaskmenu();

      if (!btn) {
        return;
      }

      // case: button clicked for the first time
      btn.classList.add("btn--task-details--open");
    });
  }

  addBtnEditTaskHandler(handler) {
    this.#projectContainer.addEventListener("click", e => {
      handler(e);
    });
  }

  addBtnRemoveTaskHandler(handler) {
    this.#projectContainer.addEventListener("click", handler);
  }

  addBtnCloseHandler() {
    this.#btnCloseForm.addEventListener("click", e => {
      this.#taskForm.parentElement.close();
    });
  }

  addProjectNavClicked(handler) {
    this.#projectList.addEventListener("click", handler);
  }

  addInboxNavClicked(handler) {
    this.#inboxNav.addEventListener("click", handler);
  }

  closeOpenedTaskmenu() {
    const btnsTaskDetails = this.#projectContainer.querySelectorAll(".btn--task-details");

    btnsTaskDetails.forEach(btn => {
      btn.classList.remove("btn--task-details--open");
    });
  }

  renderProjectView(project) {
    const html = this.generateProjectMarkup(project);

    // project id set in project article el
    this.setProjectId(project.id);

    // remove children besides add task container
    const projectChildren = [...this.#projectContainer.children];
    projectChildren.forEach(child => {
      if (child.classList.contains("add-task-container")) return;
      child.remove();
    });

    // insert project markup
    this.#projectContainer.insertAdjacentHTML("afterbegin", html);
  }

  renderTaskList(tasks) {
    const taskListEl = this.#projectContainer.querySelector(".project__task-list");

    const html = this.generateTaskListMarkup(tasks);

    taskListEl.innerHTML = "";
    taskListEl.insertAdjacentHTML("beforeend", html);
  }

  addTask(task) {
    const taskList = this.#projectContainer.querySelector(".project__task-list");
    taskList.insertAdjacentHTML("beforeend", this.generateTaskMarkup(task));
  }

  setProjectId(projectId) {
    this.#projectContainer.dataset.projectId = projectId;
  }

  getCurrentProjectId() {
    return this.#projectContainer.dataset.projectId;
  }

  generateProjectMarkup(project) {
    return `
          <h1 class="project__title heading-primary">${capacitlizeString(project.name)}</h1>
          <div class="project__divider"></div>
          <div class="project__task-list">
            ${this.generateTaskListMarkup(project.tasks)}
          </div>
    `;
  }

  generateTaskListMarkup(tasks) {
    return tasks.map(this.generateTaskMarkup).join("");
  }

  generateTaskMarkup(task) {
    const html = `
            <div class="task" tabindex="0" data-task-id=${task.id}>
              <label
                ><input class="task__checkbox" type="checkbox" ${task.checked ? "checked" : ""}/><ion-icon
                  class="icon icon-checkmark"
                  name="checkmark-outline"
                  tabindex="0"
                ></ion-icon
              ></label>
              <h2 class="heading-secondary task__title">${capacitlizeString(task.name)}</h2>
              <div class="details-dropdown">
                <button type="button" class="btn btn--task-details">
                  <ion-icon class="task__icon-edit-task" name="ellipsis-vertical-outline"></ion-icon>
                </button>
                <menu class="task-actions-menu">
                  <button class="btn btn--task-action btn--task-edit">Edit Task</button>
                  <button class="btn btn--task-action btn--task-delete">Delete Task</button>
                </menu>
              </div>
            </div>
            `;
    return html;
  }

  renderProjectsInSidebar(projects) {
    const generateProjectItemMarkup = project =>
      `<li class="item project-item" data-project-id=${project.id}><button class="btn btn--nav btn--project-item">${project.name}</button></li>`;

    const html = projects.map(generateProjectItemMarkup).join("");
    this.#projectList.innerHTML = "";
    this.#projectList.insertAdjacentHTML("afterbegin", html);
  }

  renderForm(type = "createTask", { projects, task }) {
    console.log(projects);

    if (type === "createTask") {
      this.renderTaskForm(projects);
      this.populateCreateTaskForm();
    }

    if (type === "editTask") {
      this.renderTaskForm(projects);
      this.populateEditTaskForm(task);
    }
  }

  renderTaskForm(projects) {
    // add class to render form
    this.#taskForm.classList.add("show-form");
    // TODO: remove show-form from project form.

    // open dialog window
    const dialog = this.#taskForm.parentElement;
    dialog.showModal();

    // place focus on name input field
    const taskNameField = this.#taskForm.elements["task-name"];
    taskNameField.focus();

    // Display all project options
    const projectControlEl = this.#taskForm.querySelector("#project");
    const html = this.generateProjectControlMarkup(projects, projectControlEl);

    // remove children
    projectControlEl.innerHTML = "";
    projectControlEl.insertAdjacentHTML("afterbegin", html);
  }

  populateEditTaskForm(task) {
    const fieldMap = {
      name: "task-name",
      description: "task-desc",
      dueDate: "due-date",
      priority: "task-priority",
      tags: "task-tags",
    };

    // add task ID
    this.#taskForm.dataset.id = task.id;

    // modify taskform title
    this.#taskForm.querySelector("h1").textContent = "Edit Task";

    // modfiy submit button text
    this.#btnSubmitForm.textContent = "Confirm Edit";

    const formTypeField = this.#taskForm.querySelector('input[type="hidden"');
    formTypeField.value = "edit-task";

    // populate task controls
    const inputControls = [...this.#taskForm.elements];
    for (const [field, name] of Object.entries(fieldMap)) {
      this.#taskForm.elements[name].value = task[field];
    }
  }

  populateCreateTaskForm() {
    this.#taskForm.querySelector("h1").textContent = "New Task";
    this.#btnSubmitForm.textContent = "Create Task";
    const formTypeField = this.#taskForm.querySelector('input[type="hidden"');
    formTypeField.value = "create-task";
  }

  generateProjectControlMarkup(projects) {
    return projects.map(this.projectOptionMarkup).join("");
  }

  projectOptionMarkup(project) {
    return `<option value=${project.id} ${project.name === "inbox" ? "selected" : ""}>${project.name}</option>`;
  }

  closeForm() {
    // if (type === "task") {
    console.log(this.#taskForm.parentElement);
    this.#taskForm.parentElement.close();

    this.#taskForm.reset();
    // }
  }

  showTaskActionsMenu() {}
}

export { View };
