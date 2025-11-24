import './updatePopUp.css'
import { useState } from 'react';

function UpdatePopUp({ setShowUpdatePopUp, instanceAction, dataLabel, updateInstanceFromDB }) {
  const lockedFields = ["mail", "id", "recipe", "food", "store", "user_mail"];
  
  const [formData, setFormData] = useState(() => {
    const initialData = {};
    dataLabel.forEach(key => initialData[key] = instanceAction[key]);
    return initialData;
  });

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className='backgroundPopUp' onClick={() => setShowUpdatePopUp(false)}>
      <div className='containerContentPopUp' onClick={(e) => e.stopPropagation()}>
          {dataLabel.map((key) => {
            let value = formData[key];

            if (typeof value === "boolean") value = value ? "Oui" : "Non";
            if (key === "expirationdate") value = value.slice(0, 10);

            return (
            <div key={key} className='containerReadInstance'>
              <p className='textReadInstance'>{key.charAt(0).toUpperCase() + key.slice(1)} : </p>
              <input className={`inputReadInstance ${lockedFields.includes(key) ? "inputDisabled" : ""}`} placeholder={value} disabled={lockedFields.includes(key)} onChange={(e) => handleChange(key, e.target.value)}></input>
            </div>
          )})}
          <div className='containerButtonPopUp'>
              <button className='buttonPopUp' onClick={() => setShowUpdatePopUp(false)}>Cancel</button>
              <button className='buttonPopUp' onClick={() => {updateInstanceFromDB(formData); setShowUpdatePopUp(false);}}>Update</button>
          </div>
      </div>
    </div>
  )
}

export default UpdatePopUp;