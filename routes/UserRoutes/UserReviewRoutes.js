import express from 'express'
import { AddReviews, GetReviews, removeReview, UpdateReviews } from '../../controllers/UserReviewController.js';

import protect from '../../middleware/protect.js';

const UserReviewRoutes = express.Router();


UserReviewRoutes.post("/:id",protect,AddReviews);
UserReviewRoutes.delete("/:id",protect,removeReview);
UserReviewRoutes.put("/:id",protect,UpdateReviews);
UserReviewRoutes.get("/:id",protect,GetReviews);

export default UserReviewRoutes;

