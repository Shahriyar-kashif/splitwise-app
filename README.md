# SplitWise App Project (MoneyMate)

## Introduction
This document is intended for developers and technical contributers who will work on or review this project. It provides detailed information about project's architecture, setup instructions, and development workflow.

## Project Overview
MoneyMate is a comprehensive expense management application designed to simplify the process of tracking, splitting, and settling expenses among groups of users. The app provides secure user authentication, allowing users to create accounts, log in, and access their personalized dashboard.
Users can then create and settle their expenses.

## Environmental Variables
The project uses environment variables for configuration. Copy the .env.sample file to .env and replace the placeholder values with actual credentials.

## Dependencies
The SplitWise App project depends on the following technologies and libraries:

- [React](https://reactjs.org/): JavaScript library for building user interfaces.
- [Vite](https://vitejs.dev/): Build tool that significantly improves development experience.
- [Material-UI](https://mui.com/): React components library for building beautiful UIs.
- [React Router](https://reactrouter.com/): Library for routing and navigation in React applications.
- [Redux Toolkit](https://redux-toolkit.js.org/): Redux library for efficient state management.
- [uuid](https://www.npmjs.com/package/uuid): Library for generating unique identifiers.
- [Firebase](https://firebase.google.com/): Backend services for authentication and database management.
- [react-toastify](https://www.npmjs.com/package/react-toastify): Library for displaying success and error notifications.

To install these dependencies, use the following command:

```bash
npm install
```

## Development Setup
Follow these steps to set up your development environment:
- Clone the repository:
    'git clone https://github.com/Shahriyar-kashif/splitwise-app.git'
- Navigate to the project directory:
    'cd splitwise-app'
- Install dependencies:
    'npm install'


## Running the App
To run the app locally, use the following command:
    'npm run dev'

## Creating a Build for Production
To create a build for the app production, use the following command:
    'npm run build'
