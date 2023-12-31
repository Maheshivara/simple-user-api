import { prisma } from '../util/client';
import bcrypt from 'bcrypt';
import { User } from './type';

//Get user info by email
const getByEmail = async (email: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({ where: { email } });
  return user;
};

//Check if user exist
const checkByEmail = async (email: string): Promise<Boolean> => {
  const user = await getByEmail(email);
  const check = user === null ? true : false;
  return check;
};

//Create new user in database
export const createUser = async (
  user: Omit<User, 'createdAt' | 'updatedAt' | 'id'>
): Promise<Omit<User, 'passwordHash'> | null> => {
  const check = await checkByEmail(user.email);
  if (!check) {
    return null;
  }
  user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
  const newUserData = await prisma.user.create({ data: user });
  const { passwordHash, ...newUser } = newUserData;
  return newUser;
};

//Getting user info in database, if exist
export const login = async (
  user: Pick<User, 'email' | 'passwordHash'>
): Promise<Omit<User, 'passwordHash'> | false | null> => {
  const userData = await getByEmail(user.email);
  if (!userData) {
    return null;
  }
  const check = await bcrypt.compare(user.passwordHash, userData.passwordHash);
  if (!check) {
    return false;
  }
  const { passwordHash, ...userInfo } = userData;
  return userInfo;
};

//Change user password
export const updatePassword = async (
  user: Pick<User, 'email' | 'passwordHash'>,
  newPassword: string
): Promise<Omit<User, 'passwordHash'> | false | null> => {
  const userData = await login({
    email: user.email,
    passwordHash: user.passwordHash,
  });
  if (!userData) {
    return userData;
  }
  newPassword = await bcrypt.hash(newPassword, 10);
  const updatedUser = await prisma.user.update({
    where: { email: user.email },
    data: { passwordHash: newPassword },
  });
  const { passwordHash, ...updatedInfo } = updatedUser;
  return updatedInfo;
};

//Change user info
export const updateUserInfo = async (
  updatedUserInfo: Omit<User, 'passwordHash' | 'id' | 'createdAt' | 'updatedAt'>
): Promise<Omit<User, 'passwordHash'>> => {
  const updatedUser = await prisma.user.update({
    where: { email: updatedUserInfo.email },
    data: updatedUserInfo,
  });
  const { passwordHash, ...updatedInfo } = updatedUser;
  return updatedInfo;
};
