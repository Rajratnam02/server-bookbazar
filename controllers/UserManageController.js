import usermodel from "../models/usermodel.js";


export const getAllUsers = async (req,res)=>{
    try {
        const users = await usermodel.find().select("-password");
        res.status(200).json({
            message:"Users Fetched successfully",
            data:users,
        });

    }
    catch(error){
        res.status(500).json({
            message:"Error fetching users",
            error:error.message
        });
    }

}

export const getUserById = async (req,res)=>{
    try{
        const id = req.params.id;
        const user = await usermodel.findById(id).select("-password");
        if(!user){
            return res.status(404).json({
                message:"User not found",
                });
            }
            res.status(200).json({
                message:"User Fetched successfully",
                data:user
                });
    }
    catch (error){
        res.status(500).json({
            message:"Error fetching user",
            error:error.message
        });
    }
}

export const UpdateUserRole = async (req,res)=>{
    try{
        const id = req.params.id;
        const isAdmin = req.body.isAdmin;
        const user = await usermodel.findById(id);
        if(!user){
            return res.status(404).json({
                message:"User not found",
            });
        }
        if(isAdmin === true){
            user.isAdmin = true;
            await user.save();
            res.status(200).json({
                message:"User role updated successfully",
                data:user
            });
        }
        else if(isAdmin === false){
            user.isAdmin = false;
            await user.save();
            res.status(200).json({
                message:"User role updated successfully",
                data:user
                });
        }
    }
    catch (error){
        res.status(500).json({
            message:"Error updating user role",
            error:error.message,
        });
    }
}

export const deleteUserById = async (req,res)=>{
    try{
        const id = req.params.id;
        const user = await usermodel.findByIdAndDelete(id);
        if(!user){
            return res.status(404).json({
                message:"User not found",
                });
        }
        res.status(200).json({
            message:"User deleted successfully",
        });
    }
    catch (error){
        res.status(500).json({
            message:"Error deleting user",
            error:error.message,
            });
    }
}