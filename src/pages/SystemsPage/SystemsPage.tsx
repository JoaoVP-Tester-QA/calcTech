import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MathKeyboard from "../../components/MathKeyboard/MathKeyboard";
import LoadingScreen from "../../components/LoadingScreen";
import ResultDisplay from "../../components/resultDisplay/ResultDisplay";
import {
  gaussianElimination,
  gaussJacobi,
  gaussSeidel,
} from "../../utils/calculations";
import styles from "./styles.module.css";
import { row } from "mathjs";

const EquationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<string[]>([""]);
  const [result, setResult] = useState<string | number | number[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(
    localStorage.getItem("selectedMethod") || null
  );

  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleInputChange = (
    input: string | ((prev: string) => string),
    index: number
  ) => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      if (typeof input === "string") {
        updatedRows[index] = input; // Quando o valor é uma string, substitui o valor
      } else {
        updatedRows[index] = input(prevRows[index]); // Quando é uma função, aplica à string atual
      }
      return updatedRows;
    });
  };

  const handleAddRow = () => {
    setRows((prevRows) => [...prevRows, ""]);
  };

  const handleRemoveRow = (index: number) => {
    setRows((prevRows) => prevRows.filter((_, i) => i !== index));
  };

  useEffect(() => {
    console.log(selectedMethod);
    setMethod(selectedMethod);
    setResult(null);
  }, []);

  const getMethodName = () => {
    switch (method) {
      case "Eliminação Gaussiana":
        return "Eliminação de Gauss";
      case "Gauss-Jacobi":
        return "Gauss-Jacobi";
      case "Gauss-Seidel":
        return "Gauss-Seidel";
      default:
        return "Método desconhecido";
    }
  };

  const handleCalculate = () => {
    if (!method || rows.some((row) => row.trim() === "")) {
      alert("Por favor, insira todas as equações do sistema :)");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      let calculatedResult: string | number | number[] | null = null;
      try {
        if (method === "Eliminação de Gauss") {
          calculatedResult = gaussianElimination(rows);
        } else if (method === "Gauss-Jacobi") {
          calculatedResult = gaussJacobi(rows);
        } else if (method === "Gauss-Seidel") {
          calculatedResult = gaussSeidel(rows);
        }
      } catch (error) {
        calculatedResult =
          "Erro ao processar as equações. Verifique a entrada e tente novamente.";
      }

      setResult(calculatedResult);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <h2>Resolução de Sistemas Lineares</h2>
      <h3>Método escolhido: {getMethodName()}</h3>

      {rows.map((row, index) => (
        <section key={index} className={styles.row}>
          <div className={styles.input_data}>
            <input
              ref={(el) => (inputRefs.current[`functionInput${index}`] = el)}
              type="text"
              value={row}
              onChange={(e) => handleInputChange(e.target.value, index)}
              placeholder={`Equação ${index + 1}`}
            />
            <div className={styles.buttonGroup}>
              {index === 0 && (
                <button className={styles.addButton} onClick={handleAddRow}>
                  +
                </button>
              )}
              {rows.length > 1 && index >= 1 && (
                <button
                  className={styles.removeButton}
                  onClick={() => handleRemoveRow(index)}
                >
                  -
                </button>
              )}
            </div>
          </div>
        </section>
      ))}
      <MathKeyboard
        onInput={(input) => handleInputChange(input, rows.length - 1)}
      />
      <div className={styles.actionsContainer}>
        <div className={styles.resultArea}>
          {loading ? (
            <LoadingScreen />
          ) : (
            <ResultDisplay result={result || ""} loading={loading} />
          )}
        </div>

        <div className={styles.feedbackBtns}>
          <button className={styles.calculateButton} onClick={handleCalculate}>
            Calcular
          </button>
          <button className={styles.backButton} onClick={() => navigate(-1)}>
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquationsPage;
