import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Screen } from './components/Screen';
import { ControlPanel } from './components/ControlPanel';

const App = () => {
  return (
    <div>
      <Screen />
      <ControlPanel />
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
