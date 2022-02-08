import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { UL, Spinner } from "@blueprintjs/core";

import FileElement from './FileElement';
import { addToPath } from '../services/pathSlice';

const listStyle = {
  listStyle: 'none',
  border: '1px solid #cccccc',
  padding: '0.6rem',
  cursor: 'pointer'
}

const FileElementList = ({files, setFilesList}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function fileClickHandler(file) {
    if (file.mimeType === "application/vnd.google-apps.folder")
    {
      setFilesList(null);
      dispatch(addToPath(file));
      navigate('/' + file.id);
    }
    else
    {
      window.open(file.webViewLink);
    }
  }

  if (files===null)
    return (<><Spinner/></>);

  if (files.length === 0)
    return (<>No files to show</>);

  return (
    <UL>
      {files.map(file => (
        <li style={listStyle} key={file.id} onClick={() => fileClickHandler(file)}>
          <FileElement file={file}/>
        </li>
      ))}
    </UL>
    );
}

export default FileElementList;