import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Breadcrumbs, Button, InputGroup, ButtonGroup } from "@blueprintjs/core";
import { useParams } from 'react-router-dom';

import FileElementList from './FileElementList';
import ParentDirectoryButton from './ParentDirectoryButton';
import StatusBar from './StatusBar';

import { getAllFilesInFolder } from '../services/files'
import { calculatePathFromFileID, selectBreadcrumbItems } from '../services/pathSlice';
import { setFilesList, selectFilesList, clearFilesList, selectSelectedFilesID } from '../services/currentDirectorySlice';
import { selectUsers } from '../services/userSlice';

const requestedFields = ["id", "name", "mimeType",
"quotaBytesUsed", "webViewLink", "iconLink", "modifiedTime", "viewedByMeTime"];

const BackButton = () => {
  return (
    <Button
      icon='arrow-left'
      minimal
      small/>
  );
}

const ForwardButton = () => {
  return (
    <Button
      icon='arrow-right'
      minimal
      small
      disabled/>
  );
}

const NavigationBar = () => {
  const breadcrumbItems = useSelector(selectBreadcrumbItems);

  return (
    <div className="NavigationBar">
      <BackButton/>
      <ForwardButton/>
      <ParentDirectoryButton />
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
const ToolBar = () => {
  const selectedFilesID = useSelector(selectSelectedFilesID);

  if (selectedFilesID && !selectedFilesID.length)
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

const FileExplorer = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const filesList = useSelector(selectFilesList);
  const selectedFiles = useSelector(selectSelectedFilesID);

  const user = useSelector(selectUsers).find(user => user.minifiedID === 'qvuQXkR7SAA=');

  function refreshFileExplorer() {
    if (!user) return;

    dispatch(clearFilesList());

    getAllFilesInFolder(user, params.fileID, requestedFields)
      .then(files => dispatch(setFilesList(files)))
      .catch(error => {
        console.error("updateFileList", error.message, error.response ? error.response.data.error.message : null);
      });
    try { dispatch(calculatePathFromFileID(params.fileID)); }
    catch (error) { console.error("calculatePathFromFileID", error.message);}
  }
  useEffect(refreshFileExplorer, [params, dispatch, user]);

  return (
    <div className="FileExplorer">
      <NavigationBar/>
      <ToolBar/>
      <FileElementList files={filesList}/>
      <StatusBar noOfFiles={filesList && filesList.length} noOfSelectedFiles={selectedFiles && selectedFiles.length}/>
    </div>
  );
}

export default FileExplorer;
