import express, { type Request, type Response } from "express";
import vaildJwt from "../../middlewares/authMiddleware.js";
import validate from "../../validators/validateZodSchema.js";
import { constentSchema, type contentInput } from "../../utils/zodSchema.js";
import client from "../../config/prisma.js";


type conentDTO = {
   id : number;
   type : string;
   link : string | null;
   user_id : number;
   createdAt : Date;
}

const contentRouter = express.Router();

contentRouter.post("/add",vaildJwt, validate(constentSchema),async(req : Request,res : Response) => {
try {
    const {link = null , type}  = req.body as contentInput;
 if(req.user){
    const  userId = req.user.id;
    await client.content.create({
    data : {
        link : link,
        type : type,
        user_id : userId
    }
 })
 }
 
return res.status(200).json({message : "Content added"})


} catch (error) {
    res.status(400).json({message : "somehting went wrong"})
}
})

contentRouter.get("/",vaildJwt,async(req : Request,res: Response) => {
  try {
    const loggedInUserId = req.user!.id;
    if(loggedInUserId){

const allContent = await client.content.findMany({
    where : {
        user_id : loggedInUserId
    }
})

if(allContent.length === 0){
  return    res.status(200).json({message : "No content currently"})
}

const contentToSend : conentDTO[]=  allContent.map(c => ({
    id : c.id,
    type : c.type,
    link : c.link,
    user_id : c.user_id,
    createdAt : c.created_at
}));

res.status(200).json({data : contentToSend})

    }
  } catch (error) {
res.status(400).json({message : "Something went wrong"})

  }
})

contentRouter.delete("/",vaildJwt,async(req: Request,res:Response) => {
try {
       const loggedInUserId = req.user!.id;

        await client.content.deleteMany({
             where : {
                user_id : loggedInUserId
            }
        })
res.status(200).json({message : "Deteted scussefully"})        

    } catch (error) {
        res.status(400).json({message : "Error "})        

    }
})

contentRouter.delete("/:id",vaildJwt, async(req : Request, res: Response) => {
    try {
        const loggedInUserId = req.user!.id;
    
  const deleteId  = req.params.id ;  
  const deleteIdNum = Number(deleteId);

  
  if(!deleteId){
    return res.status(400).json({message : "Invalid Id"})
  }

const content =  await client.content.findUnique({
    where : {
        id : deleteIdNum 
    }
  })

  if(!content || content.user_id !== loggedInUserId){
  return res.status(403).json({ message: "Not authorized" });
  }

  await client.content.delete({
  where: { id: deleteIdNum } // safe, id is unique
});


res.status(200).json({ message: "Deleted successfully" });
return;
    } catch (error) {
        res.status(400).json({ message: "Error" });

    }
})

export default contentRouter;