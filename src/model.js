class Project {
  #name;
  #id;
  #color;
  #tasks = [];

  constructor(name, color = "") {
    this.#id = crypto.randomUUID();
    this.#name = name;
  }

  removeTask(taskId) {}

  updateTask(taskId, taskInfo) {
    this.getTaskById(taskId).update(taskInfo);
    console.log(this.getTaskById(taskId));
  }

  createTask({ name, description = "", dueDate = "", priority, tags = [] }) {
    this.#tasks.push(new Task(name, description, dueDate, priority, tags));
  }

  getTaskById(taskId) {
    return this.#tasks.find(task => task.id === taskId);
  }

  get name() {
    return this.#name;
  }

  get tasks() {
    return this.#tasks;
  }

  get id() {
    return this.#id;
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

  set dueDate(date) {
    this.#dueDate = date;
  }

  get priority() {
    return this.#priority;
  }

  get tags() {
    return this.#tags;
  }

  update(taskInfo) {
    this.#name = taskInfo.name ?? this.#name;
    this.#description = taskInfo.description ?? this.#description;
    this.#dueDate = taskInfo.dueDate ?? this.#dueDate;
    this.#priority = taskInfo.priority ?? this.#priority;
    this.#tags = taskInfo.tags ?? this.#tags;
  }
}

class App {
  #projects = [];

  constructor() {
    this.createProject({ name: "inbox" });
    this.createProject({ name: "First project" });
    this.createProject({ name: "Second project" });
    this.createProject({ name: "Third Project project" });

    this.#projects.forEach(project => this.generateDummyData(project));
  }

  generateDummyData(project, taskCount = Math.floor(Math.random() * 5 + 1)) {
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

  getProjectById(id) {
    return this.#projects.find(project => project.id === id);
  }

  get projects() {
    return this.#projects;
  }

  getProjectNames() {
    return this.#projects.map(project => project.name);
  }
}

export { App, Project, Task };
