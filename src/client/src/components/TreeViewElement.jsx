import { Icon, Text } from '@blueprintjs/core';
import { singleClickHandler, doubleClickHandler, HumanReadableTime} from './FileElement';

const TreeViewElement = ({file, fileSize, selected, folderOpenHandler}) => {
  return (
    <div
      onClick={(event) => singleClickHandler(event, file)}
      onDoubleClick={() => doubleClickHandler(file, folderOpenHandler)}
      className={selected ? 'TreeFileElement TreeFileElementSelected' : 'TreeFileElement'}
    >
      <Icon icon={<img src={ file.iconLink } alt='icon'/>} intent='none'/>
      <div style={{maxWidth: '25rem'}}><Text ellipsize='true' style={{color: 'black'}}>{ file.name }</Text></div>
      <HumanReadableTime epoch={ file.viewedByMeTime }/>
      <HumanReadableTime epoch={ file.modifiedTime }/>
      <div style={{marginLeft: 'auto', marginRight: '1rem'}}>{ fileSize }</div>
    </div>
  );
}

export default TreeViewElement;
