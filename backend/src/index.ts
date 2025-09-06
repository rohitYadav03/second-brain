import  express from "express";
import v1Router from "./routes/routes.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser())


app.use("/api/v1", v1Router)

app.listen(process.env.PORT || 3000, () => {
    console.log(process.env.PORT);
    
    console.log("running");
})


