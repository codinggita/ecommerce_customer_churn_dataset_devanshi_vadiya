/**
 * Build MongoDB filter object from query parameters.
 */
const buildFilter = (query) => {
  const filter = {};

  // String exact matches
  if (query.country) filter.country = new RegExp(`^${query.country}$`, 'i');
  if (query.city) filter.city = new RegExp(`^${query.city}$`, 'i');
  if (query.gender) filter.gender = new RegExp(`^${query.gender}$`, 'i');
  if (query.signupQuarter) filter.signupQuarter = query.signupQuarter.toUpperCase();

  // Membership years exact
  if (query.membershipYears) {
    const val = parseInt(query.membershipYears, 10);
    if (!isNaN(val)) filter.membershipYears = val;
  }

  // Age range
  if (query.minAge || query.maxAge) {
    filter.age = {};
    if (query.minAge) {
      const val = parseInt(query.minAge, 10);
      if (!isNaN(val)) filter.age.$gte = val;
    }
    if (query.maxAge) {
      const val = parseInt(query.maxAge, 10);
      if (!isNaN(val)) filter.age.$lte = val;
    }
    if (Object.keys(filter.age).length === 0) delete filter.age;
  }

  // Minimum thresholds
  if (query.minPurchases) {
    const val = parseInt(query.minPurchases, 10);
    if (!isNaN(val)) filter.totalPurchases = { $gte: val };
  }
  if (query.minLifetime) {
    const val = parseFloat(query.minLifetime);
    if (!isNaN(val)) filter.lifetimeValue = { $gte: val };
  }
  if (query.minCredit) {
    const val = parseFloat(query.minCredit);
    if (!isNaN(val)) filter.creditBalance = { $gte: val };
  }
  if (query.minLoginFrequency) {
    const val = parseInt(query.minLoginFrequency, 10);
    if (!isNaN(val)) filter.loginFrequency = { $gte: val };
  }
  if (query.minMobileUsage) {
    const val = parseInt(query.minMobileUsage, 10);
    if (!isNaN(val)) filter.mobileAppUsage = { $gte: val };
  }
  if (query.minDiscountRate) {
    const val = parseInt(query.minDiscountRate, 10);
    if (!isNaN(val)) filter.discountUsageRate = { $gte: val };
  }
  if (query.minSessionDuration) {
    const val = parseFloat(query.minSessionDuration);
    if (!isNaN(val)) filter.sessionDurationAvg = { $gte: val };
  }

  // Churned filter
  if (query.churned !== undefined) {
    filter.churned = query.churned === '1' || query.churned === 'true';
  }

  return filter;
};

module.exports = { buildFilter };
