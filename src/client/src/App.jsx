import UserManager from './components/UserManager';
import TabManager from './components/TabManager';
import Clipboard from './components/Clipboard';

import '@blueprintjs/popover2/lib/css/blueprint-popover2.css';
import '@blueprintjs/core/lib/css/blueprint-modern.css';
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
