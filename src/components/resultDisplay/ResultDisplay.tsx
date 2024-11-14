// ResultDisplay.tsx
import React from "react";

interface ResultDisplayProps {
    result: string | number | number[]; // Permite string, number ou array de números
    loading: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, loading }) => {
    if (loading) return <p>Calculando...</p>;

    // Verifica se o resultado é um array e exibe cada valor separadamente
    if (Array.isArray(result)) {
        return (
            <div>
                <h3>Resultado:</h3>
                <ul>
                    {result.map((value, index) => (
                        <li key={index}>x{index + 1} = {value}</li>
                    ))}
                </ul>
            </div>
        );
    }

    // Exibe resultado para string ou número
    return (
        <div>
            <h3>Resultado:</h3>
            <p>{result}</p>
        </div>
    );
};

export default ResultDisplay;
