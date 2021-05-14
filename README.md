# Ecommerce Website

# About

This Project is an Application Programming Interface for an E-commerce Website. This include routes for User, Product and Order/Payment which information are stored in their database respectively. The Purpose of this Project is to aid users functionality to purchase products from the website for full satisfaction. Also, to achieve its aim in providing services.

# Content

- Installation
- Documentation
- Deployment
- Built-With
- Acknowledgement

# Installation

- Clone the Api to your Desktop
- Run 'npm install' to run all dependecies

# Documentation

The Project is well documented on Postman. The Publication link is "https://documenter.getpostman.com/view/15034996/TzRNDUgc"

# Deployment

The Project live deployment is "https://fc-ecommerce-test.herokuapp.com"
The Project is deployed using heroku and the Url is "https://eecommercee.herokuapp.com". Use the documentation to know the routes for easy navigation.

# Built-With

The Api is built with Node.js and MongoDb database to store information into the database. In addition, Payment Intergration made through Flutterwave. The Application Environment Variable to implement funtionality while building the project are:

- Environment Variable Names
  - MONGODBURI : to connect to Mongodb Atlas to store data
  - JWT_KEY : to authenticate users
  - SEND_EMAIL : to send email to users
  - debug : to asychronously log statement
  - FORGOT_PASSWORD : to send email for password reset token
  - CLOUDINARY_CLOUD_NAME : to set to store images on cloudinary
  - CLOUDINARY_API_KEY : api key to store images on cloudinary
  - CLOUDINARY_API_SECRET : secret key to store images on cloudinary
  - SECRET_KEY : to enable flutterwave connection
  - PUBLIC_KEY : flutterwave public key on account dashboard
  - MY_HASH : to set Webhook for flutterwave to send data
  - ACCTIVATION_KEY : to send activation email to users

# Acknowledgement

Hats off to:

- Prince Arthur
- Mosh Hamadani
- Awais Mirza
- CODERS NEVER QUIT
