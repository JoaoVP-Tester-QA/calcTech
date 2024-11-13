import { create, all } from 'mathjs';
import { evaluate } from 'mathjs';
const math = create(all);

function parseExpression(expression: string): any {
  expression = expression.replace("^", "**").replace("e", "E");
  return math.compile(expression);
}

class Calculator {
  exp: any;
  
  constructor(exp: string) {
    this.exp = parseExpression(exp);
  }

  f(x: number): number {
    return this.exp.evaluate({ x });
  }

  Bolzano(fa: number, fb: number): string {
    let result = `F(a) = ${fa} / F(b) = ${fb}\n`;
    if (fa * fb < 0) {
      result += "Existe ao menos uma raiz no intervalo";
    } else if (fa * fb === 0) {
      result += "A ou B é uma raiz da expressão";
    } else {
      result += "Não existem raízes no intervalo";
    }
    return result;
  }

  Bisseccao(a: number, b: number, tol: number): { table: Array<any>, result: string } {
    let columns = ['a', 'f(a)', 'm', 'f(m)', 'b', 'f(b)'];
    let table = [];
    let n = Math.ceil((Math.log10(Math.abs(b - a)) - Math.log10(Math.abs(tol))) / Math.log10(2));
    let i = 0;
    let m: number | null = null;
    let fa = this.f(a);
    let fb = this.f(b);

    if (fa * fb >= 0) {
      return { table: [], result: "Não existem raízes no intervalo" };
    }

    while (i < n) {
      m = (a + b) / 2;
      let fm = this.f(m);
      fa = this.f(a);
      fb = this.f(b);

      // Adiciona a linha de dados à tabela
      table.push({ a, fa, m, fm, b, fb });

      if (fa * fm < 0) {
        b = m;
      } else {
        a = m;
      }
      i++;
    }
    return { table, result: `Resposta = m(${i}) = ${m}` };
  }

  NewtonRaphson(x0: number, tol: number): string {
    // Derivação numérica para simular a derivada
    const derivative = math.derivative(this.exp.toString(), 'x').compile();
    let resp = '';
    let i = 0;
    let error = tol + 1;
    let x1 = x0;

    while (error > tol) {
      let fx = this.f(x0);
      let fdx = derivative.evaluate({ x: x0 });

      if (fdx === 0) {
        return `Derivada zero em x = ${x0}. O método de Newton falha.`;
      }

      x1 = x0 - fx / fdx;
      error = Math.abs(x1 - x0);
      x0 = x1;
      i++;
      resp += `\nx${i} = ${x1} --> Critério de parada: ${error}\n`;
    }
    return `Raiz aproximada encontrada: x = ${x1} com ${i} interações e ${error.toFixed(6)} de erro\n` + resp;
  }

  Secante(x0: number, x1: number, tol: number): string {
    let resp = '';
    let i = 0;
    let error = tol + 1;

    while (error > tol) {
      let fx0 = this.f(x0);
      let fx1 = this.f(x1);

      if (fx1 === fx0) {
        return "O método falha, pois f(x0) e f(x1) são iguais e causam divisão por zero.";
      }

      let x2 = (x0 * fx1 - x1 * fx0) / (fx1 - fx0);
      error = Math.abs(x2 - x1);
      x0 = x1;
      x1 = x2;
      i++;
      resp += `\nx${i + 1} = ${x1} --> Critério de parada: ${error}\n`;
    }
    return `Raiz aproximada encontrada: x = ${x1} com ${i} interações e ${error.toFixed(6)} de erro\n` + resp;
  }
}
// Exemplo de uso
// const calculator = new Calculator("x^2 - 4");
// console.log(calculator.Bisseccao(1, 3, 0.001));


class Calculator2 {
    n: number;
    xn: number[];
    fx: number[];

    constructor(n: number, xn: number[], fx: number[]) {
        this.n = n;
        this.xn = xn;
        this.fx = fx;
    }

