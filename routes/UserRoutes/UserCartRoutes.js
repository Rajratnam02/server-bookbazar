import express from "express";

import protect from "../../middleware/protect.js";
import { AddtoCart, ClearCart, getCart, RemoveFromCart, UpdateCart } from "../../controllers/UserCartController.js";

const userCartRoutes = express.Router();


userCartRoutes.get("/", protect, getCart);
userCartRoutes.post("/:id", protect, AddtoCart);
userCartRoutes.put("/", protect, UpdateCart);
userCartRoutes.delete("/:id", protect, RemoveFromCart);
userCartRoutes.delete("/", protect, ClearCart);

export default userCartRoutes; 