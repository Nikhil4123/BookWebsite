const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const config = require("../config");

// Import the User model
const User = require("../models/user");

const createTestUser = async () => {
  try {
    // Connect to database
    await mongoose.connect(config.mongoURI);
    console.log("Connected to Database");

    // Check if test user already exists
    const existingUser = await User.findOne({ email: "test@example.com" });
    if (existingUser) {
      console.log("Test user already exists");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("password123", 5);

    // Create test user
    const testUser = new User({
      username: "testuser",
      email: "test@example.com",
      password: hashedPassword,
      address: "123 Test Street, Test City",
      role: "user"
    });

    await testUser.save();
    console.log("Test user created successfully");
    console.log("Email: test@example.com");
    console.log("Password: password123");
    console.log("Username: testuser");

  } catch (error) {
    console.error("Error creating test user:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from Database");
  }
};

createTestUser();
