// src/pages/SystemsPage.tsx
import React, { useState } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import { gaussianElimination, gaussJacobi, gaussSeidel } from '../utils/calculations';

const SystemsPage: React.FC = () => {
  const [method, setMethod] = useState<string | null>(null);
  const [matrix, setMatrix] = useState<number[][]>([[0, 0, 0, 0]]);
  const [result, setResult] = useState<string | number[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = () => {
    setLoading(true);
    setTimeout(() => {
      let calculatedResult;
      switch (method) {
        case 'gaussian':
          calculatedResult = gaussianElimination(matrix);
          break;
        case 'jacobi':
          calculatedResult = gaussJacobi(matrix);
          break;
        case 'seidel':
          calculatedResult = gaussSeidel(matrix);
          break;
        default:
          calculatedResult = 'Selecione um método';
      }
      setResult(calculatedResult);
      setLoading(false);
    }, 1000);
  };

  const handleInputChange = (row: number, col: number, value: string) => {
    const newMatrix = [...matrix];
    newMatrix[row][col] = parseFloat(value) || 0;
    setMatrix(newMatrix);
  };

  const addRow = () => setMatrix([...matrix, Array(matrix[0].length).fill(0)]);
  const addColumn = () => setMatrix(matrix.map(row => [...row, 0]));

  return (
    <div>
      <h2>Resolução de Sistemas Lineares</h2>
      <select onChange={(e) => setMethod(e.target.value)}>
        <option value="">Selecione um método</option>
        <option value="gaussian">Eliminação de Gauss</option>
        <option value="jacobi">Gauss-Jacobi</option>
        <option value="seidel">Gauss-Seidel</option>
      </select>
      
      <div>
        <button onClick={addRow}>Adicionar Linha</button>
        <button onClick={addColumn}>Adicionar Coluna</button>
      </div>
      
      {matrix.map((row, rowIndex) => (
        <div key={rowIndex}>
          {row.map((value, colIndex) => (
            <input
              key={colIndex}
              type="number"
              value={value}
              onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
            />
          ))}
        </div>
      ))}
      
      <button onClick={handleCalculate}>Calcular</button>
      {loading ? <LoadingScreen /> : result !== null && <div>Resultado: {Array.isArray(result) ? result.join(', ') : result}</div>}
    </div>
  );
};

export default SystemsPage;
