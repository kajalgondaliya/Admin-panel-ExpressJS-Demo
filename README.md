# Express Admin Panel sample project

## Description
Simple admin panel with login and logout feature with dashboard using node,express,ejs,
ejs-express-layouts,sequelize-ORM,mysql

## Installation

```bash
$ npm install
$ npx sequelize-cli db:migrate //To migrate user table
$ npx sequelize-cli db:seed:all //To Seed admin details
```

# Sequlize-ORM
-First go to config folder and open config.json file.
-Add your database credentials in this code below:
"development": {
    "username": "root", //Your username
    "password": null, //Your Password if any
    "database": "admin_panel", //Your Database name
    "host": "127.0.0.1", //Your host name
    "dialect": "mysql", 
    "logging":false //Remove this option if you want to log queries running in background
  },

## Running the app

```bash
# Start the server
$ npm run dev

```
Project will start on port 4001 on localhost (http://localhost:4001).

## Test
No tests included this time. Just playing around with the framework.

## Functionality
The project contain for functionality as given below.

-Login for admin.
-Seeder used for admin credentials
-Show dashboard and logout.

## login
For login you need to pass email and password in body of API (http://localhost:4000/).