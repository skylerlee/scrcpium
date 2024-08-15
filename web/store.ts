import { createContext, useState } from 'react';

const noop = (value: any) => {};

/**
 * Context for the app
 */
export const AppContext = createContext({
  serial: '',
  setSerial: noop,
});

export const useStore = () => {
  const [serial, setSerial] = useState('');

  return {
    serial,
    setSerial,
  };
};
