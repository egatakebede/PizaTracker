// src/utils/firestoreLicenseValidator.js
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const validateLicenseWithFirestore = async (licenseNumber) => {
  try {
    const licensesRef = collection(db, 'validLicenses');
    const q = query(licensesRef, where('licenseNumber', '==', licenseNumber.toUpperCase()));
    const querySnapshot = await getDocs(q);
    
    return !querySnapshot.empty; // Returns true if license exists
  } catch (error) {
    console.error('Error validating license:', error);
    return false;
  }
};