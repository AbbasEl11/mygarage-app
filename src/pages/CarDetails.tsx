/**
 * Car Details Page Component
 * 
 * Displays comprehensive information about a single vehicle including
 * image gallery, specifications, features, and extras.
 */

import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonIcon,
} from '@ionic/react';
import storage from '../storage';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { chevronBackOutline } from 'ionicons/icons';

interface Params {
  id: string;
}

const base = (import.meta.env.BASE_URL || '/mygarage-app/').replace(/\/+$/, '')
const fallback = `${base}/#/inventory`;   

/**
 * Vehicle details page with image gallery and specifications
 * @returns {JSX.Element} Car details page
 */
const CarDetails: React.FC = () => {
  const { id } = useParams<Params>();
  const history = useHistory();
  const [car, setCar] = useState<any | undefined>(undefined); 

  const capitalize = (str: string) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

  useEffect(() => {
    (async () => {
      const cars = (await storage.get('cars')) || [];
      const found = cars.find((c: any) => String(c.id) === id);
      setCar(found);
    })();
  }, [id]);

  if (!car) {
    return (
      <IonPage>
        <IonContent>Fahrzeug nicht gefunden</IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
<IonButtons slot="start">
            <IonButton
              onClick={() => {
                if (history.length > 1) {
                  history.goBack();
                } else {
                  window.location.href = fallback;
                }
              }}
            >
              <IonIcon icon={chevronBackOutline} slot="start" />
              Zurück
            </IonButton>
          </IonButtons>
          <IonTitle>
            {car.marke} {car.modell}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ '--background': '#0a0e1a' }}>
        {/* Image Gallery */}
        {car.images && car.images.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <Swiper navigation modules={[Navigation]} className="mySwiper">
              {car.images.map((imgObj: any, index: number) => (
                <SwiperSlide key={index}>
                  <img
                    src={imgObj.image}
                    alt={`Bild ${index + 1}`}
                    style={{ 
                      width: '100%',
                      maxHeight: '400px', 
                      objectFit: 'cover',
                      borderRadius: '0'
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
          {/* Car Name Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
          }}>
            <h1 style={{
              fontSize: '2rem',
              color: 'var(--text-strong)',
              margin: 0,
              fontFamily: 'Righteous, sans-serif'
            }}>{car.marke} {car.modell}</h1>
          </div>

          {/* Specs Card */}
          <IonCard style={{
            background: 'rgba(17, 25, 40, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
          }}>
            <IonCardHeader>
              <IonCardTitle style={{ color: 'var(--text-strong)', fontSize: '1.5rem' }}>Technische Daten</IonCardTitle>
            </IonCardHeader>

          <div className="details-wrap" style={{ padding: '20px' }}>
            <div className="detail-label">Baujahr</div>
            <div className="detail-value">{car.baujahr}</div>

            <div className="detail-label">Farbe</div>
            <div className="detail-value">{capitalize(car.farbe)}</div>

            <div className="detail-label">Kilometerstand</div>
            <div className="detail-value">{car.kilometer} km</div>

            <div className="detail-label">Unfallhistorie</div>
            <div className="detail-value">{capitalize(car.unfallhistorie)}</div>

            <div className="detail-label">Preis</div>
            <div className="detail-value">{car.preis} €</div>

            <div className="detail-label">Kraftstoff</div>
            <div className="detail-value">{capitalize(car.kraftstoffart)}</div>

            <div className="detail-label">Getriebe</div>
            <div className="detail-value">{capitalize(car.getriebe)}</div>

            <div className="detail-label">AU/HU</div>
            <div className="detail-value">{car.au_hu}</div>

            <div className="detail-label">Leistung</div>
            <div className="detail-value">{car.leistung} kW</div>

            <div className="detail-label">Gewicht</div>
            <div className="detail-value">{car.gewicht} kg</div>

            <div className="detail-label">Hubraum</div>
            <div className="detail-value">{car.hubraum} l</div>

            <div className="detail-label">VIN</div>
            <div className="detail-value">{car.vin}</div>

            <div className="detail-label">Sonstige Merkmale</div>
            <div className="detail-value">{car.sonstigeMerkmale}</div>

            <div className="detail-label">Ausstattung</div>
            <div className="detail-value">
              {Array.isArray(car.ausstattung) ? car.ausstattung.join(', ') : ''}
            </div>

            <div className="detail-label">Extras</div>
            <div className="detail-value">
              {Array.isArray(car.extras) ? car.extras.join(', ') : ''}
            </div>
          </div>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CarDetails;
