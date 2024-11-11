import React from 'react';

interface ResultDisplayProps {
  result: string | number;
  loading: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, loading }) => {
  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h2>Resultado:</h2>
      <p>{result}</p>
    </div>
  );
};

export default ResultDisplay;
