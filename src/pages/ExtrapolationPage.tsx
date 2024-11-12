// src/pages/ExtrapolationPage.tsx
import React, { useState } from 'react';
import ResultDisplay from '../components/ResultDisplay';
import { extrapolationMethod } from '../utils/calculations';

const ExtrapolationPage: React.FC = () => {
  const [xValues, setXValues] = useState<string>('');
  const [yValues, setYValues] = useState<string>('');
  const [xExtrapolated, setXExtrapolated] = useState<string>('');
  const [result, setResult] = useState<number | string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleCalculate = () => {
    setLoading(true);
    setResult('');
    setTimeout(() => {
      try {
        const xVals = xValues.split(',').map(Number);
        const yVals = yValues.split(',').map(Number);
        const xExtra = parseFloat(xExtrapolated);

        if (xVals.length !== yVals.length) {
          setResult('Erro: x e y devem ter o mesmo número de valores.');
        } else {
          const res = extrapolationMethod(xVals, yVals, xExtra);
          setResult(res);
        }
      } catch (error) {
        setResult('Erro ao calcular');
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div>
      <h1>Extrapolação de Dados</h1>
      <p>Exemplo de cálculo de extrapolação utilizando Mínimos Quadrados.</p>

      <div>
        <label>Valores de X (separados por vírgula): </label>
        <input
          type="text"
          value={xValues}
          onChange={(e) => setXValues(e.target.value)}
          placeholder="Exemplo: 1, 2, 3"
        />
      </div>

      <div>
        <label>Valores de Y (separados por vírgula): </label>
        <input
          type="text"
          value={yValues}
          onChange={(e) => setYValues(e.target.value)}
          placeholder="Exemplo: 2, 4, 6"
        />
      </div>

      <div>
        <label>Valor de X para extrapolação: </label>
        <input
          type="text"
          value={xExtrapolated}
          onChange={(e) => setXExtrapolated(e.target.value)}
          placeholder="Exemplo: 4"
        />
      </div>

      <button onClick={handleCalculate}>Calcular</button>

      <ResultDisplay result={result} loading={loading} />
    </div>
  );
};

export default ExtrapolationPage;
