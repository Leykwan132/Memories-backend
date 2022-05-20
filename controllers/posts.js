import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getPosts = async (req, res) => {
  const { page } = req.query;

  try {
    // limit number of post per page
    const LIMIT = 8;

    // get the starting index of every page
    const startIndex = (Number(page) - 1) * LIMIT;

    // get total number of documents.
    // understanding what is the last page we can scroll to.
    const total = await PostMessage.countDocuments({});
    const posts = await PostMessage.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);
    res.status(200).json({
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await PostMessage.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// QUERY  -> /posts?page=1            -> page = 1
// Query the data / ask(search) the data

// PARAMS -> /posts/:id  /posts/123   -> id = 123
// ID of the post
// Get specific resource
export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;
  try {
    // ignore all the case.
    const title = new RegExp(searchQuery, "i");

    // fetch the data with mongodb & mongoose
    // find me all the post that match either 1 criteria,
    // 1. title
    // 2. is one of the tag in the arrays of tags equal to our tags.
    const posts = await PostMessage.find({
      $or: [{ title }, { tags: { $in: tags.split(",") } }],
    });

    res.json({ data: posts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;

  const newPost = new PostMessage({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });
  try {
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  // extract id.
  // route is set to receive a parameter id.
  const { id: _id } = req.params;
  const post = req.body;

  // check if the _id provided is valid
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that id ");

  // Find by id and update.
  const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
    new: true,
  });

  // send response with the updated object.
  res.json(updatedPost);
};

export const deletePost = async (req, res) => {
  // 1. grab the id from the params
  const { id } = req.params;

  // 2. check if id is valid
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with that id ");

  // 3. implement logic to delete the post
  await PostMessage.findByIdAndRemove(id);

  res.json({ message: "Post deleted successfully" });
};

export const likePost = async (req, res) => {
  const { id } = req.params;

  // check if the user is authenticated.
  if (!req.userId) return res.json({ message: "Unauthenticated" });

  // check the post the user wants to like.
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with that id ");

  // get the post
  const post = await PostMessage.findById(id);

  // check if the user has liked the post.
  // id is the id of each user that liked the post
  const index = post.likes.findIndex((id) => id === String(req.userId));

  // -1 means the userId is not found in the likes.
  if (index === -1) {
    // like the post
    post.likes.push(req.userId);
  } else {
    // dislike the post
    // return all the likes without the current person like
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }
  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  });
  res.json(updatedPost);
};

export const commentPost = async (req, res) => {
  // the dynamic /:id from the route
  const { id } = req.params;
  // passed as 2nd param when calling the api
  const { value } = req.body;

  // fetch post that put the comment on
  const post = await PostMessage.findById(id);

  // update the post.
  post.comments.push(value);

  // update the post in the database.
  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  });

  res.json(updatedPost);
};
