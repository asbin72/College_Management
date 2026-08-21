/**
 * Dynamic ID and Academic Year Generator Utility
 * Replaces hardcoded year strings with dynamic Date calculations.
 */

export const getCurrentYear = () => new Date().getFullYear();

export const getAcademicYear = (offset = 0) => {
  const year = new Date().getFullYear() + offset;
  return `${year}-${year + 1}`;
};

export const generateRegisterNumber = (deptCode = 'CSE', num) => {
  const currentYear = getCurrentYear();
  const uniqueId = num || Math.floor(1000 + Math.random() * 9000);
  return `REG-${currentYear}-${deptCode}-${uniqueId}`;
};

export const generateTransactionId = () => {
  return `TXN-${getCurrentYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
};

export const generateHallTicketId = () => {
  return `HT-${getCurrentYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
};

export const generateAppRef = () => {
  return `APP-${getCurrentYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
};
