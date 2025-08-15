import express from "express";

import { DeleteOrder, GetAllOrders, UpdateOrderStatus } from "../../controllers/AdminOrderController.js";
import protect from "../../middleware/protect.js";
import isAdmin from "../../middleware/isAdmin.js";
const AdminOrderRoutes= express.Router();


AdminOrderRoutes.get("/", protect, isAdmin, GetAllOrders);
AdminOrderRoutes.put("/:orderId", protect, isAdmin, UpdateOrderStatus);
AdminOrderRoutes.delete("/:orderId", protect, isAdmin, DeleteOrder);



export default AdminOrderRoutes;