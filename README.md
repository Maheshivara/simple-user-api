# **_Simple User API_**

A user info API builded to understand the concept of a API and learn to use **[Prisma ORM](https://www.prisma.io)** and **[ExpressJS](https://expressjs.com)** in TS projects, the password is secured by hash using **[bcrypt](https://github.com/kelektiv/node.bcrypt.js#readme)**

## **How To Use**

1. Configure a dotenv file (.env) with the variable **PORT** with the port number for the API and the location of the db file, Ex:
   ```sh
   PORT="8000"
   DATABASE_URL="file:./dev.db"
   ```
2. Install the dependencies with:
   ```console
   npm install
   ```
3. Run in the terminal the following command to create a db for the first time:
   ```console
   npm run create-database
   ```
4. To compile and start the API use the command:
   ```console
   npm run start-api
   ```

- If you already have compiled you can run the API with:
  ```console
  npm run api
  ```
- To rebuild the database you can use the command:
  ```console
  npm run rebuild-database
  ```

## **End Points:**

### **GET**

- #### {apiUrl}**_/user/login_**
  - **GET the user info as a login**
  - Query Params:
    - email (user email)(required)
    - password (user password)(required)
    - Example: http://localhost:8000/user/login?email=example@mail.com&password=aRandomPassword
  - Response Body:
    A JSON with the data of the user (if pass the authentication), Ex:
    ```javascript
    {
        "id": 1,
        "email": "example@mail.com",
        "name": "example-name",
        "username": "example-username",
        "birthday": "2023-09-20T19:29:14.765Z",
        "location": "Arapiraca/AL, Brasil",
        "phoneNumber": "082000000000", // DDD+ Number
        "createdAt": "2023-09-20T19:29:14.765Z",
        "updatedAt": "2023-09-20T19:29:14.765Z",
    }
    ```

### **POST**

- #### {apiUrl}**_/user_**
  - **Create a new user**
  - Request Body:
    ```javascript
    {
        "email": "new-user@mail.com", // is unique
        "password": "new-user-password",
        "name": "new-name",
        "username": "new-username",
        "birthday": "2000-04-20T19:29:14.765Z",
        "location": "Arapiraca/AL, Brasil",
        "phoneNumber": "082000000000", // DDD+ Number
    }
    ```
    - The email, password, birthday and phoneNumber fields are validated by express-validator as email, strongPassword, ISO8601 and phoneNumber respectively
  - Response Body:
    A JSON with the data of the user (if successfully created), Ex:
    ```javascript
    {
        "id": 1,
        "email":"new-user@mail.com",
        "name": "new-name",
        "username": "new-username",
        "birthday": "2023-09-20T19:29:14.765Z",
        "location": "Arapiraca/AL, Brasil",
        "phoneNumber": "082000000000", // DDD+ Number
        "createdAt": "2023-09-20T19:29:14.765Z",
        "updatedAt": "2023-09-20T19:29:14.765Z",
    }
    ```

### **PUT**

- #### {apiUrl}**_/user_**
  - **Change user info**
  - Request Body:
    ```javascript
    {
        "email":"user@mail.com", // unchangeable, required
        "password": "user-password", // required
        "newName": "new-name", // optional
        "newUsername": "new-username", // optional
        "newLocation": "Arapiraca/AL, Brasil", // optional
        "newPhoneNumber": "082000000000", // optional
    }
    ```
    - The request body **MUST** contain at least one of the optional keys, returning a 400(bad request) error otherwise
    - The newBirthday and newPhoneNumber fields are validated by express-validator as ISO8601 and phoneNumber respectively
  - Response Body:
    A JSON with the updated data of the user (if successfully updated), Ex:
    ```javascript
    {
        "id": 1,
        "email":"user@mail.com",
        "name": "new-name",
        "username": "new-username",
        "birthday": "2023-09-20T19:29:14.765Z",
        "location": "Arapiraca/AL, Brasil",
        "phoneNumber": "082000000000", // DDD+ Number
        "createdAt": "2023-09-20T19:29:14.765Z",
        "updatedAt": "2023-09-20T19:29:14.765Z",
    }
    ```
- #### {apiUrl}**_/user/password_**
  - **Change user password**
  - Request Body:
    ```javascript
    {
        "email":"user@mail.com", // required
        "password": "user-password", // required
        "newPassword":"anotherPassword" // required
    }
    ```
    - The newPassword field is validated by express-validator as strongPassword
  - Response Body:
    A JSON with the updated data of the user (if successfully updated), Ex:
    ```javascript
    {
        "id": 1,
        "email":"user@mail.com",
        "name": "name",
        "username": "username",
        "birthday": "2023-09-20T19:29:14.765Z",
        "location": "Arapiraca/AL, Brasil",
        "phoneNumber": "082000000000", // DDD+ Number
        "createdAt": "2023-09-20T19:29:14.765Z",
        "updatedAt": "2023-09-20T19:29:14.765Z",
    }
    ```
