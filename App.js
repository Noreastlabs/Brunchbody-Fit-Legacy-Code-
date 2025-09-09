import { useEffect } from 'react';
import { RootContainer } from './src/root-container/RootContainer';
import { hydrateWorkoutPlans } from './src/storage/mmkv/hydration';

function App() {
  useEffect(() => {
    hydrateWorkoutPlans();
  }, []);

  return <RootContainer />;
}
export default App;
