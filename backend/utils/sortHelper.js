const { SORT_FIELDS } = require('../config/config');

/**
 * Build a MongoDB sort object from query string.
 * Supports: ?sort=fieldName or ?sort=-fieldName (descending)
 */
const getSortObject = (sortQuery) => {
  if (!sortQuery) return { _id: -1 }; // default: newest first

  const sortFields = {};
  const fields = sortQuery.split(',');

  for (const field of fields) {
    const trimmed = field.trim();
    if (trimmed.startsWith('-')) {
      const key = trimmed.substring(1);
      const dbField = SORT_FIELDS[key] || key;
      sortFields[dbField] = -1;
    } else {
      const dbField = SORT_FIELDS[trimmed] || trimmed;
      sortFields[dbField] = 1;
    }
  }

  return Object.keys(sortFields).length > 0 ? sortFields : { _id: -1 };
};

module.exports = { getSortObject };
