import express from "express";import { deleteUserById, getAllUsers, getUserById, UpdateUserRole } from "../../controllers/UserManageController.js";
import protect from "../../middleware/protect.js";
import isAdmin from "../../middleware/isAdmin.js";


const UserManagementRoutes = express.Router();



UserManagementRoutes.get("/",protect,isAdmin,getAllUsers);
UserManagementRoutes.get("/:id",protect,isAdmin,getUserById);
UserManagementRoutes.put("/:id",protect,isAdmin,UpdateUserRole);
UserManagementRoutes.delete("/:id",protect,isAdmin,deleteUserById);


export default UserManagementRoutes;