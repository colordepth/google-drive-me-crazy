import { Icon } from "@blueprintjs/core";
import ReactTimeAgo from 'react-time-ago';

const elementStyle = {
  display: 'grid',
  gridTemplateColumns: '30px 1fr repeat(2, 8rem) 4.7rem',
  padding: '0.6rem',
  cursor: 'pointer',
  border: '1px solid #cccccc',
  borderRadius: '6px'
};

function humanFileSize(size) {
  var i = size == 0 ? 0 : Math.floor( Math.log(size) / Math.log(1024) );
  return ( size / Math.pow(1024, i) ).toFixed(1) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};

const LastViewedTime = ({file}) => {
  if (file.viewedByMeTime)
    return <><ReactTimeAgo date={ new Date(file.viewedByMeTime)}/></>
  return <>Never</>
}

const File = ({file}) => {
  return (
      <div onClick={() => file.mimeType !== "application/vnd.google-apps.folder" && window.open(file.webViewLink)} style={elementStyle}>
        <Icon icon={<img src={file.iconLink}/>} intent='none'/>
        <div>{ file.name }</div>
        <LastViewedTime file={file}/>
        <ReactTimeAgo date={ new Date(file.modifiedTime) }/>
        <div style={{marginLeft: 'auto', marginRight: '1rem'}}>{ file.mimeType !== "application/vnd.google-apps.folder" && humanFileSize(file.quotaBytesUsed) }</div>
      </div>
  );
}

{/*<Icon icon='folder-close' intent='primary' style={iconStyle}/>*/}

const Folder = ({file}) => {
  return (
    <>
      {/*<Icon icon='folder-close' intent='primary' style={iconStyle}/>*/}
      <Icon icon={<img src={file.iconLink}/>} intent='primary'/>
      {file.name}
    </>
  );
}

const FileElement = ({file}) => {
  return <><File file={file}/></>;
}

export default FileElement;