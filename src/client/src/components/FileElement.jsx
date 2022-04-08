import { Spinner } from '@blueprintjs/core';
import { useSelector } from 'react-redux';
import ReactTimeAgo from 'react-time-ago';

// import store from '../services/store';
import { selectDirectoryTreeForUser } from '../services/directoryTreeSlice';
import { humanFileSize } from '../services/filesMiscellaneous';

import DetailViewElement from './DetailViewElement';
import IconViewElement from './IconViewElement';
import TreeViewElement from './TreeViewElement';

import './FileElement.css';

export const HumanReadableTime = ({epoch}) => {
  if (epoch)
    return <span><ReactTimeAgo date={ new Date(epoch)}/></span>
  return <span style={{marginLeft: '2rem'}}>-</span>
}

export function singleClickHandler(event, file) {
  console.log('single click', file);
  if (event.ctrlKey) {
    // store.dispatch(switchSelection(file.id));
  }
}

export function doubleClickHandler(file, folderOpenHandler) {
  console.log('double click', file);
  if (file.mimeType === 'application/vnd.google-apps.folder')
  {
    // store.dispatch(clearFilesList());
    // store.dispatch(addToPath(file));
    folderOpenHandler(file);
  }
  else
    window.open(file.webViewLink);
}

const FileElement = ({file, selected, folderOpenHandler, user, view}) => {
  const directoryTree = useSelector(selectDirectoryTreeForUser(user.minifiedID));

  let fileSize = <><Spinner size={20}/></>;

  if (file.mimeType !== 'application/vnd.google-apps.folder')
    fileSize = humanFileSize(parseInt(file.quotaBytesUsed));
  else if (directoryTree) {
    if (directoryTree[file.id])
      fileSize = humanFileSize(parseInt(directoryTree[file.id].quotaBytesUsed));
    else
      fileSize = 'undefined';
  }
  
  const props = {file, fileSize, selected, folderOpenHandler, user};

  if (view === 'icon-view') return <IconViewElement {...props} />
  if (view === 'tree-view') return <TreeViewElement {...props} />
  if (view === 'column-view') return <IconViewElement {...props} />

  return <DetailViewElement {...props} />;
}

// {<Icon icon='folder-close' intent='primary' style={iconStyle}/>}

export default FileElement;
