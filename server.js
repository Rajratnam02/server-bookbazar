import express from "express";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import 'dotenv/config'
import connectDB from "./config/mongoose.config.js";
import cors from "cors";


// Admin Routes
import AdminOrderRoutes from "./routes/AdminRoutes/AdminOrderRoutes.js";
import AdminReviewRoutes from "./routes/AdminRoutes/AdminReviewRoutes.js";
import UserManagementRoutes from "./routes/AdminRoutes/UserManagement.js";

// User Routes
import UserAuthRoutes from "./routes/UserRoutes/UserAuthRoutes.js";
import userCartRoutes from "./routes/UserRoutes/UserCartRoutes.js";
import UserOrderRoutes from "./routes/UserRoutes/UserOrderRoutes.js";
import UserReviewRoutes from "./routes/UserRoutes/UserReviewRoutes.js";

// Product Routes
import CategoryRoutes from "./routes/AdminRoutes/CategoryRoutes.js";
import BookRoutes from "./routes/AdminRoutes/BookRoutes.js";


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors(
    {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,

    }
))
const port = process.env.PORT || 3000;
connectDB();

// Admin Routes
app.use("/api/admin/order", AdminOrderRoutes);
app.use("/api/admin/review", AdminReviewRoutes);
app.use("/api/admin/usermanagement", UserManagementRoutes);

// Universal Routes
app.use("/api/category", CategoryRoutes); //Checked
app.use("/api/book", BookRoutes); //Checked

// User Routes
app.use("/api/user/auth", UserAuthRoutes);  //Checked
app.use("/api/user/cart", userCartRoutes);
app.use("/api/user/order", UserOrderRoutes);
app.use("/api/user/review", UserReviewRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
});

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})