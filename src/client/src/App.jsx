import UserManager from './components/UserManager';
import TabManager from './components/TabManager';
import Clipboard from './components/Clipboard';

import './App.css';

const App = () => {
  return (
    <div className="App">
      <UserManager/>
      <TabManager />
      <Clipboard/>
    </div>
  );
}

export default App;
