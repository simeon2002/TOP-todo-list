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
}

class Task {
  #id;
  #name;
  #description;
  #dueDate;
  #priority;
  #dateCreated;
  #tags = [];

  constructor(name, description = "", dueDate, priority, tags) {
    this.#id = crypto.randomUUID();
    this.#name = name;
    this.#description = description;
    this.#dueDate = dueDate;
    this.#priority = priority;
    this.#tags = tags;
    this.#dateCreated = new Date().getTime();
  }

  // Getter and setter methods
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
    this.#projects.push(new Project(name, color));
    return App;
  }

  updateProject(projectId, projectInfo) {}

  deleteProject(projectId) {}

  getProjects() {
    return projects;
  }
}

export { App, Project, Task };
