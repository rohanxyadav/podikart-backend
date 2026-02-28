import asyncHandler from '../utils/asyncHandler.js';
import Product from '../models/Product.js';

// Lazy-initialize ImageKit so env vars are always loaded first
let _imagekit = null;
async function getImageKit() {
    if (!_imagekit) {
        // Import inline to avoid top-level initialization before dotenv
        const ImageKit = (await import('imagekit')).default;
        _imagekit = new ImageKit({
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
        });
    }
    return _imagekit;
}

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const query = {};
    if (req.query.category) query.category = req.query.category;
    if (req.query.featured) query.featured = req.query.featured === 'true';
    const products = await Product.find(query);
    res.json(products);
});

// @desc    Fetch single product by slug
// @route   GET /api/products/:slug
// @access  Public
const getProductBySlug = asyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug });
    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    let imageUrl = 'https://ik.imagekit.io/mn97a0qq9f/default-image.jpg';

    if (req.file) {
        try {
            const { default: ImageKit } = await import('imagekit');
            const imagekit = new ImageKit({
                publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
                privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
                urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
            });

            const base64String = req.file.buffer.toString('base64');
            const safeName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');

            const uploadResponse = await imagekit.upload({
                file: base64String,
                fileName: `${Date.now()}-${safeName}`,
                folder: '/podikart/products',
                useUniqueFileName: true,
            });

            console.log('✅ ImageKit Upload Success:', uploadResponse.url);
            imageUrl = uploadResponse.url;
        } catch (err) {
            console.error('❌ ImageKit Upload Error:', err.message);
            res.status(500);
            throw new Error('Image upload failed: ' + err.message);
        }
    }

    const {
        name, slug, shortDescription, description, category,
        rating, reviewCount, trialPrice, valuePrice,
        ingredients, benefits, usage, shelfLife, featured,
    } = req.body;

    const parseList = (val) => {
        if (!val) return [];
        try { return JSON.parse(val); } catch { return val.split(',').map(s => s.trim()); }
    };

    const product = new Product({
        name: name || 'Sample name',
        slug: slug || `product-${Date.now()}`,
        user: req.user._id,
        image: imageUrl,
        category: category || 'general',
        shortDescription: shortDescription || 'Short description',
        description: description || 'Description',
        rating: Number(rating) || 0,
        reviewCount: Number(reviewCount) || 0,
        trialPrice: Number(trialPrice) || 0,
        valuePrice: Number(valuePrice) || 0,
        ingredients: parseList(ingredients),
        benefits: parseList(benefits),
        usage: parseList(usage),
        shelfLife: shelfLife || '3 months',
        featured: featured === 'true' || false,
    });

    console.log('⏳ Saving product:', product.name, '|', product.slug);

    try {
        const createdProduct = await product.save();
        console.log('✅ Product saved:', createdProduct._id);
        res.status(201).json(createdProduct);
    } catch (saveError) {
        console.error('❌ MongoDB Save Error:', saveError.message);
        res.status(500);
        throw new Error('Database Error: ' + saveError.message);
    }
});

export { getProducts, getProductBySlug, createProduct };
