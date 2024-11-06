import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const postSchema = new mongoose.Schema({
  course: String,
  description: String,
});

const Post = mongoose.model("Post", postSchema);

// POST: Create a new post
app.post("/api/posts", async (req, res) => {
  const newPost = new Post({
    course: req.body.course,
    description: req.body.description,
  });
  
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(400).json({ message: "Error creating new post", error: err });
  }
});

// GET: Retrieve all posts with optional limit
app.get("/api/posts", async (req, res) => {
  try {
    const limit = Number(req.query.limit);
    const posts = limit ? await Post.find().limit(limit) : await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
});

// GET: Retrieve a post by ID
app.get("/api/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: `Post with ID ${req.params.id} not found` });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error });
  }
});

// PUT: Update a post by ID
app.put("/api/posts/:id", async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (updatedPost) {
      res.status(200).json(updatedPost);
    } else {
      res.status(404).json({ message: `Post with ID ${req.params.id} not found` });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating post", error });
  }
});

// DELETE: Delete a post by ID
app.delete("/api/posts/:id", async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (deletedPost) {
      res.status(200).json({ message: `Post with ID ${req.params.id} deleted successfully` });
    } else {
      res.status(404).json({ message: `Post with ID ${req.params.id} not found` });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
});




