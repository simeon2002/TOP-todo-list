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
    // create inbox project
    this.app.createProject({ name: "Test" });
    console.log(this.app);

    //display inbox with populated tasks
    this.view.displayView();

    // display available projects in sidebar
  }
}
