import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { userRouters } from './user/user.routers';

dotenv.config();
if (!process.env.PORT) {
  console.error('PORT not found in the .env file');
  process.exit(1);
}
let PORT: number;
try {
  PORT = parseInt(process.env.PORT as string, 10);
} catch {
  console.error('Invalid PORT in the .env file');
  process.exit(1);
}

const api = express();
api.use(cors());
api.use(express.json());
api.use('/user', userRouters);
api.listen(PORT, () => console.log(`Listening on port ${PORT}`));
