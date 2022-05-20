import express from "express";

import { signin, signup } from "../controllers/users.js";
const router = express.Router();

// send data to backend, backend does something to the user.
// respond to "post" on the route "/signin"

router.post("/signin", signin);
router.post("/signup", signup);

export default router;
