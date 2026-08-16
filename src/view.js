class View {
  constructor() {}

  addPageLoadHandler(handler) {
    document.addEventListener("DOMContentLoaded", handler);
  }

  displayProjectView({ name, taskList }) {
    const html = `
              <article class="project">
          <h1 class="project__title heading-primary">Project Title</h1>
          <div class="project__divider"></div>
          <div class="project__task-list">
            <div class="task" tabindex="0">
              <input class="task__checkbox" type="checkbox" checked />
              <h2 class="heading-secondary task__title">Task name</h2>
              <ion-icon class="task__icon-edit-task" name="ellipsis-vertical-outline" tabindex="0"></ion-icon>
            </div>
            <div class="task" tabindex="0">
              <input class="task__checkbox" type="checkbox" checked />
              <h2 class="heading-secondary task__title">Task name</h2>
              <ion-icon class="task__icon-edit-task" name="ellipsis-vertical-outline" tabindex="0"></ion-icon>
            </div>
            <div class="task" tabindex="0">
              <label
                ><input class="task__checkbox" type="checkbox" /><ion-icon
                  class="icon icon-checkmark"
                  name="checkmark-outline"
                  tabindex="0"
                ></ion-icon
              ></label>
              <h2 class="heading-secondary task__title">Task name</h2>
              <ion-icon class="task__icon-edit-task" name="ellipsis-vertical-outline"></ion-icon>
            </div>
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
}

export { View };
