import express from "express";
import {
  getPostsBySearch,
  getPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getPost,
  commentPost,
} from "../controllers/posts.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// localhost:4000/posts
// prefix posts was set
// respond to "get" on the route "/"
router.get("/search", getPostsBySearch);
router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", auth, createPost);
router.patch("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);
router.patch("/:id/likePost", auth, likePost);
// commentPost - backend function that handle the creation of the commnet.
router.post("/:id/commentPost", auth, commentPost);

export default router;
