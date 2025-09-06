import express, { type Request, type Response } from "express";
import vaildJwt from "../../middlewares/authMiddleware.js";
import client from "../../config/prisma.js";


const linkShareRouter = express.Router();

linkShareRouter.post("/share/remove", vaildJwt,async(req : Request , res : Response) => {
  try {
    const loggedInUserId = req.user!.id;
 
    const updated = await client.user.update({
      where : {
        id : loggedInUserId
      },
      data : {
        is_shared : false,
        link : null
      }
    })
if(!updated){
    return res.status(403).json({message : "Not found"})
}
   return res.status(200).json({message : "Visibility change"})

  } catch (error) {
       return res.status(400).json({message : "Error Changing visiblicty"})
  }
})

linkShareRouter.post("/share/add", vaildJwt,async(req : Request , res : Response) => {
  try {
    const loggedInUserId = req.user!.id;

    const randomurl = () => {
      const randomAlpha = "cnecdijmopwsopopkowsocdjowpqpqwdncdop";
      let url = "";

      for(let i = 0; i<=12 ; i++){
        const index = Math.floor(Math.random() * randomAlpha.length);
        url = url + randomAlpha[index];
      }
      return url;
    }

    const urlForUser = randomurl();
    console.log(`url : ${urlForUser}`);
    
 
    const updated = await client.user.update({
      where : {
        id : loggedInUserId
      },
      data : {
        is_shared : true,
        link : urlForUser
      }
    })
   return res.status(200).json({message : "Visibility change"})

  } catch (error) {
       return res.status(400).json({message : "Error Changing visiblicty"})
  }
})

linkShareRouter.get("/:shareLink", async(req : Request, res : Response) => {
  try {
    const link = req.params.shareLink;
    if (!link) throw new Error("Link is required");

const userInfo = await client.user.findUnique({
  where : {
    link : link  }
})

if(!userInfo){
  return res.status(403).json({message : "Not found"})
}

const userContent = await client.content.findMany({
  where : {
    user_id : userInfo!.id
  }
})

 return res.status(200).json({data : userContent})

  } catch (error) {
      return res.status(403).json({message : "Error"})
  }
})


export default linkShareRouter;