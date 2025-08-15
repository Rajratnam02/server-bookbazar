 const isAdmin = async (req,res,next)=>{
    if(req.user && req.user.isAdmin){
        next();
    }
    else{
            res.status(403).json({message:"You are not an admin!"})
    }
}

export default isAdmin;