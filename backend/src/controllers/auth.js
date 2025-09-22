import express from "express";

import { validationResult, matchedData } from "express-validator";
import dotenv from "dotenv";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import getToken from "../utils/getToken.js";

dotenv.config();

export const signUp = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // If there are validation errors, return the first error message
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: errors.array()[0].msg,
    });
  }

  try {
    const { username, email, password } = matchedData(req);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use.",
      });
    }
    const profilePic = `https://api.dicebear.com/9.x/personas/svg?seed=${email}`;

    const user = new User({
      username,
      email,
      password,
      profileImage: profilePic,
    });

    await user.save();

    const token = await getToken(user._id);

    console.log(profilePic);
    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: profilePic,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      message: "Signup successful!",
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // If there are validation errors, return the first error message
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: errors.array()[0].msg,
    });
  }

  try {
    const { email, password } = matchedData(req);

    let user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials.",
      });
    }
    const token = await getToken(user._id);
    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
      message: "Login Successful",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
