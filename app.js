import express from "express";
import morgan from "morgan";

// import middlewares
import errorHandlingMW from "./middlewares/errorHandlingMW.js";
import notFoundMW from "./middlewares/notFoundMW.js";

// import routes
import userRouter from "./routes/user.router.js";
import postRouter from "./routes/post.router.js";
import authRouter from "./routes/auth.router.js";

const app = express();

// attach middlewares
app.use(morgan("dev"));
app.use(express.json()); // req.body

// define routes
app.use("/api/auth",authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);

// not found middleware
app.use(notFoundMW);

// global error handling middleware
app.use(errorHandlingMW);

export default app;
