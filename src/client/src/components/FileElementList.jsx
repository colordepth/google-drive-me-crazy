import { Spinner, Icon, Button } from "@blueprintjs/core";
import { useSelector } from "react-redux";
import { useState } from 'react';
import { selectDirectoryTreeForUser } from '../services/directoryTreeSlice';
import FileElement from './FileElement';
import './FileElementList.css'

const listStyle = {
  listStyle: 'none',
  // width: '100%'
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
    <>
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
    </>
  );
}

const ListView = ({files, sortBy, selectedFiles, setSelectedFiles, folderOpenHandler, limit, user, view}) => {
  const selectedState = {};
  selectedFiles.forEach(fileID => { selectedState[fileID] = true });

  return (
    <ul className="FileElementList">
      <li className="DetailFileElementHeader" style={listStyle}>
        <FileElementHeader/>
      </li>
      {
      files
        .map(file => (
          <li style={listStyle} key={file.id}>
            <FileElement
              file={file}
              selected={selectedState[file.id]}
              folderOpenHandler={folderOpenHandler}
              userID={user}
              view={view}
            />
          </li>
        ))
      }
    </ul>
    );
}

const IconView = ({files, sortBy, selectedFiles, setSelectedFiles, folderOpenHandler, limit, user, view}) => {
  const selectedState = {};
  selectedFiles.forEach(fileID => { selectedState[fileID] = true });

  return (
    <ul className="FileElementList IconViewList">
      {
      files
        .map(file => (
          <li style={listStyle} key={file.id}>
            <FileElement
              file={file}
              selected={selectedState[file.id]}
              folderOpenHandler={folderOpenHandler}
              user={user}
              view={view}
            />
          </li>
        ))
      }
    </ul>
    );
}

const Tree = ({file, sortBy, folderOpenHandler, limit, user}) => {
  const directoryTree = useSelector(selectDirectoryTreeForUser(user.minifiedID));
  const [isCollapsed, setIsCollapsed] = useState(true);

  if (!directoryTree) return <>Loading directory tree</>;
  if (!directoryTree[file.id]) return <></>;   // without this, error when switching to non fileexplorer tab.

  const fileIDsInCurrentFolder = Object.keys(directoryTree)
    .filter(fileID => {
      return directoryTree[fileID].parents
        && directoryTree[fileID].parents[0] === file.id;
    });

  console.log("how much do i render?");

  const isFolder = file.mimeType === 'application/vnd.google-apps.folder';

  return (
    <>
      <div style={{display: 'flex', marginLeft: isFolder ? '0px' : '30px', alignItems: 'center'}}>
        {
          isFolder
          &&
          <Button
            onClick={() => setIsCollapsed(!isCollapsed)}
            minimal
            style={{borderRadius: '50%', width: '10px', height: '10px'}}
          >
            <Icon
              icon={'chevron-' + (isCollapsed ? 'right' : 'down')}
              color='#677'
            />
          </Button>
        }
        <FileElement
          file={file}
          user={user}
          folderOpenHandler={folderOpenHandler}
        />
      </div>
      {
        !isCollapsed && <ul style={{paddingLeft: '0px'}}>
        {
          fileIDsInCurrentFolder.map(id => directoryTree[id]).map(file => 
            <li key={file.id} style={{listStyle: 'none', marginLeft: '0.4rem'}}>
              <Tree
                file={file}
                user={user}
                folderOpenHandler={folderOpenHandler}
                sortBy={sortBy}
                limit={limit}
              />
            </li>
          )
        }
        </ul>
      }
    </>
  );
  
}

const TreeView = ({files, sortBy, selectedFiles, setSelectedFiles, folderOpenHandler, limit, user, view}) => {
  const selectedState = {};
  selectedFiles.forEach(fileID => { selectedState[fileID] = true });

  return (
    <ul className="FileElementList TreeViewList">
      <li className="DetailFileElementHeader" style={listStyle}>
        <FileElementHeader/>
      </li>
      {
      files
        .map(file => (
          <li style={listStyle} key={file.id}>
            <Tree
              file={file}
              selected={selectedState[file.id]}
              folderOpenHandler={folderOpenHandler}
              user={user}
              view={view}
            />
          </li>
        ))
      }
    </ul>
    );
}

const ColumnView = ({files, sortBy, selectedFiles, setSelectedFiles, folderOpenHandler, limit, user, view}) => {
  const selectedState = {};
  selectedFiles.forEach(fileID => { selectedState[fileID] = true });

  return (
    <ul className="FileElementList IconViewList">
      {
      files
        .map(file => (
          <li style={listStyle} key={file.id}>
            <FileElement
              file={file}
              selected={selectedState[file.id]}
              folderOpenHandler={folderOpenHandler}
              user={user}
              view={view}
            />
          </li>
        ))
      }
    </ul>
    );
}

const FileElementList = ({files, sortBy, directoryTree, loading, selectedFiles, setSelectedFiles, folderOpenHandler, limit, user, view}) => {
  const selectedState = {};
  selectedFiles.forEach(fileID => { selectedState[fileID] = true });

  if (!user) return <></>;

  if (!files || loading)
    return (<div className="FileElementList centre-content"><Spinner/></div>);

  if (files.length === 0)
    return (<div className="FileElementList centre-content"><EmptyFolder/></div>);

  const sortedFiles = (sortBy ? files.sort((a, b) => b[sortBy] - a[sortBy]) : files).slice(0, limit);
  const props = {files: sortedFiles, sortBy, loading, selectedFiles, setSelectedFiles, folderOpenHandler, limit, user, view};

  if (view === 'icon-view') return <IconView {...props} />
  if (view === 'tree-view') return <TreeView {...props} />
  if (view === 'column-view') return <ColumnView {...props} />  

  return <ListView {...props} />
}

export default FileElementList;
