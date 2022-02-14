import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { H4, Card, Breadcrumbs } from "@blueprintjs/core";
import { useParams } from 'react-router-dom';

import FileElementList from './FileElementList';
import ParentDirectoryButton from './ParentDirectoryButton';

import { getAllFilesInFolder } from '../services/files'
import { calculatePathFromFileID, selectBreadcrumbItems } from '../services/pathSlice';
import { fetchDirectoryStructure } from '../services/directoryTreeSlice';
import { setFilesList, selectFilesList, clearFilesList } from '../services/currentDirectorySlice';

const requestedFields = ["id", "name", "size", "mimeType", "fileExtension", "fullFileExtension",
"quotaBytesUsed", "webViewLink", "webContentLink", "iconLink", "hasThumbnail", "thumbnailLink", "description",
"contentHints(thumbnail(mimeType))", "imageMediaMetadata", "parents", "modifiedTime", "viewedByMeTime"];

const PathIndicator = () => {
  const breadcrumbItems = useSelector(selectBreadcrumbItems);

  return (
    <div className="PathIndicator" style={{display: 'flex', margin: "1rem 0"}}>
      <ParentDirectoryButton />
      <div>
        <Breadcrumbs items={breadcrumbItems}/>
      </div>
    </div>
  );
}

const FileExplorer = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const filesList = useSelector(selectFilesList);

  function refreshFileExplorer() {
    dispatch(clearFilesList());
    getAllFilesInFolder(params.fileId, requestedFields)
      .then(files => dispatch(setFilesList(files)))
      .catch(error => {
        console.error("updateFileList", error.message, error.response ? error.response.data.error.message : null);
      });
    try { dispatch(calculatePathFromFileID(params.fileId)); }
    catch (error) { console.error("calculatePathFromFileID", error.message);}
  }
  useEffect(refreshFileExplorer, [params, dispatch]);
  useEffect(() => dispatch(fetchDirectoryStructure()), [dispatch]);

  return (
    <div style={{margin: '2rem'}}>
      <H4 style={{margin: '1rem 0'}}>{!filesList ? "Processing" : `Number of Files in this folder: ${filesList.length}`}</H4>
        <PathIndicator/>
        <Card style={{margin: "2rem"}}>
          <FileElementList/>
        </Card>
    </div>
  );
}

export default FileExplorer;