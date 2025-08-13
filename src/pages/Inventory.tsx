// src/pages/Inventory.tsx
import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonList,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  useIonViewWillEnter,
  IonAlert,
} from '@ionic/react';
import { Link, useHistory } from 'react-router-dom';
import Header from '../components/Header';
import storage from '../storage';
import { deleteCarById, getCars } from '../services/carService';

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

/** Reusable card list used by Inventory and Home. */
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

const Inventory: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);

  // Load cars on view enter; fallback to cached list on error.
React.useEffect(() => {
  let alive = true;
  (async () => {
    setLoading(true);
    try {
      const fetched = await getCars();
      if (alive) {
        setCars(fetched);
        await storage.set('cars', fetched);
      }
    } catch (err: any) {
      console.error(err);
      if (alive) {
        setError(err.message || 'Failed to load vehicles');
        const cached = (await storage.get('cars')) || [];
        setCars(cached);
      }
    } finally {
      if (alive) setLoading(false);
    }
  })();
  return () => { alive = false; };
}, []);

  // Optimistic delete with rollback on failure.
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
        <IonContent className="ion-padding">
          <p>Loading vehicles…</p>
        </IonContent>
      </IonPage>
    );
    }

  return (
    <IonPage>
      <Header />
      <IonContent className="ion-padding">
        {cars.length === 0 ? (
          <p>No vehicles</p>
        ) : (
          <>
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
                        <div className="car-detail-value">{car.kraftstoffart}</div>
                      </div>
                      <div className="car-details-wrap">
                        <div className="car-detail-label">Getriebe</div>
                        <div className="car-detail-value">{car.getriebe}</div>
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
          </>
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
