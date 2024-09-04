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
    });

    await newUser.save();
    return res.status(200).json({ message: "signup Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
});

router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await user.findOne({ username });

    if (!existingUser) {
      res.status(500).json({ message: "Invalid credentials" });
    }

    await bcrypt.compare(password, existingUser.password, (err, data) => {
      if (data) {
        const authClaims = [
          { name: existingUser.username },
          { role: existingUser.role },
        ];

        const token = jwt.sign({ authClaims }, "bookstore123", {
          expiresIn: "30d",
        });
        res.status(200).json({
          message:"sign-in successful",
          id: existingUser._id,
          role: existingUser.role,
          token: token,
        });
      } else {
        res.status(500).json({
          message:
            "Invalid credentials maybe password or username is wrong please chek",
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
    return res.status(200).json(data);
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

module.exports = router;
