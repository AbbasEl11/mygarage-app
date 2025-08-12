// src/pages/AddCar.tsx
import React, { useEffect, useState, useRef } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonCheckbox,
  IonButton,
  IonLabel,
  IonImg,
  IonAccordionGroup,
  IonAccordion,
} from '@ionic/react';
import Header from '../components/Header';
import { useHistory } from 'react-router-dom';
import { addCar, uploadImages } from '../services/carService';

const AddCar: React.FC = () => {
  const history = useHistory();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ----- Form state -----
  const [marke, setMarke] = useState('');
  const [modell, setModell] = useState('');
  const [baujahr, setBaujahr] = useState<number>();
  const [farbe, setFarbe] = useState('');
  const [kilometer, setKilometer] = useState<number>();
  const [unfallhistorie, setUnfallhistorie] = useState<'keine' | 'ja'>('keine');
  const [preis, setPreis] = useState<number>();
  const [kraftstoffart, setKraftstoffart] = useState<'benzin' | 'diesel'>('benzin');
  const [getriebe, setGetriebe] = useState<'manuell' | 'automatik'>('manuell');
  const [auHu, setAuHu] = useState('');
  const [leistung, setLeistung] = useState<number>();
  const [gewicht, setGewicht] = useState<number>();
  const [hubraum, setHubraum] = useState<number>();
  const [vin, setVin] = useState('');
  const [sonstigeMerkmale, setSonstigeMerkmale] = useState('');

  // ----- Feature/extra checkboxes state -----
  const [checkboxes, setCheckboxes] = useState<{ [key: string]: boolean }>({});

  /** Toggle a checkbox by its label key (keeps a flat, serializable map). */
  const handleCheckboxChange = (label: string) => {
    setCheckboxes((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  // ----- File selection + previews -----
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  /** Append newly chosen files, preserving already selected ones. */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setSelectedFiles((prev) => [...prev, ...Array.from(files)]);
  };

  /** Remove a file by index and reset file input (allows re-selecting the same file). */
  const handleRemoveFile = (idx: number) => {
    setSelectedFiles((files) => files.filter((_, i) => i !== idx));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /** Create object URLs for quick client-side previews; revoke previous ones first. */
  useEffect(() => {
    previews.forEach(URL.revokeObjectURL);
    const newPreviews = selectedFiles.map((f) => URL.createObjectURL(f));
    setPreviews(newPreviews);
  }, [selectedFiles]); // eslint-disable-line react-hooks/exhaustive-deps (intentional: only track selectedFiles)

  /** Revoke object URLs on unmount to avoid memory leaks. */
  useEffect(() => {
    return () => previews.forEach(URL.revokeObjectURL);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ----- Options -----
  const ausstattung = [
    'Abgedunkelte Scheiben',
    'ABS',
    'Abstandswarner',
    'Adaptives Fahrwerk',
    'Adaptives Kurvenlicht',
    'Allradantrieb',
    'Allwetterreifen',
    'Beheizbare Frontscheibe',
    'Berganfahrassistent',
    'Bi-Xenon Scheinwerfer',
    'Blendfreies Fernlicht',
    'Dachreling',
    'Elektr. Heckklappe',
    'Elektr. Wegfahrsperre',
    'ESP',
    'Faltdach',
    'Fernlichtassistent',
    'Geschwindigkeitsbegrenzungsanlage',
    'Kurvenlicht',
    'Laserlicht',
    'LED-Scheinwerfer',
    'LED-Tagfahrlicht',
    'Leichtmetallfelgen',
    'Lichtsensor',
    'Luftfederung',
    'Nachtsichtassistent',
    'Nebelscheinwerfer',
    'Notbremsassistent',
    'Notrad',
    'Pannenkit',
    'Panoramadach',
    'Regensensor',
    'Reifendruckkontrolle',
    'Reserverad',
    'Scheibenwischerautomatik',
    'Schiebedach',
    'Keyless',
    'Servolenkung',
    'Sommerreifen',
    'Sportfahrwerk',
    'Sportpaket',
    'Spurhalteassistent',
    'Stahlfelgen',
    'Start/Stopp-Automatik',
    'Tagfahrlicht',
    'Totwinkelassistent',
    'Traktionskontrolle',
    'Verkehrszeichenerkennung',
    'Winterreifen',
    'Xenonscheinwerfer',
    'Zentralverriegelung',
  ];

  const extras = [
    'Alarmanlage',
    'Ambiente-Beleuchtung',
    'Android Auto',
    'Apple CarPlay',
    'Armlehne',
    'Beheizbares Lenkrad',
    'Behindertengerecht',
    'Bluetooth',
    'Bordcomputer',
    'CD-Spieler',
    'Elektr. Fensterheber',
    'Elektr. Seitenspiegel',
    'Freisprecheinrichtung',
    'Head-Up Display',
    'Isofix',
    'Lordosenstütze',
    'Mikrofon',
    'Musiksystem integriert',
    'Navigationssystem',
    'Radio DAB',
    'Rechenzähler anzeigen',
    'Sitzheizung',
    'Sitzverstellung',
    'Ski Sack',
    'Sportpaket',
    'TCS',
    'TV',
    'USB',
    'Volkswagen Kombination',
    'WLAN / WiFi Hotspot',
    'Zentrale Verriegelung',
  ];

  /** Submit the form: create car, then (optionally) upload selected images. */
  const handleSubmit = async () => {
    try {
      const payload = {
        marke,
        modell,
        baujahr: baujahr!,
        farbe,
        kilometer: kilometer!,
        unfallhistorie,
        preis: preis!,
        kraftstoffart,
        getriebe,
        au_hu: auHu,
        leistung: leistung!,
        gewicht: gewicht!,
        hubraum: hubraum!,
        vin,
        ausstattung: Object.keys(checkboxes).filter(
          (k) => checkboxes[k] && ausstattung.includes(k),
        ),
        extras: Object.keys(checkboxes).filter((k) => checkboxes[k] && extras.includes(k)),
        sonstigeMerkmale,
      };

      const created = await addCar(payload);

      if (selectedFiles.length) {
        await uploadImages(created.id, selectedFiles);
      }

      history.push('/inventory');
    } catch (err: any) {
      console.error(err);
      alert(`Fehler beim Speichern: ${err.message}`);
    }
  };

  return (
    <IonPage>
      <Header />
      <IonContent className="ion-padding">
        {/* Vehicle information */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Fahrzeug-Informationen</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol  size="12" sizeMd="6">
                  <IonItem>
                    <IonInput
                      label="Marke"
                      labelPlacement="floating"
                      value={marke}
                      onIonChange={(e) => setMarke(e.detail.value!)}
                    />
                  </IonItem>
                  <IonItem>
                    <IonInput
                      label="Modell"
                      labelPlacement="floating"
                      value={modell}
                      onIonChange={(e) => setModell(e.detail.value!)}
                    />
                  </IonItem>
                  <IonItem>
                    <IonInput
                      label="Baujahr"
                      labelPlacement="floating"
                      type="number"
                      value={baujahr?.toString()}
                      onIonChange={(e) => setBaujahr(Number(e.detail.value))}
                    />
                  </IonItem>
                  <IonItem>
                    <IonInput
                      label="Farbe"
                      labelPlacement="floating"
                      value={farbe}
                      onIonChange={(e) => setFarbe(e.detail.value!)}
                    />
                  </IonItem>
                  <IonItem>
                    <IonInput
                      label="Kilometerstand"
                      labelPlacement="floating"
                      type="number"
                      value={kilometer?.toString()}
                      onIonChange={(e) => setKilometer(Number(e.detail.value))}
                    />
                  </IonItem>
                  <IonItem>
                    <IonSelect
                      label="Unfallhistorie"
                      labelPlacement="floating"
                      value={unfallhistorie}
                      onIonChange={(e) => setUnfallhistorie(e.detail.value)}
                    >
                      <IonSelectOption value="keine">Keine</IonSelectOption>
                      <IonSelectOption value="ja">Ja</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                  <IonItem>
                    <IonInput
                      label="Preis"
                      labelPlacement="floating"
                      type="number"
                      value={preis?.toString()}
                      onIonChange={(e) => setPreis(Number(e.detail.value))}
                    />
                  </IonItem>
                </IonCol>

                <IonCol size="12" sizeMd="6">
                  <IonItem>
                    <IonSelect
                      label="Kraftstoff"
                      labelPlacement="floating"
                      value={kraftstoffart}
                      onIonChange={(e) => setKraftstoffart(e.detail.value)}
                    >
                      <IonSelectOption value="benzin">Benzin</IonSelectOption>
                      <IonSelectOption value="diesel">Diesel</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                  <IonItem>
                    <IonSelect
                      label="Getriebe"
                      labelPlacement="floating"
                      value={getriebe}
                      onIonChange={(e) => setGetriebe(e.detail.value)}
                    >
                      <IonSelectOption value="manuell">Manuell</IonSelectOption>
                      <IonSelectOption value="automatik">Automatik</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                  <IonItem>
                    <IonInput
                      label="AU/HU"
                      labelPlacement="stacked"
                      type="date"
                      value={auHu}
                      onIonChange={(e) => setAuHu(e.detail.value!)}
                    />
                  </IonItem>
                  <IonItem>
                    <IonInput
                      label="Leistung (PS)"
                      labelPlacement="floating"
                      type="number"
                      value={leistung?.toString()}
                      onIonChange={(e) => setLeistung(Number(e.detail.value))}
                    />
                  </IonItem>
                  <IonItem>
                    <IonInput
                      label="Gewicht (kg)"
                      labelPlacement="floating"
                      type="number"
                      value={gewicht?.toString()}
                      onIonChange={(e) => setGewicht(Number(e.detail.value))}
                    />
                  </IonItem>
                  <IonItem>
                    <IonInput
                      label="Hubraum (L)"
                      labelPlacement="floating"
                      type="number"
                      value={hubraum?.toString()}
                      onIonChange={(e) => setHubraum(Number(e.detail.value))}
                    />
                  </IonItem>
                  <IonItem>
                    <IonInput
                      label="VIN"
                      labelPlacement="floating"
                      value={vin}
                      onIonChange={(e) => setVin(e.detail.value!)}
                    />
                  </IonItem>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

{/* Ausstattung */}
<IonCard>
  <IonCardHeader><IonCardTitle>Ausstattung</IonCardTitle></IonCardHeader>
  <IonCardContent>
    <IonAccordionGroup>
      <IonAccordion value="ausstattung-acc">
        <IonItem slot="header">
          <IonLabel>Show/Hide</IonLabel>
        </IonItem>
        <div slot="content">
          <IonGrid>
            {Array.from({ length: Math.ceil(ausstattung.length / 4) }, (_, r) => (
              <IonRow key={r}>
                {ausstattung.slice(r * 4, r * 4 + 4).map((f) => (
                  <IonCol size="12" sizeSm="6" sizeMd="4" sizeLg="3" key={f}>
                    <IonItem lines="none">
                      <IonCheckbox
                        checked={checkboxes[f] || false}
                        onIonChange={() => handleCheckboxChange(f)}
                        slot="start"
                      />
                      <IonLabel>{f}</IonLabel>
                    </IonItem>
                  </IonCol>
                ))}
              </IonRow>
            ))}
          </IonGrid>
        </div>
      </IonAccordion>
    </IonAccordionGroup>
  </IonCardContent>
</IonCard>

{/* Extras */}
<IonCard>
  <IonCardHeader><IonCardTitle>Extras</IonCardTitle></IonCardHeader>
  <IonCardContent>
    <IonAccordionGroup>
      <IonAccordion value="extras-acc">
        <IonItem slot="header">
          <IonLabel>Show/Hide</IonLabel>
        </IonItem>
        <div slot="content">
          <IonGrid>
            {Array.from({ length: Math.ceil(extras.length / 4) }, (_, r) => (
              <IonRow key={r}>
                {extras.slice(r * 4, r * 4 + 4).map((f) => (
                  <IonCol size="12" sizeSm="6" sizeMd="4" sizeLg="3" key={f}>
                    <IonItem lines="none">
                      <IonCheckbox
                        checked={checkboxes[f] || false}
                        onIonChange={() => handleCheckboxChange(f)}
                        slot="start"
                      />
                      <IonLabel>{f}</IonLabel>
                    </IonItem>
                  </IonCol>
                ))}
              </IonRow>
            ))}
          </IonGrid>
        </div>
      </IonAccordion>
    </IonAccordionGroup>
  </IonCardContent>
</IonCard>


        {/* Additional notes */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Sonstige Merkmale</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonTextarea
                value={sonstigeMerkmale}
                onIonChange={(e) => setSonstigeMerkmale(e.detail.value!)}
                placeholder="Zusätzliche Merkmale"
                style={{ height: '100px' }}
              />
            </IonItem>
          </IonCardContent>
        </IonCard>

        {/* Image upload */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Datei-Upload</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem lines="none">
              <IonButton expand="block" onClick={() => fileInputRef.current?.click()}>
                Bild hinzufügen
              </IonButton>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </IonItem>

{previews.length > 0 && (
  <div className="upload-grid">
    {previews.map((url, i) => (
      <div key={i} className="upload-cell">
        <IonImg src={url} className="upload-thumb" />
        <button className="upload-remove" onClick={() => handleRemoveFile(i)}>×</button>
      </div>
    ))}
  </div>
)}

          </IonCardContent>
        </IonCard>

        <IonButton expand="block" color="primary" onClick={handleSubmit}>
          Auto speichern
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default AddCar;
