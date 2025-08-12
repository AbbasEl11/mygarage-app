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
} from '@ionic/react';
import storage from '../storage';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

interface Params {
  id: string;
}

const CarDetails: React.FC = () => {
  const { id } = useParams<Params>();
  const history = useHistory(); // kept as in original file
  const [car, setCar] = useState<any>(null);

  /** Fetch car by route `id` from local storage once `id` changes. */
  useEffect(() => {
    (async () => {
      const cars = (await storage.get('cars')) || [];
      const found = cars.find((c: any) => String(c.id) === id);
      setCar(found);
    })();
  }, [id]);

  /** Guard: show fallback page if car was not found. */
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
            <IonBackButton defaultHref="/inventory" />
          </IonButtons>
          <IonTitle>
            {car.marke} {car.modell}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Details</IonCardTitle>
          </IonCardHeader>

          {/* Image gallery (Swiper navigation enabled if images exist) */}
          {car.images && car.images.length > 0 && (
            <Swiper navigation modules={[Navigation]} className="mySwiper">
              {car.images.map((imgObj: any, index: number) => (
                <SwiperSlide key={index}>
                  <img
                    src={imgObj.image}
                    alt={`Bild ${index + 1}`}
                    className="details-image"
                    style={{ maxHeight: '300px', objectFit: 'contain' }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          <br />

          {/* Visible car name below gallery */}
          <div className="car-name">
             <h2>{car.marke} {car.modell}</h2> 
          </div>

          {/* Two-column spec grid (labels/values) */}
          <div className="details-wrap">
            <div className="detail-label">Baujahr</div>
            <div className="detail-value">{car.baujahr}</div>

            <div className="detail-label">Farbe</div>
            <div className="detail-value">{car.farbe}</div>

            <div className="detail-label">Kilometerstand</div>
            <div className="detail-value">{car.kilometer} km</div>

            <div className="detail-label">Unfallhistorie</div>
            <div className="detail-value">{car.unfallhistorie}</div>

            <div className="detail-label">Preis</div>
            <div className="detail-value">{car.preis} €</div>

            <div className="detail-label">Kraftstoff</div>
            <div className="detail-value">{car.kraftstoffart}</div>

            <div className="detail-label">Getriebe</div>
            <div className="detail-value">{car.getriebe}</div>

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
      </IonContent>
    </IonPage>
  );
};

export default CarDetails;
