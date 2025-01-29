import React from 'react';

const Card = ({ title, description, icon, image }) => {
  return (
    <div className="card">
      <div className="icon-container">{icon}</div> 
      <h3>{title}</h3>
      <p>{description}</p>
      {image && <img src={image} alt={title} />} 
    </div>
  );
};

export default Card;