import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5,
    },
    comment:{
        type:String,
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    },
    book:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"books",
    },
},{
    timestamps:true,
});

export default mongoose.model("reviews",reviewSchema);