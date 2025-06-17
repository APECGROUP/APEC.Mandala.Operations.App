import React from 'react';
import AppProvider from './src/views/appProvider/AppProvider';
import AppNavigation from './src/navigation/AppNavigation';
import {KeyboardDismiss} from './src/elements/others/KeyboardDismiss';
import './global.css';
const App = () => {
  return (
    <AppProvider>
      <KeyboardDismiss flex>
        <AppNavigation />
      </KeyboardDismiss>
    </AppProvider>
  );
};

export default App;
