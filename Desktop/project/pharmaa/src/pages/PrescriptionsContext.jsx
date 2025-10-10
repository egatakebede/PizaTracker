import React, { createContext, useContext, useState } from "react";

// Create context
const PrescriptionsContext = createContext();

// Custom hook
export function usePrescriptions() {
  return useContext(PrescriptionsContext);
}

// Provider
export function PrescriptionsProvider({ children }) {
  const [prescriptions, setPrescriptions] = useState([
    {
      id: "RX-001",
      patient: "Alice Johnson",
      medicine: "Paracetamol 500mg",
      quantity: 20,
      date: "2025-09-01",
    },
    {
      id: "RX-002",
      patient: "Bob Smith",
      medicine: "Amoxicillin 250mg",
      quantity: 10,
      date: "2025-09-05",
    },
    {
      id: "RX-003",
      patient: "Charlie Brown",
      medicine: "Ibuprofen 200mg",
      quantity: 15,
      date: "2025-09-10",
    },
    {
      id: "RX-004",
      patient: "Diana Prince",
      medicine: "Metformin 500mg",
      quantity: 30,
      date: "2025-09-11",
    },
    {
      id: "RX-005",
      patient: "Ethan Hunt",
      medicine: "Atorvastatin 10mg",
      quantity: 25,
      date: "2025-09-12",
    },
    {
      id: "RX-006",
      patient: "Fiona Gallagher",
      medicine: "Lisinopril 5mg",
      quantity: 18,
      date: "2025-09-12",
    },
  ]);

  return (
    <PrescriptionsContext.Provider value={{ prescriptions, setPrescriptions }}>
      {children}
    </PrescriptionsContext.Provider>
  );
}
