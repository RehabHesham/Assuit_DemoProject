import express from "express";
import morgan from "morgan";

// import middlewares
import errorHandlingMW from "./middlewares/errorHandlingMW.js";
import notFoundMW from "./middlewares/notFoundMW.js";

// import routes
import userRouter from "./routes/user.router.js";

const app = express();

// attach middlewares
app.use(morgan("dev"));
app.use(express.json()); // req.body

// define routes
app.use("/api/users", userRouter);

// not found middleware
app.use(notFoundMW);

// global error handling middleware
app.use(errorHandlingMW);

export default app;
