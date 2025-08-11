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
} from '@ionic/react';
import Header from '../components/Header';
import storage from '../storage';
import { deleteCarById, getCars } from '../services/carService';
import { Link } from 'react-router-dom';
import { IonAlert } from '@ionic/react';

export interface Car {
  id: number;
  marke: string;
  modell: string;
  baujahr: number;
  km: number;
  au_hu: string;
  leistung: number;
  kraftstoffart: string;
  getriebe: string;
  preis: number;
  images: { id: number; image: string }[];
}

const Inventory: React.FC = () => {
  // List state + UI flags
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);

  /** Load cars when the view is about to enter; fall back to cache on error. */
  useIonViewWillEnter(() => {
    (async () => {
      setLoading(true);
      try {
        const fetchedCars = await getCars();
        setCars(fetchedCars);
        await storage.set('cars', fetchedCars);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Fehler beim Laden der Fahrzeuge');
        const cached = (await storage.get('cars')) || [];
        setCars(cached);
      } finally {
        setLoading(false);
      }
    })();
  });

  /** Optimistic delete: update UI first, then call API; revert on failure. */
  async function handleDelete(id: number) {
    const prev = cars;
    setCars((c) => c.filter((x) => x.id !== id));
    try {
      await deleteCarById(id);
    } catch (e) {
      setCars(prev);
      console.error(e);
    }
  }

  // Loading screen
  if (loading) {
    return (
      <IonPage>
        <Header />
        <IonContent className="ion-padding">
          <p>Lade Fahrzeuge…</p>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <Header />
      <IonContent className="ion-padding">
        {cars.length === 0 ? (
          <p>Keine Fahrzeuge</p>
        ) : (
          <IonList className="car-list">
            {cars.map((car) => (
              <IonCard key={car.id} className="car-card">
                {car.images && car.images[0] && (
                  <img src={car.images[0].image} className="banner-image" />
                )}

                <IonCardHeader>
                  <IonCardTitle>
                    <h1>
                      {car.marke} {car.modell}
                    </h1>
                  </IonCardTitle>
                </IonCardHeader>

                <IonCardContent className="car-details">
                  {/* Compact spec rows */}
                  <div className="car-details-wrap">
                    <div className="car-detail-label">Baujahr</div>
                    <div className="car-detail-value">{car.baujahr}</div>
                  </div>
                  <div className="car-details-wrap">
                    <div className="car-detail-label">Kilometerstand</div>
                    <div className="car-detail-value">{car.km}</div>
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

                {/* Actions */}
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
            ))}
          </IonList>
        )}

        {/* Confirm deletion dialog */}
        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Fahrzeug löschen"
          message="Möchten Sie dieses Fahrzeug wirklich löschen?"
          buttons={[
            {
              text: 'Abbrechen',
              role: 'cancel',
              handler: () => {
                setShowDeleteAlert(false);
              },
            },
            {
              text: 'Löschen',
              role: 'destructive',
              handler: async () => {
                if (selectedCarId !== null) {
                  await handleDelete(selectedCarId);
                }
              },
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Inventory;
