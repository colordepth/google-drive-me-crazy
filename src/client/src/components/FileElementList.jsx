import { Spinner, Icon, Button } from "@blueprintjs/core";

import FileElement from './FileElement';

const listStyle = {
  listStyle: 'none'
}

function EmptyFolder() {
  return (
    <div className="bp3-non-ideal-state">
      <div className="bp3-non-ideal-state-visual">
        <span className="bp3-icon bp3-icon-folder-open"></span>
      </div>
      <div style={{fontSize: "18px", fontWeight: 300}}>Empty Folder</div>
      <div style={{fontSize: "15px", fontWeight: 300}}>Upload a new file to populate the folder.</div>
      <Button intent="primary" icon="upload" text="Upload"/>
    </div>
  );
}

const FileElementHeader = () => {
  return (
    <div className="FileElementHeader">
      <span style={{gridColumn: '1 / span 2', display: 'flex', alignItems: 'center'}}>
        <span style={{marginRight: '4px'}}>File Name</span>
        <Icon icon='caret-down' color='#777' size={13}/>
      </span>
      <span style={{display: 'flex', alignItems: 'center'}}>
        <span style={{marginRight: '5px'}}>Last Viewed</span>
        <Icon icon='double-caret-vertical' color='#777' size={13}/>
      </span>
      <span style={{display: 'flex', alignItems: 'center'}}>
        <span style={{marginRight: '5px'}}>Last Modified</span>
        <Icon icon='double-caret-vertical' color='#777' size={13}/>
      </span>
      <span style={{display: 'flex', alignItems: 'center', margin: 'auto'}}>
        <span style={{marginRight: '5px'}}>Size</span>
        <Icon icon='double-caret-vertical' color='#777' size={13}/>
      </span>
    </div>
  );
}

const FileElementList = ({files, sortBy}) => {

  console.log(files);

  if (!files)
    return (<div className="FileElementList centre-content"><Spinner/></div>);

  if (files.length === 0)
    return (<div className="FileElementList centre-content"><EmptyFolder/></div>);


  return (
    <ul className="FileElementList">
      <li style={listStyle}>
        <FileElementHeader/>
      </li>
      {
      (sortBy === 'quotaBytesUsed' ? files.slice().sort((a, b) => b.quotaBytesUsed - a.quotaBytesUsed).slice(0, 100) : files)
        .map(file => (
          <li style={listStyle} key={file.id}>
            <FileElement file={file}/>
          </li>
        ))
      }
    </ul>
    );
}

export default FileElementList;
