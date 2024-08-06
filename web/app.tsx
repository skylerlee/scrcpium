import React from 'react';
import { render } from 'react-dom';

const App = () => {
  return <button className="btn">Hello world!</button>;
};

render(<App />, document.getElementById('root'));
