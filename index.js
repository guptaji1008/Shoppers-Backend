import path from 'path'
import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors'
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./db/conn.js";
import productRouter from "./routers/productRouter.js";
import userRouter from "./routers/userRouter.js";
import orderRouter from "./routers/orderRouter.js";
import { handleError, handleNotFound } from "./middleware/helperMessage.js";
const port = process.env.PORT || 8000;
connectDb(); // connection to database

const app = express();
app.use(cors())

// body parser middleware
app.use(express.json());

// cookie parser middleware
app.use(cookieParser());

app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.get("/api/config/paypal", (req, res) =>
  res.json({ clientId: process.env.PAYPAL_CLIENT_ID })
);

app.use("/*", handleNotFound);

app.use(handleError);

app.listen(port, () => console.log(`Listening to port no. ${port}`));
