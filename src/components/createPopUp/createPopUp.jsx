import './createPopUp.css'
import { useState } from "react";

function CreatePopUp({ setShowCreatePopUp, columnsAdd, createInstanceFromDB }) {

  const initialForm = {};
  columnsAdd.forEach(c => initialForm[c] = "");

  const [formData, setFormData] = useState(initialForm);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="backgroundPopUp" onClick={() => setShowCreatePopUp(false)}>
      <div className="containerContentPopUp" onClick={(e) => e.stopPropagation()}>
        
        {columnsAdd.map(col => (
          <div key={col} className="containerReadInstance">
            <p className="textReadInstance">{col} :</p>
            <input 
              className="inputReadInstance"
              onChange={(e) => handleChange(col, e.target.value)}
            />
          </div>
        ))}

        <div className="containerButtonPopUp">
          <button className="buttonPopUp" onClick={() => setShowCreatePopUp(false)}>Cancel</button>
          <button className="buttonPopUp" onClick={() => { createInstanceFromDB(formData); setShowCreatePopUp(false); }}>Create</button>
        </div>

      </div>
    </div>
  );
}

export default CreatePopUp;