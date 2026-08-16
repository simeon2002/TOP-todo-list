class Project {
  name;
  id;
  color;
  tasks = [];

  constructor(name, color = undefined) {
    this.id = crypto.randomUUID();
    this.name = name;
  }

  removeTask(taskId) {}

  updateTask(taskId, taskInfo) {}

  createTask(taskInfo) {}
}

class Task {
  id;
  name;
  description;
  dueDate;
  priority;
  dateCreated;
  tags = [];

  constructor(name, description = "", dueDate, priority, tags) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.tags = tags;
    this.dateCreated = new Date();
  }

  // Getter and setter methods
}

class App {
  projects = [];

  constructor() {
    this.createProject("inbox");
  }

  createProject(projectInfo) {
    this.projects.push(new Project(projectInfo.name, projectInfo?.color));
    return App;
  }

  updateProject(projectId, projectInfo) {}

  deleteProject(projectId) {}

  getProjects() {
    return projects;
  }
}

export { App, Project, Task };
