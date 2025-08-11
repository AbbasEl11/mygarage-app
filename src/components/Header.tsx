import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Header: React.FC = () => {
  const history = useHistory();

  return (
    <IonHeader>
      <IonToolbar>
        <IonTitle>MyGarage</IonTitle>
        <IonButtons slot="end">
          <IonButton onClick={() => history.push('/home')}>Home</IonButton>
          <IonButton onClick={() => history.push('/inventory')}>Inventar</IonButton>
          <IonButton onClick={() => history.push('/add-car')}>Hinzufügen</IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
