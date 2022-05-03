import { Icon } from "@blueprintjs/core";
import ReactDOM from 'react-dom';
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { openPath, clearHighlights, selectTab } from '../services/tabSlice';
import { selectEntitiesInsideFolder, selectDirectoryTreeForUser } from '../services/fileManagerService';
import { TreeView } from "./FileElementList";
import { selectUserByID } from "../services/userSlice";

const SidebarElement = ({ icon, text, size })  => {
  return (
    <div className="SidebarElement">
      <Icon icon={ icon } size={size} style={{paddingRight: '0.6rem'}}/>
      { text }
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
        <SidebarElement icon='cloud' size={15} text='College Drive' />
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
  const tab = useSelector(selectTab(tabID));
  const activePath = tab.pathHistory.at(tab.activePathIndex);
  const directoryTreeChange = useSelector(selectDirectoryTreeForUser(userID));
  const user = useSelector(selectUserByID(userID));

  function refreshSidebarTree() {

    setEntitiesList(null);    // show loading
    console.log("refreshed sidebar tree");

    user && selectEntitiesInsideFolder(activePath.path, user, requestedFields, "mimeType = 'application/vnd.google-apps.folder'")
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
          <Icon icon='star' size={15} style={{paddingRight: '0.6rem'}}/>
          Starred
        </div>
      </div>
      <div className="SidebarBlock"> 
        <div className="SidebarHeader">
          <Icon icon='history' size={15} style={{paddingRight: '0.6rem'}}/>
          Recent
        </div>
      </div>
      <div className="SidebarBlock">
        <div className="SidebarHeader">
          <Icon icon='cloud' size={15} style={{paddingRight: '0.6rem'}}/>
          Drives
        </div>
        <SidebarElement icon='cloud' size={15} text='College Drive' />
        <SidebarElement icon='cloud' size={15} text='Personal Drive' />
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
          Storage
        </div>
      </div>
      <div className="SidebarBlock">
        <div className="SidebarHeader">
          <Icon icon='diagram-tree' size={15} style={{paddingRight: '0.6rem'}}/>
          Tree Navigation
        </div>
        <TreeView entities={entitiesList ? entitiesList : []} user={user} tabID={tabID} onlyFolders={true} view='tree-view'/>
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
