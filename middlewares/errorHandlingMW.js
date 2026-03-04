export default (err, req, res, next) => {
  console.error(err); // Log server-side error for debugging

  // Default status code & message
  let statusCode = err.status || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors;

  // Validation Error (Schema validation)
  if (err.name === "ValidationError") {
    statusCode = 400;

    errors = Object.values(err.errors).map((el) => ({
      field: el.path,
      message: el.message,
    }));

    message = "Validation failed";
  }

  // Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;

    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];

    message = `${field} '${value}' already exists`;
  }

  res.status(statusCode).json({
    status: "ُError something went wrong",
    message,
    ...(errors && { errors }),
  });
};
