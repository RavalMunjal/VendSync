import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Vendor from '../models/Vendor.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await User.deleteMany();
    await Vendor.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@bidflow.com',
      password: 'password123',
      role: 'admin'
    });

    await User.create([
      {
        name: 'Procurement Officer',
        email: 'po@bidflow.com',
        password: 'password123',
        role: 'procurement_officer'
      },
      {
        name: 'Vendor One',
        email: 'vendor1@example.com',
        password: 'password123',
        role: 'vendor'
      }
    ]);

    await Vendor.create([
      {
        name: 'Tech Supplies Inc.',
        email: 'vendor1@example.com',
        phone: '1234567890',
        gstNumber: '27AABCU9603R1ZN',
        category: 'IT Hardware',
        status: 'active',
        rating: 4.5,
        createdBy: admin._id
      },
      {
        name: 'Office Decor Ltd.',
        email: 'decor@example.com',
        phone: '0987654321',
        gstNumber: '27AABCU9603R2ZM',
        category: 'Furniture',
        status: 'active',
        rating: 4.0,
        createdBy: admin._id
      }
    ]);

    console.log('Data Imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Vendor.deleteMany();
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB().then(() => {
  if (process.argv[2] === '-d') {
    destroyData();
  } else {
    importData();
  }
});
