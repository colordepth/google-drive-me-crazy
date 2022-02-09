import { Icon, Spinner, Text } from "@blueprintjs/core";
import ReactTimeAgo from 'react-time-ago';
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

const File = ({file, directoryTree}) => {
  let fileSize = '1';

  if (file.mimeType !== "application/vnd.google-apps.folder")
    fileSize = humanFileSize(parseInt(file.quotaBytesUsed));
  else if (directoryTree) {
    if (directoryTree[file.id])
      fileSize = humanFileSize(parseInt(directoryTree[file.id].size));
    else
      fileSize = <><Spinner size={20}/></>;
  }
  return (
      <div onClick={() => file.mimeType !== "application/vnd.google-apps.folder" && window.open(file.webViewLink)} className='FileElement'>
        <Icon icon={<img src={ file.iconLink } alt="icon"/>} intent='none'/>
        <div><Text ellipsize='true'>{ file.name }</Text></div>
        <LastViewedTime file={ file }/>
        <ReactTimeAgo date={ file.modifiedTime }/>
        <div style={{marginLeft: 'auto', marginRight: '1rem'}}>{ fileSize }</div>
      </div>
  );
}

// {<Icon icon='folder-close' intent='primary' style={iconStyle}/>}

const FileElement = ({file, directoryTree}) => {
  return <><File file={file} directoryTree={directoryTree}/></>;
}

export default FileElement;