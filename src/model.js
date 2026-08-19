class Project {
  #id;
  #name;
  #description;
  #color;
  #tasks = [];

  constructor(name, color = "inherit", description = "") {
    this.#id = crypto.randomUUID();
    this.#name = name;
    this.#description = description;
    this.#color = color;
  }

  removeTask(taskId) {
    const taskIndex = this.getTaskIndex(taskId);
    console.log(this.#tasks.splice(taskIndex, 1));
  }

  getTaskIndex(taskId) {
    return this.#tasks.findIndex(task => task.id === taskId);
  }

  updateTask(taskId, taskInfo) {
    this.getTaskById(taskId).update(taskInfo);
    console.log(this.getTaskById(taskId));
  }

  createTask({ name, description = "", dueDate = "", priority, tags = [] }) {
    this.#tasks.push(new Task(this.#id, name, description, dueDate, priority, tags));
  }

  addTask(task) {
    task.projectId = this.#id;
    this.#tasks.push(task);
  }

  moveTask(taskId, toProject) {
    // get index
    const taskIdx = this.getTaskIndex(taskId);
    console.log(taskIdx);

    // add task to other project
    console.log("adding task...");

    toProject.addTask(this.#tasks[taskIdx]);

    console.log("Removing task from old project....");

    // project from this project
    this.removeTask(taskId);
    console.log(this);
    console.log(toProject);
  }

  getTaskById(taskId) {
    return this.#tasks.find(task => {
      return task.id === taskId;
    });
  }

  update(projectInfo) {
    this.#name = projectInfo.name;
    this.#description = projectInfo.description;
    this.#color = projectInfo.color;
  }

  get name() {
    return this.#name;
  }

  get tasks() {
    return this.#tasks;
  }

  get color() {
    return this.#color;
  }

  get id() {
    return this.#id;
  }

  get description() {
    return this.#description;
  }
}

class Task {
  #id;
  #projectId;
  #name;
  #description;
  #checked;
  #dueDate;
  #priority;
  #dateCreated;
  #tags;

  constructor(projectId, name, description = "", dueDate, priority, tags = [], checked = false) {
    this.#id = crypto.randomUUID();
    this.#projectId = projectId;
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

  get projectId() {
    return this.#projectId;
  }

  set projectId(id) {
    this.#projectId = id;
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
    this.#projectId = taskInfo.projectId;
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
    this.createProject({ name: "First project", color: "blue", description: "testing" });
    this.createProject({ name: "Second project" });
    this.createProject({ name: "Third Project" });

    this.#projects.forEach(project => this.generateDummyData(project));
    console.log(this.#projects);
  }

  generateDummyData(project, taskCount = Math.floor(Math.random() * 5 + 1)) {
    for (let i = 0; i < taskCount; i++) {
      project.createTask({
        name: `task ${Math.floor(Math.random() * 20 + 1)}`,
        priority: "low",
      });
    }
  }

  createProject({ name, color, description }) {
    console.log(description);

    const project = new Project(name, color, description);
    this.isProjectNameUnqiue(name) && this.#projects.push(project);
  }

  isProjectNameUnqiue(name) {
    return !this.#projects.some(project => project.name === name);
  }

  updateProject(projectInfo) {
    const project = this.getProjectById(projectInfo.id);

    console.log("before", project);
    project.update(projectInfo);
    console.log("after", project);
  }

  deleteProject(projectId) {
    const idx = this.#projects.findIndex(project => project.id === projectId);
    console.log(this.#projects);
    this.#projects.splice(idx, 1);
    console.log(this.#projects);
  }

  getProjectByName(name) {
    return this.#projects.filter(project => name === project.name)[0];
  }

  getProjectById(id) {
    return this.#projects.find(project => project.id === id);
  }

  getProjectByTaskId(taskId) {
    return this.#projects.find(project => project.tasks.some(task => task.id === taskId));
  }

  getAllTasks() {
    return this.#projects.flatMap(project => project.tasks);
  }

  get projects() {
    return this.#projects.filter(project => project.name !== "inbox");
  }

  getInbox() {
    return this.#projects.find(project => project.name === "inbox");
  }

  getProjectNames() {
    return this.#projects.map(project => project.name);
  }
}

export { App, Project, Task };
