import React from 'react';
import './App.css';
import SinglePlayerGame from './components/SinglePlayerGame/SinglePlayerGame';

const App: React.FC = () => {

  return (
    <div className="App">
      <SinglePlayerGame />
    </div>
  );
};

export default App;