    Lagrange(x: number): string {
        const n = this.n;
        const xn = this.xn;
        let l = Array(n).fill(1);

        for (let i = 0; i < n; i++) {
            let k = 0;
            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    l[i] *= (x - xn[k]) / (xn[i] - xn[k]);
                }
                k++;
            }
        }

        let p = 0;
        let resp = '';
        for (let i = 0; i < n; i++) {
            resp += `l${i} = ${l[i]}\n`;
            p += l[i] * this.fx[i];
        }

        resp = `P(${x}) = ${p}\n` + resp;
        return resp;
    }

    NewtonGregory(x: number): { result: string, table: Array<{ [key: string]: any }> } {
        const xn = this.xn;
        const fx = this.fx;
        const n = this.n;

        const fdd: number[][] = Array.from({ length: n }, () => Array(n).fill(null));

        for (let i = 0; i < n; i++) {
            fdd[i][0] = fx[i];
        }

        for (let j = 1; j < n; j++) {
            for (let i = 0; i < n - j; i++) {
                fdd[i][j] = (fdd[i + 1][j - 1] - fdd[i][j - 1]) / (xn[i + 1] - xn[i]);
            }
        }

        const table = fdd.map((row, index) => {
            const rowObj: { [key: string]: any } = { "f(x)": row[0] };
            for (let j = 1; j < n; j++) {
                rowObj[`Ordem ${j}`] = row[j];
            }
            return rowObj;
        });

        let xterm = 1;
        let yint = fdd[0][0];
        for (let order = 1; order < n; order++) {
            xterm *= (x - xn[order - 1]);
            yint += fdd[0][order] * xterm;
        }

        const resp = `P${n - 1}(${x}) = ${yint}`;
        return { result: resp, table };
    }

    NewtonInversa(y: number): { result: string, table: Array<{ [key: string]: any }> } {
        const xn = this.fx;
        const fx = this.xn;
        const n = this.n;

        const fdd: number[][] = Array.from({ length: n }, () => Array(n).fill(null));
        
        for (let i = 0; i < n; i++) {
            fdd[i][0] = fx[i];
        }

        for (let j = 1; j < n; j++) {
            for (let i = 0; i < n - j; i++) {
                fdd[i][j] = (fdd[i + 1][j - 1] - fdd[i][j - 1]) / (xn[i + j] - xn[i]);
            }
        }

        const table = fdd.map((row, index) => {
            const rowObj: { [key: string]: any } = { "f(y)": row[0] };
            for (let j = 1; j < n; j++) {
                rowObj[`Ordem ${j}`] = row[j];
            }
            return rowObj;
        });

        let yterm = 1;
        let xint = fdd[0][0];
        for (let order = 1; order < n; order++) {
            yterm *= (y - xn[order - 1]);
            xint += fdd[0][order] * yterm;
        }

        const resp = `P${n - 1}(${y}) = ${xint}`;
        return { result: resp, table };
    }
}
// Exemplo de uso
// const calculator2 = new Calculator2(3, [1, 2, 3], [2, 3, 5]);
// console.log(calculator2.Lagrange(1.5));
// console.log(calculator2.NewtonGregory(1.5));
// console.log(calculator2.NewtonInversa(3));


class Calculator3 {
    A: number[][];  // Matriz de coeficientes
    b: number[][];  // Vetor de termos independentes

    constructor(A: number[][], b: number[][]) {
        this.A = A;
        this.b = b;
    }

    private sistemaTriangularSuperior(U: number[][], y: number[][]): number[][] {
        const n = U.length;
        const x: number[][] = Array.from({ length: n }, () => [0]);

        for (let i = n - 1; i >= 0; i--) {
            let sum = 0;
            for (let j = i + 1; j < n; j++) {
                sum += U[i][j] * x[j][0];
            }
            x[i][0] = (y[i][0] - sum) / U[i][i];
        }
        return x;
    }

    Eliminacao_de_Gauss(): string {
        const A = this.A.map(row => [...row]);
        const b = this.b.map(row => [...row]);
        const n = A.length;
        const Aa = A.map((row, i) => [...row, b[i][0]]);

        for (let j = 0; j < n - 1; j++) {
            const pivo = Aa[j][j];
            for (let i = j + 1; i < n; i++) {
                const fator = Aa[i][j] / pivo;
                for (let k = 0; k < Aa[i].length; k++) {
                    Aa[i][k] -= fator * Aa[j][k];
                }
            }
        }

        const U = Aa.map(row => row.slice(0, n));
        const y = Aa.map(row => [row[n]]);
        const x = this.sistemaTriangularSuperior(U, y);

        let resp = '';
        for (let i = 0; i < n; i++) {
            resp += `x${i + 1} = ${x[i][0]}\n`;
        }
        return resp;
    }

