import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Screen } from './components/Screen';
import { ControlPanel } from './components/ControlPanel';
import { AppContext, useStore } from './store';

const App = () => {
  const storeState = useStore();

  return (
    <AppContext.Provider value={storeState}>
      <Screen />
      <ControlPanel />
    </AppContext.Provider>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
