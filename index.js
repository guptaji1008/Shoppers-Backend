import path from 'path'
import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./db/conn.js";
import productRouter from "./routers/productRouter.js";
import userRouter from "./routers/userRouter.js";
import orderRouter from "./routers/orderRouter.js";
import uploadRouter from "./routers/uploadRoutes.js";
import { handleError, handleNotFound } from "./middleware/helperMessage.js";
const port = process.env.PORT;
connectDb(); // connection to database

const app = express();

// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser middleware
app.use(cookieParser());

app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/upload", uploadRouter);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.get("/api/config/paypal", (req, res) =>
  res.json({ clientId: process.env.PAYPAL_CLIENT_ID })
);

app.use("/*", handleNotFound);

app.use(handleError);

app.listen(port, () => console.log(`Listening to port no. ${port}`));
