// App.tsx
import storage from './storage';
storage.create();

import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
  IonHeader,
  IonMenu,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonButtons,
  IonMenuToggle,
  IonIcon
} from '@ionic/react';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import AddCar from './pages/AddCar';
import CarDetails from './pages/CarDetails';
import { closeOutline } from 'ionicons/icons';
import { IonReactHashRouter } from '@ionic/react-router';
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/palettes/dark.system.css';
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    {/* ✅ HashRouter statt IonReactRouter */}
<IonReactHashRouter basename="/mygarage-app">
      {/* Slide-in menu (mobile) */}
      <IonMenu contentId="main" side="end">
        <IonHeader>
          <IonToolbar>
            <IonTitle>MyGarage</IonTitle>
            <IonButtons slot="end">
              <IonMenuToggle>
                <IonButton>
                  <IonIcon icon={closeOutline} />
                </IonButton>
              </IonMenuToggle>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <IonList>
            <IonMenuToggle autoHide={true}>
              <IonItem routerLink="/home" routerDirection="root">
                <IonLabel>Home</IonLabel>
              </IonItem>
            </IonMenuToggle>
            <IonMenuToggle autoHide={true}>
              <IonItem routerLink="/inventory" routerDirection="root">
                <IonLabel>Inventory</IonLabel>
              </IonItem>
            </IonMenuToggle>
            <IonMenuToggle autoHide={true}>
              <IonItem routerLink="/add-car" routerDirection="root">
                <IonLabel>Add Car</IonLabel>
              </IonItem>
            </IonMenuToggle>
          </IonList>
        </IonContent>
      </IonMenu>

      <IonRouterOutlet id="main">
        <Route exact path="/home" component={Home} />
        <Route exact path="/inventory" component={Inventory} />
        <Route exact path="/add-car" component={AddCar} />
        <Route exact path="/car/:id" component={CarDetails} />
        <Redirect exact from="/" to="/home" />
      </IonRouterOutlet>
  </IonReactHashRouter>
  </IonApp>
);

export default App;
