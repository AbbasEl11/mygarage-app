/**
 * Home Page Component
 * 
 * Landing page with hero section and display of latest vehicles.
 * Provides quick access to vehicle inventory and add functionality.
 */

import Header from '../components/Header';
import { IonPage, IonContent, IonButton, useIonViewWillEnter } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getCars } from '../services/carService';    
import { InventoryCards, Car } from './Inventory';     

/**
 * Home page with hero section and latest vehicles
 * @returns {JSX.Element} Home page component
 */
const Home: React.FC = () => {
  const [latest, setLatest] = useState<Car[]>([]);
  const history = useHistory();

  /**
   * Loads the two most recent vehicles from the API
   */
  const loadLatestCars = async () => {
    try {
      const data = await getCars();
      setLatest(data.slice(0, 2)); 
    } catch (err) {
      console.error(err);
    }
  };

  useIonViewWillEnter(() => {
    loadLatestCars();
  });

  return (
    <IonPage id="main">
      <Header />
      <IonContent>
        {/* Hero Section */}
        <div style={{
          position: 'relative',
          height: '400px',
          backgroundImage: 'url("https://images.unsplash.com/photo-1503376780353-7e6692767b70")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          {/* Gradient Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(2px)'
          }} />
          
          {/* Content */}
          <div style={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            padding: '40px 20px',
            maxWidth: '600px'
          }}>
            <h1 style={{
              fontSize: '3rem',
              color: '#fff',
              marginBottom: '20px',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
              fontFamily: 'Righteous, sans-serif',
              letterSpacing: '1px',
              lineHeight: '1.2'
            }}>Manage Your Garage</h1>
            <p style={{
              fontSize: '1.2rem',
              color: 'rgba(255, 255, 255, 0.95)',
              marginBottom: '30px',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
              letterSpacing: '1px',
              fontWeight: '400',
              textAlign: 'center',
              justifyContent: 'center',
              display: 'block'
            }}>Track, add, and organize your vehicles</p>
            <IonButton 
              onClick={() => history.push('/inventory')}
              style={{
                '--background': 'rgba(255, 255, 255, 0.95)',
                '--color': '#000',
                fontSize: '1rem',
                fontWeight: '700',
                padding: '0 40px',
                height: '50px',
                borderRadius: '30px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                textTransform: 'none'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', height: '100%' }}>View Inventory</span>
            </IonButton>
          </div>
        </div>

        {/* Latest Cars Section */}
        <div style={{ padding: '40px 20px' }}>
          <h2 style={{ 
            textAlign: 'center',
            fontSize: '2rem',
            color: 'var(--text-strong)',
            marginBottom: '30px',
            fontFamily: 'Righteous, sans-serif'
          }}>Latest Cars</h2>
          {latest.length > 0 ? (
            <InventoryCards cars={latest} />
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '40px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
              }}>
                <p style={{ 
                  fontSize: '1.2rem', 
                  marginBottom: '24px',
                  color: 'var(--text)',
                  fontWeight: '500'
                }}>Noch keine Fahrzeuge vorhanden</p>
                <IonButton 
                  onClick={() => history.push('/add-car')}
                  style={{
                    '--background': 'rgba(255, 255, 255, 0.95)',
                    '--color': '#000',
                    fontSize: '1rem',
                    fontWeight: '700',
                    textTransform: 'none'
                  }}
                >
                  Erstes Fahrzeug hinzufügen
                </IonButton>
              </div>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
