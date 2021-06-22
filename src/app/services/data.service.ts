import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

const PROJECT_KEY = 'categories';
const TASK_KEY = 'tasks';

export interface Project {
  name: string;
  color: string;
  tasks?: Task[];
  id?: number;
}

export interface Task {
  name: string;
  project?: number;
  priority?: number;
  due?: string;
  done?: boolean;
  id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  async addProject(proj: Project) {
    let projArray = await this.getProjectsAsArray(false);
    proj.id = Date.now();
    projArray.push(proj);
    return Storage.set({ key: PROJECT_KEY, value: JSON.stringify(projArray) });
  }
  async getProjects() {
    return this.getProjectsAsArray();
  }

  async getTaskOverview() {
    let tasksArray = await this.getTasksAsArray();
    let projArray = await this.getProjectsAsArray();

    const sorted = [];

    for (let p of projArray) {
      sorted.push({ ...p, tasks: tasksArray.filter(task => task.project == p.id && !task.done) })
    }
    return sorted;
  }

  async getProjectById(id) {
    let projArray = await this.getProjectsAsArray();
    let tasksArray = await this.getTasksAsArray();

    let item = null;
    projArray = projArray.filter(proj => proj.id == id);

    if (projArray.length > 0) {
      item = projArray[0];
      item.tasks = tasksArray.filter(task => task.project == id && !task.done);
    }

    return item;
  }
  private async getProjectsAsArray(addInbox = true) {
    const projects = await Storage.get({ key: PROJECT_KEY });
    console.log('projects: ', projects);
    let projArray = [];

    if (projects.value) {
      projArray = JSON.parse(projects.value);
    }

    if (addInbox) {
      projArray.push({
        name: 'Inbox',
        color: '#92949c',
        id: 0,
        tasks: []
      });
    }

    return projArray;
  }

  async addTask(task: Task) {
    let taskArray = await this.getTasksAsArray();
    task.id = Date.now();
    taskArray.push(task);
    return Storage.set({ key: TASK_KEY, value: JSON.stringify(taskArray) });
  }

  async getTasks() {
    return this.getTasksAsArray();
  }

  private async getTasksAsArray() {
    const tasks = await Storage.get({ key: TASK_KEY });
    let tasksArray = [];

    if (tasks.value) {
      tasksArray = JSON.parse(tasks.value);
    }
    return tasksArray;
  }

  getPriorities() {
    return [
      {
        value: 1,
        color: '#ff0000'
      },
      {
        value: 2,
        color: '#ff9d46'
      },
      {
        value: 3,
        color: '#0000ff'
      },
      {
        value: 4,
        color: '#737373'
      }
    ];
  }
  async updateTask(task: Task) {
    let tasksArray: Task[] = await this.getTasksAsArray();
    let result = [];

    for (let t of tasksArray) {
      if (t.id == task.id) {
        result.push(task);
      } else {
        result.push(t);
      }
    }

    return Storage.set({ key: TASK_KEY, value: JSON.stringify(result) });
  }

  async removeTask(id: number) {
    let tasksArray: Task[] = await this.getTasksAsArray();
    tasksArray = tasksArray.filter(t => t.id != id);
    return Storage.set({ key: TASK_KEY, value: JSON.stringify(tasksArray) });
  }
  async searchTask(name: string) {
    let tasksArray: Task[] = await this.getTasksAsArray();
    return tasksArray.filter(task => task.name.toLowerCase().indexOf(name) >= 0)
  }
}
