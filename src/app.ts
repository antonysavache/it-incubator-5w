import express from "express";
import {SETTINGS} from "./settings";
// import {blogsRouter} from "./routes/blogs/blogs.router";
// import {testingRouter} from "./routes/testing/testing.router";
// import {postRouter} from "./routes/posts/posts.router";

export const app = express();
app.use(express.json());

// app.use(SETTINGS.PATH.TESTING, testingRouter);
// app.use(SETTINGS.PATH.BLOGS, blogsRouter);
// app.use(SETTINGS.PATH.POSTS, postRouter);