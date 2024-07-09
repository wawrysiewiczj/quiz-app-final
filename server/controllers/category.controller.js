import Category from "../models/category.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
  try {
    if (!req.body || !req.body.name) {
      console.error("Request body or name missing");
      return next(errorHandler(400, "Please provide a name"));
    }

    const { name } = req.body;

    const slug = name
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");

    const newCategory = new Category({
      ...req.body,
      slug,
      userId: req.user.id,
    });

    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    next(error);
  }
};

export const get = async (req, res, next) => {
  try {
    const query = {
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.name && { name: req.query.name }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.categoryId && { _id: req.query.categoryId }),
    };

    const categories = await Category.find(query);

    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};
