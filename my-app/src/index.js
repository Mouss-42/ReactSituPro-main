import React from 'react';
import ReactDOM from 'react-dom/client';  // Assurez-vous d'utiliser cette version avec createRoot
import './index.css';
import App from './App';

// Assure-toi que l'élément #root existe dans ton HTML
const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);  // Crée le root React à partir de l'élément DOM
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('Element with id "root" not found!');
}
