import React from 'react';
import '../css/Card.css';

const Card = ({ title, description, icon, buttonText }) => {
  return (
    <div className="channel-card">
      <div className="icon-box">
        <img
          src={icon}
          alt={`${title} Icon`}
          className="channel-icon"
        />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <button className="channel-button">{buttonText}</button>
    </div>
  );
};

export default Card;
