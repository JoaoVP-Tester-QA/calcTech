import React, { useState, useEffect } from 'react';
import LinkList from '../components/LinkList';

const MainPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(localStorage.getItem('selectedCategory') || null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(localStorage.getItem('selectedMethod') || null);


  // Salva a Categoria
  const handleCategorySelect = (category: string) => {
    localStorage.setItem('selectedCategory', category);
    setSelectedCategory(category);
    setSelectedMethod(null); //
  };

  // Salva o Método
  const handleMethodSelect = (method: string) => {
    localStorage.setItem('selectedMethod', method);
    setSelectedMethod(method);
  };

  // Opções do usuário. Pais em const, Filhos nos arrays
  const equationsLinks = [
    { name: 'Bolzano', path: '/equations' },
    { name: 'Bissecção', path: '/equations' },
    { name: 'Newton-Raphson', path: '/equations' },
    { name: 'Secante', path: '/equations' },
  ];

  const systemsLinks = [
    { name: 'Eliminação Gaussiana', path: '/systems' },
    { name: 'Gauss-Jacobi', path: '/systems' },
    { name: 'Gauss-Seidel', path: '/systems' },
  ];

  const interpolationLinks = [
    { name: 'Lagrange', path: '/interpolation' },
    { name: 'Newton-Gregory', path: '/interpolation' },
    { name: 'Inversa', path: '/interpolation' },
  ];

  const extrapolationLinks = [
    { name: 'Mínimos Quadrados', path: '/extrapolation' },
  ];

  return (
    <div>
      <h1>FunctionMath</h1>
      
      {!selectedCategory ? (
        <div>
          <h2>Selecione a categoria:</h2>
          <ul>
            <li>
              <button onClick={() => handleCategorySelect('equations')}>Resolução de Equações Lineares</button>
            </li>
            <li>
              <button onClick={() => handleCategorySelect('systems')}>Resolução de Sistemas Lineares</button>
            </li>
            <li>
              <button onClick={() => handleCategorySelect('interpolation')}>Interpolação</button>
            </li>
            <li>
              <button onClick={() => handleCategorySelect('extrapolation')}>Extrapolação</button>
            </li>
          </ul>
        </div>
      ) : (
        <div>
          <h2>
            {selectedCategory === 'equations' ? "Resolução de Equações Lineares" : 
             selectedCategory === 'systems' ? "Resolução de Sistemas Lineares" : 
             selectedCategory === 'interpolation' ? "Interpolação" : "Extrapolação"}
          </h2>
          
          {selectedCategory === 'equations' && (
            <LinkList 
              items={equationsLinks} 
              onMethodSelect={handleMethodSelect} 
            />
          )}
          {selectedCategory === 'systems' && (
            <LinkList 
              items={systemsLinks} 
              onMethodSelect={handleMethodSelect} 
            />
          )}
          {selectedCategory === 'interpolation' && (
            <LinkList 
              items={interpolationLinks} 
              onMethodSelect={handleMethodSelect} 
            />
          )}
          {selectedCategory === 'extrapolation' && (
            <LinkList 
              items={extrapolationLinks} 
              onMethodSelect={handleMethodSelect} 
            />
          )}

          {selectedMethod && <p>Método selecionado: {selectedMethod}</p>}

          <button onClick={() => setSelectedCategory(null)}>Voltar</button>
        </div>
      )} 
    </div>
  );
};

export default MainPage;
