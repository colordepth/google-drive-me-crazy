import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import FileExplorer from './components/FileExplorer';
import Sidebar from './components/Sidebar';
import credentials, { refreshToken, setTokenRefreshTimeout } from './services/auth';
import { getAbout } from './services/userInfo';
import './App.css';

const Dashboard = () => {
  return (
    <div>
      ok
    </div>
  );
}

const StorageAnalyzer = () => {
  return (
    <div>
      ok
    </div>
  );
}

const UserManager = ({ children }) => {
  const [about, setAbout] = useState(null);

  useEffect(setTokenRefreshTimeout, []);
  useEffect(() => getAbout(['*']).then((data) => {console.log(data); setAbout(data)}), []);

  // if refresh token missing
  if (!credentials.refresh_token) {
    window.location.replace('/');
    return <>Redirecting to login page...</>;
  }

  // if access token is expired
  if (credentials.expiry_date <= new Date()) {
    refreshToken()
      .then(() => window.location.reload(false))
      .catch(() => {
        window.location.replace('/');
      });
    return <>Connecting to Google Drive...</>;
  }

  return (
    <>
      <div style={{margin: "0 1rem", position: "absolute", "top": "3px", "right": "3px"}}>
        <img
          src={about && about.user.photoLink}
          alt="user image"
          referrerPolicy="no-referrer"
          style={{borderRadius: '50%', width: '32px', height: '32px'}}
        />
      </div>
      { children }
    </>
  );
}

const App = () => {
  return (
    <div className="App">
      <UserManager>
        <div className="MainContent">
          <Sidebar/>
          <div>
            <Routes>
              <Route path="/dashboard" element={<Dashboard/>}/>
              <Route path="/storage-analyzer" element={<StorageAnalyzer/>}/>
              <Route path="/:fileId" element={<FileExplorer/>}/>
              <Route path="*" element={<Navigate to="/root" />} />
            </Routes>
          </div>
        </div>
      </UserManager>
    </div>
  );
}

export default App;
