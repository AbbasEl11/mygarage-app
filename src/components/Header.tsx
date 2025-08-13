import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonMenuButton
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Header: React.FC = () => {
  const history = useHistory();

  return (
    <IonHeader>
      <IonToolbar className="navbar-toolbar">
        <div className="navbar">
          {/* Left: burger (mobile) */}
          <div className="menu-button">
            <IonButtons>
              <IonMenuButton />
            </IonButtons>
          </div>

          {/* Center: logo/title */}
          <div className="logoNavbar">
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Logo" />
          </div>

          {/* Right: desktop nav buttons */}
          <div className="navbar-buttons">
            <IonButtons>
              <IonButton onClick={() => history.push('/home')}>Home</IonButton>
              <IonButton onClick={() => history.push('/inventory')}>Inventar</IonButton>
              <IonButton onClick={() => history.push('/add-car')}>Hinzufügen</IonButton>
            </IonButtons>
          </div>
        </div>
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
