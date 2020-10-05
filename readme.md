# Task manager

## Description
A simple task manager built as the third project during the Udemy class [The Complete Node.js Developer Course (3rd Edition)](https://www.udemy.com/course/the-complete-nodejs-developer-course-2/) by Andrew Mead.
This application doesn't include a UI, and serves as a bridge between URL calls and a mongodb database.

## Requirements
- Access to a MongoDB database
- A config/dev.env file, containing the following variables:
  - DATABASE_URL (ex: mongodb://localhost:27017)
  - PORT
  - JWT_SALT (For webtokens)
  - SENDGRID_API_KEY (To use email features)
- A config/test.env file for testing containing the same variables (except for SENDGRID_API_KEY)