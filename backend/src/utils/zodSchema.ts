import {z} from "zod";

export const signupSchema = z.object({
username : z.string().nonempty("Name is required").min(3, "minimum 3 lenght").max(10 , "Maximum is 10 lenght allowed").trim(),
    password : z.string().nonempty("password is required").min(8, "minimum 8 lenght charachter long")
})

export type signupInput = z.infer<typeof signupSchema>


export const signInSchema = z.object({
    username : z.string().nonempty("Enter the username").min(3, "Wrong username").max(10, "Wrong username"),
    password : z.string().nonempty("Enter the password").min(8, "wrong password")
})

export type singInInput = z.infer<typeof signInSchema>

export const constentSchema = z.object({
    link : z.string().max(200, "Link is two long , invlaid link").optional(),
    type : z.string().nonempty("Enter the type of the content")
})

export type contentInput = z.infer<typeof constentSchema>