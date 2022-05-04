import { Icon } from "@blueprintjs/core";
import ReactDOM from 'react-dom';
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { openPath, clearHighlights, selectTab, selectActiveTab } from '../services/tabSlice';
import { selectEntitiesInsideFolder, selectDirectoryTreeForUser } from '../services/fileManagerService';
import { TreeView } from "./FileElementList";
import { addTag, selectUserByID, selectUsers, setCreateTagVisibility } from "../services/userSlice";

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
  const users = useSelector(selectUsers);

  return (
    <div className="SideBar">
      <div className="SidebarBlock">
        <div className="SidebarHeader HomeHeader">
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
          users && users.map(user => <UserElement user={user}/>)
        }
      </div>
    </div>
  );
}

function resetHighlightedFiles(clickedNode, dispatch, tabID) {
  const fileElementsDOM = Array.from(document.getElementsByClassName('FileElement'));
  const contextMenuDOM = Array.from(document.getElementsByClassName('bp3-menu'));

  let clickedOnFileElement = false;
  let clickedOnContextMenu = false;

  fileElementsDOM.forEach(fileElement => {
    if (fileElement.contains(clickedNode)) {
      clickedOnFileElement = true;
    }
  })

  contextMenuDOM.forEach(menu => {
    if (menu.contains(clickedNode)) {
      clickedOnContextMenu = true;
    }
  })

  if (!clickedOnFileElement && !clickedOnContextMenu) dispatch(clearHighlights(tabID));
}

const requestedFields = ["id", "name", "parents", "mimeType", "trashed", "iconLink"];

export const UserSidebar = ({ userID, tabID }) => {
  const dispatch = useDispatch();
  const [entitiesList, setEntitiesList] = useState(null);
  const [treeIsOpen, setTreeIsOpen] = useState(true);
  const tab = useSelector(selectTab(tabID));
  const activePath = tab.pathHistory.at(tab.activePathIndex).path;
  const directoryTreeChange = useSelector(selectDirectoryTreeForUser(userID));
  const user = useSelector(selectUserByID(userID));
  const users = useSelector(selectUsers);

  function refreshSidebarTree() {

    setEntitiesList(null);    // show loading
    console.log("refreshed sidebar tree");

    directoryTreeChange && Object.keys(directoryTreeChange).forEach(id => {
      const entity = directoryTreeChange[id];

      if (entity.appProperties) {
        Object.keys(entity.appProperties).forEach(tagName => {
          dispatch(addTag({userID, tag: tagName}));
        })
      }
    })

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
        <div className={"SidebarHeader".concat(activePath == 'dashboard' ? ' HomeHeader' : '')} onClick={() => {
            dispatch(openPath({
              id: tabID,
              path: {
                path: 'dashboard',
                name: "Dashboard",
                userID: null
              }
            }));
          }}>
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
        <div className={"SidebarHeader".concat(activePath == 'trash' ? ' HomeHeader' : '')}>
          <Icon icon='trash' size={15} style={{paddingRight: '0.6rem'}}/>
          Trash
        </div>
        <div style={{marginTop: "4px"}} className={"SidebarHeader".concat(activePath == 'storage-analyzer' ? ' HomeHeader' : '')}
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
        <div style={{marginTop: "4px"}} className={"SidebarHeader".concat(activePath == 'storage-organizer' ? ' HomeHeader' : '')}
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
        <div className={"SidebarHeader"}>
          <Icon icon='tag' size={15} style={{paddingRight: '0.6rem'}}/>
          Tags
        </div>
        {user && user.tags && user.tags.map((tag, i) => 
          tag.name && 
          <div
            className={"SidebarElement".concat(activePath == 'tag_'.concat(tag.name) ? ' HomeHeader' : '')}
            key={tag.name}
            onClick={() => dispatch(openPath({
                id: tabID,
                path: {
                  path: `tag_${tag.name}`,
                  name: tag.name.replace('&', ' '),
                  userID: user.minifiedID
                }
              }))
            }
          >
            {/* <Icon icon='full-circle' size={14} style={{color: tag.color, paddingRight: '0.6rem'}}/> */}
            {/* <div style={{marginRight: '0.5rem'}}>{i}</div> */}
            <div style={{ width: '16px', height: '16px', marginRight: '0.6rem', background: tag.color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F0EFFF'}}>{}</div>
            {tag.name.replace('&', ' ')}
          </div>
        )}
        <div className="SidebarElement" onClick={() => dispatch(setCreateTagVisibility({userID: user.minifiedID, visible: true}))}>
          <Icon icon='plus' size={14} style={{paddingRight: '0.6rem'}}/>
          Create new tag
        </div>
      </div>  
      <div className="SidebarBlock">
        <div className="SidebarHeader" onClick={() => setTreeIsOpen(!treeIsOpen)}>
          <Icon icon='diagram-tree' size={15} style={{marginLeft: '-0.5rem', marginRight: '0.3rem', padding: '0.5rem', borderRadius: '50%', background: '#00003020', boxShadow: treeIsOpen ? 'inset 0 0 0 1px rgb(17 20 24 / 20%), inset 0 1px 2px rgb(17 20 24 / 20%)' : ''}}/>
          Tree Navigation
        </div>
        {treeIsOpen && 
        <div style={{maxHeight: '400px', overflow: 'auto'}}>
          <TreeView entities={entitiesList ? entitiesList : []} user={user} tabID={tabID} onlyFolders={true} view='tree-view'/>
        </div>
        }
      </div>
    </div>
  );
}

export default SidebarPortal;
