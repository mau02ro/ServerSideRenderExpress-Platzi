import React from "react";
import "../assets/components/Categories.scss";
const Categories = ({ children, text }) => {
  return (
    <div>
      <h3 className="categories__title">{text}</h3>
      {children}
    </div>
  );
};

export default Categories;
