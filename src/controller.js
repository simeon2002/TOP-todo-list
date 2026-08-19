import { App } from "./model.js";
import { View } from "./view.js";

export default class AppController {
  constructor() {
    this.app = new App();
    this.view = new View();

    // adding event handlers for DOM events.
    this.view.addPageLoadHandler(this.handlePagleLoad.bind(this));
    this.view.addBtnProjectsHandler(this.handleBtnProjectsClick.bind(this));
    this.view.addBtnAddTaskHandler(this.handleAddTaskBtnClick.bind(this), "click");
    this.view.addBtnFormSubmitHandler(this.handleBtnFormSubmit.bind(this), "submit");
    this.view.addBtnEditTaskHandler(this.handleEditTaskBtnClick.bind(this));
    this.view.addBtnRemoveTaskHandler(this.handleRemoveTaskBtnClick.bind(this));
    // this.view.addProjectNavClicked(this.handleProjectNavClick.bind(this));
    this.view.addNavItemClickedHandler(this.handleNavItemClick.bind(this));
    this.view.addBtnProjectFormSubmitHandler(this.handleBtnProjectFormSubmit.bind(this));
    this.view.addRemoveProjectBtnHandler(this.handleRemoveProjectBtnClick.bind(this));
    this.view.addEditProjectBtnHandler(this.handleEditProjectBtnClick.bind(this));
  }

  handlePagleLoad(e) {
    console.log(this.app);
    const inboxProject = this.app.getProjectByName("inbox");

    //display inbox with populated tasks
    this.view.renderProjectView(inboxProject);

    // Get projects
    const projects = this.app.projects;

    // display available projects in sidebar
    this.view.renderProjectsInSidebar(projects);

    // add projectId to inbox nav item
    this.view.inboxNavOnLoad(this.app.getInbox().id);
  }

  handleBtnProjectsClick(e) {
    const toggleButtonClass = el => {
      if (!el.classList.contains("btn--closed") && !el.classList.contains("btn--open")) {
        el.classList.add("btn--open");
        return;
      }

      el.classList.toggle("btn--open");
      el.classList.toggle("btn--closed");
      console.log(el.className);
    };
    const btnProjects = e.currentTarget;
    const chevron = btnProjects.querySelector("ion-icon");

    // toggle button classes for chevron and bg color
    toggleButtonClass(btnProjects);
  }

  handleAddTaskBtnClick(e) {
    console.log(this.app.getInbox());
    this.view.renderTaskDialog("createTask", { projects: [this.app.getInbox(), ...this.app.projects] });
  }

  handleBtnFormSubmit(e) {
    // prevent default submit
    e.preventDefault();

    // get form data
    const formData = new FormData(e.target);
    const formType = formData.get("form-type");

    if (formType === "create-task") {
      this.handleTaskCreation(formData);
    }

    if (formType === "edit-task") {
      this.handleTaskEdit(e, formData);
    }

    // close form
    this.view.closeDialog(e.target.parentElement);

    // store new projects state
    this.app.saveToStorage();
  }

  handleTaskEdit(e, formData) {
    // get updated info
    const { projectId, ...taskInfo } = this.getFormData(formData);
    const taskId = e.target.dataset.id;

    // get selected and current project
    const selectedProject = this.app.getProjectById(projectId);
    const currentProjectOfTask = this.app.getProjectByTaskId(taskId);

    // update task
    currentProjectOfTask.updateTask(taskId, taskInfo);

    // if different project is selected, move task
    if (selectedProject.id !== currentProjectOfTask.id) {
      currentProjectOfTask.moveTask(taskId, selectedProject);
    }

    // rerender view
    if (this.isAllTasksViewOpen()) this.handleAllTasksRender();
    else this.view.renderTaskList(currentProjectOfTask.tasks);
  }

  getFormData(formData) {
    const name = formData.get("task-name");
    const description = formData.get("task-desc");
    const dueDate = formData.get("due-date");
    const priority = formData.get("task-priority");
    const tags = formData.get("task-tags");
    const projectId = formData.get("project");

    return { name, description, dueDate, priority, tags, projectId };
  }

  handleTaskCreation(formData) {
    const { name, description, dueDate, priority, tags, projectId } = this.getFormData(formData);

    // TODO: validate form data
    const validateFormData = formData => {};

    // get current project
    const project = this.app.getProjectById(projectId);

    // create new task for specific project
    project.createTask({ name, description, dueDate, priority, tags });

    // rerender view if task is present here
    // if (this.view.getCurrentProjectId() === project.id) this.view.addTask(project.tasks.at(-1));
    if (this.isAllTasksViewOpen()) this.handleAllTasksRender();
    else this.view.renderTaskList(project.tasks);
  }

  handleEditTaskBtnClick(e) {
    const editTaskBtn = e.target.closest(".btn--task-edit");
    if (!editTaskBtn) return;

    // fetch task details
    const taskEl = e.target.closest(".task");
    const taskId = taskEl.dataset.taskId;
    const projectId = taskEl.dataset.projectId;
    const task = this.app.getProjectById(projectId).getTaskById(taskId);
    const projects = this.app.projects;
    const inbox = this.app.getInbox();
    console.log(inbox);

    // render populated edit form
    this.view.renderTaskDialog("editTask", { projects: [inbox, ...projects], task });
  }

