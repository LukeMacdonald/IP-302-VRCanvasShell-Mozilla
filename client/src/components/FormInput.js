import React from "react";

const FormInput = ({ label, name, id, type, value, onChange,placeholder,required }) => {
  return (
    <div className="form-group form-input-group"> 
      <input
        name={name}
        id={id}
        className="form-control form-input"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

export default FormInput;