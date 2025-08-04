import User from "../models/User.js";
import passport from "passport";

// registerUser:
//  - get username, email, password from request
//  - check if user exists
//  - if no, hash password, create user, save to DB
export const registerUser = async (req, res) =>{
    const { username, email, password} = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

       const hashedPassword = await User.hashPassword(password);
       const newUser = new User({ username, email, passwordHash: hashedPassword });
       
       await newUser.save()
       res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(400).json({ message: "User not created", error: error.message });
        
    }
};


// loginUser:
//  - use passport to authenticate
//  - if success, log in and return user info
export const loginUser = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        req.logIn(user,(err) => {
            if (err) return next (err);
            res.json({ message: "Login successful",
                user: { username: user.username, email: user.email },
            });
        });
    })(req,res,next);
};

// logoutUser:
//  - end session and return confirmation
export const logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err) ;
        res.json({ message: "Logout successful"});
});
};
// getCurrentUser:
//  return user info if authenticated
export const getCurrentUser = (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not Authenticated" });
    }
        res.json({ 
            user: {
                username: req.user.username,
                email: req.user.email,
            },
        });
    };

    export const updateUserProfile = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const { username, email } = req.body;
  try {
    const user = await User.findById(req.user._id);

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    res.json({ message: "Profile updated", user: { username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
};
