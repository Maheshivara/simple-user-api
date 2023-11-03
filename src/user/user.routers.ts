import express from 'express';
import { body, validationResult } from 'express-validator';
import {
  login,
  createUser,
  updateUserInfo,
  updatePassword,
} from './user.services';

export const userRouters = express.Router();

// Login endpoint
// Body: email, password
userRouters.get(
  '/login',
  body('email').isEmail(),
  body('password').isString(),
  async (request, response) => {
    try {
      const result = validationResult(request);
      if (!result.isEmpty()) {
        return response.status(400).json({ errors: result.array() });
      }
      const loginData = {
        email: request.body.email,
        passwordHash: request.body.password,
      };
      const user = await login(loginData);
      if (!user) {
        response.set('WWW-Authenticate', 'Basic');
        return response
          .status(401)
          .json({ errors: 'Incorrect password or user not registered' });
      }
      return response.status(200).json({ user: user });
    } catch (error: any) {
      console.error(`User login error:\n${error.message}`);
      return response.status(500).json({ error: 'Internal API error' });
    }
  }
);

// Register user endpoint
// Body: email, password, name, userName, birthday, location, phoneNumber
userRouters.post(
  '/',
  body('email').isEmail(),
  body('password').isStrongPassword(),
  body('name').isString(),
  body('userName').isString(),
  body('birthday').isISO8601(),
  body('location').isString(),
  body('phoneNumber').isMobilePhone('any'),
  async (request, response) => {
    try {
      const result = validationResult(request);
      if (!result.isEmpty()) {
        return response.status(400).json({ errors: result.array() });
      }
      const userData = {
        email: request.body.email,
        passwordHash: request.body.password,
        name: request.body.name,
        userName: request.body.userName,
        birthday: new Date(request.body.birthday),
        location: request.body.location,
        phoneNumber: request.body.phoneNumber,
      };
      const user = await createUser(userData);
      if (!user) {
        return response.status(409).json({ error: 'User already exist' });
      }
      return response.status(201).json({ newUser: user });
    } catch (error: any) {
      console.error(`User create error:\n${error.message}`);
      return response.status(500).json({ error: 'Internal API error' });
    }
  }
);

// Update user endpoint
// Body: email, password, name, userName, birthday, location, phoneNumber
userRouters.put(
  '/',
  body('email').isEmail(),
  body('password').isString(),
  body('newName').optional().isString(),
  body('newUserName').optional().isString(),
  body('newBirthday').optional().isISO8601(),
  body('newLocation').optional().isString(),
  body('newPhoneNumber').optional().isMobilePhone('any'),
  async (request, response) => {
    try {
      const result = validationResult(request);
      if (!result.isEmpty()) {
        return response.status(400).json({ errors: result.array() });
      }
      const userLogin = {
        email: request.body.email,
        passwordHash: request.body.password,
      };
      const user = await login(userLogin);
      if (!user) {
        response.set('WWW-Authenticate', 'Basic');
        return response
          .status(401)
          .json({ errors: 'Incorrect password or user not registered' });
      }
      if (
        !request.body.newName &&
        !request.body.newUserName &&
        !request.body.newBirthday &&
        !request.body.newLocation &&
        !request.body.newPhoneNumber
      ) {
        return response.status(400).json({ errors: 'No fields to update' });
      }

      const userUpdatedData = {
        email: request.body.email,
        name: request.body.newName ?? user.name,
        userName: request.body.newUserName ?? user.userName,
        birthday:
          request.body.newBirthday === undefined
            ? user.birthday
            : new Date(request.body.newBirthday),
        location: request.body.newLocation ?? user.location,
        phoneNumber: request.body.newPhoneNumber ?? user.phoneNumber,
      };
      const updatedUser = await updateUserInfo(userUpdatedData);
      return response.status(200).json({ updatedUser: updatedUser });
    } catch (error: any) {
      console.error(`User update error:\n${error.message}`);
      return response.status(500).json({ error: 'Internal API error' });
    }
  }
);

userRouters.put(
  '/password',
  body('email').isEmail(),
  body('password').isString(),
  body('newPassword').isStrongPassword(),
  async (request, response) => {
    try {
      const result = validationResult(request);
      if (!result.isEmpty()) {
        return response.status(400).json({ errors: result.array() });
      }
      const userLogin = {
        email: request.body.email,
        passwordHash: request.body.password,
      };
      const user = await updatePassword(userLogin, request.body.newPassword);
      if (!user) {
        response.set('WWW-Authenticate', 'Basic');
        return response
          .status(401)
          .json({ errors: 'Incorrect password or user not registered' });
      }
      return response.status(200).json({ updatedUser: user });
    } catch (error: any) {
      console.error(`User password update error:\n${error.message}`);
      return response.status(500).json({ error: 'Internal API error' });
    }
  }
);
