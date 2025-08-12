;
import Header from '../components/Header';
// src/pages/Home.tsx
import { IonPage, IonContent, IonButton } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getCars } from '../services/carService';    
import { InventoryCards, Car } from './Inventory';     

const Home: React.FC = () => {
  const [latest, setLatest] = useState<Car[]>([]);
  const history = useHistory();

  useEffect(() => {
    (async () => {
      const data = await getCars();
      setLatest(data.slice(0, 2)); 
    })().catch(console.error);
  }, []);

  return (
    <IonPage id="main">
      <Header />
      <IonContent className="ion-padding">
        <div className="hero-section">
          <div className="hero-overlay">
            <h1>Manage Your Garage</h1>
            <p>Track, add, and organize your vehicles</p>
            <IonButton onClick={() => history.push('/inventory')}>View Inventory</IonButton>
          </div>
        </div>

        <h2 style={{ margin: '16px 0' }}>Latest Cars</h2>
        <InventoryCards cars={latest} />
      </IonContent>
    </IonPage>
  );
};

export default Home;
