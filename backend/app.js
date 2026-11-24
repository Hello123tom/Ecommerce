import express from "express";
import product from "./routes/productRoutes.js";
import errorHandleMiddleware from "./middleware/error.js";
import user from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
import order from "./routes/orderRoutes.js";
import fileupload from 'express-fileupload'
import dotenv from "dotenv";
import payment from "./routes/paymentRoute.js";
import { stripeWebhook } from "./controller/paymentController.js";
if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: "backend/config/config.env" });
}

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
app.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);
app.use(express.json());
app.use(cookieParser());
app.use(fileupload());

app.use("/api/v1", payment);
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);

app.use(express.static(path.join(__dirname, "../frontend/vite-project/dist")));
app.get("/{*path}", (_, res) => {
  res.sendFile(
    path.join(__dirname, "../frontend/vite-project/dist/index.html")
  );
});
app.use(errorHandleMiddleware);


export default app;