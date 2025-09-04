import express, { type Request, type Response } from "express";
import client from "../../config/prisma.js";
import { signInSchema, signupSchema, type signupInput, type singInInput } from "../../utils/zodSchema.js";
import validate from "../../validators/validateZodSchema.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()


const authRouter = express.Router();

authRouter.post("/signup",validate(signupSchema), async(req :Request, res : Response) => {
  try {
    const {username , password} = req.body as signupInput;
    // as = type assertion. Matlab compiler ko bolna:
// “Bhai, mujhe pata hai ye value kaunsa type hai, tu tension mat le.”

    const user = await client.user.findUnique({
        where : {
          username : username
        }
    })

    if(user){
            return res.status(400).json({message : "username alredy exist , try diffent username"});
    }
const hashPassword = await bcrypt.hash(password,10);
     
    await client.user.create({
        data :  {
            username : username,
            password : hashPassword
        }
    });

    res.json({message : "signup scuseesfull"})


  } catch (error) {
    console.log("Error is : ", error);
    res.json({error : "Something went wrong !! "})
  }
})

authRouter.post("/login", validate(signInSchema),async(req,res) => {
try {
  const {username, password}  = req.body as singInInput

  const userDetails = await client.user.findUnique({
    where : {
      username : username
    }
  })
// console.log("user details check ", userDetails);

if(userDetails){
  const isCorrectPassword = await bcrypt.compare(password, userDetails.password)


  if(!isCorrectPassword){
    return res.status(400).json({message : "Wrong password"})
  }

// now jwt impletion left 
const jwtToken = jwt.sign({ id : userDetails.id ,username : username }, process.env.ACCESS_TOKEN_SECRET as string, {expiresIn : "7d"})

res.cookie("loginToken", jwtToken, {
  httpOnly : true, 
  secure : false, // prod me true
  sameSite : "strict",
  maxAge : 7 * 24 * 60 * 60 * 1000
})

return res.status(200).json({ message : "Login successful"})
}

 res.status(404).json({message : "User not found, try again"})

} catch (error) {
  console.log("Sign in error : ", error);
  res.status(400).json({message : "Something went wrong"})
}
})

export default authRouter;

