import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

export const signin = async (req, res) => {
  // get all data through req.body
  const { email, password } = req.body;

  try {
    // 1. Find the user
    const existingUser = await User.findOne({ email });

    if (!existingUser)
      return res.status(404).json({ message: "User doesn't exist." });

    // 2. Compare the password with bcrypt
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    // 3. get jwt token and send to frontend.
    // information to be stored in the token, secret string, option object.
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      "test",
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ email: "Something went wrong." });
  }
};

export const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;

  try {
    // check if the account is registered
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists." });

    // check if the password does not match.
    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords don't match." });

    // hashing the password.
    const hashedPassword = await bcrypt.hash(password, 12);

    // creating the user.
    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName}, ${lastName}`,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, "test", {
      expiresIn: "1h",
    });

    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ email: "Something went wrong." });
  }
};
