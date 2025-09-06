import express, { type Request, type Response } from "express";
import vaildJwt from "../../middlewares/authMiddleware.js";
import client from "../../config/prisma.js";


const  tagRouter = express.Router();

tagRouter.get("/", vaildJwt, async(req : Request , res : Response) => {
    try {
        const allTags = await client.tags.findMany();
        return res.status(200).json({data : allTags})
    } catch (error) {
                return res.status(400).json({message : "Error in fetching Tags"})

    }
})

tagRouter.delete("/content/:id/tags/:tagid", vaildJwt, async(req : Request, res : Response) => {
  try {
    const contentId = Number(req.params.id);
    const tagId = Number(req.params.tagid);

    await client.contentTag.deleteMany({
        where : {
            contentId,
             tagId
        }
    })

   
        return res.status(200).json({message : "Deleted"})

  } catch (error) {
            return res.status(400).json({message : "Error in deltaing tag"})

  }
})

export  default tagRouter;