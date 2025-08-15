import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        unique:true
    },
    items:[{
        product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'books',
    },
        quantity:{
        type:Number,
        default:1,
    }}]
},{
    timestamps:true,
})

export default mongoose.model("cart",cartSchema);