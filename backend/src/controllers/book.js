import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary"; // its neccessary for you to import v2 of cloudinary
import streamifier from "streamifier";
import dotenv from "dotenv";
import sharp from "sharp";
import { validationResult, matchedData } from "express-validator";
import User from "../models/user.model.js";
import Book from "../models/book.model.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed!"), false);
  },
});

export const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: "No file uploaded",
    });
  }

  try {
    const processedBuffer = await sharp(req.file.buffer)
      .resize({ width: 800 })
      .jpeg({ quality: 80 })
      .toBuffer();

    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) resolve(result);
          else reject(error);
        });
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const result = await streamUpload(processedBuffer);

    // 3️⃣ Return success response
    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

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
    if (!req.user || !req.user._id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized user.",
      });
    }

    const userId = req.user._id;

    const { title, caption, image, rating } = matchedData(req);

    const newBook = new Book({
      title,
      caption,
      image,
      rating,
      user: userId,
    });

    await newBook.save();

    return res.status(201).json({
      success: true,
      newBook,
      message: "Book created successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getBooks = async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized user.",
    });
  }
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "profileImage username");

    const totalBooks = await Book.countDocuments();
    const hasNextPage = page * limit < totalBooks;

    return res.status(200).json({
      success: true,
      books,
      currentPage: page,
      hasNextPage,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteBook = async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized user.",
    });
  }
  try {
    const userId = req.user._id;
    const { bookId } = req.params;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found.",
      });
    }
    if (book.user.toString() !== userId.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access.",
      });
    }

    await Book.findByIdAndDelete(bookId);
    return res.status(200).json({
      success: true,
      message: "Book deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getUserBooks = async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized user.",
    });
  }
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const books = await Book.find({ user: req.user._id })
      .sort({ createdAt: -1 })                          
      .skip(skip)   
      .limit(limit)   
      .populate("user", "profileImage username");

    if (books.length === 0) {
      return res.status(200).json({
        success: true,
        books: [],
        message: "You have no recommendations.",
      });
    }

    const totalBooks = await Book.countDocuments({ user: req.user._id });
    const hasNextPage = page * limit < totalBooks;

    return res.status(200).json({
      success: true,
      books,
      currentPage: page,
      hasNextPage,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
