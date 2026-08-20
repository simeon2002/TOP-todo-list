import { format } from "date-fns";

class Project {
  #id;
  #name;
  #description;
  #color;
  #tasks = [];

  constructor(name, color = "inherit", description = "", id) {
    this.#id = id ?? crypto.randomUUID();
    this.#name = name;
    this.#description = description;
    this.#color = color;
  }

  static createExistingProject({ id, name, color, description, tasks }) {
    const project = new Project(name, color, description, id);

    tasks.forEach(task => {
      const taskObj = Task.createExistingTask(task);
      console.log(taskObj);

      project.addTask(taskObj);
    });

    return project;
  }

  removeTask(taskId) {
    const taskIndex = this.getTaskIndex(taskId);
    this.#tasks.splice(taskIndex, 1);
  }

  getTaskIndex(taskId) {
    return this.#tasks.findIndex(task => task.id === taskId);
  }

  updateTask(taskId, taskInfo) {
    this.getTaskById(taskId).update(taskInfo);
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

    // add task to other project
    console.log("adding task...");

    toProject.addTask(this.#tasks[taskIdx]);

    console.log("Removing task from old project....");

    // project from this project
    this.removeTask(taskId);
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

  toJSON() {
    return {
      id: this.#id,
      name: this.#name,
      description: this.#description,
      color: this.#color,
      tasks: this.#tasks,
    };
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

  constructor(projectId, name, description = "", dueDate = "", priority, tags = [], checked = false, id) {
    this.#id = id ?? crypto.randomUUID();
    this.#projectId = projectId;
    this.#name = name;
    this.#description = description;
    this.#checked = checked;

    this.#dueDate = dueDate !== "" ? new Date(dueDate) : "";
    this.#priority = priority;
    this.#tags = tags.length !== 0 ? tags : [];
    this.#dateCreated = new Date().getTime();
    console.log(this.#tags);
  }

  static createExistingTask({ id, projectId, name, description, dueDate, priority, tags, checked }) {
    console.log(dueDate);
    const task = new Task(projectId, name, description, dueDate, priority, tags, checked, id);
    return task;
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

  // set checked(value) {
  //   this.#checked = value;
  // }

  get dueDate() {
    return this.#dueDate ? format(this.#dueDate, "MMM dd, yyyy") : "";
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
    console.log(this);

    this.#name = taskInfo?.name ?? this.#name;
    this.#projectId = taskInfo?.projectId ?? this.#projectId;
    this.#description = taskInfo?.description ?? this.#description;
    this.#dueDate = taskInfo?.dueDate ? new Date(taskInfo.dueDate) : this.#dueDate;
    this.#priority = taskInfo?.priority ?? this.#priority;
    this.#tags = taskInfo?.tags ?? this.#tags;
    this.#checked = taskInfo?.checked ?? this.#checked;
  }

  toJSON() {
    console.log(this.#dueDate);

    return {
      id: this.#id,
      name: this.#name,
      projectId: this.#projectId,
      description: this.#description,
      dueDate: this.#dueDate,
      priority: this.#priority,
      tags: this.#tags,
      checked: this.#checked,
    };
  }
}

class App {
  #projects = [];

  constructor() {
    // this.createProject({ name: "inbox" });
    // this.createProject({ name: "First project", color: "blue", description: "testing" });
    // this.createProject({ name: "Second project" });
    // this.createProject({ name: "Third Project" });
    // this.#projects.forEach(project => this.generateDummyData(project));
    // console.log(this.#projects);
  }

  generateDummyData(project, taskCount = Math.floor(Math.random() * 5 + 1)) {
    for (let i = 0; i < taskCount; i++) {
      project.createTask({
        name: `task ${Math.floor(Math.random() * 20 + 1)}`,
        priority: "low",
      });
    }
  }
  createInbox() {
    this.createProject({ name: "inbox" });
  }

  createProject({ name, color, description }) {
    const project = new Project(name, color, description);
    this.isProjectNameUnqiue(name) && this.#projects.push(project);
  }

  isProjectNameUnqiue(name) {
    return !this.#projects.some(project => project.name === name);
  }

  updateProject(projectInfo) {
    const project = this.getProjectById(projectInfo.id);

    project.update(projectInfo);
  }

  deleteProject(projectId) {
    const idx = this.#projects.findIndex(project => project.id === projectId);
    this.#projects.splice(idx, 1);
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

  getAllTasksNotDone() {
    return this.#projects.flatMap(project => project.tasks.filter(task => !task.checked));
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

  addProject(project) {
    this.#projects.push(project);
  }

  saveToStorage() {
    console.log(JSON.stringify(this.#projects));

    localStorage.setItem("projects", JSON.stringify(this.#projects));
  }

  fetchFromStorage() {
    const projects = JSON.parse(localStorage.getItem("projects"));
    if (!projects) return;

    projects.forEach(project => {
      const projectObj = Project.createExistingProject.bind(this)(project);
      console.log("normal", project);
      console.log("Project", projectObj);
      this.addProject(projectObj);
    });
  }
}

export { App, Project, Task };
