import express from 'express';
import { 
    createProduct, getAllProducts,updateProduct, 
    createReviewForProduct,deleteProduct, getProductDetails, 
    getAdminProducts, getProductreviews, deleteProductReview
} from '../controller/productController.js';
const router = express.Router();
import { verifyUser, roleBaseAcess } from '../middleware/userAuth.js';

router.route("/adim/products/create").get(getAllProducts).post(verifyUser,roleBaseAcess("admin"),createProduct);
router.route("/product/:id").put(verifyUser,roleBaseAcess("admin"),updateProduct).delete(verifyUser,roleBaseAcess("admin"),deleteProduct);
router.route("/product/:id").get(getProductDetails);
router.route("/products")
    .get(getAllProducts)
router.route("/admin/products").get(verifyUser,roleBaseAcess("admin"),getAdminProducts);
router.route("/review").put(verifyUser,createReviewForProduct);
router.route("/reviews").get(getProductreviews).delete(verifyUser,deleteProductReview);

export default router;