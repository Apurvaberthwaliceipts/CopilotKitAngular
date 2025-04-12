# Angular Chat App with Integrated Chat Component

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.16.

## Project Overview

This application demonstrates how to integrate a chat component from a Next.js application (example-todos-app) into an Angular 16 application using an iframe approach. The integration showcases how to embed external components or applications within an Angular framework.

## Setup Instructions

### Step 1: Run the example-todos-app (Chat Component)

Navigate to the example-todos-app directory and start the development server:

```bash
cd /path/to/example-todos-app
npm install
npm run dev
```

This will start the Next.js application with the chat component on http://localhost:3000.

### Step 2: Run the Angular Application

In a new terminal window, navigate to the angular-chat-app directory and start the Angular development server:

```bash
cd /path/to/angular-chat-app
npm install
ng serve
```

This will start the Angular application on http://localhost:4200.

## How It Works

The integration works as follows:

1. The Angular application includes a `ChatComponent` that embeds the example-todos-app in an iframe.
2. The iframe securely loads the external application using Angular's DomSanitizer.
3. Styling is applied to ensure a seamless user experience.

## Customization

To customize the integration:

1. Update the `chatAppUrl` in `src/app/chat/chat.component.ts` to point to your deployed chat application.
2. Modify the styling in `src/app/chat/chat.component.scss` to match your application's design.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
