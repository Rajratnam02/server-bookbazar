import bookmodel from "../models/bookmodel.js";
import reviewmodel from "../models/reviewmodel.js";
import usermodel from "../models/usermodel.js";

export const AddReviews = async (req, res) =>{
    try{
        const {rating , comment} = req.body;
        const bookid = req.params.id;
        const user = req.user;
        const CheckUser = await usermodel.findById(user._id);
        if(!CheckUser){
            return res.status(404).json({message : "User not found"});
        }
        const CheckBook = await bookmodel.findById(bookid);
        if(!CheckBook){
            return res.status(404).json({message : "Book not found"});
        }
        const CheckReview = await reviewmodel.findOne({book : bookid , user : user._id});
        if(CheckReview){
            return res.status(400).json({message : "You have already reviewed this book"});
        }
        const newReview =await reviewmodel.create({
            rating : rating ,
            comment : comment ,
            user : user._id ,
            book : bookid,
        })
        const updatedBook = await bookmodel.findByIdAndUpdate(bookid , {$push : {reviews : newReview._id}});
        const updatedUser = await usermodel.findByIdAndUpdate(user._id , {$push : {reviews : newReview._id}});
        res.status(201).json({message : "Review Added Successfully"});
    }
    catch(error){
        res.status(500).json({
            message : "Internal Server Error",
            error : error.message,
        });
    }
}

export const removeReview = async (req,res)=>{
    try{
        const reviewid = req.params.id;
        const user = req.user;
        const CheckUser = await usermodel.findById(user._id);
        if(!CheckUser){
            return res.status(404).json({message : "User not found"});
        }
        const CheckReview = await reviewmodel.findById(reviewid);
        if(!CheckReview){
            return res.status(404).json({message : "Review not found"});
        }
        if(CheckReview.user.toString() !== user._id.toString()){
            return res.status(403).json({message : "You are not authorized to delete this review"});
        }
        const updatedBook = await bookmodel.findByIdAndUpdate(CheckReview.book , {$pull : {reviews :reviewid}});
        const updatedUser = await usermodel.findByIdAndUpdate(user._id,{
            $pull : {reviews : reviewid}
        });
        await reviewmodel.findByIdAndDelete(reviewid);
        res.status(200).json({message : "Review Deleted Successfully"});
    }
    catch (error){
        res.status(500).json({
            message : "Internal Server Error",
            error : error.message,
        });
    }
}

export const UpdateReviews = async (req,res)=>{
    try{
        const reviewid = req.params.id;
        const user = req.user;
        const {rating, comment} = req.body;
        const CheckUser = await usermodel.findById(user._id);
        const CheckReview = await reviewmodel.findById(reviewid);
        if(!CheckUser){
            return res.status(404).json({message : "User not found"});
        }
        if(!CheckReview){
            return res.status(404).json({message : "Review not found"});
        }
        if(CheckReview.user.toString() !== user._id.toString()){
            return res.status(403).json({message : "You are not authorized to update this review"});
        }
        if(rating) CheckReview.rating = rating;
        if(comment) CheckReview.comment = comment;
        await CheckReview.save();
        res.status(200).json({message : "Review Updated Successfully"});
    }
    catch(error){
        res.status(500).json({
            message : "Internal Server Error",
            error : error.message,
        });
    }
}

export const GetReviews = async (req,res)=>{
    try{
        const bookid = req.params.id;
        const book = await bookmodel.findById(bookid).populate("reviews");
        if(!book){
            return res.status(404).json({message : "Book not found"});
        }
        res.status(200).json({
            message : "Reviews Retrieved Successfully",
            reviews : book.reviews
        });
    }
    catch (error){
        res.status(500).json({
            message : "Internal Server Error",
            error : error.message,
        });
    }
}

