const router = require("express").Router();
const user = require("../models/user");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");
const config = require("../config");

router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password, address } = req.body;
    if (!username || username.length < 4) {
      return res.status(400).json({ message: "Username should be more than 3 characters", user: null, token: null });
    }
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists", user: null, token: null });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists", user: null, token: null });
    }
    if (!password || password.length <= 4) {
      return res.status(400).json({ message: "Password should be greater than 5 characters", user: null, token: null });
    }
    const hashpasswrd = await bcrypt.hash(password, 5);
    const newUser = new User({
      username,
      email,
      password: hashpasswrd,
      address,
      role: req.body.role || "user",
    });
    await newUser.save();
    const authClaims = [
      { name: newUser.username },
      { role: newUser.role },
    ];
    const token = jwt.sign({ authClaims }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });
    return res.status(200).json({
      message: "Signup successful",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        address: newUser.address,
        avatar: newUser.avatar,
        bio: newUser.bio,
        favoriteGenres: newUser.favoriteGenres,
        studyInterests: newUser.studyInterests,
        readingStatus: newUser.readingStatus,
        privacy: newUser.privacy
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", user: null, token: null });
    console.log(error);
  }
});

router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;
    let existingUser = await user.findOne({ username });
    if (!existingUser) {
      existingUser = await user.findOne({ email: username });
    }
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid credentials", user: null, token: null });
    }
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (isMatch) {
      const authClaims = [
        { name: existingUser.username },
        { role: existingUser.role },
      ];
      const token = jwt.sign({ authClaims }, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn,
      });
      return res.status(200).json({
        message: "Sign-in successful",
        user: {
          id: existingUser._id,
          username: existingUser.username,
          email: existingUser.email,
          role: existingUser.role,
          address: existingUser.address,
          avatar: existingUser.avatar,
          bio: existingUser.bio,
          favoriteGenres: existingUser.favoriteGenres,
          studyInterests: existingUser.studyInterests,
          readingStatus: existingUser.readingStatus,
          privacy: existingUser.privacy
        },
        token
      });
    } else {
      return res.status(401).json({ message: "Invalid credentials", user: null, token: null });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error", user: null, token: null });
    console.log(error);
  }
});

router.get("/get-user-information", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const foundUser = await user.findById(id).select("-password");
    if (!foundUser) {
      return res.status(404).json({ message: "User not found", user: null });
    }
    return res.status(200).json({
      message: "User fetched successfully",
      user: foundUser
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", user: null });
  }
});

router.put("/update-address", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { address } = req.body;
    const updated = await user.findByIdAndUpdate(id, { address }, { new: true }).select("-password");
    if (!updated) {
      return res.status(404).json({ message: "User not found", user: null });
    }
    return res.status(200).json({
      message: "Address updated successfully",
      user: updated
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", user: null });
  }
});

// Update profile (bio, avatar, coverPhoto, preferences, privacy)
router.put("/update-profile", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { bio, avatar, coverPhoto, favoriteGenres, studyInterests, readingStatus, privacy } = req.body;
    const updated = await user.findByIdAndUpdate(
      id,
      { bio, avatar, coverPhoto, favoriteGenres, studyInterests, readingStatus, privacy },
      { new: true }
    ).select("-password");
    if (!updated) {
      return res.status(404).json({ message: "User not found", user: null });
    }
    return res.status(200).json({
      message: "Profile updated successfully",
      user: updated
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", user: null });
  }
});

module.exports = router;
