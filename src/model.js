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
  #inbox = new Project("inbox");

  constructor() {
    this.generateDummyData(this.#inbox);
    this.createProject({ name: "First project" });
    this.createProject({ name: "Second project" });
    this.createProject({ name: "Third Project project" });
    console.log(this.#projects);

    this.#projects.forEach(this.generateDummyData);
  }

  generateDummyData(project, taskCount = Math.floor(Math.random() * 5 + 1)) {
    console.log(taskCount);
    for (let i = 0; i < taskCount; i++) {
      project.createTask({
        name: `task ${Math.floor(Math.random() * 20 + 1)}`,
        priority: "low",
      });
    }
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

  get inbox() {
    return this.#inbox;
  }
}

export { App, Project, Task };
