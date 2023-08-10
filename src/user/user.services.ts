import { prisma } from "../util/client";
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
const createUser = async (
  user: Omit<User, "createdAt" | "updatedAt">
): Promise<Omit<User, "passwordHash"> | null> => {
  const check = await checkByEmail(user.email);
  if (check) {
    return null;
  }
  const newUserData = await prisma.user.create({ data: user });
  const { passwordHash, ...newUser } = newUserData;
  return newUser;
};
