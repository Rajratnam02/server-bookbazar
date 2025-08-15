import ordermodel from "../models/ordermodel.js";

export const addOrder = async (req,res) => {
    try{
        const bookId = req.params.id;
        const userID = req.user._id;
        const quantity = req.body.quantity;
        const newOrder =await ordermodel.create({
            book:bookId,
            userId:userID,
            quantity:quantity,
        })
        res.status(200).json({
            message:"Order Successful",
            data:newOrder,
        });
    }
    catch(error){
        res.status(500).json({
            message:"Error Occured",
            error:error.message
        })
    }
}

export const getOrder = async (req,res) =>{
    try{
        const userID = req.user._id;
        const orders = await ordermodel.find({userId:userID}).populate("book");
        res.status(200).json({
            message:"Orders Retrieved",
            data: orders
        })
    }
    catch(error){
        res.status(500).json({
            message:"Error Occured",
            error:error.message
        })
    }
}

export const GetOrderById = async (req,res) =>{
    try{
        const orderID = req.params.id;
        const order = await ordermodel.findById(orderID).populate("book");
        res.status(200).json({
            message:"Order Retrieved",
            data:order
        })
    }
    catch(error){
        res.status(500).json({
            message:"Error Occured",
            error:error.message
        })
    }
}

export const CancelOrder = async (req,res) =>{
    try{
        const orderID = req.params.id;
        const order = await ordermodel.findById(orderID);
        const userId = req.user._id;
        if(order.userId.toString() !== userId.toString()){
            return res.status(401).json({
                message:"You are not authorized to cancel this order"
            })
        }
        if(order.status === "delivered"){
            return res.status(400).json({
                message:"Order is already delivered"
            });
        }
        order.status = "cancelled";
        await order.save();
         res.status(200).json({
            message:"Order Cancelled",
            data:order
        });

    }
    catch(error){
        res.status(500).json({
            message:"Error Occured",
            error:error.message
        })
    }
}