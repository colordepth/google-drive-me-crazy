import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { UL, Spinner } from "@blueprintjs/core";
import { useSelector } from 'react-redux';

import FileElement from './FileElement';
import { addToPath } from '../services/pathSlice';
import { selectDirectoryTree } from '../services/directoryTreeSlice';

const listStyle = {
  listStyle: 'none',
  // border: '1px solid #cccccc',
  // padding: '0.6rem',
  // cursor: 'pointer'
}


const elementStyle = {
  display: 'grid',
  gridTemplateColumns: '30px 1fr repeat(2, 8rem) 4.7rem',
  padding: '0.6rem',
  cursor: 'pointer',
  // border: '1px solid #ccc',
  fontSize: '1rem',
  borderRadius: '2px'
};

const FileElementList = ({files, setFilesList}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const directoryTree = useSelector(selectDirectoryTree);

  function fileClickHandler(file) {
    if (file.mimeType === "application/vnd.google-apps.folder")
    {
      setFilesList(null);
      dispatch(addToPath(file));
      navigate('/' + file.id);
    }
    // Non-Folder File click is handled in FileElement.jsx
  }

  if (files===null)
    return (<><Spinner/></>);

  if (files.length === 0)
    return (<>No files to show</>);

  return (
    <UL>
      <li style={listStyle}>
        <div style={elementStyle}>
          <span style={{gridColumn: '1 / span 2'}}>File Name</span><span>Last Viewed</span><span>Last Modified</span><span style={{margin: 'auto'}}>Size</span>
        </div>
      </li>
      {files.map(file => (
        <li style={listStyle} key={file.id} onClick={() => fileClickHandler(file)}>
          <FileElement file={file} directoryTree={directoryTree}/>
        </li>
      ))}
    </UL>
    );
}

export default FileElementList;