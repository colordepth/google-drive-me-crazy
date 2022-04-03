import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Breadcrumbs, Button, InputGroup, ButtonGroup } from "@blueprintjs/core";

import FileElementList from './FileElementList';
import ParentDirectoryButton from './ParentDirectoryButton';
import StatusBar from './StatusBar';

import { getAllFilesInFolder } from '../services/files'
import { calculatePathFromFileID, selectBreadcrumbItems } from '../services/pathSlice';
import { openPath, pathHistoryBack, pathHistoryForward, selectActivePath } from '../services/tabSlice';
import { selectUserByID } from '../services/userSlice';
import { selectDirectoryTreeForUser, selectStoreStatusForUser, updateFilesAndFolders } from '../services/directoryTreeSlice';

const requestedFields = ["id", "name", "parents", "mimeType", "quotaBytesUsed",
  "webViewLink", "iconLink", "modifiedTime", "viewedByMeTime", "owners"];

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

const NavigationBar = ({ tab }) => {
  const breadcrumbItems = useSelector(selectBreadcrumbItems);

  return (
    <div className="NavigationBar">
      <BackButton tab={tab}/>
      <ForwardButton tab={tab}/>
      <ParentDirectoryButton tab={tab}/>
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
const ToolBar = ({ selectedFiles }) => {
  if (!selectedFiles.length)
    return (
      <div className="ToolBar">
        <Button small minimal icon='add' rightIcon="chevron-down" text="New" />
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

const FileExplorer = ({ userID, selectedFiles, setSelectedFiles, tab }) => {
  const [filesList, setFilesList] = useState(null);
  const directoryTree = useSelector(selectDirectoryTreeForUser(userID));
  const directoryTreeStatus = useSelector(selectStoreStatusForUser(userID));
  const activeTabPath = useSelector(selectActivePath(tab.id));
  const dispatch = useDispatch();

  const user = useSelector(selectUserByID(userID));

  function refreshFileListData() {
    
    if (directoryTree) {
      setFilesListFromDirectoryTree();
      return;
    }
    
    setFilesList(null);    // show loading

    // fetch files and also update in directoryTree
    getAllFilesInFolder(user, activeTabPath.path, requestedFields)
      .then(files => {
        setFilesList(files);
        dispatch(updateFilesAndFolders(userID, files));
      })
      .catch(error => {
        console.error("updateFileListFileExplorer",
          error.message,
          error.response ? error.response.data.error.message : null
        );
      });
    // try { dispatch(calculatePathFromFileID(activeTabPath.path)); }
    // catch (error) { console.error("calculatePathFromFileID", error.message);}
  }

  function setFilesListFromDirectoryTree() {
    if (!directoryTree) return;
    if (!directoryTree[activeTabPath.path]) return;   // without this, error when switching to non fileexplorer tab.

    const fileIDsInCurrentFolder = Object.keys(directoryTree)
      .filter(fileID => {
        return directoryTree[fileID].parents
          && directoryTree[fileID].parents[0] === directoryTree[activeTabPath.path].id;
      });

    setFilesList(fileIDsInCurrentFolder.map(id => directoryTree[id]));
    console.log('set files from directory tree');
  }

  function folderOpenHandler(folder) {
    dispatch(openPath({id: tab.id, path: {
      path: folder.id,
      name: folder.name,
      userID
    }}));
  }

  useEffect(refreshFileListData, [ activeTabPath ]);
  useEffect(setFilesListFromDirectoryTree, [ directoryTree ]);

  return (
    <div className="FileExplorer">
      <NavigationBar tab={ tab }/>
      <ToolBar selectedFiles={ selectedFiles }/>
      <FileElementList files={ filesList } selectedFiles={ selectedFiles } folderOpenHandler={ folderOpenHandler }/>
      <StatusBar noOfFiles={ filesList && filesList.length } noOfSelectedFiles={ selectedFiles.length }/>
    </div>
  );
}

export default FileExplorer;
