import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Get Admin Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    // Orders are currently processed via WhatsApp, so we return placeholders until an Order model is built
    const totalOrders = 3;
    const totalRevenue = 4500;

    res.json({
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue
    });
});

export { getAdminStats };
