import { Component, OnInit, OnDestroy } from '@angular/core';

// Define the Todo item interface
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit, OnDestroy {
  todos: Todo[] = [];
  newTodoText: string = '';
  nextId: number = 1;
  private todosUpdatedListener: any;

  constructor() { }

  ngOnInit(): void {
    // Load todos from localStorage if available
    this.loadTodos();
    
    // Listen for todo updates from the chat component
    this.todosUpdatedListener = () => this.loadTodos();
    window.addEventListener('todos-updated', this.todosUpdatedListener);
  }
  
  ngOnDestroy(): void {
    // Remove event listener when component is destroyed
    window.removeEventListener('todos-updated', this.todosUpdatedListener);
  }

  loadTodos(): void {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      this.todos = JSON.parse(savedTodos);
      this.nextId = Math.max(...this.todos.map(todo => todo.id), 0) + 1;
    }
  }

  addTodo(): void {
    if (this.newTodoText.trim()) {
      const newTodo: Todo = {
        id: this.nextId++,
        text: this.newTodoText.trim(),
        completed: false
      };
      this.todos.push(newTodo);
      this.saveTodos();
      this.newTodoText = '';
      
      // Notify the chat component about the todo change
      this.notifyTodoChange();
    }
  }

  toggleComplete(todo: Todo): void {
    todo.completed = !todo.completed;
    this.saveTodos();
    
    // Notify the chat component about the todo change
    this.notifyTodoChange();
  }

  deleteTodo(id: number): void {
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.saveTodos();
    
    // Notify the chat component about the todo change
    this.notifyTodoChange();
  }

  private saveTodos(): void {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }
  
  private notifyTodoChange(): void {
    // Dispatch a custom event to notify about todo changes
    window.dispatchEvent(new CustomEvent('todos-changed', { 
      detail: { todos: this.todos }
    }));
  }
}
