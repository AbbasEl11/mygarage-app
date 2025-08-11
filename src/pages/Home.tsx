import { IonPage, IonContent } from '@ionic/react';
import Header from '../components/Header';

const Home: React.FC = () => {
  return (
    <IonPage>
      <Header />
      <IonContent className="ion-padding">
        <h2>Willkommen bei MyGarage!</h2>
        <p>Verwalte deine Fahrzeuge einfach und effizient.</p>
      </IonContent>
    </IonPage>
  );
};

export default Home;
