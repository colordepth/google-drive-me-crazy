import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { selectActiveTab, selectTabs, selectActivePath } from '../services/tabSlice';

import Tab from './Tab';
import TabsBar from './TabsBar';

function getURLPath(pathObject) {
  if (pathObject.path === 'dashboard') return `/${pathObject.path}`;
  return `/${pathObject.userID}/${pathObject.path}`
}

const TabManager = (props) => {
  const navigate = useNavigate();

  const tabs = useSelector(selectTabs);
  const activeTab = useSelector(selectActiveTab);
  const activeTabPath = useSelector(selectActivePath(activeTab.id));

  useEffect(() => navigate(getURLPath(activeTabPath)), [activeTabPath]);

  const tabElements = tabs.map(tabInfo =>
    <Tab key={tabInfo.id} tabID={tabInfo.id}/>
  );
  const activeTabElement = tabElements.find(tab => tab.key === activeTab.id);

  return (
    <>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100%'
      }}>
        <TabsBar/>
        { activeTabElement }
      </div>
    </>
  );
}

export default TabManager
