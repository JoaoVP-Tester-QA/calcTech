import React from 'react';
import { Rings } from 'react-loader-spinner';

const LoadingScreen: React.FC = () => (
  <div>
    <Rings color="#00BFFF" height={80} width={80} />
    <p>Calculando...</p>
  </div>
);

export default LoadingScreen;
