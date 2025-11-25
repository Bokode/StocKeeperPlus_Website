import './createPopUp.css'
import { useState } from "react";

function CreatePopUp({ setShowCreatePopUp, columnsAdd, createInstanceFromDB }) {
  const filteredColumns = columnsAdd.filter(c => c !== "id");

  const initialForm = {};
  filteredColumns.forEach(c => initialForm[c] = "");

  const [formData, setFormData] = useState(initialForm);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="backgroundPopUp" onClick={() => setShowCreatePopUp(false)}>
      <div className="containerContentPopUp" onClick={(e) => e.stopPropagation()}>
        {filteredColumns.map(col => {
          const value = formData[col];
          const isBoolean = col == "isadmin";
          return (
            <div key={col} className="containerReadInstance">
              <p className="textReadInstance">{col} :</p>
              {isBoolean ? (
                <input type="checkbox" checked={value} onChange={(e) => handleChange(col, e.target.checked)}/>
              ) : (
                <input className="inputReadInstance" value={value} onChange={(e) => handleChange(col, e.target.value)}/>
              )}
            </div>
          );
        })}

        <div className="containerButtonPopUp">
          <button className="buttonPopUp" onClick={() => setShowCreatePopUp(false)}>Cancel</button>
          <button className="buttonPopUp" onClick={() => { createInstanceFromDB(formData); setShowCreatePopUp(false); }}>Create</button>
        </div>

      </div>
    </div>
  );
}

export default CreatePopUp;
