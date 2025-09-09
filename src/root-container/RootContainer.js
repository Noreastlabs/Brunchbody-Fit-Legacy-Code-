import { Component } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import RootNavigation from '../navigation/RootNavigation';
import { persistor, store } from '../redux';
import { colors } from '../resources';

export class RootContainer extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <GestureHandlerRootView
            style={{ flex: 1, backgroundColor: colors.background }}
          >
            <PaperProvider>
              <RootNavigation />
            </PaperProvider>
          </GestureHandlerRootView>
        </PersistGate>
      </Provider>
    );
  }
}
