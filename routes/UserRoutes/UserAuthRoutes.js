import express from "express";


import { AddAddress, DeleteAddress, GetAddress, GetAddressById, getProfile, login, logout, register, sendOtp, UpdateProfile, userauthentication, verifyOtp } from "../../controllers/UserAuthController.js";
import protect from "../../middleware/protect.js";

const UserAuthRoutes = express.Router();


// Profile
UserAuthRoutes.get("/", protect, getProfile);
UserAuthRoutes.put("/profile", protect, UpdateProfile);

// Authentication
UserAuthRoutes.post("/register", register);
UserAuthRoutes.post("/sendOtp", sendOtp);
UserAuthRoutes.post("/verifyOtp", verifyOtp);
UserAuthRoutes.post("/login", login);
UserAuthRoutes.post("/logout", logout);
UserAuthRoutes.get("/authentication", protect, userauthentication);


// Address
UserAuthRoutes.post("/address",protect,AddAddress);
UserAuthRoutes.delete("/address/:id",protect,DeleteAddress);
UserAuthRoutes.get("/address",protect,GetAddress);
UserAuthRoutes.get("/address/:id", protect,GetAddressById);
export default UserAuthRoutes;


// Working Good