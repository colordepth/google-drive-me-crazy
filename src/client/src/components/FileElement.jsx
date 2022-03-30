import { Icon, Spinner, Text } from "@blueprintjs/core";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';

import store from '../services/store';
import { addToPath } from '../services/pathSlice';
import { selectDirectoryTree } from '../services/directoryTreeSlice';
import { clearFilesList, switchSelection, selectSelectedFilesID } from '../services/currentDirectorySlice';
import './FileElement.css';

function humanFileSize(size) {
  var i = !size ? 0 : Math.floor( Math.log(size) / Math.log(1024) );
  return ( size / Math.pow(1024, i) ).toFixed(1) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};

const LastViewedTime = ({file}) => {
  if (file.viewedByMeTime)
    return <span><ReactTimeAgo date={ new Date(file.viewedByMeTime)}/></span>
  return <span style={{marginLeft: '2rem'}}>-</span>
}
 
function singleClickHandler(event, file) {
  console.log("single click", file);
  if (event.ctrlKey) {
    store.dispatch(switchSelection(file.id));
  }
}

function doubleClickHandler(file, navigate) {
  console.log("double click", file);
  if (file.mimeType === "application/vnd.google-apps.folder")
  {
    store.dispatch(clearFilesList());
    store.dispatch(addToPath(file));
    navigate('./../' + file.id);
  }
  else
    window.open(file.webViewLink);
}

const File = ({file}) => {
  const directoryTree = useSelector(selectDirectoryTree);
  const selectedFilesID = useSelector(selectSelectedFilesID);
  const navigate = useNavigate();

  let fileSize = '1';

  if (file.mimeType !== "application/vnd.google-apps.folder")
    fileSize = humanFileSize(parseInt(file.quotaBytesUsed));
  else if (directoryTree) {
    if (directoryTree[file.id])
      fileSize = humanFileSize(parseInt(directoryTree[file.id].quotaBytesUsed));
    else
      fileSize = <><Spinner size={20}/></>;
  }
  return (
      <div
        onClick={(event) => singleClickHandler(event, file)}
        onDoubleClick={() => doubleClickHandler(file, navigate)}
        className={selectedFilesID.find(id => id === file.id) ? 'FileElement Selected' : 'FileElement'}
      >
        <Icon icon={<img src={ file.iconLink } alt="icon"/>} intent='none'/>
        <div><Text ellipsize='true' style={{color: "black"}}>{ file.name }</Text></div>
        <LastViewedTime file={ file }/>
        <ReactTimeAgo date={ new Date(file.modifiedTime) }/>
        <div style={{marginLeft: 'auto', marginRight: '1rem'}}>{ fileSize }</div>
      </div>
  );
}

// {<Icon icon='folder-close' intent='primary' style={iconStyle}/>}

const FileElement = ({file}) => {
  return <><File file={file}/></>;
}

export default FileElement;
