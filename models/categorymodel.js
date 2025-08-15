import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    name:{
        type:String,
        unique:true,
        trim:true,
        lowercase:true,
    },
    description:{
        type:String,
    },
    image:{
        type:String,
    },
    books:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"books"
    }]
})

export default mongoose.model("categories",categorySchema);