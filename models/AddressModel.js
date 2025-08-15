import mongoose from "mongoose";

const addressSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true,
    },
    street:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true,
    },
    state:{
        type:String,
        required:true,
    },
    pincode:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true,
    },
    contact:{
        type:String,
        required:true,
    }   
},{
    timestamps:true,
})
export default mongoose.model("address",addressSchema);