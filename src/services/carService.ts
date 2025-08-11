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

export interface Car extends CarPayload {
  id: number;
}

const BASE = import.meta.env.VITE_API_BASE_URL;

/** Upload multiple image files for a given car ID. */
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

/** Retrieve all cars from the backend. */
export async function getCars(): Promise<Car[]> {
  const res = await fetch(`${BASE}/cars/`);
  if (!res.ok) {
    throw new Error(`Status ${res.status}`);
  }
  return res.json();
}

/** Create a new car entry in the backend. */
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
 * Delete a car entry by its ID.
 * Handles both 204 No Content and JSON error responses gracefully.
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
