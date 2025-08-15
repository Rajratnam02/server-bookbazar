import usermodel from "../models/usermodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { transporter } from "../config/nodemailer.config.js";
import AddressModel from "../models/AddressModel.js";


export const register = async (req,res)=>{
    try{
        const {name,email,password,mobileNumber} = req.body;
        const existingUser = await usermodel.findOne({email});
        if (existingUser && existingUser.isVerified) return res.status(400).json({ msg: "Email already exists" });
        if(existingUser && !existingUser.isVerified) return res.status(205).json({ msg: "Please Verify Email" });
        const hashedPassword = await bcrypt.hash(password,10);
        const CreatedUser = await usermodel.create({
            name,
            email,
            password: hashedPassword,
            mobileNumber
        });
        res.status(200).json({
            msg:"User created successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            msg: "Error creating user",
            error: error.message,
        })
    }
}


export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const existingUser =await usermodel.findOne({
            email,
        });
        if (!existingUser) {
            return res.status(404).json({
                msg: "User Not Found"
            });
        }
        let otp = Math.floor(100000 + Math.random() * 900000);
        existingUser.otp = otp;
        existingUser.otpLife = Date.now() + 15 * 60 * 1000;
        await existingUser.save();
        transporter.sendMail({
          from: process.env.SMTP_USER,
          to: email,
          subject: "OTP for Verification",
          html: `<h1>Your OTP is ${otp}</h1><p>It is valid for 15 minutes</p>`,
        });
        res.status(200).json({
            msg: "OTP sent successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            msg: "Error sending OTP",
            error: error.message,
        });
    }
}

export const verifyOtp = async (req,res)=>{
    try{
        const {email,otp} = req.body;
        const existingUser = await usermodel.findOne({email},"-password");
        if(!existingUser) return res.status(400).json({msg:"Email does not exist"});
        if(Date.now()>existingUser.otpLife)
        {
            return res.status(400).json({msg:"OTP has expired"});
        }

        if(Number(otp) !== Number(existingUser.otp)) return res.status(400).json({ msg: "Invalid OTP" });
        existingUser.otp =undefined;
        existingUser.otpLife = undefined;
        existingUser.isVerified = true;
        await existingUser.save();

        const token = jwt.sign({id:existingUser._id},process.env.JWT_SECRET_KEY,{
            expiresIn: "7d",
        });
        res.cookie("token",token,{
            httpOnly: true,
            maxAge: 7*24*60*60*1000,
            secure: process.env.NODE_ENV === "production",
        });
        res.status(200).json({
            msg: "OTP verified successfully",
            user:existingUser,
        });
    }
    catch(error){
        res.status(500).json({msg:"Error verifying OTP",error:error.message});
    }
}

export const login = async (req,res)=>{
    try{
        const {email,password} = req.body;
        const existingUser = await usermodel.findOne({email});
        if(!existingUser) return res.status(400).json({msg:"Invalid Credentials"});
        const check = await bcrypt.compare(password,existingUser.password);
        if(!check) return res.status(400).json({msg:"Invalid Credentials"});
        if(!existingUser.isVerified)
        {
            return res.status(205).json({
                msg: "Please verify your email first",
            })
        }
        const token = jwt.sign({id:existingUser._id},process.env.JWT_SECRET_KEY,{
            expiresIn: "7d",
        });
        const returnUser = await usermodel.findById(existingUser._id).select("-password");
        res.cookie("token",token,{
            httpOnly: true,
            maxAge : 7*24*60*60*1000,
            secure: process.env.NODE_ENV === "production",
        });
        res.status(200).json({
            msg: "Login successful",
            user:returnUser,
        });
    }
    catch(error){
        res.status(500).json({msg:"Error logging in",error:error.message});
    }
}

export const logout = async (req,res)=>{
    try{
        res.clearCookie("token");
        res.status(200).json({msg:"Logged out successfully"});
    }
    catch(error){
        res.status(500).json({msg:"Error logging out",error:error.message});
    }
}

export const getProfile = async (req,res) =>{
    try{
        const user = await usermodel.findById(req.user.id).select("-password");
        res.status(200).json(user);
    }
    catch (error){
        res.status(500).json({msg:"Error fetching profile",error:error.message});
    }
}

export const UpdateProfile = async (req, res) => {
  try {
    const { name, mobileNumber, image } = req.body;

    const user = req.user;
    const updatedUSer = await usermodel.findById(user._id);
    if(!updatedUSer)
    {
        return res.status(404).json({msg: "User not found"});
    }
    if(name) updatedUSer.name = name;
    if(mobileNumber) updatedUSer.mobileNumber = mobileNumber;
    if(image) updatedUSer.image = image;

    await updatedUSer.save();
    res.status(200).json({
        msg: "Profile updated successfully",
        user:{
            name:updatedUSer.name,
            mobileNumber:updatedUSer.mobileNumber,
            image:updatedUSer.image,
            email:updatedUSer.email
        }
    });
}
 catch (error) {
    res.status(500).json({
      msg: "Error updating profile",
      error: error.message,
    });
  }
}

export const AddAddress = async (req, res) =>{
    try{
        const {street,city,state,pincode,country,contact} = req.body;
        const fetchedUser = req.user;
        const user = await usermodel.findById(fetchedUser._id)
        const address = await AddressModel.create({
            street,city,state,pincode,country,contact,user:user._id
        });
        user.address.push(address._id);
        await user.save();
        res.status(200).json({msg:"Address added successfully",address:address});
    }
    catch(error){
        res.status(500).json({msg:"Error adding address",error:error.message});
    }
}

export const DeleteAddress = async (req,res)=>{
    try{
        let addressId = req.params.id;
        const fetcheduser = req.user;
        let address = await AddressModel.findById(addressId);
        if(!address){
            return res.status(404).json({msg:"Address not found"});
        }
        if(address.user.toString() !== fetcheduser._id.toString()){
            return res.status(401).json({msg:"You are not authorized to delete this address"})
        }
        await AddressModel.findByIdAndDelete(addressId);
        await usermodel.findByIdAndUpdate(fetcheduser._id,{
            $pull:{address:addressId}
        });
        res.status(200).json({
            msg:"Address deleted successfully"
        })
    }
    catch(error){
        res.status(500).json({msg:"Error deleting address",error:error.message});
    }
}

export const GetAddress = async (req,res)=>{
    try{
        const fetcheduser = req.user;
        const addresses = await usermodel.findById(fetcheduser._id).populate("address");
        res.status(200).json({msg:"Addresses fetched successfully",addresses:addresses.address});
    }
    catch (error){
        res.status(500).json({msg:"Error fetching addresses",error:error.message});
    }
}


export const userauthentication = async (req, res) => {
    try {
        res.status(200).json({
            msg: "User authenticated successfully",
        })
    }
    catch (error) {
        res.status(500).json({ msg: "Error authenticating user", error: error.message });
    }
}


export const GetAddressById = async (req, res) => {
    try {
        const addressId = req.params.id;
        const address = await AddressModel.findById(addressId);
        if (!address) {
            return res.status(404).json({ msg: "Address not found" });
        }
        res.status(200).json({ msg: "Address fetched successfully", address: address });
    } catch (error) {
        res.status(500).json({ msg: "Error fetching address", error: error.message });
    }
}