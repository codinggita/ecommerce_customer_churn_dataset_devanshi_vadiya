const Customer = require('../models/Customer');
const asyncHandler = require('../utils/asyncHandler');
const config = require('../config/config');

// Keyword-to-filter mapping for semantic search
const KEYWORD_FILTERS = {
  'high-value': { lifetimeValue: { $gte: config.HIGH_LIFETIME_VALUE } },
  'loyal': { membershipYears: { $gte: config.LOYAL_MEMBERSHIP_YEARS } },
  'inactive': { daysSinceLastPurchase: { $gte: config.INACTIVE_DAYS } },
  'mobile': { mobileAppUsage: { $gte: config.HIGH_MOBILE_USAGE } },
  'discount': { discountUsageRate: { $gte: config.HIGH_DISCOUNT_RATE } },
  'cart': { cartAbandonmentRate: { $gte: config.HIGH_CART_ABANDONMENT } },
  'reviews': { productReviewsWritten: { $gte: config.TOP_REVIEWER_REVIEWS } },
  'credit': { creditBalance: { $gte: config.HIGH_CREDIT } },
  'engagement': { socialMediaEngagementScore: { $gte: config.HIGH_ENGAGEMENT } },
  'churned': { churned: true },
  'premium': { lifetimeValue: { $gte: config.PREMIUM_LIFETIME }, totalPurchases: { $gte: config.PREMIUM_PURCHASES } },
};

exports.searchCustomers = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim() === '') {
    return res.status(400).json({ success: false, error: 'Search query (q) is required and cannot be empty' });
  }

  const query = q.trim().toLowerCase();

  // Check semantic keywords first
  if (KEYWORD_FILTERS[query]) {
    const customers = await Customer.find(KEYWORD_FILTERS[query]).limit(50);
    return res.json({ success: true, query: q, count: customers.length, data: customers });
  }

  // Text search across string fields
  const regex = new RegExp(query, 'i');
  const filter = {
    $or: [
      { country: regex },
      { city: regex },
      { gender: regex },
      { signupQuarter: regex },
    ],
  };

  const customers = await Customer.find(filter).limit(50);
  res.json({ success: true, query: q, count: customers.length, data: customers });
});
