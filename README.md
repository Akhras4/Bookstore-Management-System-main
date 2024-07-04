# Bookstore Management System

This repository contains code for a bookstore management system. The system provides

<p dir=auto>
<a href=""><img alt="NPM Version" src="https://img.shields.io/npm/v/registration-system"></a>
<a href=""><img alt="NPM License" src="https://img.shields.io/badge/license-MIT-blue"></a>
<a href="https://www.npmjs.com/package/registration-system?activeTab=readme"><img alt="NPM Collaborators" src="https://img.shields.io/npm/collaborators/registration-system"></a>

</p>


### Technologies Used

- Node.js
- Express.js
- MongoDB
- JSON Web Tokens (JWT)
- Multer (for file uploads)
- EJS (for rendering views)
- Nodemailer (for sending transactional emails)

## Functionality Overview
### functions object
- **User Signup:** Allows users to register by providing their email address and choosing a username.
- **Email Verification:** Sends a verification email containing a unique token to the user's email address for validation.
- **Login:** Allows registered users to log in using their email address and password.
- **JWT Authentication:** Generates JSON Web Tokens (JWT) upon successful login for secure authentication of subsequent requests.
- **Logout:** Logs the user out of the system, invalidating their current session.
- **User Profile Rendering:** Displays user-specific information such as username and profile details.
- **The** function `account` retrieves user account information and renders it on a webpage, including
- **user** details, user info, and associated books.
### Account Object
-* **@param {Object}** req - The request object representing the HTTP request made by the client.
-* **@param {Object}** res - The response object used to send a response back to the client.

-* **The `req`** parameter contains information such as the request method (`req.method`), request parameters (`req.params`),
and other details about the request.
 
-* **The `res`** parameter is used to send data, status codes, and render views in response to client requests.

-* In this code snippet, the function checks if the request method is a GET and proceeds to retrieve
user account information and render it on a webpage.
-*
### HomeController Object

This code snippet defines a JavaScript object named `HomeController`, which contains several methods for handling different routes and actions in a web application.



-* This code snippet defines a JavaScript object named `HomeController` which contains several methods
-* for handling different routes and actions in a web application. Here is a breakdown of what each
-* method does:


## Parameters Explanation

- **email:** Stores the email address of the user. Used for signup, login, verification, and identification in the database.
- **UserName:** Stores the username of the user. Used for signup, login, and displaying user-specific information.
- **emailtoken:** A unique token generated for each user during signup. Used for email verification and validation.

## Email Verification Process

1. During signup, a random emailtoken is generated for each user.
2. This token is sent to the user's email address for verification.
3. Once the user clicks on the verification link containing the token, their email is verified.

## Installation and Usage

To use this system, follow these steps:

1. Clone the repository to your local machine.
2. Install any required dependencies.
3. Configure the database connection settings.
4. AppEmail: Application email address for sending emails.
5. AppPassword: Application-specific password for email authentication.
6. MY_SECRET: Secret key for encryption and decryption.
7. Run the application.

## Contributing

Contributions are welcome! If you find any bugs or want to suggest improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
