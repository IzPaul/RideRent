import { useState } from 'react';

const PHILIPPINE_GEOGRAPHY = {
  "National Capital Region (NCR)": [],
  "Cordillera Administrative Region (CAR)": ["Abra", "Apayao", "Benguet", "Ifugao", "Kalinga", "Mountain Province"],
  "Region I — Ilocos Region": ["Ilocos Norte", "Ilocos Sur", "La Union", "Pangasinan"],
  "Region II — Cagayan Valley": ["Batanes", "Cagayan", "Isabela", "Nueva Vizcaya", "Quirino"],
  "Region III — Central Luzon": ["Aurora", "Bataan", "Bulacan", "Nueva Ecija", "Pampanga", "Tarlac", "Zambales"],
  "Region IV-A — CALABARZON": ["Batangas", "Cavite", "Laguna", "Quezon", "Rizal"],
  "MIMAROPA Region": ["Marinduque", "Occidental Mindoro", "Oriental Mindoro", "Palawan", "Romblon"],
  "Region V — Bicol Region": ["Albay", "Camarines Norte", "Camarines Sur", "Catanduanes", "Masbate", "Sorsogon"],
  "Region VI — Western Visayas": ["Aklan", "Antique", "Capiz", "Guimaras", "Iloilo", "Negros Occidental"],
  "Region VII — Central Visayas": ["Bohol", "Cebu", "Negros Oriental", "Siquijor"],
  "Region VIII — Eastern Visayas": ["Biliran", "Eastern Samar", "Leyte", "Northern Samar", "Samar", "Southern Leyte"],
  "Region IX — Zamboanga Peninsula": ["Zamboanga del Norte", "Zamboanga del Sur", "Zamboanga Sibugay"],
  "Region X — Northern Mindanao": ["Bukidnon", "Camiguin", "Lanao del Norte", "Misamis Occidental", "Misamis Oriental"],
  "Region XI — Davao Region": ["Davao de Oro", "Davao del Norte", "Davao del Sur", "Davao Occidental", "Davao Oriental"],
  "Region XII — SOCCSKSARGEN": ["Cotabato", "Sarangani", "South Cotabato", "Sultan Kudarat"],
  "Region XIII — Caraga": ["Agusan del Norte", "Agusan del Sur", "Dinagat Islands", "Surigao del Norte", "Surigao del Sur"],
  "BARMM": ["Basilan", "Lanao del Sur", "Maguindanao del Norte", "Maguindanao del Sur", "Sulu", "Tawi-Tawi"]
};

export const usePhilippineGeography = () => {
  // Returns an array of all region names
  const getRegions = () => Object.keys(PHILIPPINE_GEOGRAPHY);

  // Returns an array of provinces matching the given region name parameter
  const getProvincesByRegion = (regionName) => {
    if (!regionName || !PHILIPPINE_GEOGRAPHY[regionName]) return [];
    return PHILIPPINE_GEOGRAPHY[regionName];
  };

  return { getRegions, getProvincesByRegion };
};