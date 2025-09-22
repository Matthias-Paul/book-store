import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const getToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  return jwt.sign({ userId }, secret);
};

export default getToken;