import express from "express";
// import createHttpError from "http-errors"; // Ensure this is installed and imported
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app = express();

app.get("/", (req, res) => {
  // const error = createHttpError(404, "Not Found");
  // throw error;
  res.json({ message: "Hello World" });
});

// Use the error handler correctly
app.use(globalErrorHandler);

export default app;
