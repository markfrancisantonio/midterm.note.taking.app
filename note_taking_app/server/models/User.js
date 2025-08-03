//Import mongoose for MongoDb modelling
//Import bcrypt for passwords hashing


import mongoose from "mongoose";
import bcrypt from "bcrypt";

//Define user schema: username, passowrd, email

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    email: {type: String, required: true },
});

//Static method to hash passwords before saving

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password,10);
};

//Check password validity

userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.passwordHash);
};

const User = mongoose.model("User", userSchema);
export default User;