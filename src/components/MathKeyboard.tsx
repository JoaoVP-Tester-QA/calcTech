// src/components/MathKeyboard.tsx
import React from 'react';

type MathKeyboardProps = {
  onInput: (input: string) => void;
};

const MathKeyboard: React.FC<MathKeyboardProps> = ({ onInput }) => {
  const handleButtonClick = (value: string) => {
    onInput(value);
  };

  const handleDelete = () => {
    onInput("DELETE"); // Sinal para o componente pai remover o último caractere
  };

  return (
    <div style={keyboardContainerStyle}>
      <div style={buttonRowStyle}>
        <button onClick={() => handleButtonClick('x')}>x</button>
        <button onClick={() => handleButtonClick('y')}>y</button>
        <button onClick={() => handleButtonClick('+')}>+</button>
        <button onClick={() => handleButtonClick('-')}>−</button>
      </div>

      <div style={buttonRowStyle}>
        <button onClick={() => handleButtonClick('*')}>×</button>
        <button onClick={() => handleButtonClick('/')}>÷</button>
        <button onClick={() => handleButtonClick('^')}>^</button>
        <button onClick={() => handleButtonClick('(')}>(</button>
      </div>

      <div style={buttonRowStyle}>
        <button onClick={() => handleButtonClick(')')}>)</button>
        <button onClick={() => handleButtonClick('pi')}>π</button>
        <button onClick={() => handleButtonClick('e')}>e</button>
        <button onClick={handleDelete} style={deleteButtonStyle}>⌫</button>
      </div>

      <div style={buttonRowStyle}>
        <button onClick={() => handleButtonClick('sqrt(')}>√</button>
        <button onClick={() => handleButtonClick('log(')}>log</button>
        <button onClick={() => handleButtonClick('ln(')}>ln</button>
        <button onClick={() => handleButtonClick('exp(')}>exp</button>
      </div>

      <div style={buttonRowStyle}>
        <button onClick={() => handleButtonClick('sin(')}>sin</button>
        <button onClick={() => handleButtonClick('cos(')}>cos</button>
        <button onClick={() => handleButtonClick('tan(')}>tan</button>
        <button onClick={() => handleButtonClick('^2')}>x²</button>
      </div>
    </div>
  );
};

const keyboardContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  maxWidth: '300px',
  margin: '0 auto',
  padding: '15px',
  borderRadius: '10px',
  backgroundColor: '#f0f0f0',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
};

const buttonRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '10px',
};

const deleteButtonStyle: React.CSSProperties = {
  backgroundColor: '#ffcccc',
  color: '#ff0000',
  fontWeight: 'bold',
};

export default MathKeyboard;
