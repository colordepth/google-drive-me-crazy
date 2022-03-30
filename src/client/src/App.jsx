import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Button, Icon } from "@blueprintjs/core";

import FileExplorer from './components/FileExplorer';
import { SidebarPortal } from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StorageAnalyzer from './components/StorageAnalyzer';
import credentials, { refreshToken, setTokenRefreshTimeout } from './services/auth';
import { getAbout, getQuotaDetails } from './services/userInfo';
import './App.css';

const UserManager = ({ children }) => {
  const [about, setAbout] = useState({});

  useEffect(setTokenRefreshTimeout, []);

  useEffect(() => {
    let fetchedAbout = {};

    getAbout(['user'])
      .then((userInfo) => {fetchedAbout = {...fetchedAbout, ...userInfo}; setAbout(fetchedAbout)});
    
    getQuotaDetails()
      .then((quota) => {fetchedAbout = {...fetchedAbout, quota}; setAbout(fetchedAbout)});
  
  }, []);

  // if refresh token missing
  if (!credentials.refresh_token) {
    window.location.replace('/');
    return <>Redirecting to login page...</>;
  }

  if (about.user && about.quota) console.log(about);

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
          src={about.user && about.user.photoLink}
          alt="user image"
          referrerPolicy="no-referrer"
          style={{borderRadius: '50%', width: '32px', height: '32px'}}
        />
      </div>
      { children }
    </>
  );
}

const TabsBar = ({ activeTab, tabInfoList, createTabHandler, closeTabHandler, tabClickHandler }) => {

  return (
    <div className="TabsBar">
      { 
        tabInfoList && tabInfoList.map(tabInfo => 
          <span className="Tab" key={tabInfo.id.concat('tab')} onClick={() => tabClickHandler(tabInfo.id)}>
            <span>{ tabInfo.path }</span>
            <Icon
              icon='cross'
              size={13}
              style={{color: '#777'}}
              onClick={() => closeTabHandler(tabInfo.id)}
            />
          </span>
        )
      }
      <Button
        minimal
        style={{marginLeft: "2px", alignSelf: "center", borderRadius: '50%'}}
        onClick={createTabHandler}
      >
        <Icon icon='plus' color="#777"/>
      </Button>
    </div>
  );
}

const TabManager = (props) => {
  const navigate = useNavigate();

  const [activeTabID, setActiveTabID] = useState('default');
  const [tabInfoList, setTabInfoList] = useState([
    {
      id: 'default',
      path: 'qvuQXkR7SAA=/root'
    },
    {
      id: 'second-tab',
      path: 'qvuQXkR7SAA=/storage-analyzer'
    }
  ]);

  if (!tabInfoList) return <></>;

  // if (tabInfoList.length === 0) {
  //   setTabInfoList([{ id: 'default', path: 'root' }]);
  // }

  function createTabHandler(tabID) {
    const newTab = {
      id: 'new-tab' + new Date(),
      path: 'dashboard'
    };
    setTabInfoList([...tabInfoList, newTab]);
    navigate('/' + newTab.path);
  }

  function closeTabHandler(tabID) {
    setTabInfoList(tabInfoList.filter(tabInfo => tabInfo.id !== tabID));
  }

  function tabClickHandler(tabID) {
    const newActiveTab = tabInfoList.find(tabInfo => tabInfo.id === tabID);
    console.log('tab clicked', newActiveTab);
    setActiveTabID(newActiveTab.id);
    navigate('/' + newActiveTab.path);
  }

  console.log(46, tabInfoList);
  const tabs = tabInfoList.map(tabInfo => <Tab key={tabInfo.id} path={tabInfo.path}/>);
  const activeTab = tabs.find(tab => tab.key === activeTabID);

  if (tabInfoList.length && !activeTab) {
    setActiveTabID(tabInfoList[0].id);
    navigate('/' + tabInfoList[0].path);
  }

  console.log(14, tabInfoList);
  console.log(15, tabs);
  console.log(16, activeTabID);
  console.log(17, activeTab);

  return (
    <>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh'
      }}>
        <TabsBar
          activeTabID={activeTabID}
          tabInfoList={tabInfoList}
          tabClickHandler={tabClickHandler}
          createTabHandler={createTabHandler}
          closeTabHandler={closeTabHandler}
        />
        { activeTab }
      </div>
    </>
  );
}

const Tab = (props) => {

  return (
    <UserManager>
      <SidebarPortal/>
      <Routes>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/:userID/storage-analyzer" element={<StorageAnalyzer/>}/>
        <Route path="/:userID/:fileID" element={<FileExplorer/>}/>
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </UserManager>
  );
}

const App = () => {
  return (
    <div className="App">
      <TabManager />
    </div>
  );
}

export default App;
