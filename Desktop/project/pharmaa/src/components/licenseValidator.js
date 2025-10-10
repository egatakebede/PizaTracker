// src/utils/licenseValidator.js
const validLicenseNumbers = [
  "PHARMA-2024-001",
  "PHARMA-2024-002", 
  "PHARMA-2024-003",
  "PHARMA-2024-004",
  "PHARMA-2024-005",
  "PHARMA-2024-006",
  "PHARMA-2024-007",
  "PHARMA-2024-008",
  "PHARMA-2024-009",
  "PHARMA-2024-010",
  "MED-LIC-2024-A1",
  "MED-LIC-2024-B2",
  "MED-LIC-2024-C3",
  "MED-LIC-2024-D4",
  "MED-LIC-2024-E5",
  "RX-APPROVED-001",
  "RX-APPROVED-002",
  "RX-APPROVED-003"
];

// Validate license number
export const validateLicenseNumber = (licenseNumber) => {
  if (!licenseNumber) return false;
  const normalizedLicense = licenseNumber.toUpperCase().trim();
  return validLicenseNumbers.includes(normalizedLicense);
};

// Get all valid licenses
export const getValidLicenseNumbers = () => {
  return [...validLicenseNumbers];
};

// Check if license format is valid (for user feedback)
export const isValidLicenseFormat = (licenseNumber) => {
  if (!licenseNumber) return false;
  const patterns = [
    /^PHARMA-2024-\d{3}$/,
    /^MED-LIC-2024-[A-Z]\d$/,
    /^RX-APPROVED-\d{3}$/
  ];
  
  return patterns.some(pattern => pattern.test(licenseNumber.toUpperCase()));
};

// Default export
export default {
  validateLicenseNumber,
  getValidLicenseNumbers,
  isValidLicenseFormat
};