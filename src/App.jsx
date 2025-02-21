import  {React, useState } from "react";
import Board from "./component/Board";
import "./styles.css";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className = "container">
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <button className = "togglebtn" onClick={() => setDarkMode(!darkMode)}>
        Toggle {darkMode ? "Light" : "Dark"} Mode
      </button>
      <Board />
    </div>
    </div>
  );
};

export default App;