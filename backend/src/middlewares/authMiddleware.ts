import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

interface jwtInterface {
    id: number,
    username : string
}

const vaildJwt = (req : Request,res : Response,next : NextFunction) => {
    console.log("here inide the middleware ");
    
    try {
        const token = req.cookies.loginToken;
        console.log("token is : ", token);
        
        if(!token){
            return res.status(401).json({message : "No token found login again"})
        }
        const user = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET as string) as jwtInterface;
console.log("user details : ", user);

        if(!user){
            return res.status(403).json({message : "Login again"})
        }

        req.user = user;
        console.log("added usr to request and next ");
        
        next()

    } catch (error) {
        res.status(400).json({ErrorMiddleware : "something went wrong !"})
        }
    }

    export default vaildJwt;