    Gauss_Jacobi(p: number, x0: number[][], nMax: number): string {
        const n = this.A.length;
        const invA = this.invertMatrix(this.A);  // Corrigido para inversão de matriz
        const B = this.subtractMatrices(this.identityMatrix(n), this.multiplyMatrices(invA, this.A));
        const d = this.multiplyMatrices(invA, this.b);

        let xOld = x0.map(row => [...row]);
        let it = 0;
        let er = 1;
        let resp = '';

        while (er >= Math.pow(10, -p) && it < nMax) {
            const x = this.addMatrices(this.multiplyMatrices(B, xOld), d);
            er = this.calculateError(x, xOld);
            xOld = x;
            it++;
        }

        for (let i = 0; i < n; i++) {
            resp += `x${i + 1} = ${xOld[i][0]}\n`;
        }
        return `O valor da solução após ${it} iterações é:\n${resp}`;
    }

    Gauss_Seidel(p: number, x0: number[][], nMax: number): string {
        const n = this.A.length;
        const invLowerA = this.invertMatrix(this.lowerTriangularMatrix(this.A));  // Corrigido para inversão de matriz
        const B = this.subtractMatrices(this.identityMatrix(n), this.multiplyMatrices(invLowerA, this.A));
        const d = this.multiplyMatrices(invLowerA, this.b);

        let x = x0.map(row => [...row]);
        let xOld = x0.map(row => [...row]);
        let it = 0;
        let er = 1;
        let resp = '';

        while (er >= Math.pow(10, -p) && it < nMax) {
            for (let i = 0; i < n; i++) {
                x[i][0] = B[i].reduce((sum, bij, j) => sum + bij * x[j][0], 0) + d[i][0];
            }
            er = this.calculateError(x, xOld);
            xOld = x.map(row => [...row]);
            it++;
        }

        for (let i = 0; i < n; i++) {
            resp += `x${i + 1} = ${x[i][0]}\n`;
        }
        return `O valor da solução após ${it} iterações é:\n${resp}`;
    }

    private identityMatrix(n: number): number[][] {
        return Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
    }

    private multiplyMatrices(A: number[][], B: number[][]): number[][] {
        const n = A.length;
        const m = B[0].length;
        const result: number[][] = Array.from({ length: n }, () => Array(m).fill(0));

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < m; j++) {
                for (let k = 0; k < A[0].length; k++) {
                    result[i][j] += A[i][k] * B[k][j];
                }
            }
        }
        return result;
    }

    private invertMatrix(A: number[][]): number[][] {
        const n = A.length;
        const augmented = A.map((row, i) => [...row, ...this.identityMatrix(n)[i]]);
        for (let i = 0; i < n; i++) {
            let pivot = augmented[i][i];
            for (let j = 0; j < augmented[i].length; j++) {
                augmented[i][j] /= pivot;
            }

            for (let j = i + 1; j < n; j++) {
                let factor = augmented[j][i];
                for (let k = 0; k < augmented[j].length; k++) {
                    augmented[j][k] -= factor * augmented[i][k];
                }
            }
        }

        for (let i = n - 1; i >= 0; i--) {
            for (let j = i - 1; j >= 0; j--) {
                let factor = augmented[j][i];
                for (let k = 0; k < augmented[j].length; k++) {
                    augmented[j][k] -= factor * augmented[i][k];
                }
            }
        }

        return augmented.map(row => row.slice(n));
    }

    private lowerTriangularMatrix(A: number[][]): number[][] {
        return A.map((row, i) => row.map((val, j) => (i >= j ? val : 0)));
    }

    private calculateError(x: number[][], xOld: number[][]): number {
        let sum = 0;
        for (let i = 0; i < x.length; i++) {
            sum += Math.pow(x[i][0] - xOld[i][0], 2);
        }
        return Math.sqrt(sum);
    }

    private subtractMatrices(A: number[][], B: number[][]): number[][] {
        return A.map((row, i) => row.map((val, j) => val - B[i][j]));
    }

    private addMatrices(A: number[][], B: number[][]): number[][] {
        return A.map((row, i) => row.map((val, j) => val + B[i][j]));
    }
}

// const A = [
//     [4, -1, 0, 0],
//     [-1, 4, -1, 0],
//     [0, -1, 4, -1],
//     [0, 0, -1, 3]
// ];
// const b = [
//     [15],
//     [10],
//     [10],
//     [10]
// ];

// Cria uma instância da classe Calculator com a matriz A e vetor b
// const calculator3 = new Calculator(A, b);

// // Método de Eliminação de Gauss
// console.log("Eliminação de Gauss:");
// console.log(calculator3.Eliminacao_de_Gauss());

// // Configurações para métodos iterativos Gauss-Jacobi e Gauss-Seidel
// const precision = 6; // Precisão decimal
// const initialGuess = [[0], [0], [0], [0]]; // Chute inicial para x
// const maxIterations = 100; // Número máximo de iterações

