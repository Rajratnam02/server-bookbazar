
//Admin Order Controller
import ordermodel from "../models/ordermodel.js"



export const GetAllOrders = async (req,res)=>{
    try{
        let orders = await ordermodel.find({}).populate("userId","name email mobileNumber address").populate('book',"title finalPrice").sort({ createdAt: -1 });
        res.status(200).json({
            message: "Orders retrieved successfully",
            data: orders
        })
    }
    catch(error){
        res.status(500).json({
            message: "Error retrieving orders",
            error: error.message,
        })
    }
}

export const UpdateOrderStatus = async (req,res)=>{
    try{
        let orderId = req.params.orderId;
        let status = req.body.status;
        let Order =await ordermodel.findOne({_id:orderId.toString()});
        if(!Order){
            return res.status(404).json({
                message: "Order not found",
        });
    }
        Order.status= status;
        await Order.save();
        res.status(200).json({
            message: "Order status updated successfully",
            data: Order,
        });
    }
    catch (error){
        res.status(500).json({
            message: "Error updating order status",
            error: error.message,
        });
    }
}

export const DeleteOrder = async (req,res)=>{
    try{
        let orderId = req.params.orderId;
        let Order = await ordermodel.findOneAndDelete({_id:orderId.toString()});
        if(!Order){
            return res.status(404).json({
                message: "Order not found",
            });
        }
        res.status(200).json({
            message: "Order deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error deleting order",
            error: error.message,
        });
    }
}