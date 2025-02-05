import React from 'react';
import Content from './Content.tsx';
import { Provider } from './Store.tsx';

function App() {
  return (
    <Provider>
      <div className="container">
        <h4>App</h4>
        <Content />
      </div>
    </Provider>
  );
}

export default App;
