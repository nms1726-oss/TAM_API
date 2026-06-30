import { Router } from "express";
import product from "../../controllers/products";
import { uploadProductos } from "../../middlewares/uploadProductos";

const router = Router();

router.get("/all", product.getAllProducts);
router.get("/:id", product.getProductById);

router.post("/create", (req, res, next) => {

    uploadProductos.single("imagen")(req, res, (err: any) => {

        if (err) {
            return res.status(409).json({
                error: err.message
            });
        }

        if (req.file) {
            req.body.imagen = `assets/img/${req.file.filename}`;
        }

        next();
    });

}, product.createProduct);

router.put("/update/:id", (req, res, next) => {

    uploadProductos.single("imagen")(req, res, (err: any) => {

        if (err) {
            return res.status(409).json({
                error: err.message
            });
        }

        if (req.file) {
            req.body.imagen = `assets/img/${req.file.filename}`;
        }

        next();
    });

}, product.updateProduct);

router.delete("/delete/:id", product.deleteProduct);

export default router;