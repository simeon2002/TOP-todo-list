import { capacitlizeString } from "./utils.js";

class View {
  #mainContainer = document.querySelector(".main-container");
  #btnProjects = document.querySelector(".btn--projects");
  #projectList = document.querySelector(".project-list");

  constructor() {}

  addPageLoadHandler(handler) {
    document.addEventListener("DOMContentLoaded", handler);
  }

  addBtnProjectsHandler(handler, eventType = "click") {
    this.#btnProjects.addEventListener(eventType, handler);
  }

  renderProjectView(project) {
    const html = this.generateProjectMarkup(project);
    this.#mainContainer.insertAdjacentHTML("afterbegin", html);
  }

  generateProjectMarkup(project) {
    return `
        <article class="project">
          <h1 class="project__title heading-primary">${capacitlizeString(project.name)}</h1>
          <div class="project__divider"></div>
          <div class="project__task-list">
            ${project.tasks.map(this.generateTaskMarkup).join("")}
            <div class="add-task-container">
              <div class="project__divider project__divider--add-task"></div>
              <button class="btn btn--create-task">
                <ion-icon class="icon-add-task" name="add-outline"></ion-icon><span>Add task</span>
              </button>
            </div>
          </div>
        </article>
    `;
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

  renderProjectsInSidebar(projectNames) {
    const generateProjectItemMarkup = projectName =>
      `<li class="item project-item"><button class="btn btn--nav">${projectName}</button></li>`;

    const html = projectNames.map(generateProjectItemMarkup).join("");
    this.#projectList.innerHTML = "";
    this.#projectList.insertAdjacentHTML("afterbegin", html);
  }
}

export { View };
