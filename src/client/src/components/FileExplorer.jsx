import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { H4, Card, Breadcrumbs } from "@blueprintjs/core";
import { useParams } from 'react-router-dom';

import FileElementList from './FileElementList';
import ParentDirectoryButton from './ParentDirectoryButton';

import { getFileByID, getAllFilesInFolder } from '../services/files'
import { calculatePathFromFile, calculatePathFromFileID, selectBreadcrumbItems } from '../services/pathSlice';
import { fetchAllFolders } from '../services/directoryTreeSlice';

const requestedFields = ["id", "name", "size", "mimeType", "fileExtension", "fullFileExtension", "quotaBytesUsed", "webViewLink", "parents"];

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
  
  const [filesList, setFilesList] = useState(null);

  function refreshFileExplorer() {
    setFilesList(null);
    getAllFilesInFolder(params.fileId, requestedFields)
      .then(files => setFilesList(files))
      .catch(error => {
        console.error("updateFileList", error.message, error.response ? error.response.data.error.message : null);
      });
    try { dispatch(calculatePathFromFileID(params.fileId)); }
    catch (error) { console.error("calculatePathFromFileID", error.message);}
  }
  useEffect(refreshFileExplorer, [params, dispatch]);
  useEffect(() => dispatch(fetchAllFolders()), []);

  return (
    <>
      <H4 style={{margin: '1rem 0'}}>{filesList === null ? "Processing" : `Number of Files in this folder: ${filesList.length}`}</H4>
      <Card>
        <PathIndicator/>
        <Card style={{margin: "2rem"}}>
          <FileElementList files={filesList} setFilesList={setFilesList}/>
        </Card>
      </Card>
    </>
  );
}

export default FileExplorer;