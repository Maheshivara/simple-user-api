import { prisma } from "../util/client";
import bcrypt from "bcrypt";
import { User } from "./type";

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
  user: Omit<User, "createdAt" | "updatedAt">
): Promise<Omit<User, "passwordHash"> | null> => {
  const check = await checkByEmail(user.email);
  if (check) {
    return null;
  }
  user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
  const newUserData = await prisma.user.create({ data: user });
  const { passwordHash, ...newUser } = newUserData;
  return newUser;
};

//Getting user info in database, if exist
export const login = async (
  user: Pick<User, "email" | "passwordHash">
): Promise<Omit<User, "passwordHash"> | false | null> => {
  const userData = await getByEmail(user.email);
  if (userData === null) {
    return null;
  }
  const check = await bcrypt.compare(user.passwordHash, userData.passwordHash);
  if (!check) {
    return false;
  }
  const { passwordHash, ...userInfo } = userData;
  return userInfo;
};
