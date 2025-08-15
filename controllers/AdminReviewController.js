import reviewmodel from "../models/reviewmodel.js";

export const DeleteReview = async (req,res)=>{
    try{
        const reviewId = req.params.id;
        const review = await reviewmodel.findByIdAndDelete(reviewId);
        if(!review){
            return res.status(404).json({message: "Review not found"});
        }
        res.status(200).json({message: "Review deleted successfully"});
    }
    catch (error){
        res.status(500).json({message: "Error deleting review",error:error.message});
    }
}

export const getReviews = async (req,res)=>{
    try{
        const reviews = await reviewmodel.find().populate("user","name email");
        res.status(200).json({
            message:"Reviews Fetched successfully",
            data:reviews
        });
    }
    catch (error){
        res.status(500).json({message: "Error fetching reviews",error:error.message});
    }
}