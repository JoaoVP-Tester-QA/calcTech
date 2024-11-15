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
        <button onClick={() => handleButtonClick("+")}>+</button>
        <button onClick={() => handleButtonClick("-")}>−</button>
        <button onClick={() => handleButtonClick("*")}>×</button>
      </section>

      <section className={styles.row}>
        <button onClick={() => handleButtonClick("/")}>÷</button>
        <button onClick={() => handleButtonClick("^")}>^</button>
        <button onClick={() => handleButtonClick("(")}>(</button>
        <button onClick={() => handleButtonClick(")")}>)</button>
      </section>

      <section className={styles.row}>
        <button onClick={() => handleButtonClick("pi")}>π</button>
        <button onClick={() => handleButtonClick("e")}>e</button>
        <button onClick={() => handleButtonClick("log(")}>log</button>
        <button onClick={() => handleButtonClick("sqrt(")}>√</button>
      </section>

      <section className={styles.row}>
        <button onClick={() => handleButtonClick("exp(")}>exp</button>
        <button onClick={() => handleButtonClick("sin(")}>sin</button>
        <button onClick={() => handleButtonClick("cos(")}>cos</button>
        <button onClick={() => handleButtonClick("tan(")}>tan</button>
      </section>

      <section>
        <button onClick={handleDelete} className={styles.deleteButtonStyle}>
          ⌫
        </button>
      </section>
    </div>
  );
};

export default MathKeyboard;
