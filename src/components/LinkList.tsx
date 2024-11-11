import React from 'react';
import { Link } from 'react-router-dom';

// Definindo o tipo correto para os props
interface LinkListProps {
  items: { name: string; path: string }[];
  onMethodSelect: (method: string) => void;
}

const LinkList: React.FC<LinkListProps> = ({ items, onMethodSelect }) => {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.name}>
          <Link to={item.path} onClick={() => onMethodSelect(item.name)}>
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default LinkList;
