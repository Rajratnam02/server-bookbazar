import express from "express";import { CreateCategory, DeleteCategory, GetCategory, seedCategories, UpdateCategory } from "../../controllers/CategoryController.js";
import protect from "../../middleware/protect.js";
import isAdmin from "../../middleware/isAdmin.js";


const CategoryRoutes=express.Router();



CategoryRoutes.post("/",protect,isAdmin,CreateCategory);
CategoryRoutes.put("/:id",protect,isAdmin,UpdateCategory);
CategoryRoutes.delete("/:id",protect,isAdmin,DeleteCategory);
CategoryRoutes.post("/seed", protect, isAdmin, seedCategories);


CategoryRoutes.get("/",GetCategory);


export default CategoryRoutes