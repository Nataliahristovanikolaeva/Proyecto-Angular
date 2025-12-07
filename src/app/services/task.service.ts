import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task, TaskStats } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [];
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private readonly STORAGE_KEY = 'taskmaster_tasks';

  constructor() {
    this.loadFromLocalStorage();
  }

  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  addTask(taskData: Omit<Task, 'id' | 'createdAt'>) {
    const newTask: Task = {
      ...taskData,
      id: this.generateId(),
      createdAt: new Date()
    };
    this.tasks.push(newTask);
    this.saveToLocalStorage();
    this.tasksSubject.next([...this.tasks]);
  }

  updateTask(id: string, updates: Partial<Task>) {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updates };
      this.saveToLocalStorage();
      this.tasksSubject.next([...this.tasks]);
    }
  }

  deleteTask(id: string) {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.saveToLocalStorage();
    this.tasksSubject.next([...this.tasks]);
  }

  toggleTaskCompletion(id: string) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveToLocalStorage();
      this.tasksSubject.next([...this.tasks]);
    }
  }

  getStats(): TaskStats {
    const now = new Date();
    return {
      total: this.tasks.length,
      completed: this.tasks.filter(t => t.completed).length,
      pending: this.tasks.filter(t => !t.completed).length,
      highPriority: this.tasks.filter(t => t.priority === 'high').length,
      overdue: this.tasks.filter(t => 
        !t.completed && t.dueDate && new Date(t.dueDate) < now
      ).length
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private saveToLocalStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks));
  }

  private loadFromLocalStorage() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.tasks = JSON.parse(stored);
      this.tasksSubject.next([...this.tasks]);
    }
  }
}