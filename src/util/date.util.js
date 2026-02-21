export const buildDateFilter = (startDate, endDate) => {
  const dateFilter = {};

  if (startDate) {
    dateFilter.$gte = new Date(startDate);
  }

  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    dateFilter.$lte = end;
  }

  return Object.keys(dateFilter).length > 0 ? dateFilter : null;
};