// Example middleware for authentication or error handling
exports.protect = async (req, res, next) => {
  // Add authentication logic here
  next();
};