  handleRemoveTaskBtnClick(e) {
    const deleteTaskBtn = e.target.closest(".btn--task-delete");
    if (!deleteTaskBtn) return;

    // confirmation window
    const confirmDeletion = confirm("Are you sure you want to delete the task?");

    if (!confirmDeletion) return;

    // if yes -> remove task from projects
    const taskEl = e.target.closest(".task");
    const taskId = e.target.closest(".task").dataset.taskId;
    const projectId = e.target.closest(".task").dataset.projectId;
    const currentProject = this.app.getProjectById(projectId);
    currentProject.removeTask(taskId);

    // update task list
    if (this.isAllTasksViewOpen()) this.handleAllTasksRender();
    else this.view.renderTaskList(currentProject.tasks);

    // store new projects state
    this.app.saveToStorage();
  }

  // handleProjectNavClick(e) {
  //   console.log(e.target);
  //   const projectItemBtn = e.target.closest(".btn--project-item");
  //   if (!projectItemBtn) return;
  //   const projectId = projectItemBtn.parentElement.dataset.projectId;

  //   // display new project view
  //   this.view.renderProjectView(this.app.getProjectById(projectId));
  // }

  handleNavItemClick(e) {
    const navItem = e.target.closest(".nav-list .item:not(:has(.btn--projects), :has(.btn--create))");

    if (!navItem || e.target.closest(".project-details-dropdown")) return;

    const navItems = e.currentTarget.querySelectorAll(".nav-list .item");
    const navBtn = navItem.querySelector(".btn--nav");
    console.log(navBtn);

    let projectId = navItem.dataset.projectId;

    // if project clicked
    if (projectId) {
      // fetch project
      const project = this.app.getProjectById(projectId);
      // render project
      this.view.renderProjectView(project);
    }

    // if all task view clicked
    if (navBtn.textContent.toLowerCase() === "all tasks") {
      this.handleAllTasksRender();
    }

    // make clicked btn active state
    navItems.forEach(btn => btn.classList.remove("item--active"));
    navItem.classList.add("item--active");
  }

  handleAllTasksRender() {
    const tasks = this.app.getAllTasks();
    const name = "all tasks";
    const id = "all tasks";

    this.view.renderProjectView({ id, name, tasks });
  }

  isAllTasksViewOpen() {
    return this.view.getCurrentProjectId() === "all tasks";
  }

  handleBtnProjectFormSubmit(e) {
    e.preventDefault();
    console.log(e);

    // get form data
    const form = e.target;
    const formData = new FormData(form);
    const formType = formData.get("form-type");
    const name = formData.get("project-name");
    const description = formData.get("project-desc");
    const color = formData.get("project-color");
    const id = form.dataset?.id;

    // check form type
    if (formType === "create-project") {
      this.app.createProject({ name, color, description });
    }

    if (formType === "edit-project") {
      this.app.updateProject({ name, description, color, id });
    }

    // rerender project list
    this.view.renderProjectsInSidebar(this.app.projects);

    // close modal
    this.view.closeDialog(e.target.parentElement);

    // render new project view
    this.view.renderProjectView(this.app.getProjectByName(name));

    // store new projects state
    this.app.saveToStorage();
  }

  handleRemoveProjectBtnClick(e) {
    const deleteBtn = e.target.closest(".btn--project-delete");

    if (!deleteBtn) return;

    const confirmDeletion = confirm("Are you sure you want to delete the project?");

    if (!confirmDeletion) return;

    this.deleteProject(deleteBtn);
  }

  renderInboxView() {
    this.view.renderProjectView(this.app.getInbox());
    this.view.MakeInboxNavBtnActive();
  }

  deleteProject(deleteBtn) {
    const projectNavItem = deleteBtn.closest(".project-item");
    const idProjectItem = projectNavItem.dataset.projectId;

    this.app.deleteProject(idProjectItem);

    this.view.renderProjectsInSidebar(this.app.projects);

    this.renderProjectViewOnProjectDelete(idProjectItem);

    // store new projects state
    this.app.saveToStorage();
  }

  renderProjectViewOnProjectDelete(projectId) {
    const projectIdCurrentView = this.view.getCurrentProjectId();

    if (projectIdCurrentView === projectId) {
      this.renderInboxView();
      return;
    }

    if (this.isAllTasksViewOpen()) {
      this.handleAllTasksRender();
      return;
    }

    const projectCurrentView = this.app.getProjectById(projectIdCurrentView);
    this.view.renderProjectView(projectCurrentView);
  }

  handleEditProjectBtnClick(e) {
    const editBtn = e.target.closest(".btn--project-edit");
    if (!editBtn) return;

    const projectToEdit = this.getProjectToEdit(editBtn);

    this.view.renderProjectDialog();

    this.view.populateProjectForm(projectToEdit);
  }

  getProjectToEdit(btn) {
    const projectItem = btn.closest(".project-item");
    const projectId = projectItem.dataset.projectId;
    return this.app.getProjectById(projectId);
  }
}
