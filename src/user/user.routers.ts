import express from 'express';
import { body, validationResult } from 'express-validator';
import { login, createUser } from './user.services';

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
      if (user === false || user === null) {
        response.set('WWW-Authenticate', 'Basic');
        return response
          .status(401)
          .json({ errors: 'Incorrect password or user not registered' });
      }
      return response.status(200).json({ user: user });
    } catch (error: any) {
      return response.status(500).json(error.message);
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
      if (user === null) {
        return response.status(409).json({ error: 'User already exist' });
      }
      return response.status(201).json({ newUser: user });
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
);
