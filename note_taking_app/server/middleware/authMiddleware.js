export function ensureAuthenticated(req, res, next) {
  console.log("Is Authenticated?", req.isAuthenticated());
  console.log("User in session:", req.user);
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized, please log in" });
}
