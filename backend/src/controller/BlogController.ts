import express from "express";
import { Request, Response } from "express";

export async function CreateBlog(req: Request, res: Response){
    const data = req.body;
    console.log(data);

    try {
     const blogData = "Placeholder";
    return
        res
         .status(200)
        .json({ message: "Blog is good" });
    }  catch (error) {
   console.error(error);
    return
        res
            .status(500)
            .json({ message: "Internal server error occured"})
}
}
