import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Breadcrumbs, Button, InputGroup, ButtonGroup } from "@blueprintjs/core";
import { Position, Toaster } from "@blueprintjs/core";

import FileElementList from './FileElementList';
import StatusBar from './StatusBar';
import FileUpload from './FileUpload';

import { selectEntitiesInsideFolder, selectEntity, calculatePathFromEntityID } from '../services/fileManagerService';
import { openPath, pathHistoryBack, pathHistoryForward } from '../services/tabSlice';
import { selectUserByID } from '../services/userSlice';
import { clearHighlights } from '../services/tabSlice';

const requestedFields = ["id", "name", "parents", "mimeType", "quotaBytesUsed", "trashed",
  "webViewLink", "iconLink", "modifiedTime", "viewedByMeTime", "owners", "thumbnailLink"];

const BackButton = ({ tab }) => {
  const dispatch = useDispatch();

  return (
    <Button
      icon='arrow-left'
      minimal
      small
      disabled={tab.activePathIndex === 0}
      onClick={() => dispatch(pathHistoryBack(tab.id))}
    />
  );
}

const ForwardButton = ({ tab }) => {
  const dispatch = useDispatch();

  return (
    <Button
      icon='arrow-right'
      minimal
      small
      disabled={tab.activePathIndex === tab.pathHistory.length-1}
      onClick={() => dispatch(pathHistoryForward(tab.id))}
    />
  );
}

const ParentDirectoryButton = ({ tabID, user, parentFolderID }) => {
  const dispatch = useDispatch();

  function switchToParentFolder() {
    selectEntity(parentFolderID, user)
      .then(parentFolder => {
        dispatch(openPath({
          id: tabID,
          path: {
            path: parentFolder.id,
            name: parentFolder.name,
            userID: user.minifiedID
          }
        }));
      })
  }

  return (
    <Button
      icon='arrow-up'
      minimal
      small
      className="ParentDirectoryButton"
      disabled={ !parentFolderID }
      onClick={switchToParentFolder}
    />
  );
}

const NavigationBar = ({ tab, user, folderOpenHandler }) => {
  const currentFolderID = tab.pathHistory.at(tab.activePathIndex).path;
  const [currentFolder, setCurrentFolder] = useState(null);
  const [breadcrumbItems, setBreadCrumbItems] = useState([]);

  console.log("Navigation bar render");

  useEffect(() => {
    if (!user) return;

    selectEntity(currentFolderID, user)
      .then(entity => setCurrentFolder(entity))

    calculatePathFromEntityID(currentFolderID, user)
      .then(path => {

        let result = [];
        path.forEach(folder => result.push({
          icon: "folder-open",
          intent: "primary",
          text: folder.name,
          onClick: () => folderOpenHandler(folder)
        }))
        result[0] = { ...result[0], icon: "cloud" };
        setBreadCrumbItems(result);
      })
    },
    [tab.activePathIndex]
  );

  const parentFolderID = currentFolder && currentFolder.parents && currentFolder.parents[0];

  return (
    <div className="NavigationBar">
      <BackButton tab={tab}/>
      <ForwardButton tab={tab}/>
      <ParentDirectoryButton tabID={tab.id} user={user} parentFolderID={parentFolderID}/>
      <Breadcrumbs className="AddressBar" items={breadcrumbItems} fill/>
      <InputGroup
        leftIcon="search"
        onChange={() => {}}
        placeholder="Search..."
        rightElement={null}
        fill
      />
    </div>
  );
}

const ToolBar = ({ highlightedEntities, user, targetFolderID }) => {
  const [overlayState, setOverlayState] = useState(false);

  if (!highlightedEntities.length)
    return (
      <div className="ToolBar">
        <FileUpload isOpen={overlayState} onClose={() => setOverlayState(false)} user={user} targetFolderID={targetFolderID}/>
        <Button small minimal icon='add' rightIcon="chevron-down" text="New" onClick={() => setOverlayState(true)}/>
    </div>
    );
  return (
    <div className="ToolBar">
      <ButtonGroup>
        <Button small minimal icon='cut' text="Cut" />
        <Button small minimal icon='duplicate' text="Copy" />
        <Button small minimal disabled icon='clipboard' text="Paste" />
      </ButtonGroup>
      <Button small minimal icon='edit' text="Rename" />
      <Button small minimal intent='danger' icon='trash' text="Trash" />
    </div>
    );
}

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
