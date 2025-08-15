import express from "express";import { DeleteReview, getReviews } from "../../controllers/AdminReviewController.js";
import protect from "../../middleware/protect.js";
import isAdmin from "../../middleware/isAdmin.js";


const AdminReviewRoutes = express.Router();

AdminReviewRoutes.get("/",protect,isAdmin,getReviews);
AdminReviewRoutes.delete("/:id",protect,isAdmin,DeleteReview);

export default AdminReviewRoutes;