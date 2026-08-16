import { App } from "./model.js";
import { View } from "./view.js";

export default class AppController {
  constructor() {
    this.app = new App();
    this.view = new View();

    // adding event handlers for DOM events.
    this.view.addPageLoadHandler(this.handlePagleLoad.bind(this));
  }

  handlePagleLoad(e) {
    console.log(this.app);
    const inboxProject = this.app.getProjectByName("inbox");

    //display inbox with populated tasks
    this.view.renderProjectView(inboxProject);

    // display available projects in sidebar
    // this.view.displayProjectsSidebar();
  }
}
