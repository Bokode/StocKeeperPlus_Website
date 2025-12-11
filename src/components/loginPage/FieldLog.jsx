import "./loginPage.css";

export default function FieldLog({ type, placeholder, value, onChange, disabled }) {
  return (
    <div className="field-log">
      <input
        className="inputField"
        type={type}
        placeholder=" "
        required
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      <label className="floatingLabel">{placeholder}</label>
    </div>
  );
}
