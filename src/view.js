import { capacitlizeString } from "./utils.js";

class View {
  #mainContainer = document.querySelector(".main-container");
  #projectContainer = document.querySelector(".project");
  #btnProjects = document.querySelector(".btn--projects");
  #btnAddTasks = document.querySelectorAll(".btn--create-task");
  #btnSubmitForm = document.querySelector(".btn--form-submit");
  #btnSumbitProjectForm = document.querySelector(".btn--project-form-submit");
  #btnCloseForm = document.querySelector(".btn--close-form");
  #btnCreateProject = document.querySelector(".btn--create-project");
  #projectList = document.querySelector(".project-list");
  #navList = document.querySelector(".nav-list");
  #taskForm = document.querySelector(".task-form");
  #projectForm = document.querySelector(".project-form");

  constructor() {
    console.log(this.#btnCreateProject);

    // events that don't modify any state
    this.#addBtnTaskDetailsHandler();
    this.addBtnCloseHandler();
    this.addCreateProjectBtnHandler();
    this.handleDialogClose();
    this.handleBtnProjectDetailsClick();
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

      // case: button clicked again or outside of button clicked
      if (!btn || btn.classList.contains("btn--task-details--open")) {
        this.closeOpenedTaskmenu();
        return;
      }

      // case: button clicked or other of the same button clicked
      this.closeOpenedTaskmenu();
      btn.classList.add("btn--task-details--open");
    });
  }

  handleBtnProjectDetailsClick() {
    document.body.addEventListener("click", e => {
      const projectDetailsBtn = e.target.closest(".btn--project-details");
      const projectListContainer = this.#projectList.parentElement;

      if (!projectDetailsBtn || projectDetailsBtn.classList.contains("btn--project-details--open")) {
        this.closeProjectMenu();
        return;
      }

      this.openProjectMenu(projectDetailsBtn);
    });
  }

  closeProjectMenu() {
    const projectListContainer = this.#projectList.parentElement;
    projectListContainer.style.overflow = "hidden";
    this.closeOpenedProjectMenu();
  }

  openProjectMenu(btn) {
    const projectListContainer = this.#projectList.parentElement;
    projectListContainer.style.overflow = "visible";
    this.closeOpenedProjectMenu();
    btn.classList.add("btn--project-details--open");
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
      this.closeDialog(e.target.closest("dialog"));
    });
  }

  addProjectNavClicked(handler) {
    this.#projectList.addEventListener("click", handler);
  }

  addNavItemClickedHandler(handler) {
    this.#navList.addEventListener("click", handler);
  }

  addCreateProjectBtnHandler() {
    this.#projectList.addEventListener("click", e => {
      const createProjectBtn = e.target.closest(".btn--create-project");
      if (!createProjectBtn) return;

      this.populateGeneralFormInfo(this.#projectForm, "New Project", "Create Project", "create-project");
      this.renderProjectDialog();
    });
  }

  addBtnProjectFormSubmitHandler(handler) {
    this.#projectForm.addEventListener("submit", handler);
  }

  addRemoveProjectBtnHandler(handler) {
    this.#projectList.addEventListener("click", handler);
  }

  addEditProjectBtnHandler(handler) {
    this.#projectList.addEventListener("click", handler);
  }

  handleDialogClose() {
    document.querySelectorAll("dialog").forEach(dialog => dialog.addEventListener("close", e => e.target.querySelector("form").reset()));
  }

  closeOpenedTaskmenu() {
    const btnsTaskDetails = this.#projectContainer.querySelectorAll(".btn--task-details");

    btnsTaskDetails.forEach(btn => {
      btn.classList.remove("btn--task-details--open");
    });
  }

  closeOpenedProjectMenu() {
    const projectDetailsBtns = this.#projectList.querySelectorAll(".btn--project-details");

    projectDetailsBtns.forEach(btn => btn.classList.remove("btn--project-details--open"));
  }

  renderProjectView({ id, name, tasks }) {
    console.log(id);

    const html = this.generateProjectMarkup(name, tasks);

    // project id set in project article el
    id && this.setProjectId(id);

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

  setProjectId(projectId) {
    this.#projectContainer.dataset.projectId = projectId;
  }

  getCurrentProjectId() {
    return this.#projectContainer.dataset.projectId;
  }

  generateProjectMarkup(name, tasks) {
    return `
          ${this.generateProjectTitle(name)}
          <div class="project__task-list">
            ${this.generateTaskListMarkup(tasks)}
          </div>
    `;
  }

  generateTaskListMarkup(tasks) {
    return tasks.map(this.generateTaskMarkup).join("");
  }

  generateProjectTitle(name) {
    return `<h1 class="project__title heading-primary">${capacitlizeString(name)}</h1>
          <div class="project__divider"></div>`;
  }

  generateTaskMarkup(task) {
    const html = `
            <div class="task" tabindex="0" data-task-id=${task.id} data-project-id=${task.projectId}>
              <label
                ><input class="task__checkbox" type="checkbox" ${task.checked ? "checked" : ""}/><ion-icon
                  class="icon icon-checkmark"
                  name="checkmark-outline"
                  tabindex="0"
                ></ion-icon
              ></label>
              <h2 class="heading-secondary task__title">${capacitlizeString(task.name)}</h2>
              <div class="task-details-dropdown">
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

  setInboxId(id) {
    // add project id
    const inboxNav = this.#navList.querySelector(":has(.btn--inbox)");
    inboxNav.dataset.projectId = id;
  }

  setNavItemActive(id) {
    console.log(id);

    const navItem = document.querySelector(`[data-project-id="${id}"]`);
    console.log(navItem);

    const navItems = document.querySelectorAll(".item");
    navItems.forEach(item => item.classList.remove("item--active"));
    navItem.classList.add("item--active");
  }

  renderProjectsInSidebar(projects) {
    const generateProjectItemMarkup = project => {
      console.log(project.color);
      return `
      <li class="item project-item" data-project-id=${project.id} ${project.color !== "inherit" ? `style="border-left: 3px solid ${project.color}"` : ""}>
        <button class="btn btn--nav btn--project-item" >
          ${project.name}
        </button>
        <div class="project-details-dropdown">
          <button type="button" class="btn btn--project-details">
            <ion-icon class="task__icon-edit-project" name="ellipsis-vertical-outline"></ion-icon>
          </button>
          <menu class="project-actions-menu">
            <button class="btn btn--project-action btn--project-edit">Edit Project</button>
            <button class="btn btn--project-action btn--project-delete">Delete Project</button>
          </menu>
        </div>
      </li>`;
    };

    const html = projects.map(generateProjectItemMarkup).join("");
    this.#projectList.innerHTML = `
        <li class="item project-create-item">
          <button class="btn btn--create btn--create-project">
            <ion-icon class="icon-add-task" name="add-outline"></ion-icon><span>Create Project</span>
          </button>
        </li>
    `;
    this.#projectList.insertAdjacentHTML("afterbegin", html);
  }

  renderTaskDialog(type = "createTask", { projects, task }) {
    // open dialog window
    const dialog = this.#taskForm.parentElement;
    dialog.showModal();

    // render task form
    this.renderTaskForm(projects, type, task);
  }

  renderTaskForm(projects, type, task = undefined) {
    // place focus on name input field
    const taskNameField = this.#taskForm.elements["task-name"];
    taskNameField.focus();

    if (type === "createTask") {
      this.populateGeneralFormInfo(this.#taskForm, "New Task", "Create Task", "create-task");
      this.renderProjectControlOptions(projects);
    }

    if (type === "editTask") {
      this.populateGeneralFormInfo(this.#taskForm, "edit task", "confirm edit", "edit-task");
      this.populateEditTaskFormInfo(task);
      this.renderProjectControlOptions(projects, task.projectId, false);
    }
  }

  renderProjectControlOptions(projects, projectIdFromTask, createTask = true) {
    const projectControlEl = this.#taskForm.querySelector("#project");
    const html = this.generateProjectControlMarkup(projects, projectIdFromTask, createTask);

    // remove children
    projectControlEl.innerHTML = "";
    projectControlEl.insertAdjacentHTML("afterbegin", html);
  }

  populateEditTaskFormInfo(task) {
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

  populateGeneralFormInfo(form, title, btnContent, type = "create-task") {
    form.querySelector("h1").textContent = capacitlizeString(title);
    form.querySelector(".btn--form-submit").textContent = capacitlizeString(btnContent);
    const formTypeField = form.querySelector('input[type="hidden"]');
    formTypeField.value = type;
  }

  generateProjectControlMarkup(projects, projectIdFromTask, createTask) {
    return projects.map(project => this.projectOptionMarkup(project, projectIdFromTask, createTask)).join("");
  }

  projectOptionMarkup(project, projectIdFromTask, createTask) {
    let selectedOption;
    if (createTask) selectedOption = project.id === this.getCurrentProjectId() ? "selected" : "";
    else selectedOption = project.id === projectIdFromTask ? "selected" : "";
    return `<option value=${project.id} ${selectedOption}>${project.name}</option>`;
  }

  renderProjectDialog() {
    this.#projectForm.parentElement.showModal();
  }

  closeDialog(dialog) {
    dialog.close();
  }

  populateProjectForm(project) {
    this.populateGeneralFormInfo(this.#projectForm, project.name, "edit project", "edit-project");
    this.populateProjectSpecificFormInfo(project);
  }

  populateProjectSpecificFormInfo(project) {
    const fieldValueMap = {
      "project-name": project.name,
      "project-desc": project.description,
      "project-color": project.color,
    };

    for (const [fieldName, value] of Object.entries(fieldValueMap)) {
      this.#projectForm.elements[fieldName].value = value;
      console.log(this.#projectForm.elements[fieldName]);
    }

    // add project id to form
    this.#projectForm.dataset.id = project.id;
  }
}

export { View };
