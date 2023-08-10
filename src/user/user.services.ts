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
