import express from "express";

import { validationResult, matchedData } from "express-validator";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

export const createBook = async (req, res) => {
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




  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
