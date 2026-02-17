/**
 * Header Component
 * 
 * Main navigation header with logo and primary navigation buttons.
 * Provides consistent navigation across all pages of the application.
 */

import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

/**
 * Global navigation header component
 * @returns {JSX.Element} Header with logo and navigation buttons
 */
const Header: React.FC = () => {
  const history = useHistory();

  return (
    <IonHeader>
      <IonToolbar className="navbar-toolbar" style={{
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        padding: '8px 20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Logo/Brand */}
          <div onClick={() => history.push('/home')} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer'
          }}>
            <img 
              src={`${import.meta.env.BASE_URL}logo.png`} 
              alt="MyGarage" 
              style={{
                height: '40px',
                width: 'auto',
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))'
              }}
            />
            <span style={{
              fontSize: '1.4rem',
              fontWeight: '700',
              color: '#fff',
              fontFamily: 'Righteous, sans-serif',
              textShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}>MyGarage</span>
          </div>

          {/* Navigation Links */}
          <IonButtons style={{ gap: '8px' }}>
            <IonButton 
              onClick={() => history.push('/home')}
              style={{
                '--color': '#fff',
                fontWeight: '600',
                fontSize: '0.95rem',
                textTransform: 'none'
              }}
            >
              Home
            </IonButton>
            <IonButton 
              onClick={() => history.push('/inventory')}
              style={{
                '--color': '#fff',
                fontWeight: '600',
                fontSize: '0.95rem',
                textTransform: 'none'
              }}
            >
              Inventar
            </IonButton>
            <IonButton 
              onClick={() => history.push('/add-car')}
              style={{
                '--background': 'rgba(255, 255, 255, 0.2)',
                '--background-hover': 'rgba(255, 255, 255, 0.3)',
                '--color': '#fff',
                fontWeight: '700',
                fontSize: '0.95rem',
                textTransform: 'none',
                borderRadius: '20px'
              }}
            >
              + Neu
            </IonButton>
          </IonButtons>
        </div>
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
