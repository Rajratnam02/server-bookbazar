import mongoose from "mongoose";

const bookschema = mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    author:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    isbn:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"reviews"
        }
    ],
    discount:{
        type:Number,
    },
    stock:{
        type:Number,
        default:100,
    },
    finalPrice:{
        type:Number,
    }
},{
    timestamps:true,
})


export default mongoose.model('books', bookschema);