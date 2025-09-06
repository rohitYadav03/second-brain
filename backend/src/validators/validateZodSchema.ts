import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";
const validate = (schemaInput : ZodTypeAny ) => {
   return (req : Request,res : Response,next : NextFunction) => {
     console.log("s : ",schemaInput);
     
         const result = schemaInput.safeParse(req.body);
console.log("result is : ",result);

         if(result.success){
            req.body = result.data;
            console.log("Inside validate done");
            
            next()
         }
         else {
            const errorMassage = result.error.issues.map((eachMsg) => {
                return eachMsg.message
            })
            res.status(400).json({messageValidate : errorMassage})

         }
     
   }
}

export default validate;