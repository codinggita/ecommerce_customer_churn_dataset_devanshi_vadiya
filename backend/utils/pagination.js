const { DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT } = require('../config/config');

/**
 * Extract pagination params from query string.
 * Returns { page, limit, skip } with validation.
 */
const getPagination = (query) => {
  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);

  if (isNaN(page) || page < 1) page = DEFAULT_PAGE;
  if (isNaN(limit) || limit < 1) limit = DEFAULT_LIMIT;
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;

  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Build pagination metadata for response.
 */
const getPaginationMeta = (total, page, limit) => {
  const pages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    pages,
    hasNextPage: page < pages,
    hasPrevPage: page > 1,
  };
};

module.exports = { getPagination, getPaginationMeta };
