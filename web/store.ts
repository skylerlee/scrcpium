import { createContext, useState } from 'react';

/**
 * Context for the app
 */
export const AppContext = createContext({
  serial: '',
});

export const [storeState, setStoreState] = useState({
  serial: '',
});
