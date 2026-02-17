/**
 * Car Service Module
 * 
 * API service for vehicle CRUD operations and image uploads.
 * Handles communication with the Django REST backend.
 */

/**
 * Vehicle creation payload interface
 */
export interface CarPayload {
  marke: string;
  modell: string;
  baujahr: number;
  farbe: string;
  kilometer: number;
  unfallhistorie: 'keine' | 'ja';
  preis: number;
  kraftstoffart: 'benzin' | 'diesel';
  getriebe: 'manuell' | 'automatik';
  au_hu: string;
  leistung: number;
  gewicht: number;
  hubraum: number;
  vin: string;
  ausstattung: string[];
  extras: string[];
  sonstigeMerkmale: string;
}

/**
 * Complete vehicle data with server-generated fields
 */
export interface Car extends CarPayload {
  id: number;
   images: { id: number; image: string }[];
}

const BASE = import.meta.env.VITE_API_BASE_URL;

/**
 * Uploads multiple images for a vehicle
 * @param {number} carId - Vehicle ID
 * @param {File[]} files - Array of image files to upload
 * @throws {Error} If upload fails
 */
export async function uploadImages(carId: number, files: File[]) {
  const form = new FormData();
  files.forEach((f) => form.append('images', f));

  const res = await fetch(`${BASE}/cars/${carId}/upload-images/`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    throw new Error('Bild-Upload fehlgeschlagen');
  }
}

/**
 * Retrieves all vehicles from the backend
 * @returns {Promise<Car[]>} Array of all vehicles
 * @throws {Error} If request fails
 */
export async function getCars(): Promise<Car[]> {
  const res = await fetch(`${BASE}/cars/`);
  if (!res.ok) {
    throw new Error(`Status ${res.status}`);
  }
  return res.json();
}

/**
 * Creates a new vehicle entry
 * @param {CarPayload} car - Vehicle data to create
 * @returns {Promise<Car>} Created vehicle with server-generated ID
 * @throws {Error} If creation fails with backend validation errors
 */
export async function addCar(car: CarPayload): Promise<Car> {
  const res = await fetch(`${BASE}/cars/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(car),
  });

  if (!res.ok) {
    // Parse backend error format (assumes key-based error object)
    const err = await res.json();
    throw new Error(Object.keys(err)[0] + ': ' + err[Object.keys(err)[0]].join(', '));
  }

  return res.json();
}

/**
 * Deletes a vehicle by ID
 * @param {string | number} id - Vehicle ID to delete
 * @throws {Error} If deletion fails
 */
export async function deleteCarById(id: string | number): Promise<void> {
  const res = await fetch(`${BASE}/cars/${id}/`, { method: 'DELETE' });

  // Many backends return 204 for successful deletes
  if (res.status === 204) return;

  if (!res.ok) {
    let msg = `Delete failed (${res.status})`;
    try {
      const err = await res.json();
      const key = Object.keys(err)[0];
      msg = `${key}: ${Array.isArray(err[key]) ? err[key].join(', ') : err[key]}`;
    } catch {
      // Ignore JSON parsing errors
    }
    throw new Error(msg);
  }
}
