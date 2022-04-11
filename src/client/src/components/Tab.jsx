import { useSelector } from 'react-redux';
import { selectTab, selectActivePath } from '../services/tabSlice';
import FileExplorer from './FileExplorer';
import SidebarPortal, { DashboardSidebar, UserSidebar } from './Sidebar';
import Dashboard from './Dashboard';
import StorageAnalyzer from './StorageAnalyzer';
import { Routes, Route, Navigate } from 'react-router-dom';

const Tab = ({tabID}) => {
  const self = useSelector(selectTab(tabID));
  const activeTabPath = useSelector(selectActivePath(tabID));

  // TODO: Move SideBarPortal to storage analyzer, file explorer and dashboard itself
  return (
    <Routes>
      <Route path="/dashboard" element={
        <>
          <SidebarPortal element={ <DashboardSidebar/> } />
          <Dashboard tab={self}/>
        </>
      }/>
      <Route path="/:userID/*" element={
        <>
          <SidebarPortal element={ <UserSidebar userID={activeTabPath.userID} tabID={ tabID }/> } />
          <Routes>
            <Route path="storage-analyzer" element={
              <StorageAnalyzer
                userID={activeTabPath.userID}
                tab={self}
              />
            }/>
            <Route path=":fileID" element={
              <FileExplorer
                userID={activeTabPath.userID}
                tab={self}
              />
            }/>
            <Route path="*" element={<Navigate to="./../root" />}/>
          </Routes>
        </>
      }/>
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default Tab;
