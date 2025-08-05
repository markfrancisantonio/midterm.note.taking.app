import User from "../models/User.js";
import passport from "passport";

// Register a new user if username is available
// Hashes password and saves user to database
export const registerUser = async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await User.hashPassword(password);
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      passwordHash: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(400).json({ message: "User not created", error: error.message });
  }
};

// Log in a user using passport authentication
// Sends back basic user info on success
export const loginUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    req.logIn(user, (err) => {
      if (err) return next(err);
      res.json({
        message: "Login successful",
        user: { username: user.username, email: user.email },
      });
    });
  })(req, res, next);
};

// Log out the current user and redirect to homepage
export const logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/index.html?logout=1");
  });
};

// Return info of the currently logged-in user
export const getCurrentUser = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not Authenticated" });
  }
  res.json({
    user: {
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      username: req.user.username,
      email: req.user.email,
    },
  });
};

// Update logged-in user's profile with new info
// Only updates fields if provided in request
export const updateUserProfile = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const { firstName, lastName, username, email } = req.body;
  try {
    const user = await User.findById(req.user._id);

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    res.json({
      message: "Profile updated",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
};
