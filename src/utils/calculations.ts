import { create, all } from "mathjs";

const math = create(all, {});

//[Resolução de Equações Lineares]

// BOLZANO MODE
export const bolzanoMethod = (
    func: string,
    tolerance: number = 0.0001,
    maxIterations: number = 1000
): number | string => {
    try {
        const f = math.parse(func).compile();

        let a = -10;
        let b = 10;
        let iterations = 0;
        let c: number | undefined;

        while (f.evaluate({ x: a }) * f.evaluate({ x: b }) >= 0) {
            a -= 10;
            b += 10;
            iterations++;

            if (iterations > maxIterations) {
                return "Could not find a valid interval";
            }
        }

        while (Math.abs(b - a) > tolerance) {
            c = (a + b) / 2;
            const fc = f.evaluate({ x: c });

            if (fc === 0) {
                return c;
            } else if (f.evaluate({ x: a }) * fc < 0) {
                b = c;
            } else {
                a = c;
            }

            iterations++;

            if (iterations > maxIterations) {
                return "Max iterations reached without finding the root";
            }
        }

        if (c !== undefined) {
            const roundedC = Math.round(c / tolerance) * tolerance;
            if (Math.abs(c - roundedC) < tolerance) {
                return roundedC;
            }
            return c;
        } else {
            return "Error: Unable to calculate root.";
        }
    } catch (error) {
        return "Function error: Please check the input.";
    }
};

// Método de Bissecção
export const bisectionMethod = (
    func: string,
    tolerance: number = 0.0001,
    maxIterations: number = 1000
): number | string => {
    try {
        const f = math.parse(func).compile();

        let a = -10;
        let b = 10;
        let iterations = 0;

        while (f.evaluate({ x: a }) * f.evaluate({ x: b }) >= 0) {
            a -= 10;
            b += 10;
            iterations++;

            if (iterations > maxIterations) {
                return "Could not find a valid interval";
            }
        }

        let fa = f.evaluate({ x: a });
        let fb = f.evaluate({ x: b });

        let c = a;
        while (Math.abs(b - a) > tolerance) {
            c = (a + b) / 2;
            const fc = f.evaluate({ x: c });

            if (fc === 0) return c;
            else if (fa * fc < 0) b = c;
            else a = c;
        }

        if (c !== undefined) {
            const roundedC = Math.round(c / tolerance) * tolerance;
            if (Math.abs(c - roundedC) < tolerance) {
                return roundedC;
            }
            return c;
        } else {
            return "Error: Unable to calculate root.";
        }
    } catch (error) {
        return "Erro na função";
    }
};

// Método de Newton-Raphson
export const newtonRaphsonMethod = (
    func: string,
    initialGuess: number = 1,
    tolerance: number = 0.0001,
    maxIterations: number = 100
): number | string => {
    try {
        const derivative = math.derivative(func, 'x').toString();
        const scope = { x: 0 };
        func = func.replace(/\be\b/g, `${Math.E}`).replace(/\bpi\b/gi, `${Math.PI}`);
        const f = math.parse(func).compile();
        const fPrime = math.parse(derivative).compile();
        
        let x = initialGuess;
        let iteration = 0;

        while (iteration < maxIterations) {
            const fx = f.evaluate({ x });
            const fxPrime = fPrime.evaluate({ x });

            if (Math.abs(fx) < tolerance) break;

            if (Math.abs(fxPrime) < tolerance) {
                return "Derivada muito próxima de zero, não é possível continuar.";
            }

            x = x - fx / fxPrime;
            iteration++;

            if (Math.abs(fx) < tolerance) break;
        }

        return x;
    } catch (error) {
        console.error("Erro ao processar a função ou derivada:", error);
        return "Erro na função ou derivada. Verifique a entrada.";
    }
};

// Método da Secante
export const secantMethod = (
    func: string,
    a: number = -10,
    b: number = 10,
    tolerance: number = 0.0001,
    maxIterations: number = 100
): number | string => {
    try {
        // Compilar a função do usuário
        const f = math.parse(func).compile();

        let fa = f.evaluate({ x: a });
        let fb = f.evaluate({ x: b });
        let c = a;

        let iteration = 0;

        while (iteration < maxIterations) {
            // Verificar se o divisor é muito próximo de zero
            if (Math.abs(fa - fb) < tolerance) {
                return "Falha: A diferença entre f(a) e f(b) está muito próxima de zero.";
            }

            // Calcular o próximo ponto usando a fórmula da secante
            c = b - (fb * (b - a)) / (fb - fa);
            const fc = f.evaluate({ x: c });

            // Verificar se f(c) está suficientemente próximo de zero
            if (Math.abs(fc) < tolerance) {
                return c;  // Retornar a raiz aproximada
            }

            // Preparar para a próxima iteração
            a = b;
            b = c;
            fa = fb;
            fb = fc;

            iteration++;
        }

        return "Falha: Número máximo de iterações atingido sem encontrar a raiz.";
    } catch (error) {
        console.error("Erro ao processar a função:", error);
        return "Erro: Verifique a função fornecida.";
    }
};

//                                                          [Resolução de Sistemas Lineares]

