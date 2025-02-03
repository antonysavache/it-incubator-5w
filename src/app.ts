import express from "express";
import {SETTINGS} from "./settings";
import {blogsRouter} from "./features/blogs/blogs.router";
import {testingRouter} from "./shared/features/testing/testing.router";
import {postsRouter} from "./features/posts/posts.router";
import {usersRouter} from "./features/users/users.router";
import {authRouter} from "./features/auth/auth.router";

export const app = express();
app.use(express.json());

app.use(SETTINGS.PATH.TESTING, testingRouter);
app.use(SETTINGS.PATH.BLOGS, blogsRouter);
app.use(SETTINGS.PATH.POSTS, postsRouter);
app.use(SETTINGS.PATH.USERS, usersRouter);
app.use(SETTINGS.PATH.AUTH, authRouter)
