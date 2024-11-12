// src/components/MathKeyboard.tsx
import React from "react";
import styles from "./styles.module.css";

type MathKeyboardProps = {
  onInput: (input: string | ((prev: string) => string)) => void;
};

const MathKeyboard: React.FC<MathKeyboardProps> = ({ onInput }) => {
  const handleButtonClick = (value: string) => {
    onInput(value);
  };

  const handleDelete = () => {
    onInput((prev) => prev.slice(0, -1));
  };

  return (
    <div className={styles.container}>
      <section className={styles.row}>
        <button onClick={() => handleButtonClick("x")}>x</button>
        <button onClick={() => handleButtonClick("y")}>y</button>
        <button onClick={() => handleButtonClick("+")}>+</button>
        <button onClick={() => handleButtonClick("-")}>−</button>
      </section>

      <section className={styles.row}>
        <button onClick={() => handleButtonClick("*")}>×</button>
        <button onClick={() => handleButtonClick("/")}>÷</button>
        <button onClick={() => handleButtonClick("^")}>^</button>
        <button onClick={() => handleButtonClick("^2")}>x²</button>
       
      </section>

      <section className={styles.row}>
        <button onClick={() => handleButtonClick("(")}>(</button>
        <button onClick={() => handleButtonClick(")")}>)</button>
        <button onClick={() => handleButtonClick("pi")}>π</button>
        <button onClick={() => handleButtonClick("e")}>e</button>
      </section>

      <section className={styles.row}>
        <button onClick={() => handleButtonClick("sqrt(")}>√</button>
        <button onClick={() => handleButtonClick("log(")}>log</button>
        <button onClick={() => handleButtonClick("ln(")}>ln</button>
        <button onClick={() => handleButtonClick("exp(")}>exp</button>
      </section>

      <section className={styles.row}>
        <button onClick={() => handleButtonClick("sin(")}>sin</button>
        <button onClick={() => handleButtonClick("cos(")}>cos</button>
        <button onClick={() => handleButtonClick("tan(")}>tan</button>
        <button onClick={handleDelete} style={deleteButtonStyle}>
          ⌫
        </button>
      </section>
    </div>
  );
};

const deleteButtonStyle: React.CSSProperties = {
  backgroundColor: "#ffcccc",
  color: "#ff0000",
  fontWeight: "bold",
};

export default MathKeyboard;
