import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { H1, InputGroup, Button, Card, Icon } from "@blueprintjs/core";

import FileExplorer from './components/FileExplorer';
import { setTokenRefreshTimeout } from './services/auth';
import { getAbout } from './services/userInfo';
import './App.css';

const SideBar = () => {
  return (
    <div className="SideBar">
      <div className="SidebarBlock">
        <div className="HomeHeader">
          <Icon icon='home' size={15} style={{paddingRight: '0.6rem'}}/>
          Home
        </div>
      </div>
      <div className="SidebarBlock"> 
        <div className="SidebarHeader">
          <Icon icon='star' size={15} style={{paddingRight: '0.6rem'}}/>
          Starred
        </div>
        <div className="SidebarElement">
          <Icon icon='folder-open' size={14} style={{paddingRight: '0.6rem'}}/>
          Avant Garde
        </div>
        <div className="SidebarElement">
          <Icon icon='folder-open' size={14} style={{paddingRight: '0.6rem'}}/>
          Minerva
        </div>
        <div className="SidebarElement">
          <Icon icon='folder-open' size={14} style={{paddingRight: '0.6rem'}}/>
          Ruhaniyat
        </div>
      </div>
      <div className="SidebarBlock">
        <div className="SidebarHeader">
          <Icon icon='cloud' size={15} style={{paddingRight: '0.6rem'}}/>
          Drives
        </div>
        <div className="SidebarElement">
          <Icon icon='cloud' size={14} style={{paddingRight: '0.6rem'}}/>
          College Drive
        </div>
        <div className="SidebarElement">
          <Icon icon='cloud' size={14} style={{paddingRight: '0.6rem'}}/>
          Personal Drive
        </div>
      </div>
      <div className="SidebarBlock">
        <div className="SidebarHeader">
          <Icon icon='history' size={15} style={{paddingRight: '0.6rem'}}/>
          Recent
        </div>
        <div className="SidebarElement">
          <Icon icon='document' size={14} style={{paddingRight: '0.6rem'}}/>
          Planner.xlsx
        </div>
        <div className="SidebarElement">
          <Icon icon='document' size={14} style={{paddingRight: '0.6rem'}}/>
          Resume.pdf
        </div>
        <div className="SidebarElement">
          <Icon icon='document' size={14} style={{paddingRight: '0.6rem'}}/>
          Literature Survey.docx
        </div>
      </div>
      <div className="SidebarBlock">
        <div className="SidebarHeader">
          <Icon icon='trash' size={15} style={{paddingRight: '0.6rem'}}/>
          Trash
        </div>
        <div style={{marginTop: "4px"}}className="SidebarHeader">
          <Icon icon='database' size={15} style={{paddingRight: '0.6rem'}}/>
          Storage
        </div>
      </div>
      <div className="SidebarBlock">
        <div className="SidebarHeader">
          <Icon icon='tag' size={15} style={{paddingRight: '0.6rem'}}/>
          Tags
        </div>
        <div className="SidebarElement">
          <Icon icon='full-circle' size={14} style={{color: 'maroon', paddingRight: '0.6rem'}}/>
          Design
        </div>
        <div className="SidebarElement">
          <Icon icon='full-circle' size={14} style={{color: 'teal', paddingRight: '0.6rem'}}/>
          Dev
        </div>
        <div className="SidebarElement">
          <Icon icon='full-circle' size={14} style={{color: 'orange', paddingRight: '0.6rem'}}/>
          Games
        </div>
      </div>
    </div>
  );
}

const Dashboard = () => {
  return (
    <div>
      ok
    </div>
  );
}

const App = () => {
  const [about, setAbout] = useState(null);
  useEffect(setTokenRefreshTimeout, []);
  useEffect(() => getAbout(['*']).then((data) => {console.log(data); setAbout(data)}), []);

  const SidebarHeaderStyle = {
    padding: '0.3rem'
  }

  return (
    <div className="App">
      <div style={{margin: "0 1rem", position: "absolute", "top": "3px", "right": "3px"}}>
        <img
          src={about && about.user.photoLink}
          alt="user image"
          referrerPolicy="no-referrer"
          style={{borderRadius: '50%', width: '32px', height: '32px'}}
        />
      </div>
      <div className="MainContent">
        <SideBar/>
        <div>
          <Routes>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/:fileId" element={<FileExplorer/>}/>
            <Route path="*" element={<Navigate to="/root" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
