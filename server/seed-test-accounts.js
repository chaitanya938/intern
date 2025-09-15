const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Tenant = require('./models/Tenant');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://gnanavardhini2_db_user:gnanavardhini@internshalassignment.ed9vdpa.mongodb.net/?retryWrites=true&w=majority&appName=Internshalassignment');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const createTestAccounts = async () => {
  try {
    await connectDB();

    // Create tenants
    const acmeTenant = await Tenant.findOneAndUpdate(
      { slug: 'acme' },
      {
        name: 'Acme',
        slug: 'acme',
        subscription: 'free',
        noteLimit: 3 // Free plan limit
      },
      { upsert: true, new: true }
    );

    const globexTenant = await Tenant.findOneAndUpdate(
      { slug: 'globex' },
      {
        name: 'Globex',
        slug: 'globex',
        subscription: 'free',
        noteLimit: 3 // Free plan limit
      },
      { upsert: true, new: true }
    );

    // Create test accounts
    const testAccounts = [
      {
        email: 'admin@acme.test',
        password: 'password',
        role: 'admin',
        tenant: acmeTenant._id
      },
      {
        email: 'user@acme.test',
        password: 'password',
        role: 'member',
        tenant: acmeTenant._id
      },
      {
        email: 'admin@globex.test',
        password: 'password',
        role: 'admin',
        tenant: globexTenant._id
      },
      {
        email: 'user@globex.test',
        password: 'password',
        role: 'member',
        tenant: globexTenant._id
      }
    ];

    for (const account of testAccounts) {
      const existingUser = await User.findOne({ email: account.email });
      if (existingUser) {
        console.log(`User ${account.email} already exists, updating...`);
        existingUser.role = account.role;
        existingUser.tenant = account.tenant;
        await existingUser.save();
      } else {
        const hashedPassword = await bcrypt.hash(account.password, 10);
        const user = new User({
          ...account,
          password: hashedPassword
        });
        await user.save();
        console.log(`Created user: ${account.email}`);
      }
    }

    console.log('✅ All test accounts created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating test accounts:', error);
    process.exit(1);
  }
};

createTestAccounts();
