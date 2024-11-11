import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MathKeyboard from "../../components/MathKeyboard/MathKeyboard";
import LoadingScreen from "../../components/LoadingScreen";
import {
  bolzanoMethod,
  bisectionMethod,
  newtonRaphsonMethod,
  secantMethod,
} from "../../utils/calculations";
import styles from "./styles.module.css";

const EquationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [functionInput, setFunctionInput] = useState("");
  const [intervalA, setIntervalA] = useState<number>(0);
  const [intervalB, setIntervalB] = useState<number>(0);
  const [initialGuess, setInitialGuess] = useState<number>(0);
  const [result, setResult] = useState<string | number | null>(null);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<string | null>(null);
  const mathFieldRef = useRef<HTMLElement | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(
    localStorage.getItem("selectedMethod") || null
  );
  const handleInputChange = (input: string | ((prev: string) => string)) => {
    if (typeof input === "string") {
      setFunctionInput((prev) => prev + input);
    } else {
      setFunctionInput(input);
    }
  };

  useEffect(() => {
    const storedMethod = localStorage.getItem("selectedCategory");
    console.log(storedMethod);
    setMethod(selectedMethod);
    setResult(null);
  }, []);

  const getMethodName = () => {
    switch (method) {
      case "Bolzano":
        return "Bolzano";
      case "Bissecção":
        return "Bissecção";
      case "Newton-Raphson":
        return "Newton-Raphson";
      case "Secante":
        return "Secante";
      default:
        return "Método desconhecido";
    }
  };

  const handleCalculate = () => {
    if (!method || !functionInput) {
      setResult("Por favor, insira uma função.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      let calculatedResult: string | number | null = null;
      console.log(method);
      try {
        if (method === "Bolzano") {
          calculatedResult = bolzanoMethod(functionInput, intervalA, intervalB);
        } else if (method === "bisection") {
          calculatedResult = bisectionMethod(
            functionInput,
            intervalA,
            intervalB
          );
        } else if (method === "newton") {
          calculatedResult = newtonRaphsonMethod(
            functionInput,
            "derivadaDaFuncaoAqui",
            initialGuess
          );
        } else if (method === "secant") {
          calculatedResult = secantMethod(functionInput, intervalA, intervalB);
        }
      } catch (error) {
        calculatedResult =
          "Erro ao processar a função. Verifique a entrada e tente novamente.";
      }

      setResult(calculatedResult);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (mathFieldRef.current) {
      mathFieldRef.current.addEventListener("input", (event) => {
        const target = event.target as HTMLInputElement;
        setFunctionInput(target.value);
      });
    }
  }, []);

  return (
    <div className={styles.container}>
      <h2>Resolução de Equações Linear</h2>
      <h3>Método escolhido: {getMethodName()}</h3>

      <input
        type="text"
        value={functionInput}
        onChange={(e) => setFunctionInput(e.target.value)}
        placeholder="Insira a função aqui"
      />
      <MathKeyboard onInput={handleInputChange} />

      {method === "newton" && (
        <input
          type="number"
          value={initialGuess}
          onChange={(e) => setInitialGuess(Number(e.target.value))}
          placeholder="Ponto inicial"
        />
      )}

      {(method === "bolzano" ||
        method === "bisection" ||
        method === "secant") && (
        <>
          <input
            type="number"
            value={intervalA}
            onChange={(e) => setIntervalA(Number(e.target.value))}
            placeholder="Intervalo A"
          />
          <input
            type="number"
            value={intervalB}
            onChange={(e) => setIntervalB(Number(e.target.value))}
            placeholder="Intervalo B"
          />
        </>
      )}

      <div className={styles.btns_submit}>
        <button onClick={handleCalculate}>Calcular</button>
        {loading ? (
          <LoadingScreen />
        ) : (
          result !== null && <div>Resultado: {result}</div>
        )}

        {/* Botão de voltar */}
        <button onClick={() => navigate(-1)}>Voltar</button>
      </div>
    </div>
  );
};

export default EquationsPage;
