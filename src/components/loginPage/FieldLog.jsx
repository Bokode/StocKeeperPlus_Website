import { useState } from "react";
import "./loginPage.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function FieldLog({ type, placeholder, value, onChange, disabled }) {

  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === "password";
  const inputType = isPasswordField && showPassword ? "text" : type;

  return (
    <div className="field-log" style={{ position: 'relative' }}>
      <input
        className="inputField"
        type={inputType}
        placeholder=" "
        required
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      <label className="floatingLabel">{placeholder}</label>

      {isPasswordField && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="buttonPW"
        >
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
        </button>
      )}
    </div>
  );
}