// src/pages/InterpolationPage.tsx
import React, { useState } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import { lagrangeInterpolation, newtonGregoryInterpolation, inverseInterpolation } from '../utils/calculations';

const InterpolationPage: React.FC = () => {
  const [method, setMethod] = useState<string | null>(null);
  const [xValues, setXValues] = useState<string>('');
  const [yValues, setYValues] = useState<string>('');
  const [point, setPoint] = useState<string>('');
  const [result, setResult] = useState<number | string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = () => {
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      let calculatedResult;
      try {
        // Convertendo as entradas em arrays de números
        const xVals = xValues.split(',').map(Number);
        const yVals = yValues.split(',').map(Number);
        const interpPoint = parseFloat(point);

        // Verificando se a quantidade de valores de x e y corresponde
        if (xVals.length !== yVals.length) {
          calculatedResult = 'Erro: x e y devem ter o mesmo número de valores.';
        } else {
          // Chamando o método apropriado baseado na seleção do usuário
          switch (method) {
            case 'lagrange':
              calculatedResult = lagrangeInterpolation(xVals, yVals, interpPoint);
              break;
            case 'newtonGregory':
              calculatedResult = newtonGregoryInterpolation(xVals, yVals, interpPoint);
              break;
            case 'inverse':
              calculatedResult = inverseInterpolation(xVals, yVals, interpPoint);
              break;
            default:
              calculatedResult = 'Selecione um método';
          }
        }
      } catch (error) {
        calculatedResult = 'Erro ao calcular';
      }
      setResult(calculatedResult);
      setLoading(false);
    }, 1000);
  };

  return (
    <div>
      <h2>Interpolação</h2>
      <select onChange={(e) => setMethod(e.target.value)}>
        <option value="">Selecione um método</option>
        <option value="lagrange">Lagrange</option>
        <option value="newtonGregory">Newton-Gregory</option>
        <option value="inverse">Inversa</option>
      </select>
      
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
        <label>Ponto para interpolação: </label>
        <input
          type="text"
          value={point}
          onChange={(e) => setPoint(e.target.value)}
          placeholder="Exemplo: 2.5"
        />
      </div>

      <button onClick={handleCalculate}>Calcular</button>

      {loading ? <LoadingScreen /> : result !== null && <div>Resultado: {result}</div>}
    </div>
  );
};

export default InterpolationPage;
