import FileElement from './FileElement';
import { UL, Spinner } from "@blueprintjs/core";

const listStyle = {
  listStyle: 'none',
  border: '1px solid #cccccc',
  padding: '0.6rem',
  cursor: 'pointer'
}

const FileElementList = ({files, onClickHandler}) => {
  if (files===null)
    return (<><Spinner/></>);

  if (files.length === 0)
    return (<>No files to show</>);

  return (
    <UL>
      {files.map(file => (
        <li style={listStyle} key={file.id} onClick={() => onClickHandler(file)}>
          <FileElement file={file}/>
        </li>
      ))}
    </UL>
    );
}

export default FileElementList;