// Eliminação de Gauss
export const gaussianElimination = (matrix: number[][]): number[] | string => {
    try {
        const augmentedMatrix = matrix.map((row) => [...row]);
        const n = augmentedMatrix.length;

        for (let i = 0; i < n; i++) {
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (
                    Math.abs(augmentedMatrix[k][i]) >
                    Math.abs(augmentedMatrix[maxRow][i])
                ) {
                    maxRow = k;
                }
            }

            [augmentedMatrix[i], augmentedMatrix[maxRow]] = [
                augmentedMatrix[maxRow],
                augmentedMatrix[i],
            ];

            for (let k = i + 1; k < n; k++) {
                const factor = augmentedMatrix[k][i] / augmentedMatrix[i][i];
                for (let j = i; j < augmentedMatrix[k].length; j++) {
                    augmentedMatrix[k][j] -= factor * augmentedMatrix[i][j];
                }
            }
        }

        const solution = Array(n).fill(0);
        for (let i = n - 1; i >= 0; i--) {
            solution[i] = augmentedMatrix[i][n] / augmentedMatrix[i][i];
            for (let k = i - 1; k >= 0; k--) {
                augmentedMatrix[k][n] -= augmentedMatrix[k][i] * solution[i];
            }
        }
        return solution;
    } catch (error) {
        return "Erro ao resolver o sistema";
    }
};

//  Gauss-Jacobi
export const gaussJacobi = (
    matrix: number[][],
    tolerance = 0.0001,
    maxIterations = 100
): number[] | string => {
    const n = matrix.length;
    let x = Array(n).fill(0);
    let xNew = Array(n).fill(0);
    let iteration = 0;

    while (iteration < maxIterations) {
        for (let i = 0; i < n; i++) {
            let sum = matrix[i][n];
            for (let j = 0; j < n; j++) {
                if (j !== i) {
                    sum -= matrix[i][j] * x[j];
                }
            }
            xNew[i] = sum / matrix[i][i];
        }

        let diff = xNew.reduce(
            (acc, val, idx) => acc + Math.abs(val - x[idx]),
            0
        );
        if (diff < tolerance) return xNew;

        x = [...xNew];
        iteration++;
    }

    return "O método não convergiu";
};

// Gauss Seidel
export const gaussSeidel = (
    matrix: number[][],
    tolerance = 0.0001,
    maxIterations = 100
): number[] | string => {
    const n = matrix.length;
    let x = Array(n).fill(0);
    let iteration = 0;

    while (iteration < maxIterations) {
        let diff = 0;
        for (let i = 0; i < n; i++) {
            let sum = matrix[i][n];
            for (let j = 0; j < n; j++) {
                if (j !== i) {
                    sum -= matrix[i][j] * x[j];
                }
            }
            const xNew = sum / matrix[i][i];
            diff += Math.abs(xNew - x[i]);
            x[i] = xNew;
        }

        if (diff < tolerance) return x;
        iteration++;
    }

    return "O método não convergiu";
};

//                                                                    [Interpretação]

// Interpretação -> Lagrange
export const lagrangeInterpolation = (
    x: number[],
    y: number[],
    xToFind: number
): number => {
    let result = 0;
    const n = x.length;

    // Fórmula de Lagrange
    for (let i = 0; i < n; i++) {
        let term = y[i];
        for (let j = 0; j < n; j++) {
            if (j !== i) {
                term = (term * (xToFind - x[j])) / (x[i] - x[j]);
            }
        }
        result += term;
    }

    return result;
};

// Interpretação -> Newton-Gregory
export const newtonGregoryInterpolation = (
    x: number[],
    y: number[],
    xToFind: number
): number => {
    const n = x.length;
    let result = y[0];
    let h = x[1] - x[0];

    // Diferenças divididas
    let difference = [...y];
    for (let i = 1; i < n; i++) {
        for (let j = n - 1; j >= i; j--) {
            difference[j] = difference[j] - difference[j - 1];
        }
    }

    // Fórmula de Newton-Gregory
    for (let i = 1; i < n; i++) {
        let term = difference[i] / h ** i;
        for (let j = 0; j < i; j++) {
            term = term * (xToFind - x[j]);
        }
        result += term;
    }

    return result;
};

// Interpretação -> Inversa
export const inverseInterpolation = (
    x: number[],
    y: number[],
    yToFind: number
): number => {
    let result = 0;
    const n = x.length;

    // Fórmula de interpolação inversa
    for (let i = 0; i < n; i++) {
        let term = 1;
        for (let j = 0; j < n; j++) {
            if (j !== i) {
                term *= yToFind - y[j];
            }
        }
        result += x[i] / term;
    }

    return result;
};

//                                                                      [Extrapolação]

// Extrapolação -> Método dos Mínimos Quadrados
export const extrapolationMethod = (
    xValues: number[],
    yValues: number[],
    xExtrapolated: number
): number | string => {
    const n = xValues.length;

    if (n !== yValues.length || n < 2) {
        return "Erro: Vetores de entrada devem ter o mesmo comprimento e conter pelo menos dois pontos.";
    }

    let sumX = 0,
        sumY = 0,
        sumXY = 0,
        sumX2 = 0;

    for (let i = 0; i < n; i++) {
        sumX += xValues[i];
        sumY += yValues[i];
        sumXY += xValues[i] * yValues[i];
        sumX2 += xValues[i] ** 2;
    }

    const a = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
    const b = (sumY - a * sumX) / n;

    const yExtrapolated = a * xExtrapolated + b;

    return yExtrapolated;
};

//                                                                    [Integração Numérica]
