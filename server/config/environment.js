module.exports = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://gnanavardhini2_db_user:gnanavardhini@internshalassignment.ed9vdpa.mongodb.net/?retryWrites=true&w=majority&appName=Internshalassignment',
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here-make-it-very-long-and-secure-for-production-use',
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000
};
