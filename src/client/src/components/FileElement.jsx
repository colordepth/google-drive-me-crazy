import { Icon, Spinner, Text } from "@blueprintjs/core";
import { useSelector } from 'react-redux';

import ReactTimeAgo from 'react-time-ago';

import store from '../services/store';
import { addToPath } from '../services/pathSlice';
import { selectDirectoryTreeForUser } from '../services/directoryTreeSlice';
import { clearFilesList, switchSelection } from '../services/currentDirectorySlice';
import './FileElement.css';
import { getFileThumbnail } from "../services/files";
import { useState, useEffect } from "react";

function humanFileSize(size) {
  var i = !size ? 0 : Math.floor( Math.log(size) / Math.log(1024) );
  return ( size / Math.pow(1024, i) ).toFixed(1) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};

const HumanReadableTime = ({epoch}) => {
  if (epoch)
    return <span><ReactTimeAgo date={ new Date(epoch)}/></span>
  return <span style={{marginLeft: '2rem'}}>-</span>
}
 
function singleClickHandler(event, file) {
  console.log("single click", file);
  if (event.ctrlKey) {
    store.dispatch(switchSelection(file.id));
  }
}

function doubleClickHandler(file, folderOpenHandler) {
  console.log("double click", file);
  if (file.mimeType === "application/vnd.google-apps.folder")
  {
    // store.dispatch(clearFilesList());
    // store.dispatch(addToPath(file));
    // store.dispatch(openPath(file.id));
    folderOpenHandler(file);
    // navigate('./../' + file.id);
  }
  else
    window.open(file.webViewLink);
}

const IconViewElement = ({file, fileSize, selected, folderOpenHandler, user}) => {
  const bigIconLink = file.iconLink.split('/').map((e,i) => i === 3 ? "128" : e).join('/');

  const [thumbnailImage, setThumbnailImage] = useState(null);

  useEffect(() => {
    // Use getGoogleFileThumbnail for google docs thumbnail. also gotta add google docs to scope
    file && !file.mimeType.startsWith('application/vnd.google-apps.') && file.thumbnailLink && getFileThumbnail(file, user)
    .then(data => {
      // console.log(URL.createObjectURL(data));
      setThumbnailImage(URL.createObjectURL(data));
    })
    .catch(error => {
      // console.log(132);
      console.error(error);
    })
  }, [file]);

  return (
    <div
      onClick={(event) => singleClickHandler(event, file)}
      onDoubleClick={() => doubleClickHandler(file, folderOpenHandler)}
      className={selected ? 'IconFileElement IconFileElementSelected' : 'IconFileElement'}
    >
      <div>
        {
          thumbnailImage ? 
          <div className="ThumbnailImageContainer">
            <img src={ thumbnailImage } className="ThumbnailImage" alt="thumbnail"/>
          </div>
          :
          <img src={ bigIconLink } className="BigIconImage" alt="icon"/>
        }
      </div>
      <div className='IconViewFileName'>{ file.name }</div>
    </div>
  );
}

const DetailViewElement = ({file, fileSize, selected, folderOpenHandler}) => {
  return (
    <div
      onClick={(event) => singleClickHandler(event, file)}
      onDoubleClick={() => doubleClickHandler(file, folderOpenHandler)}
      className={selected ? 'DetailFileElement DetailFileElementSelected' : 'DetailFileElement'}
    >
      <Icon icon={<img src={ file.iconLink } alt="icon"/>} intent='none'/>
      <div style={{maxWidth: '25rem'}}><Text ellipsize='true' style={{color: "black"}}>{ file.name }</Text></div>
      <HumanReadableTime epoch={ file.viewedByMeTime }/>
      <HumanReadableTime epoch={ file.modifiedTime }/>
      <div style={{marginLeft: 'auto', marginRight: '1rem'}}>{ fileSize }</div>
    </div>
  );
}

const TreeViewElement = ({file, fileSize, selected, folderOpenHandler}) => {
  return (
    <div
      onClick={(event) => singleClickHandler(event, file)}
      onDoubleClick={() => doubleClickHandler(file, folderOpenHandler)}
      className={selected ? 'TreeFileElement TreeFileElementSelected' : 'TreeFileElement'}
    >
      <Icon icon={<img src={ file.iconLink } alt="icon"/>} intent='none'/>
      <div style={{maxWidth: '25rem'}}><Text ellipsize='true' style={{color: "black"}}>{ file.name }</Text></div>
      <HumanReadableTime epoch={ file.viewedByMeTime }/>
      <HumanReadableTime epoch={ file.modifiedTime }/>
      <div style={{marginLeft: 'auto', marginRight: '1rem'}}>{ fileSize }</div>
    </div>
  );
}

const FileElement = ({file, selected, folderOpenHandler, user, view}) => {
  const directoryTree = useSelector(selectDirectoryTreeForUser(user.minifiedID));

  let fileSize = <><Spinner size={20}/></>;

  if (file.mimeType !== "application/vnd.google-apps.folder")
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
