import jwt from "jsonwebtoken"
import usermodel from "../models/usermodel.js";

const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) return res.status(401).json({msg:"Please login to access this"});
        const deCodedToken = jwt.verify(token,process.env.JWT_SECRET_KEY);
        const user = await usermodel.findById(deCodedToken.id).select("-password");
        if(!user) return res.status(401).json({msg:"User does not exist"});
            req.user = user;
            next();
        }
         catch (error) {
            res.status(401).json({
                message:"Internal Server Error",
                error:error.message,
            })
         }
}

export default protect;



