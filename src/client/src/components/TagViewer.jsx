import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Position, Toaster } from "@blueprintjs/core";

import FileElementList from './FileElementList';
import StatusBar from './StatusBar';
import NavigationBar from './NavigationBar';
import ToolBar from './ToolBar';

import { selectDirectoryTreeForUser, selectEntitiesInsideTag } from '../services/fileManagerService';
import { openPath, clearHighlights } from '../services/tabSlice';
import { selectUserByID } from '../services/userSlice';
import { selectFilesForUser, selectFoldersForUser } from '../services/directoryTreeSlice';
import { useParams } from 'react-router-dom';

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

const TagViewer = ({ userID, tab }) => {
  const dispatch = useDispatch();

  const activePath = tab.pathHistory.at(tab.activePathIndex);
  const user = useSelector(selectUserByID(userID));
  const [viewMode, setViewMode] = useState('icon-view');
  const [taggedFiles, setTaggedFiles] = useState(null);

  const { tagName } = useParams();
  const directoryTreeChange = useSelector(selectDirectoryTreeForUser(userID));

  const highlightedEntitiesList = Object
    .keys(tab.highlightedEntities)
    .map(entityID => tab.highlightedEntities[entityID]);

  useEffect(() => {
    async function findTaggedFiles() {
      user && selectEntitiesInsideTag(tagName, user)
        .then(results => {
          return results
            .filter(file => file.owners && file.owners.length && file.owners[0].me)
            .filter(entity => !entity.trashed);
        })
        .then(results => setTaggedFiles(results))
    }
    findTaggedFiles();
  }, [directoryTreeChange, tagName])

  // return <></>;

  return (
    <div className="FileExplorer" onClick={(event) => resetHighlightedFiles(event.target, dispatch, tab.id)}> 
      <NavigationBar tab={ tab } user= { user } folderOpenHandler={ () => {} } />
      <ToolBar
        highlightedEntitiesList={ highlightedEntitiesList }
        user={ user }
        targetFolderID={ activePath.path }
        viewMode={ viewMode }
        setViewMode={ setViewMode }
      />
      <FileElementList
        entities={ taggedFiles }     // For icon-view and list-view
        user={user}
        tabID={tab.id}
        view={ viewMode }
      />
      <StatusBar noOfFiles={ taggedFiles && taggedFiles.length } noOfSelectedFiles={ highlightedEntitiesList.length }/>
    </div>
  );
}

export default TagViewer;
