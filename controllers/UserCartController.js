import cartmodel from "../models/cartmodel.js";
import usermodel from "../models/usermodel.js";

// ✅ Add item to cart
export const AddtoCart = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user._id;
    const quantity = parseInt(req.body.quantity) || 1;

    let cart = await cartmodel.findOne({ user: userId });

    // Create new cart if not exists
    if (!cart) {
      cart = await cartmodel.create({ user: userId });
      await usermodel.findByIdAndUpdate(userId, { cart: cart._id });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === bookId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: bookId,
        quantity,
      });
    }

    await cart.save();

    return res.status(200).json({
      msg: "Item added to cart successfully",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal Server Error",
      error: error.message,
    });
  }
};

// ✅ Get user's cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await cartmodel
      .findOne({ user: userId })
      .populate("items.product");

    return res.status(200).json({
      msg: "Cart retrieved successfully",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal Server Error",
      error: error.message,
    });
  }
};

// ✅ Update quantity of a product in the cart
export const UpdateCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    if (!productId || quantity < 1) {
      return res.status(400).json({
        msg: "Product ID and valid quantity are required",
      });
    }

    const cart = await cartmodel.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ msg: "Item not found in cart" });
    }

    item.quantity = quantity;
    await cart.save();

    return res.status(200).json({
      msg: "Cart updated successfully",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal Server Error",
      error: error.message,
    });
  }
};

// ✅ Remove item from cart
export const RemoveFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.id;

    const cart = await cartmodel.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    const index = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (index === -1) {
      return res.status(404).json({ msg: "Item not found in cart" });
    }

    cart.items.splice(index, 1);
    await cart.save();

    return res.status(200).json({
      msg: "Item removed from cart successfully",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal Server Error",
      error: error.message,
    });
  }
};

// ✅ Clear the entire cart
export const ClearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await cartmodel.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    return res.status(200).json({
      msg: "Cart cleared successfully",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal Server Error",
      error: error.message,
    });
  }
};
