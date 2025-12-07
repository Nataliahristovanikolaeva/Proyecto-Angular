import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <header class="header">
        <h1>📋 TaskMaster</h1>
        <p>Gestiona tus tareas fácilmente</p>
      </header>

      <main>
        <!-- Formulario -->
        <div class="form-container">
          <h3>➕ Nueva Tarea</h3>
          <form (ngSubmit)="addTask()" #taskForm="ngForm">
            <input 
              type="text" 
              [(ngModel)]="newTask.title" 
              name="title" 
              placeholder="Título"
              required
              class="form-input"
            >
            
            <select [(ngModel)]="newTask.priority" name="priority" class="form-select">
              <option value="low">🟢 Baja</option>
              <option value="medium">🟡 Media</option>
              <option value="high">🔴 Alta</option>
            </select>
            
            <button type="submit" class="submit-btn">
              Agregar Tarea
            </button>
          </form>
        </div>

        <!-- Estadísticas -->
        <div class="stats">
          <div class="stat-item">
            <span class="stat-number">{{ tasks.length }}</span>
            <span class="stat-label">Total</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ completedTasks }}</span>
            <span class="stat-label">Completadas</span>
          </div>
        </div>

        <!-- Lista de tareas -->
        <div class="tasks-container">
          <div *ngIf="tasks.length === 0" class="empty-state">
            <p>🎉 ¡No hay tareas! Agrega tu primera tarea.</p>
          </div>

          <div *ngFor="let task of tasks" class="task-item">
            <input 
              type="checkbox" 
              [checked]="task.completed"
              (change)="toggleTask(task.id)"
              class="task-checkbox"
            >
            <span [class.completed]="task.completed">{{ task.title }}</span>
            <span class="priority" [class]="task.priority">
              {{ task.priority === 'high' ? '🔥' : task.priority === 'medium' ? '⚠️' : '✅' }}
            </span>
            <button (click)="deleteTask(task.id)" class="delete-btn">X</button>
          </div>
        </div>
      </main>

      <footer class="footer">
        <p>© 2024 TaskMaster</p>
      </footer>
    </div>
  `,
  styles: [`
    .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial; }
    .header { text-align: center; background: #4a6fa5; color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
    .header h1 { margin: 0; }
    .form-container { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px; }
    .form-input, .form-select { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px; }
    .submit-btn { background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; width: 100%; }
    .stats { display: flex; justify-content: space-around; margin: 20px 0; }
    .stat-item { text-align: center; }
    .stat-number { font-size: 24px; font-weight: bold; color: #4a6fa5; }
    .stat-label { color: #666; }
    .tasks-container { background: #f9f9f9; padding: 20px; border-radius: 10px; }
    .empty-state { text-align: center; color: #666; padding: 40px; }
    .task-item { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; display: flex; align-items: center; gap: 10px; }
    .task-checkbox { width: 20px; height: 20px; }
    .completed { text-decoration: line-through; color: #999; }
    .priority { padding: 5px 10px; border-radius: 5px; font-size: 12px; }
    .high { background: #ffebee; color: #c62828; }
    .medium { background: #fff3e0; color: #ef6c00; }
    .low { background: #e8f5e9; color: #2e7d32; }
    .delete-btn { background: #ff5252; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; margin-left: auto; }
    .footer { text-align: center; margin-top: 40px; color: #666; }
  `]
})
export class App implements OnInit {
  tasks: any[] = [];
  newTask = { title: '', priority: 'medium' as 'low' | 'medium' | 'high' };
  
  ngOnInit() {
    // Cargar tareas guardadas
    const saved = localStorage.getItem('tasks');
    if (saved) this.tasks = JSON.parse(saved);
  }
  
  get completedTasks() {
    return this.tasks.filter(t => t.completed).length;
  }
  
  addTask() {
    if (this.newTask.title.trim()) {
      const task = {
        id: Date.now().toString(),
        title: this.newTask.title,
        priority: this.newTask.priority,
        completed: false,
        createdAt: new Date()
      };
      this.tasks.push(task);
      this.saveTasks();
      this.newTask.title = '';
    }
  }
  
  toggleTask(id: string) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
    }
  }
  
  deleteTask(id: string) {
    if (confirm('¿Eliminar esta tarea?')) {
      this.tasks = this.tasks.filter(t => t.id !== id);
      this.saveTasks();
    }
  }
  
  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }
}