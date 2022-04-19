import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Position, Toaster } from "@blueprintjs/core";

import FileElementList from './FileElementList';
import StatusBar from './StatusBar';
import NavigationBar from './NavigationBar';
import ToolBar from './ToolBar';

import { selectEntitiesInsideFolder, selectDirectoryTreeForUser } from '../services/fileManagerService';
import { openPath, clearHighlights } from '../services/tabSlice';
import { selectUserByID } from '../services/userSlice';

const requestedFields = ["id", "name", "parents", "mimeType", "quotaBytesUsed", "trashed",
  "webViewLink", "iconLink", "modifiedTime", "viewedByMeTime", "owners", "thumbnailLink"];

const AppToaster = Toaster.create({
  className: "recipe-toaster",
  position: Position.BOTTOM_RIGHT,
});

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

const FileExplorer = ({ userID, tab }) => {
  const [entitiesList, setEntitiesList] = useState(null);
  const dispatch = useDispatch();

  const activePath = tab.pathHistory.at(tab.activePathIndex);
  const user = useSelector(selectUserByID(userID));
  const directoryTreeChange = useSelector(selectDirectoryTreeForUser(userID));
  const [viewMode, setViewMode] = useState('detail-view');

  function refreshFileListData() {

    if (activePath.path  === 'storage-analyzer') return;

    setEntitiesList(null);    // show loading
    console.log("refreshed fileList");

    user && selectEntitiesInsideFolder(activePath.path, user, requestedFields)
      .then(entities => {
        setEntitiesList(entities);
      })
      .catch(error => {
        console.error("FileExplorer refreshFileListData",
          error.message,
          error.response ? error.response.data.error.message : null
        );
      });
  }

  function folderOpenHandler(folder) {
    if (activePath.path === folder.id || (folder.isRoot && activePath.path ==='root'))
      return;

    dispatch(openPath({
      id: tab.id,
      path: {
        path: folder.id,
        name: folder.name,
        userID
      }
    }));
    AppToaster.show({ message: "Toasted.." });
  }

  useEffect(refreshFileListData, [ activePath, directoryTreeChange ]);

  const highlightedEntitiesList = Object
    .keys(tab.highlightedEntities)
    .map(entityID => tab.highlightedEntities[entityID]);

  return (
    <div className="FileExplorer" onClick={(event) => resetHighlightedFiles(event.target, dispatch, tab.id)}> 
      <NavigationBar tab={ tab } user= { user } folderOpenHandler={ folderOpenHandler } />
      <ToolBar
        highlightedEntitiesList={ highlightedEntitiesList }
        user={ user }
        targetFolderID={ activePath.path }
        viewMode={ viewMode }
        setViewMode={ setViewMode }
      />
      <FileElementList
        entities={ entitiesList && entitiesList.filter(entity => !entity.trashed) }     // For icon-view and list-view
        user={user}
        tabID={tab.id}
        view={ viewMode }
      />
      <StatusBar noOfFiles={ entitiesList && entitiesList.length } noOfSelectedFiles={ highlightedEntitiesList.length }/>
    </div>
  );
}

export default FileExplorer;
