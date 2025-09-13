const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Tenant = require('./models/Tenant');
const User = require('./models/User');
const config = require('./config/environment');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await Tenant.deleteMany({});
    await User.deleteMany({});

    // Create tenants
    const acmeTenant = new Tenant({
      name: 'Acme',
      slug: 'acme',
      subscription: 'free',
      noteLimit: 3
    });

    const globexTenant = new Tenant({
      name: 'Globex',
      slug: 'globex',
      subscription: 'free',
      noteLimit: 3
    });

    await acmeTenant.save();
    await globexTenant.save();

    console.log('Tenants created');

    // Hash password
    const hashedPassword = await bcrypt.hash('password', 10);

    // Create users
    const users = [
      {
        email: 'admin@acme.test',
        password: hashedPassword,
        role: 'admin',
        tenant: acmeTenant._id
      },
      {
        email: 'user@acme.test',
        password: hashedPassword,
        role: 'member',
        tenant: acmeTenant._id
      },
      {
        email: 'admin@globex.test',
        password: hashedPassword,
        role: 'admin',
        tenant: globexTenant._id
      },
      {
        email: 'user@globex.test',
        password: hashedPassword,
        role: 'member',
        tenant: globexTenant._id
      }
    ];

    await User.insertMany(users);

    console.log('Users created');
    console.log('Seed data completed successfully!');
    console.log('\nTest accounts created:');
    console.log('admin@acme.test (Admin, Acme)');
    console.log('user@acme.test (Member, Acme)');
    console.log('admin@globex.test (Admin, Globex)');
    console.log('user@globex.test (Member, Globex)');
    console.log('All passwords: password');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
