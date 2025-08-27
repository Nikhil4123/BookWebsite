const router = require("express").Router();
const user = require("../models/user");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");

router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    if (username.length < 4) {
      return res
        .status(400)
        .json({ message: "Username should be more than 3 words " });
    }

    const existingUsername = await User.findOne({ username: username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists " });
    }

    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      return res.status(400).json({ message: " Email already exists " });
    }

    if (password.length <= 4) {
      return res
        .status(400)
        .json({ message: " Password's should  be greater than 5 " });
    }

    const hashpasswrd = await bcrypt.hash(password, 5);

    const newUser = new User({
      username: username,
      email: email,
      password: hashpasswrd,
      address: address,
      role: req.body.role || "user", // Allow role to be set during signup
    });

    await newUser.save();
    
    // Generate token for new user
    const authClaims = [
      { name: newUser.username },
      { role: newUser.role },
    ];

    const secret = process.env.JWT_SECRET || "bookstore123";
    const token = jwt.sign({ authClaims }, secret, {
      expiresIn: "30d",
    });

    return res.status(200).json({
      message: "signup Successfully",
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
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
});

router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Try to find user by username first, then by email
    let existingUser = await user.findOne({ username });
    
    if (!existingUser) {
      // If not found by username, try by email
      existingUser = await user.findOne({ email: username });
    }

    if (!existingUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    await bcrypt.compare(password, existingUser.password, (err, data) => {
      if (data) {
        const authClaims = [
          { name: existingUser.username },
          { role: existingUser.role },
        ];

        const secret = process.env.JWT_SECRET || "bookstore123";
        const token = jwt.sign({ authClaims }, secret, {
          expiresIn: "30d",
        });
        res.status(200).json({
          message:"sign-in successful",
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
          token: token,
        });
      } else {
        res.status(401).json({
          message:
            "Invalid credentials maybe password or username is wrong please check",
        });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
});

router.get("/get-user-information", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const data = await user.findById(id).select("-password");
    return res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: "Internal service error " });
  }
});

router.put("/update-address", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { address } = req.body;
    await user.findByIdAndUpdate(id, { address });
    return res.status(200).json({ message: "Address Updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal service error " });
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
    return res.status(200).json({ status: "success", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Internal service error " });
  }
});

module.exports = router;
