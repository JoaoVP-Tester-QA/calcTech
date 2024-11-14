import React from 'react';
import Style from './ResultDisplay.module.css';

interface ResultDisplayProps {
  result: string | number;
  loading: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, loading }) => {
  if (loading) {
    return <div className={Style.loadingText}>Carregando...</div>;
  }

  return (
    <div className={Style.resultContainer}>
      <h2>Resultado:</h2>
      <p>{result}</p>
    </div>
  );
};

export default ResultDisplay;
