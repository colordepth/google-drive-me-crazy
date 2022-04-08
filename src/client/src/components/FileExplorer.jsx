import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Position, Toaster } from "@blueprintjs/core";

import FileElementList from './FileElementList';
import StatusBar from './StatusBar';
import NavigationBar from './NavigationBar';
import ToolBar from './ToolBar';

import { selectEntitiesInsideFolder } from '../services/fileManagerService';
import { openPath } from '../services/tabSlice';
import { selectUserByID } from '../services/userSlice';

const requestedFields = ["id", "name", "parents", "mimeType", "quotaBytesUsed", "trashed",
  "webViewLink", "iconLink", "modifiedTime", "viewedByMeTime", "owners", "thumbnailLink"];

const AppToaster = Toaster.create({
  className: "recipe-toaster",
  position: Position.TOP,
});

const FileExplorer = ({ userID, tab }) => {
  const [entitiesList, setEntitiesList] = useState(null);
  const dispatch = useDispatch();

  const activePath = tab.pathHistory.at(tab.activePathIndex);
  const user = useSelector(selectUserByID(userID));

  function refreshFileListData() {

    setEntitiesList(null);    // show loading

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
    AppToaster.show({ message: "Toasted." });
  }

  useEffect(refreshFileListData, [ activePath ]);

  return (
    <div className="FileExplorer">
      <NavigationBar tab={ tab } user= { user } folderOpenHandler={ folderOpenHandler } />
      <ToolBar highlightedEntities={ tab.highlightedEntities } user={ user } targetFolderID={ activePath.path }/>
      <FileElementList
        entities={ entitiesList && entitiesList.filter(entity => !entity.trashed) }     // For icon-view and list-view
        user={user}
        tabID={tab.id}
        view='icon-view'
      />
      <StatusBar noOfFiles={ entitiesList && entitiesList.length } noOfSelectedFiles={ tab.highlightedEntities.length }/>
    </div>
  );
}

export default FileExplorer;
