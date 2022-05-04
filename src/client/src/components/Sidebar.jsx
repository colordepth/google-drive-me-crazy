import { Icon } from "@blueprintjs/core";
import ReactDOM from 'react-dom';
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { openPath, clearHighlights, selectTab, createTab, switchActiveTab, selectActiveTab, selectActiveTabID } from '../services/tabSlice';
import { selectEntitiesInsideFolder, selectDirectoryTreeForUser, selectEntity } from '../services/fileManagerService';
import { TreeView } from "./FileElementList";
import { selectUserByID, selectUsers } from "../services/userSlice";

const SidebarElement = ({ icon, text, size })  => {
  return (
    <div className="SidebarElement">
      <Icon icon={ icon } size={size} style={{paddingRight: '0.6rem'}}/>
      { text }
    </div>
  );
}

const UserElement = ({ user })  => {
  const dispatch = useDispatch();
  const tab = useSelector(selectActiveTab);

  function openUserDrive() {
    dispatch(openPath({
      id: tab.id,
      path: {
        path: 'root',
        name: 'My Drive',
        userID: user.minifiedID
      }
    }));
  }

  const style = tab.pathHistory.at(-1).userID === user.minifiedID ? {background: '#d4d2fb'} : {};

  return (
    <div className="SidebarElement" onClick={openUserDrive} style={style}>
      <img
        src={user && user.photoLink}
        alt="user profile"
        referrerPolicy="no-referrer"
        style={{borderRadius: '50%', width: '28px', height: '28px', marginRight: '0.5rem'}}
      />
      { user.displayName }
    </div>
  );
}

const SidebarPortal = ({ element }) => {
  return ReactDOM.createPortal(
    element,
    document.getElementById('sidebar')
  );
}

export const DashboardSidebar = () => {
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
        <SidebarElement icon='folder-open' text='Avant Garde' />
        <SidebarElement icon='folder-open' text='Minerva' />
        <SidebarElement icon='folder-open' text='Ruhaniyat' />
      </div>
      <div className="SidebarBlock">
        <div className="SidebarHeader">
          <Icon icon='cloud' size={15} style={{paddingRight: '0.6rem'}}/>
          Drives
        </div>
        <SidebarElement icon='cloud' size={15} text='Drive Drive' />
        <SidebarElement icon='cloud' size={15} text='Personal Drive' />
      </div>
      <div className="SidebarBlock">
        <div className="SidebarHeader">
          <Icon icon='history' size={15} style={{paddingRight: '0.6rem'}}/>
          Recent
        </div>
        <SidebarElement icon='document' size={14} text='Planner.xlsx' />
        <SidebarElement icon='document' size={14} text='Resume.pdf' />
        <SidebarElement icon='document' size={14} text='Literature Survey.docx' />
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

function resetHighlightedFiles(clickedNode, dispatch, tabID) {
  const fileElementsDOM = Array.from(document.getElementsByClassName('FileElement'));

  let clickedOnFileElement = false;

  fileElementsDOM.forEach(fileElement => {
    if (fileElement.contains(clickedNode)) {
      clickedOnFileElement = true;
    }
  })

  if (!clickedOnFileElement) dispatch(clearHighlights(tabID));
}

const requestedFields = ["id", "name", "parents", "mimeType", "trashed", "iconLink"];

export const UserSidebar = ({ userID, tabID }) => {
  const dispatch = useDispatch();
  const [entitiesList, setEntitiesList] = useState(null);
  const [treeIsOpen, setTreeIsOpen] = useState(true);
  const tab = useSelector(selectTab(tabID));
  const activePath = tab.pathHistory.at(tab.activePathIndex);
  const directoryTreeChange = useSelector(selectDirectoryTreeForUser(userID));
  const user = useSelector(selectUserByID(userID));
  const users = useSelector(selectUsers);

  function refreshSidebarTree() {

    setEntitiesList(null);    // show loading
    console.log("refreshed sidebar tree");

    user && selectEntitiesInsideFolder('root', user, requestedFields, "mimeType = 'application/vnd.google-apps.folder'")
      .then(entities => {
        setEntitiesList(entities);
        console.log("TREE", entities);
      })
      .catch(error => {
        console.error("Sidebar refreshSidebarTree",
          error.message,
          error.response ? error.response.data.error.message : null
        );
      });
  }

  useEffect(refreshSidebarTree, [ directoryTreeChange ]);

  return (
    <div className="SideBar" onClick={(event) => resetHighlightedFiles(event.target, dispatch, tabID)}>
      <div className="SidebarBlock">
        <div className="HomeHeader">
          <Icon icon='home' size={15} style={{paddingRight: '0.6rem'}}/>
          Home
        </div>
      </div>
      <div className="SidebarBlock">
        <div className="SidebarHeader">
          <Icon icon='cloud' size={15} style={{paddingRight: '0.6rem'}}/>
          Drives
        </div>
        {
          users.map(user => <UserElement user={user}/>)
        }
      </div>
      <div className="SidebarBlock">
        
      </div>
      <div className="SidebarBlock">
        <div className="SidebarHeader">
          <Icon icon='trash' size={15} style={{paddingRight: '0.6rem'}}/>
          Trash
        </div>
        <div style={{marginTop: "4px"}} className="SidebarHeader"
          onClick={() => {
            dispatch(openPath({
              id: tabID,
              path: {
                path: 'storage-analyzer',
                name: "Storage Analyzer",
                userID: userID
              }
            }));
          }}
        >
          <Icon icon='database' size={15} style={{paddingRight: '0.6rem'}}/>
          Storage Analyzer
        </div>
        <div style={{marginTop: "4px"}} className="SidebarHeader"
          onClick={() => {
            dispatch(openPath({
              id: tabID,
              path: {
                path: 'storage-organizer',
                name: "Storage Organizer",
                userID: userID
              }
            }));
          }}
        >
          <Icon icon='clean' size={15} style={{paddingRight: '0.6rem'}}/>
          Storage Organizer
        </div>
      </div>
      <div className="SidebarBlock">
        <div className="SidebarHeader" onClick={() => setTreeIsOpen(!treeIsOpen)}>
          <Icon icon='diagram-tree' size={15} style={{marginLeft: '-0.5rem', marginRight: '0.3rem', padding: '0.5rem', borderRadius: '50%', background: '#00003020', boxShadow: 'inset 0 0 0 1px rgb(17 20 24 / 20%), inset 0 1px 2px rgb(17 20 24 / 20%)'}}/>
          Tree Navigation
        </div>
        {treeIsOpen && 
        <div style={{maxHeight: '400px', overflow: 'auto'}}>
          <TreeView entities={entitiesList ? entitiesList : []} user={user} tabID={tabID} onlyFolders={true} view='tree-view'/>
        </div>
        }
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

export default SidebarPortal;
