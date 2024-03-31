import { Router } from "express";
import { create, get, getAll, getCount, remove, update } from "../controllers/product";


const router = Router();
router.get('/products', getAll);
router.get('/products/count', getCount);
router.get("/products/:id", get);
router.post("/products", create);
router.put("/products/:id",  update)
router.delete("/products/:id" , remove)

export default router;