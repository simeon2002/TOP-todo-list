class Project {
  #name;
  #id;
  #color;
  #tasks = [];

  constructor(name, color = undefined) {
    this.#id = crypto.randomUUID();
    this.#name = name;
  }

  removeTask(taskId) {}

  updateTask(taskId, taskInfo) {}

  createTask({ name, description = "", dueDate = undefined, priority, tags = [] }) {
    this.#tasks.push(new Task(name, description, dueDate, priority, tags));
  }

  get name() {
    console.log(this.#name);
    return this.#name;
  }

  get tasks() {
    return this.#tasks;
  }
}

class Task {
  #id;
  #name;
  #description;
  #checked;
  #dueDate;
  #priority;
  #dateCreated;
  #tags;

  constructor(name, description = "", dueDate, priority, tags = [], checked = false) {
    this.#id = crypto.randomUUID();
    this.#name = name;
    this.#description = description;
    this.#checked = checked;
    this.#dueDate = dueDate;
    this.#priority = priority;
    this.#tags = tags;
    this.#dateCreated = new Date().getTime();
  }

  // Getter and setter methods
  get name() {
    return this.#name;
  }

  get id() {
    return this.#id;
  }

  get description() {
    return this.#description;
  }

  get checked() {
    return this.#checked;
  }

  get dueDate() {
    return this.#dueDate;
  }

  get priority() {
    return this.#priority;
  }

  get tags() {
    return this.#tags;
  }
}

class App {
  #projects = [];

  constructor() {
    this.createProject({ name: "inbox" });
    const inbox = this.#projects[0];
    inbox.createTask({
      name: "task 1",
      priority: "low",
    });
    inbox.createTask({
      name: "task 2",
      priority: "medium",
    });
    inbox.createTask({
      name: "task 3",
      priority: "low",
    });
    inbox.createTask({
      name: "task 4",
      priority: "high",
    });
  }

  createProject({ name, color }) {
    this.isProjectNameUnqiue(name) && this.#projects.push(new Project(name, color));
    return App;
  }

  isProjectNameUnqiue(name) {
    return !this.#projects.some(project => project.name === name);
  }

  updateProject(projectId, projectInfo) {}

  deleteProject(projectId) {}

  getProjectByName(name) {
    return this.#projects.filter(project => name === project.name)[0];
  }
}

export { App, Project, Task };
