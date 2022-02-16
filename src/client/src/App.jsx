import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { H1, InputGroup, Button, Card } from "@blueprintjs/core";

import FileExplorer from './components/FileExplorer';
import { setTokenRefreshTimeout } from './services/auth';
import { getAbout } from './services/userInfo';
import './App.css';

const App = () => {
  const [about, setAbout] = useState(null);
  useEffect(setTokenRefreshTimeout, []);
  useEffect(() => getAbout(['*']).then((data) => {console.log(data); setAbout(data)}), []);

  const sidebarElementStyle = {
    padding: '0.3rem'
  }

  return (
    <div className="App">
      {/*<header className="App-header">
        <nav>
          <H1>Google Drive Me Crazy</H1>
          
          <div style={{margin: "0 1rem"}}>
          <img
            src={about && about.user.photoLink}
            alt="user image"
            referrerPolicy="no-referrer"
            style={{borderRadius: '50%', width: '50px', height: '50px'}}
          />
          </div>
        </nav>
      </header>*/}
      <div style={{margin: "0 1rem", position: "absolute", "top": "3px", "right": "3px"}}>
        <img
          src={about && about.user.photoLink}
          alt="user image"
          referrerPolicy="no-referrer"
          style={{borderRadius: '50%', width: '32px', height: '32px'}}
        />
      </div>
      <div className="MainContent">
        <div className="SideBar">
          <ul style={{listStyle: 'none'}}>
            <li style={sidebarElementStyle}>Home</li>
            <li style={sidebarElementStyle}>Starred</li>
            <li style={sidebarElementStyle}>Drives</li>
            <li style={sidebarElementStyle}>Recent</li>
            <li style={sidebarElementStyle}>Starred</li>
            <li style={sidebarElementStyle}>Trashed</li>
            <li style={sidebarElementStyle}>Storage</li>
          </ul>
        </div>
        <div>
          <Routes>
            <Route path="/:fileId" element={<FileExplorer/>}/>
            <Route path="*" element={<Navigate to="/root" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
