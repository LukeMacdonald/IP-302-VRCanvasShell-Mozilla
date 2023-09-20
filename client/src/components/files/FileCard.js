import React from 'react';
import '../../styles/components.css';

function FileCard(props) {
  const { file, onSelect, isSelected } = props;

  const handleSelect = () => {
    onSelect(file);
  };

  // Define a CSS class based on whether the card is selected
  const cardClassName = `card file-card ${isSelected ? 'selected' : ''}`;

  return (
    <div className={cardClassName} onClick={handleSelect}>
      <div className="row">
        <div className="col">
          <div className="card-body">
            <p className="card-text file-card-text">{file.display_name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileCard;