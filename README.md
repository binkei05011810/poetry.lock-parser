# poetry.lock parser

Some Python projects use Poetry to manage dependencies. Poetry uses a file called poetry.lock to record which packages a project needs and which dependencies those packages have. [Here](https://github.com/python-poetry/poetry/blob/70e8e8ed1da8c15041c3054603088fce59e05829/poetry.lock) is an example of such a file.

This is a small application to parse your poetry.lock file and display a list of packages. You can click on each package to view detail information:

- Name
- Description
- The names of the required dependencies
- The names of the optional dependencies
- The names of the reverse dependencies (packages that depend on the current package)
  All the dependencies clickable if they are installed and the user can navigate the package structure by clicking from package to package

https://user-images.githubusercontent.com/59312728/169808408-c484e82d-89a6-4ab1-9dee-ab81a8034f68.mov

## This app use:

- React
- Redux Toolkit
- Material UI

# Setup the app on local machine

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

1. Clone this repository to your local machine

2. `npm install` to install all the necessary packages

3. `npm start` in the project directory to run the app in the development mode

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser


