import { UL, Spinner, Icon } from "@blueprintjs/core";
import { useSelector } from 'react-redux';

import FileElement from './FileElement';
import { selectFilesList } from '../services/currentDirectorySlice';

const listStyle = {
  listStyle: 'none'
}

const headerRowStyle = {
  display: 'grid',
  gridTemplateColumns: '30px 1fr repeat(2, 8rem) 4.7rem',
  padding: '0.6rem',
  cursor: 'pointer',
  fontSize: '1rem',
  borderRadius: '2px'
};

const FileElementList = () => {
  const files = useSelector(selectFilesList);

  if (!files)
    return (<><Spinner/></>);

  if (files.length === 0)
    return (<>No files to show</>);

  return (
    <UL>
      <li style={listStyle}>
        <div style={headerRowStyle}>
          <span style={{gridColumn: '1 / span 2', display: 'flex', alignItems: 'center'}}>
            <span style={{marginRight: '4px'}}>File Name</span>
            <Icon icon='caret-down' color='#777' size={13}/>
          </span>
          <span style={{display: 'flex', alignItems: 'center'}}>
            <span style={{marginRight: '5px'}}>Last Viewed</span>
            <Icon icon='double-caret-vertical' color='#777' size={13}/>
          </span>
          <span style={{display: 'flex', alignItems: 'center'}}>
            <span style={{marginRight: '5px'}}>Last Modifed</span>
            <Icon icon='double-caret-vertical' color='#777' size={13}/>
          </span>
          <span style={{display: 'flex', alignItems: 'center', margin: 'auto'}}>
            <span style={{marginRight: '5px'}}>Size</span>
            <Icon icon='double-caret-vertical' color='#777' size={13}/>
          </span>
        </div>
      </li>
      {files.map(file => (
        <li style={listStyle} key={file.id}>
          <FileElement file={file}/>
        </li>
      ))}
    </UL>
    );
}

export default FileElementList;