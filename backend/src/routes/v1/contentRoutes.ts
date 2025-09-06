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
   contentTags : string[];
}

const contentRouter = express.Router();

contentRouter.post("/add",vaildJwt, validate(constentSchema),async(req : Request,res : Response) => {
try {
    console.log("REQ BODY : ",req.body);
    
    const {link = null , type, tags}  = req.body ;
    console.log(`here I am : ${link}, type : ${type}, tags = ${tags}`);
    console.log(tags);
    
 if(!req.user){
   return res.status(400).json({message : "User not found"})
 }
  const  userId = req.user.id;
  const contentDetails =  await client.content.create({
    data : {
        link : link,
        type : type,
        user_id : userId
    }
 })

 // now we need to itrate over the tags array
for(const eachTag of tags){
    // let find that each tag is unquie or not 

    const uniqueTag = await client.tags.findFirst({
        where : {
            title : eachTag.toLowerCase()
        }
    })

    // I am assuming that if it will be new than it will retun null or undefined
    if(!uniqueTag){
// create a new tag for the current tag 

const newTag = await client.tags.create({
    data : {
        title : eachTag.toLowerCase()
    }
})
// now push this detail in the contenttag tabel a new row

const contentTagAdded = await client.contentTag.create({
    data : {
        tagId : newTag.id,
        contentId : contentDetails.id
    }
})

    }else{
        await client.contentTag.create({
            data : {
                tagId : uniqueTag.id,
                contentId : contentDetails.id
            }
        })
    }
}
  return  res.status(200).json({message : "content created"})


} catch (error) {
    console.log("error : ",error);
    
  return  res.status(400).json({message : "somehting went wrong"})
}
})

contentRouter.get("/",vaildJwt,async(req : Request,res: Response) => {
  try {
    const loggedInUserId = req.user!.id;
    if(loggedInUserId){

const allContent = await client.content.findMany({
    where : {
        user_id : loggedInUserId,
    },
include : {
    contentTags : {
        include : {
            tags : true
        }
    }
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
    contentTags : c.contentTags.map(ct => ct.tags.title ),
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