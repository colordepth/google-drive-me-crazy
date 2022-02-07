import {useEffect, useState} from 'react';
import './App.css';

import { Routes, Route, Navigate } from 'react-router-dom';
import { H1, H4, Card, Breadcrumbs, InputGroup } from "@blueprintjs/core";
import { useNavigate, useParams } from 'react-router-dom';
import ParentDirectoryButton from './components/ParentDirectoryButton';
import FileElementList from './components/FileElementList';
import { setTokenRefreshTimeout } from './services/auth';
import { getFileByID, getAllFilesInFolder } from './services/files'
import store from './services/store';
import { useSelector, useDispatch } from 'react-redux';
import { addToPath, calculatePathFromFile, selectBreadcrumbItems } from './services/pathSlice.js';

const requestedFields = ["id", "name", "size", "mimeType", "fileExtension", "fullFileExtension", "quotaBytesUsed", "webViewLink", "parents"];

const fileClickHandler = (file, setFilesList, navigate) => {
  if (file.mimeType === "application/vnd.google-apps.folder")
  {
    setFilesList(null);
    store.dispatch(addToPath(file));
    navigate('/app/' + file.id);
  }
  else
  {
    window.open(file.webViewLink);
  }
}

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <H1>Google Drive Me Crazy</H1>
      </header>
      <InputGroup
          leftIcon="search"
          large={true}
          onChange={() => {}}
          placeholder="Search..."
          rightElement={null}
      />
      <Routes>
        <Route path="/app/:fileId" element={<FileBrowser/>}/>
        <Route path="*" element={<Navigate to="/app/root" />} />
      </Routes>
    </div>
  );
}

const FileBrowser = () => {
  const params = useParams();
  const [filesList, setFilesList] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const breadcrumbItems = useSelector(selectBreadcrumbItems);

  useEffect(setTokenRefreshTimeout, []);


  // update path
  useEffect(() => {
    setFilesList(null);
    getFileByID(params.fileId, ['*'])
      .then(folder => dispatch(calculatePathFromFile(folder)))
      .catch(error => {
        console.error("updatePath", error.message, error.response ? error.response.data.error.message : null);
      });
    getAllFilesInFolder(params.fileId, requestedFields)
      .then(files => setFilesList(files))
      .catch(error => {
        console.error("updateFileList", error.message, error.response ? error.response.data.error.message : null);
      });
    }, [params, dispatch]
  );

  return (
    <>
      <H4 style={{margin: '1rem 0'}}>{filesList === null ? "Processing" : `Number of Files in this folder: ${filesList.length}`}</H4>
      <Card>
        <div className="pathBar" style={{display: 'flex', margin: "1rem 0"}}>
          <ParentDirectoryButton />
          <div style={{margin: '0 1rem'}}>
            <Breadcrumbs items={breadcrumbItems}/>
          </div>
        </div>
        <Card style={{margin: "2rem"}}>
          <FileElementList files={filesList} onClickHandler={(file) => {fileClickHandler(file, setFilesList, navigate)}}/>
        </Card>
      </Card>
    </>
  );
}

export default App;