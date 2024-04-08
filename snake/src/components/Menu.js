import React, { useEffect, useState } from "react";

const Menu = ({ onRouteChange }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("playerName");
    if (storedName) {
      setName(storedName);
    }
  }, []);

  const handleStart = () => {
    if (name !== "") {
      onRouteChange(name);
      localStorage.setItem("playerName", name);
    } else {
      alert("Please enter a name");
    }
  };

  return (
    <div className="wrapper">
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleStart}>Start</button>
    </div>
  );
};

export default Menu;
