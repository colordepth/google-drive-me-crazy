import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { H1, InputGroup } from "@blueprintjs/core";

import FileExplorer from './components/FileExplorer';
import { setTokenRefreshTimeout } from './services/auth';
import './App.css';

const App = () => {
  useEffect(setTokenRefreshTimeout, []);

  return (
    <div className="App">
      <header className="App-header">
        <H1>Google Drive Me Crazy</H1>
      </header>
      <InputGroup
          leftIcon="search"
          large={true}
          onChange={() => {}}
          placeholder="Search..."
          rightElement={null}
      />
      <Routes>
        <Route path="/:fileId" element={<FileExplorer/>}/>
        <Route path="*" element={<Navigate to="/root" />} />
      </Routes>
    </div>
  );
}

export default App;