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
        console.log(el.className);
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
    this.view.renderForm(this.app.projects, "task");
  }

  handleBtnFormSubmit(e) {
    // prevent default submit
    e.preventDefault();

    // get form data
    const formData = new FormData(e.target);

    const name = formData.get("task-name");
    const description = formData.get("task-desc");
    const dueDate = formData.get("due-date");
    const priority = formData.get("task-priority");
    const tags = formData.get("task-tags");
    const projectId = formData.get("project");

    // TODO: validate form data
    const validateFormData = formData => {};

    // get current project
    const project = this.app.getProjectById(projectId);

    // create new task for specific project
    project.createTask({ name, description, dueDate, priority, tags });

    // rerender view
    this.view.renderProjectView(project);

    // close form
    this.view.closeForm();
  }
}
