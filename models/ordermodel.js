import mongoose from "mongoose";


const orderSchema = mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    book:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"books",
    },
    quantity:{
        type:Number,
        required:true,
        default:1,
    },
    status:{
        type:String,
        enum:["pending","confirmed","shipped","delivered","cancelled"],
        default:"pending",
    },
},{
    timestamps:true,
})

export default mongoose.model("order",orderSchema);