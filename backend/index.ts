import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from "cors";
import cookieParser from "cookie-parser";
import publicRouter from './publicRoutes';
import privateRouter from './privateRoutes';

export const prisma = new PrismaClient();
export const app = express();

// Enable CORS for frontend origin
app.use(
  cors({
    origin: process.env.FRONT_END_URL || "http://localhost:3008",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use('/', publicRouter);
app.use('/user', privateRouter);

const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
