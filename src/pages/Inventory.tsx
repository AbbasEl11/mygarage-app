/**
 * Inventory Page Component
 * 
 * Displays all vehicles in a grid layout with options to view details or delete.
 * Includes loading and empty states for better user experience.
 */

import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonList,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonAlert,
  useIonViewWillEnter,
} from '@ionic/react';
import { Link, useHistory } from 'react-router-dom';
import Header from '../components/Header';
import storage from '../storage';
import { deleteCarById, getCars } from '../services/carService';

/**
 * Vehicle data structure
 */
export interface Car {
  id: number;
  marke: string;
  modell: string;
  baujahr: number;
  kilometer: number;
  au_hu: string;
  leistung: number;
  kraftstoffart: string;
  getriebe: string;
  preis: number;
  images: { id: number; image: string }[];
}

const API_BASE = import.meta.env.VITE_API_BASE_URL;

/**
 * Capitalizes the first letter of a string
 * @param {string} str - Input string
 * @returns {string} Capitalized string
 */
function capitalize(str: string) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Reusable vehicle card grid component
 * Used by both Inventory and Home pages
 * @param {Object} props - Component props
 * @param {Car[]} props.cars - Array of vehicles to display
 * @param {Function} props.onCardClick - Optional click handler
 * @returns {JSX.Element} Grid of vehicle cards
 */
export function InventoryCards({
  cars,
  onCardClick,
}: {
  cars: Car[];
  onCardClick?: (id: number) => void;
}) {
  const history = useHistory();
  const go = (id: number) => (onCardClick ? onCardClick(id) : history.push(`/car/${id}`));

  return (
    <div className="car-list">
      {cars.map((car) => {
const img = car.images?.[0]?.image;
const src = img
  ? (img.startsWith('http') ? img : `${API_BASE}${img}`)
  : undefined;

        return (
          <div key={car.id} className="car-card" onClick={() => go(car.id)}>
            {src && <img src={src} alt={`${car.marke} ${car.modell}`} />}
            <div className="car-details">
              <div className="car-name">
                <p>{car.marke}</p>
                <p> {car.modell}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Inventory page component with vehicle management
 * Displays all vehicles with delete functionality and caching support
 * @returns {JSX.Element} Inventory page with vehicle grid
 */
const Inventory: React.FC = () => {
  const history = useHistory();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);

  /**
   * Loads vehicles with error handling and caching
   */
  const loadCars = async () => {
    setLoading(true);
    try {
      const fetched = await getCars();
      setCars(fetched);
      await storage.set('cars', fetched);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load vehicles');
      const cached = (await storage.get('cars')) || [];
      setCars(cached);
    } finally {
      setLoading(false);
    }
  };

  // Reload every time the page becomes visible
  useIonViewWillEnter(() => {
    loadCars();
  });

  /**
   * Handles vehicle deletion with optimistic update and rollback on failure
   * @param {number} id - Vehicle ID to delete
   */
  async function handleDelete(id: number) {
    const prev = cars;
    setCars((c) => c.filter((x) => x.id !== id));
    try {
      await deleteCarById(id);
    } catch (e) {
      console.error(e);
      setCars(prev);
    } finally {
      setShowDeleteAlert(false);
      setSelectedCarId(null);
    }
  }

  if (loading) {
    return (
      <IonPage>
        <Header />
        <IonContent style={{ '--background': '#0a0e1a' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            padding: '40px'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '40px 60px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                border: '4px solid rgba(255, 255, 255, 0.1)',
                borderTop: '4px solid #fff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px'
              }} />
              <p style={{
                fontSize: '1.2rem',
                color: 'var(--text)',
                fontWeight: '500',
                margin: 0
              }}>Loading vehicles...</p>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <Header />
      <IonContent style={{ '--background': '#0a0e1a' }}>
        {cars.length === 0 ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            padding: '40px'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '40px 60px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              textAlign: 'center',
              maxWidth: '500px'
            }}>
              <p style={{
                fontSize: '1.2rem',
                color: 'var(--text)',
                fontWeight: '500',
                marginBottom: '24px'
              }}>Keine Fahrzeuge vorhanden</p>
              <button 
                onClick={() => history.push('/add-car')}
                style={{
                  padding: '14px 32px',
                  borderRadius: '30px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#000',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  textTransform: 'none',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s'
                }}
              >
                Fahrzeug hinzufügen
              </button>
            </div>
          </div>
        ) : (
          <div className="ion-padding">
            {/* Full cards list */}
            <IonList className="car-list">
                {cars.map((car) => {
                
const img = car.images?.[0]?.image;
const src = img
  ? (img.startsWith('http') ? img : `${API_BASE}${img}`)
  : undefined;


                return (
                  <IonCard key={car.id} className="car-card">
                    {src && <img src={src} className="banner-image" alt={`${car.marke} ${car.modell}`} />}

                    <IonCardHeader>
                      <IonCardTitle>
                        <h1>
                          {car.marke} {car.modell}
                        </h1>
                      </IonCardTitle>
                    </IonCardHeader>

                    <IonCardContent className="car-details">
                      <div className="car-details-wrap">
                        <div className="car-detail-label">Baujahr</div>
                        <div className="car-detail-value">{car.baujahr}</div>
                      </div>
                      <div className="car-details-wrap">
                        <div className="car-detail-label">Kilometerstand</div>
                        <div className="car-detail-value">{car.kilometer}</div>
                      </div>
                      <div className="car-details-wrap">
                        <div className="car-detail-label">AU/HU</div>
                        <div className="car-detail-value">{car.au_hu}</div>
                      </div>
                      <div className="car-details-wrap">
                        <div className="car-detail-label">Leistung</div>
                        <div className="car-detail-value">{car.leistung}</div>
                      </div>
                      <div className="car-details-wrap">
                        <div className="car-detail-label">Kraftstoff</div>
                        <div className="car-detail-value">{capitalize(car.kraftstoffart)}</div>
                      </div>
                      <div className="car-details-wrap">
                        <div className="car-detail-label">Getriebe</div>
                        <div className="car-detail-value">{capitalize(car.getriebe)}</div>
                      </div>
                      <div className="car-details-wrap">
                        <div className="car-detail-label">Preis</div>
                        <div className="car-detail-value">{car.preis}</div>
                      </div>
                    </IonCardContent>

                    <div className="button-wrapper">
                      <Link className="btn outline" to={`/car/${car.id}`}>
                        Details
                      </Link>
                      <button
                        className="btn outline-delete"
                        onClick={() => {
                          setSelectedCarId(car.id);
                          setShowDeleteAlert(true);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </IonCard>
                );
              })}
            </IonList>
          </div>
        )}

        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Fahrzeug löschen"
          message="Möchten Sie dieses Fahrzeug wirklich löschen?"
          buttons={[
            { text: 'Abbrechen', role: 'cancel', handler: () => setShowDeleteAlert(false) },
            {
              text: 'Löschen',
              role: 'destructive',
              handler: async () => {
                if (selectedCarId !== null) await handleDelete(selectedCarId);
              },
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Inventory;
