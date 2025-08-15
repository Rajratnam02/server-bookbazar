import express from "express"
import { bookSeeder, CreateBooks, DeleteBook, GetAllBooks, GetBookById, GetBooksByCategory , UpdateBook } from "../../controllers/BookController.js";
import protect from "../../middleware/protect.js";
import isAdmin from "../../middleware/isAdmin.js";

const BookRoutes = express.Router();


// Admin Routes
BookRoutes.post("/", protect, isAdmin, CreateBooks); //works
BookRoutes.put("/:id", protect, isAdmin, UpdateBook); //works
BookRoutes.delete("/:id", protect, isAdmin, DeleteBook); //works
BookRoutes.post("/seed", bookSeeder);


// General Routes
BookRoutes.get("/", protect, GetAllBooks); //works
BookRoutes.get("/:id", protect, GetBookById);  //works
BookRoutes.get("/category/:id", GetBooksByCategory); //works

export default BookRoutes;