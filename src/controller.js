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
    this.view.addProjectItemClicked(this.handleProjectItemClick.bind(this));
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

    this.view.renderForm("createTask", { projects: [...this.app.projects, this.app.getInbox()] });
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
    this.view.closeForm(formData);
  }

  handleTaskEdit(e, formData) {
    // get updated info
    const { projectId, ...taskInfo } = this.getFormData(formData);
    const taskId = e.target.dataset.id;

    // get current project
    const currentProject = this.app.getProjectById(projectId);

    // update task
    currentProject.updateTask(taskId, taskInfo);

    // rerender view
    this.view.renderTaskList(currentProject.tasks);
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
    if (this.view.getCurrentProjectId() === project.id) this.view.addTask(project.tasks.at(-1));
  }

  handleEditTaskBtnClick(e) {
    const editTaskBtn = e.target.closest(".btn--task-edit");
    if (!editTaskBtn) return;

    // fetch task details
    const taskId = e.target.closest(".task").dataset.taskId;
    const projectId = this.view.getCurrentProjectId();
    const task = this.app.getProjectById(projectId).getTaskById(taskId);
    const projects = this.app.projects;
    const inbox = this.app.getInbox();
    console.log(inbox);

    // render populated edit form
    this.view.renderForm("editTask", { projects: [...projects, inbox], task });
  }

  handleRemoveTaskBtnClick(e) {
    const deleteTaskBtn = e.target.closest(".btn--task-delete");
    if (!deleteTaskBtn) return;

    // confirmation window
    const confirmDeletion = confirm("Are you sure you want to delete the task?");

    if (!confirmDeletion) return;

    // if yes -> remove task from projects
    const currentProject = this.app.getProjectById(this.view.getCurrentProjectId());
    const taskId = e.target.closest(".task").dataset.taskId;
    currentProject.removeTask(taskId);

    // update task list
    this.view.renderTaskList(currentProject.tasks);
  }

  handleProjectItemClick(e) {
    console.log(e.target);
    const projectItemBtn = e.target.closest(".btn--project-item");
    if (!projectItemBtn) return;
    const projectId = projectItemBtn.parentElement.dataset.projectId;

    // display new project view
    this.view.renderProjectView(this.app.getProjectById(projectId));
  }
}
