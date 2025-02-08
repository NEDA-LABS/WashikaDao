import express from "express";
import { Request, Response } from "express";
import {CreateBlog} from "../controller/BlogController"

const router = express.Router();
router.post('/GetAllBlogs', (req: Request, res: Response) => CreateBlog(req, res));
export default router;
