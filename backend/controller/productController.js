import Product from "../models/productModel.js";
import handleError from "../utils/handleError.js";
import handleAsyncError from "../middleware/handleAsyncError.js";
import APIFunctionality from "../utils/apifunctionality.js";
import { v2 as cloudinary } from "cloudinary";

export const createProduct = handleAsyncError(async (req, res, next) => {
    let image = []
    console.log('req.file', req.file)
    console.log('req.body', req.body)
    if (typeof req.body.image === 'string') {
        image.push(req.body.image)
    } else {
        image = req.body.image
    }
    const imageLinks = []
    for (let i = 0; i < image.length; i++) {
        const result = await cloudinary.uploader.upload(image[i], {
            folder: 'products'
        })
        imageLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })

    }

    req.body.images = imageLinks
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    // const product = await Product.insertMany(req.body)
    res.status(201).json({
        success: true,
        product,
    });
})


export const getAllProducts = handleAsyncError(async (req, res, next) => {
    const resultPerPage = 3;
    const apiFeatures = new APIFunctionality(Product.find(), req.query).search().filter();

    const filterQuery = apiFeatures.query.clone();
    const productCount = await filterQuery.countDocuments();
    console.log(`productCount: ${productCount}`);

    const totalProducts = Math.ceil(productCount / resultPerPage);
    const page = Number(req.query.page) || 1;
    if (page > totalProducts && productCount > 0) {

    }

    apiFeatures.pagination(resultPerPage);
    const products = await apiFeatures.query;
    if (!products || products.length === 0) {
        console.log(`products: ${products}`);

    }
    res.status(200).json({
        success: true,
        products,
        productCount: productCount,
        totalProducts,
        currentPage: page,
    })
});

export const updateProduct = handleAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new handleError("Product not found", 404));
    }
    const submittedImages = req.body.image;
    const images = Array.isArray(submittedImages)
        ? submittedImages
        : typeof submittedImages === 'string' && submittedImages
            ? [submittedImages]
            : [];

    if (images.length > 0) {
        const imagesLink = [];

        for (const image of images) {
            const result = await cloudinary.uploader.upload(image, {
                folder: 'products'
            });

            imagesLink.push({
                public_id: result.public_id,
                url: result.secure_url
            });
        }

        req.body.images = imagesLink;
    }

    delete req.body.image;




    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        product
    })
})



export const deleteProduct = handleAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new handleError("Product not found", 404));
    }
    for (const image of product.images) {
        await cloudinary.uploader.destroy(image.public_id);
    }
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    })
})


export const getProductDetails = handleAsyncError(async (req, res, next) => {
    // console.log(req.query);


    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new handleError("Product not found", 404))
    }
    res.status(200).json({
        success: true,
        product
    })
})


export const getAdminProducts = handleAsyncError(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products
    })
})

export const createReviewForProduct = handleAsyncError(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user.id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }
    const product = await Product.findById(productId);
    if (!product) {
        return next(new handleError("Product not found", 404));
    }

    // const reviewExist = product.reviews.find((rev) => rev.user.toString() === req.user.id.toString());

    const reviewExist = product.reviews.find((rev) => rev.user && String(rev.user) === String(req.user.id));
    console.log(`reviewExist: ${reviewExist}`);

    if (reviewExist) {
        // product.reviews.forEach((review) =>{
        //     if(req.user.toString() === req.user.id){
        //         review.rating = rating
        //         review.comment = comment
        //         console.log(`rev5555555555555555:`);
        //     }
        // })
        reviewExist.rating = Number(rating);
        reviewExist.comment = comment;
        //  console.log(review);
        //  console.log(`reviewExist: ${reviewExist}`);
    } else {
        // console.log(`77777777777777`)
        product.reviews.push(review);

    }
    // await product.save({validateBeforeSave:false});
    product.numOfReviews = product.reviews.length;
    let avg = 0;
    product.reviews.forEach((rev) => {
        avg += rev.rating;
    })
    product.ratings = product.reviews.length > 0 ? avg / product.reviews.length : 0;
    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        product
    })
})

export const getProductreviews = handleAsyncError(async (req, res, next) => {
    console.log(req.query.id)
    const product = await Product.findById(req.query.id);
    if (!product) {
        return next(new handleError("Product not found", 404));
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

export const deleteProductReview = handleAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
    if (!product) {
        return next(new handleError("Product not found", 404));
    }

    const reviews = product.reviews.find((rev) => rev.user && String(rev.user) === String(req.user.id));
    // const reviews = product.reviews.filter((rev) => rev.user.toString() !== req.user.id.toString());

    const reviewIndex = product.reviews.findIndex((rev) => rev.user && String(rev.user) === String(req.user.id));
    if (reviewIndex === -1) {
        return next(new handleError("Review not found", 404));
    }

    product.reviews.splice(reviewIndex, 1);
    product.numOfReviews = product.reviews.length;
    product.ratings = product.reviews.length > 0 ? product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length : 0;

    await product.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
        reviews: product.reviews
    })

    // let avg = 0    
    // reviews.forEach((rev) =>{
    //     avg += rev.rating;
    // })
    // const ratings = reviews.length>0? avg / reviews.length:0;
    // const numOfReviews = reviews.length;
    // await Product.findByIdAndUpdate(req.query.productId)

})