// // Método de Gauss-Jacobi
// console.log("Gauss-Jacobi:");
// console.log(calculator3.Gauss_Jacobi(precision, initialGuess, maxIterations));

// // Método de Gauss-Seidel
// console.log("Gauss-Seidel:");
// console.log(calculator3.Gauss_Seidel(precision, initialGuess, maxIterations));

class GaussianElimination {
    static solve(A: number[][], b: number[]): number[] {
        const n = b.length;
        
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                const fator = A[j][i] / A[i][i];
                for (let k = i; k < n; k++) {
                    A[j][k] -= fator * A[i][k];
                }
                b[j] -= fator * b[i];
            }
        }

        let x: number[] = new Array(n).fill(0);
        for (let i = n - 1; i >= 0; i--) {
            x[i] = b[i];
            for (let j = i + 1; j < n; j++) {
                x[i] -= A[i][j] * x[j];
            }
            x[i] /= A[i][i];
        }
        return x;
    }
}

class Extrapolation {
    static linear(x: number[], y: number[], xExtrapolar: number): number {
        const A: number[][] = [
            [x.reduce((sum, xi) => sum + xi ** 2, 0), x.reduce((sum, xi) => sum + xi, 0)],
            [x.reduce((sum, xi) => sum + xi, 0), x.length]
        ];
        const b: number[] = [
            y.reduce((sum, yi, i) => sum + y[i] * x[i], 0),
            y.reduce((sum, yi) => sum + yi, 0)
        ];

        const [a, bVal] = GaussianElimination.solve(A, b);

        return a * xExtrapolar + bVal;
    }

    static quadratic(x: number[], y: number[], xExtrapolar: number): number {
        const A: number[][] = [
            [x.reduce((sum, xi) => sum + xi ** 4, 0), x.reduce((sum, xi) => sum + xi ** 3, 0), x.reduce((sum, xi) => sum + xi ** 2, 0)],
            [x.reduce((sum, xi) => sum + xi ** 3, 0), x.reduce((sum, xi) => sum + xi ** 2, 0), x.reduce((sum, xi) => sum + xi, 0)],
            [x.reduce((sum, xi) => sum + xi ** 2, 0), x.reduce((sum, xi) => sum + xi, 0), x.length]
        ];
        const b: number[] = [
            y.reduce((sum, yi, i) => sum + y[i] * x[i] ** 2, 0),
            y.reduce((sum, yi, i) => sum + y[i] * x[i], 0),
            y.reduce((sum, yi) => sum + yi, 0)
        ];

        const [a, bVal, c] = GaussianElimination.solve(A, b);

        // Extrapolação
        return a * xExtrapolar ** 2 + bVal * xExtrapolar + c;
    }
}
// Exemplo de uso
// const xConhecido = [1, 2, 3, 4, 5];  // Valores conhecidos de x
// const yConhecido = [2.3, 3.5, 5.7, 8.1, 10.2];  // Valores correspondentes de y
// const xExtrapolar = 6;  // Ponto onde queremos extrapolar

// const yExtrapoladoLinear = Extrapolation.linear(xConhecido, yConhecido, xExtrapolar);
// console.log(`Extrapolação Linear em x=${xExtrapolar}: y ≈ ${yExtrapoladoLinear.toFixed(2)}`);

// const yExtrapoladoQuadratico = Extrapolation.quadratic(xConhecido, yConhecido, xExtrapolar);
// console.log(`Extrapolação Quadrática em x=${xExtrapolar}: y ≈ ${yExtrapoladoQuadratico.toFixed(2)}`);


class Calculator4 {
    private exp: string;

    constructor(exp: string) {
        this.exp = exp;
    }

    // Função para avaliar a expressão
    private f(x: number): number {
        const scope = { x: x };
        return evaluate(this.exp, scope);
    }

    // Método para calcular a integral utilizando o método do trapézio
    trapezioR(x: [number, number], n: number): number {
        const f = this.f.bind(this);  // Binding da função f
        const h = (x[1] - x[0]) / n;
        let e = x[0];
        let soma = f(x[0]) + f(x[1]);

        // Itera sobre o intervalo e soma as áreas dos trapézios
        while (e < x[1]) {
            e += h;
            soma += 2 * f(e);
        }

        return soma * h / 2;
    }
}
// Exemplo de uso
// const calc = new Calculator('sin(x) + cos(x)');  // Exemplo de expressão
// const resultado = calc.trapezioR([0, Math.PI], 100);  // Intervalo de 0 a PI, com 100 subdivisões
// console.log(`Resultado da integral (trapézio): ${resultado}`);


