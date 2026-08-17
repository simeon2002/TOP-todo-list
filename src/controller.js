import { App } from "./model.js";
import { View } from "./view.js";

export default class AppController {
  constructor() {
    this.app = new App();
    this.view = new View();

    // adding event handlers for DOM events.
    this.view.addPageLoadHandler(this.handlePagleLoad.bind(this));
    this.view.addBtnProjectsHandler(this.handleBtnProjectsClick.bind(this));
  }

  handlePagleLoad(e) {
    console.log(this.app);
    const inboxProject = this.app.inbox;

    //display inbox with populated tasks
    this.view.renderProjectView(inboxProject);

    // Get project names
    const projectNames = this.app.getProjectNames();

    // display available projects in sidebar
    this.view.renderProjectsInSidebar(projectNames);
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
}
