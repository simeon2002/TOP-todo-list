import { capacitlizeString } from "./utils.js";

class View {
  #mainContainer = document.querySelector(".main-container");
  #projectContainer = document.querySelector(".project");
  #btnProjects = document.querySelector(".btn--projects");
  #btnAddTasks = document.querySelectorAll(".btn--create-task");
  #btnSubmitForm = document.querySelector(".btn--form-submit");
  #projectList = document.querySelector(".project-list");
  #taskForm = document.querySelector(".task-form");

  constructor() {}

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
    const html = `<div class="task" tabindex="0">
              <label
                ><input class="task__checkbox" type="checkbox" ${task.checked ? "checked" : ""}/><ion-icon
                  class="icon icon-checkmark"
                  name="checkmark-outline"
                  tabindex="0"
                ></ion-icon
              ></label>
              <h2 class="heading-secondary task__title">${capacitlizeString(task.name)}</h2>
              <ion-icon class="task__icon-edit-task" name="ellipsis-vertical-outline"></ion-icon>
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

  renderForm(projects, type = "task") {
    if (type === "task") {
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
}

export { View };
