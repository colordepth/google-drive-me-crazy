import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { H1, InputGroup, Button, Card } from "@blueprintjs/core";

import FileExplorer from './components/FileExplorer';
import { setTokenRefreshTimeout } from './services/auth';
import { getAbout } from './services/userInfo';
import './App.css';

const App = () => {
  useEffect(setTokenRefreshTimeout, []);
  useEffect(() => getAbout(['*']).then((data) => console.log(data)), []);

  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <H1>Google Drive Me Crazy</H1>
          <div style={{margin: "0 1rem"}}>
            <Button icon="log-in" intent="primary" outlined size="large" text="Log Out" large/>
          </div>
        </nav>
      </header>
      <div className="MainContent">
        <InputGroup
            leftIcon="search"
            large={true}
            onChange={() => {}}
            placeholder="Search..."
            rightElement={null}
        />
        <div style={{display: 'grid', gridTemplateColumns: '15rem 1fr'}}>
          <Card style={{marginTop: '2rem', height: '30rem'}}>
            <ul style={{listStyle: 'none'}}>
              <li>Priority</li>
              <li>MyDrive</li>
              <li>Shared with me</li>
              <li>Recent</li>
              <li>Starred</li>
              <li>Trashed</li>
              <li>Storage</li>
            </ul>
          </Card>
          <div>
            <Routes>
              <Route path="/:fileId" element={<FileExplorer/>}/>
              <Route path="*" element={<Navigate to="/root" />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;