import express from "express";

import { addOrder, CancelOrder, getOrder, GetOrderById } from "../../controllers/UserOrderController.js";
import protect from "../../middleware/protect.js";

const UserOrderRoutes = express.Router();

UserOrderRoutes.post("/:id", protect, addOrder);
UserOrderRoutes.get("/profile/all", protect, getOrder);
UserOrderRoutes.get("/:id", protect, GetOrderById);
UserOrderRoutes.delete("/:id", protect, CancelOrder);


export default UserOrderRoutes;