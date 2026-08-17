import { capacitlizeString } from "./utils.js";

class View {
  #mainContainer = document.querySelector(".main-container");
  #projectContainer = document.querySelector(".project");
  #btnProjects = document.querySelector(".btn--projects");
  #btnAddTasks = document.querySelectorAll(".btn--create-task");
  #btnSubmitForm = document.querySelector(".btn--form-submit");
  #projectList = document.querySelector(".project-list");
  #taskForm = document.querySelector(".task-form");

  constructor() {
    // events that don't modify any state
    this.#addBtnTaskDetailsHandler();
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

    // insert project markup
    this.#projectContainer.insertAdjacentHTML("afterbegin", html);
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
                  <button class="btn btn--task-action">Edit Task</button>
                  <button class="btn btn--task-action">Delete Task</button>
                </menu>
              </div>
            </div>
            `;
    return html;
  }

  renderProjectsInSidebar(projects) {
    const generateProjectItemMarkup = project =>
      `<li class="item project-item" data-project-id=${project.id}><button class="btn btn--nav">${project.name}</button></li>`;

    const html = projects.map(generateProjectItemMarkup).join("");
    this.#projectList.innerHTML = "";
    this.#projectList.insertAdjacentHTML("afterbegin", html);
  }

  renderForm(type = "createTask", { projects, task }) {
    console.log(projects);

    if (type === "createTask") {
      this.renderTaskForm(projects);
    }

    if (type === "editTask") {
      this.renderTaskForm(projects);
      this.populateTaskForm(task);
    }
  }

  renderTaskForm(projects) {
    // add class to render form
    this.#taskForm.classList.add("show-form");
    // TODO: remove show-form from project form.

    // open dialog window
    const dialog = this.#taskForm.parentElement;
    dialog.showModal();

    // Display all project options
    const projectControlEl = this.#taskForm.querySelector("#project");
    const html = this.generateProjectControlMarkup(projects, projectControlEl);
    projectControlEl.innerHTML = "";
    projectControlEl.insertAdjacentHTML("afterbegin", html);
  }

  populateTaskForm(task) {
    const fieldMap = {
      name: "task-name",
      description: "task-desc",
      dueDate: "due-date",
      priority: "task-priority",
      tags: "task-tags",
    };

    // modify taskform title
    this.#taskForm.querySelector("h1").textContent = "Edit Task";

    // populate task controls
    const inputControls = [...this.#taskForm.elements];
    for (const [field, name] of Object.entries(fieldMap)) {
      this.#taskForm.elements[name].value = task[field];
    }
  }

  generateProjectControlMarkup(projects) {
    return projects.map(this.projectOptionMarkup).join("");
  }

  projectOptionMarkup(project) {
    return `<option value=${project.id} ${project.name === "inbox" ? "selected" : ""}>${project.name}</option>`;
  }

  closeForm(type = "task") {
    if (type === "task") {
      console.log(this.#taskForm.parentElement);
      this.#taskForm.parentElement.close();

      this.#taskForm.reset();
    }
  }

  showTaskActionsMenu() {}
}

export { View };
