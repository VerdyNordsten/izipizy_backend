const jwt = require("jsonwebtoken")

const validateCreateRecipe = async (req, res, next) => {
  const { name } = req.body
  try {
    const checkNameProduct = async (name) => {
      if (!name) {
        throw new Error("Name is required")
      }
      if (!/^[a-zA-Z0-9._-\s]+$/.test(name)) throw new Error("Name is not valid")
      if (name.length < 4 || name.length > 50) throw new Error("Name must be between 4 and 50 characters")
      if (name[0] === " " || name[name.length - 1] === " ") throw new Error("Name cannot start or end with a space")
    }
    await Promise.all([checkNameProduct(name)])
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" })
    }
    const token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT)
    req.decoded = decoded
    if (req.decoded.role !== "SELLER") {
      return res.json({ message: "Only sellers are allowed to create products" })
    }
    next()
  } catch (error) {
    return res.json({ message: error.message })
  }
}

const validateUpdateRecipe = async (req, res, next) => {
  const { name = "" } = req.body || {};
  try {
    const checkNameProduct = async (name) => {
      if (!/^[a-zA-Z0-9._-\s]+$/.test(name)) {
        throw new Error("Name is not valid");
      }
      if (name.length < 4 || name.length > 50) {
        throw new Error("Name must be between 4 and 50 characters");
      }
      if (name[0] === " " || name[name.length - 1] === " ") {
        throw new Error("Name cannot start or end with a space");
      }
    };
    await checkNameProduct(name);
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
    req.decoded = decoded;
    if (req.decoded.role !== "SELLER") {
      return res.status(401).json({ message: "Only sellers are allowed to update products" });
    }
    next();
  } catch (error) {
    return res.json({ message: error.message })
  }
};


module.exports = { validateCreateRecipe, validateUpdateRecipe }
