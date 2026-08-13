// Database connection configuration (if needed later)
// E.g., for MongoDB or Postgres via Knex/Prisma
const connectDB = async () => {
  try {
    console.log('Database connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
