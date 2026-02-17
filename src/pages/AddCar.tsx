/**
 * Add Car Page Component
 * 
 * Form page for adding new vehicles to the inventory.
 * Handles vehicle details, features, extras, and image uploads.
 */

import React, { useEffect, useState, useRef } from 'react';
import { IonPage, IonContent, useIonViewWillEnter } from '@ionic/react';
import Header from '../components/Header';
import { useHistory } from 'react-router-dom';
import { addCar, uploadImages } from '../services/carService';
import './AddCar.css';

/**
 * Add car form component with comprehensive vehicle data collection
 * @returns {JSX.Element} Add car form page
 */
const AddCar: React.FC = () => {
  const history = useHistory();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
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
  const [checkboxes, setCheckboxes] = useState<{ [key: string]: boolean }>({});

  // File handling
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleCheckboxChange = (label: string) => {
    setCheckboxes((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setSelectedFiles((prev) => [...prev, ...Array.from(files)]);
  };

  const handleRemoveFile = (idx: number) => {
    setSelectedFiles((files) => files.filter((_, i) => i !== idx));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => {
    previews.forEach(URL.revokeObjectURL);
    const newPreviews = selectedFiles.map((f) => URL.createObjectURL(f));
    setPreviews(newPreviews);
  }, [selectedFiles]);

  useEffect(() => {
    return () => previews.forEach(URL.revokeObjectURL);
  }, []);

  const ausstattung = [
    'ABS', 'Abstandswarner', 'Allradantrieb', 'Allwetterreifen', 'Android Auto', 
    'Apple CarPlay', 'Armlehne', 'Beheizbares Lenkrad', 'Bluetooth', 'Bordcomputer',
    'Elektr. Fensterheber', 'Freisprecheinrichtung', 'Head-Up Display', 'Isofix',
    'Navigationssystem', 'Sitzheizung', 'USB', 'WLAN / WiFi Hotspot',
  ];

  const extras = [
    'Abgedunkelte Scheiben', 'Klimaanlage', 'Klimaautomatik', 'Ledersitze', 
    'Metallic-Lackierung', 'Panoramadach', 'Parksensoren', 'Rückfahrkamera',
    'Schiebedach', 'Soundsystem', 'Sportfahrwerk', 'Xenon-Scheinwerfer',
  ];

  const handleSubmit = async () => {
    try {
      const payload = {
        marke, modell, baujahr: baujahr!, farbe, kilometer: kilometer!,
        unfallhistorie, preis: preis!, kraftstoffart, getriebe,
        au_hu: auHu, leistung: leistung!, gewicht: gewicht!,
        hubraum: hubraum!, vin, sonstigeMerkmale,
        ausstattung: Object.keys(checkboxes).filter(k => checkboxes[k] && ausstattung.includes(k)),
        extras: Object.keys(checkboxes).filter(k => checkboxes[k] && extras.includes(k)),
      };

      const created = await addCar(payload);
      if (selectedFiles.length) await uploadImages(created.id, selectedFiles);
      history.push('/inventory');
    } catch (err: any) {
      console.error(err);
      alert(`Fehler: ${err.message}`);
    }
  };

  return (
    <IonPage>
      <Header />
      <IonContent style={{ '--background': '#0a0e1a' }}>
        <div className="add-car-container">
          <div className="add-car-header">
            <h1>Neues Fahrzeug hinzufügen</h1>
            <p>Füllen Sie die Informationen zu Ihrem Fahrzeug aus</p>
          </div>

          {/* Grundinformationen */}
          <div className="form-section">
            <h2 className="section-title">Grundinformationen</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Marke *</label>
                <input type="text" value={marke} onChange={(e) => setMarke(e.target.value)} placeholder="z.B. BMW" />
              </div>
              <div className="form-group">
                <label>Modell *</label>
                <input type="text" value={modell} onChange={(e) => setModell(e.target.value)} placeholder="z.B. 3er" />
              </div>
              <div className="form-group">
                <label>Baujahr *</label>
                <input type="number" value={baujahr || ''} onChange={(e) => setBaujahr(Number(e.target.value))} placeholder="2020" />
              </div>
              <div className="form-group">
                <label>Farbe *</label>
                <input type="text" value={farbe} onChange={(e) => setFarbe(e.target.value)} placeholder="Schwarz" />
              </div>
              <div className="form-group">
                <label>Kilometerstand *</label>
                <input type="number" value={kilometer || ''} onChange={(e) => setKilometer(Number(e.target.value))} placeholder="50000" />
              </div>
              <div className="form-group">
                <label>Preis (€) *</label>
                <input type="number" value={preis || ''} onChange={(e) => setPreis(Number(e.target.value))} placeholder="25000" />
              </div>
            </div>
          </div>

          {/* Technische Daten */}
          <div className="form-section">
            <h2 className="section-title">Technische Daten</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Kraftstoff *</label>
                <select value={kraftstoffart} onChange={(e) => setKraftstoffart(e.target.value as any)}>
                  <option value="benzin">Benzin</option>
                  <option value="diesel">Diesel</option>
                </select>
              </div>
              <div className="form-group">
                <label>Getriebe *</label>
                <select value={getriebe} onChange={(e) => setGetriebe(e.target.value as any)}>
                  <option value="manuell">Manuell</option>
                  <option value="automatik">Automatik</option>
                </select>
              </div>
              <div className="form-group">
                <label>Leistung (PS) *</label>
                <input type="number" value={leistung || ''} onChange={(e) => setLeistung(Number(e.target.value))} placeholder="150" />
              </div>
              <div className="form-group">
                <label>Hubraum (L) *</label>
                <input type="number" step="0.1" value={hubraum || ''} onChange={(e) => setHubraum(Number(e.target.value))} placeholder="2.0" />
              </div>
              <div className="form-group">
                <label>Gewicht (kg) *</label>
                <input type="number" value={gewicht || ''} onChange={(e) => setGewicht(Number(e.target.value))} placeholder="1500" />
              </div>
              <div className="form-group">
                <label>Unfallhistorie *</label>
                <select value={unfallhistorie} onChange={(e) => setUnfallhistorie(e.target.value as any)}>
                  <option value="keine">Keine</option>
                  <option value="ja">Ja</option>
                </select>
              </div>
            </div>
          </div>

          {/* Weitere Details */}
          <div className="form-section">
            <h2 className="section-title">Weitere Details</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>AU/HU</label>
                <input type="date" value={auHu} onChange={(e) => setAuHu(e.target.value)} />
              </div>
              <div className="form-group">
                <label>VIN</label>
                <input type="text" value={vin} onChange={(e) => setVin(e.target.value)} placeholder="Fahrzeug-Identifikationsnummer" />
              </div>
            </div>
            <div className="form-group full-width">
              <label>Sonstige Merkmale</label>
              <textarea 
                value={sonstigeMerkmale} 
                onChange={(e) => setSonstigeMerkmale(e.target.value)} 
                placeholder="Weitere Details zum Fahrzeug..."
                rows={4}
              />
            </div>
          </div>

          {/* Ausstattung */}
          <div className="form-section">
            <h2 className="section-title">Ausstattung</h2>
            <div className="checkbox-grid">
              {ausstattung.map((item) => (
                <label key={item} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={checkboxes[item] || false}
                    onChange={() => handleCheckboxChange(item)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Extras */}
          <div className="form-section">
            <h2 className="section-title">Extras</h2>
            <div className="checkbox-grid">
              {extras.map((item) => (
                <label key={item} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={checkboxes[item] || false}
                    onChange={() => handleCheckboxChange(item)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Bilder Upload */}
          <div className="form-section">
            <h2 className="section-title">Fahrzeugbilder</h2>
            <div className="file-upload-area">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
              <button className="btn-upload" onClick={() => fileInputRef.current?.click()}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Bilder hinzufügen
              </button>
              
              {previews.length > 0 && (
                <div className="upload-grid" style={{ marginTop: '20px' }}>
                  {previews.map((url, i) => (
                    <div key={i} className="upload-cell">
                      <img src={url} alt={`Preview ${i + 1}`} className="upload-thumb" />
                      <button className="upload-remove" onClick={() => handleRemoveFile(i)}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button className="btn-cancel" onClick={() => history.push('/inventory')}>
              Abbrechen
            </button>
            <button className="btn-submit" onClick={handleSubmit}>
              Fahrzeug speichern
            </button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AddCar;
