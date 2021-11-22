
import React from "react";
import "./loader.css";

export default function Loader() {
  return (
    <div className="loader">
      <img src={`${process.env.PUBLIC_URL}/loader.svg`} alt="" />
    </div>
  );
}