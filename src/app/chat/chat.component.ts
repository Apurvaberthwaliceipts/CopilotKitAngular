import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit, OnDestroy {
  chatUrl: SafeResourceUrl;
  @ViewChild('chatFrame') chatFrame!: ElementRef;
  private todosChangedListener: any;

  constructor(private sanitizer: DomSanitizer) {
    this.chatUrl = this.sanitizer.bypassSecurityTrustResourceUrl('http://localhost:3000');
  }

  ngOnInit(): void {
    // Listen for messages from the iframe
    window.addEventListener('message', this.receiveMessage.bind(this), false);
    
    // Listen for todo changes from the todo component
    this.todosChangedListener = this.handleTodosChanged.bind(this);
    window.addEventListener('todos-changed', this.todosChangedListener);
  }
  
  ngOnDestroy(): void {
    // Clean up event listeners
    window.removeEventListener('message', this.receiveMessage.bind(this));
    window.removeEventListener('todos-changed', this.todosChangedListener);
  }

  ngAfterViewInit(): void {
    // Set up a timer to check when the iframe is loaded
    const checkIframeLoaded = setInterval(() => {
      const iframe = this.chatFrame?.nativeElement;
      if (iframe && iframe.contentWindow) {
        // Send initial todo data to the iframe
        this.sendTodosToChat();
        clearInterval(checkIframeLoaded);
      }
    }, 1000);
  }

  // Handle todos-changed event from todo component
  handleTodosChanged(event: CustomEvent): void {
    if (event.detail && event.detail.todos) {
      console.log('Todos changed, sending to chat:', event.detail.todos);
      this.sendTodosToChat();
    }
  }

  // Send todos to the chat iframe
  sendTodosToChat(): void {
    const todos = localStorage.getItem('todos') || '[]';
    const iframe = this.chatFrame?.nativeElement;
    if (iframe && iframe.contentWindow) {
      console.log('Sending todos to chat iframe:', JSON.parse(todos));
      iframe.contentWindow.postMessage({
        type: 'TODOS_UPDATE',
        todos: JSON.parse(todos)
      }, 'http://localhost:3000');
    }
  }

  // Receive messages from the iframe
  receiveMessage(event: MessageEvent): void {
    // Only accept messages from the chat iframe
    if (event.origin !== 'http://localhost:3000') return;

    console.log('Received message from chat iframe:', event.data);

    // Handle different message types
    if (event.data && event.data.type) {
      switch (event.data.type) {
        case 'CHAT_READY':
          console.log('Chat iframe is ready, sending todos');
          this.sendTodosToChat();
          break;
        case 'ADD_TODO':
          console.log('Adding todo from chat:', event.data.todo);
          this.addTodoFromChat(event.data.todo);
          break;
        case 'TOGGLE_TODO':
          console.log('Toggling todo from chat:', event.data.todoId);
          this.toggleTodoFromChat(event.data.todoId);
          break;
        case 'DELETE_TODO':
          console.log('Deleting todo from chat:', event.data.todoId);
          this.deleteTodoFromChat(event.data.todoId);
          break;
      }
    }
  }

  // Add a todo from the chat
  addTodoFromChat(todoText: string): void {
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');
    const newId = todos.length > 0 ? Math.max(...todos.map((t: {id: number}) => t.id)) + 1 : 1;
    
    todos.push({
      id: newId,
      text: todoText,
      completed: false
    });
    
    localStorage.setItem('todos', JSON.stringify(todos));
    
    // Broadcast event for todo component to update
    window.dispatchEvent(new CustomEvent('todos-updated'));
    
    // Send updated todos back to the chat
    this.sendTodosToChat();
  }
  
  // Toggle a todo's completion status
  toggleTodoFromChat(todoId: number): void {
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');
    
    const todoIndex = todos.findIndex((t: {id: number}) => t.id === todoId);
    if (todoIndex !== -1) {
      todos[todoIndex].completed = !todos[todoIndex].completed;
      
      localStorage.setItem('todos', JSON.stringify(todos));
      
      // Broadcast event for todo component to update
      window.dispatchEvent(new CustomEvent('todos-updated'));
      
      // Send updated todos back to the chat
      this.sendTodosToChat();
    }
  }
  
  // Delete a todo
  deleteTodoFromChat(todoId: number): void {
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');
    
    const filteredTodos = todos.filter((t: {id: number}) => t.id !== todoId);
    
    localStorage.setItem('todos', JSON.stringify(filteredTodos));
    
    // Broadcast event for todo component to update
    window.dispatchEvent(new CustomEvent('todos-updated'));
    
    // Send updated todos back to the chat
    this.sendTodosToChat();
  }
}
