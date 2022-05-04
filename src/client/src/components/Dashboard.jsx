import { Icon } from "@blueprintjs/core";
import NavigationBar from './NavigationBar';
import { useDispatch, useSelector } from "react-redux";
import { selectFilesForUser } from '../services/fileManagerService';
import { selectUserByID } from '../services/userSlice';
import { openPath } from "../services/tabSlice";
import { selectUsers } from "../services/userSlice";
import { useState } from "react";
import FileElementList from "./FileElementList";

import './Dashboard.css';

const UserCard = ({user, tabID}) => {
  const dispatch = useDispatch();

  return (
    <div className='UserCard' onClick={() => {
      dispatch(openPath({
        id: tabID,
        path: {
          path: 'root',
          name: "College",
          userID: user.minifiedID
        }
      }));
    }}
    >
      <div>
        <img src={user.photoLink} style={{borderRadius: '50%'}}/>
      </div>
      <div>
        <div>
          <b style={{color: '#333'}}>College</b><br/><br/>
          <span style={{color: '#555'}}>{user.emailAddress}</span><br/>
        </div>
      </div>
    </div>
  );
}

const PinnedItems = ({tab}) => {
  return (
    <div className='DashboardElement'>
      <div className='DashboardElementContents'>
        <div className='UserCard'>
          sample
        </div>
      </div>
    </div>
  );
}

const RecentFiles = ({files, tab, user}) => {
  return (
    <FileElementList entities={files} sortBy='viewedByMeTime' limit={100} view='icon-view' tabID={tab.id} user={user} hideScrollbar={true}/>
  );
}

const tabStyle = {
  background: '#ccd',
  padding: "0.5rem",
  borderRadius: "4px 4px 0 0",
  // border: "1px solid #dde",
  // borderBottom: "none",
  display: "flex",
  alignItems: "center",
  gap: "6px"
};

const activeTabStyle = {
  background: '#eef',
  padding: "0.5rem",
  // borderRadius: "4px 4px 0 0",
  // border: "1px solid #dde",
  borderBottom: "none",
  display: "flex",
  alignItems: "center",
  gap: "6px"
}

const dashboardTabBarStyle = {
  display: "flex",
  alignItems: "center",
}

const dashboardTabsContainerStyle = {
  margin: "3rem 3.2rem 1rem 3.2rem",
}

const dashboardTabContentStyle = {
  border: "1px solid #dde",
  borderRadius: "0 5px 5px 5px",
  width: "100%",
  padding: "1rem",
  height: "10rem",
  overflow: "hidden"
}

const DashboardTabs = ({tab}) => {
  const [activeTab, setActiveTab] = useState('Recent Files');

  const users = useSelector(selectUsers);

  const user = users && users[0];
  const allFiles = useSelector(selectFilesForUser(user && user.minifiedID));
  const files = allFiles && allFiles.filter(file => 
    file.owners && file.owners.length && file.owners[0].me
  );

  return (
    <div style={dashboardTabsContainerStyle}>
      <div style={dashboardTabBarStyle}>
        <span
          style={activeTab === "Recent Files" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('Recent Files')}
        >
          <Icon size={14} icon='time' /><span>Recent Files</span>
        </span>
        <span
          style={activeTab === "Starred Files" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('Starred Files')}
        >
          <Icon size={14} icon='star' /><span>Starred Files</span>
        </span>
      </div>
      <div style={dashboardTabContentStyle}>
        {activeTab === "Recent Files" ? <RecentFiles tab={tab} files={files} user={user}/> : <PinnedItems tab={tab}/>}
      </div>
    </div>
  );
}

const Dashboard = ({tab}) => {
  const users = useSelector(selectUsers);

  return (
    <div className='Dashboard'>
      <NavigationBar tab={ tab } />
      <DashboardTabs tab={ tab }/>
      <div className='DashboardElement'>
        <div className='DashboardTitle' style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <Icon icon='database' /> <h2>User Drives</h2>
        </div>
        <div className='DashboardElementContents'>
          {
            users.map(user => <UserCard key={user.minifiedID} user={user} tabID={tab.id}/>)
          }
          <div className='UserCard AddAccountCard'>
            <div className='AddAccountBorder' onClick={() => window.location.replace('/authenticate/google')}>
              Add Account
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
