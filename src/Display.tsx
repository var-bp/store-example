import React from 'react';
import Value from './Value.tsx';

function Display() {
  return (
    <div className="container">
      <h4>Display</h4>
      <Value data="first" />
      <Value data="last" />
    </div>
  );
}

export default Display;
