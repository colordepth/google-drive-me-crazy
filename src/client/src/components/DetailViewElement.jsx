import { Icon, Text } from '@blueprintjs/core';
import { singleClickHandler, doubleClickHandler, HumanReadableTime} from './FileElement';

const DetailViewElement = ({entity, fileSize, selected, tabID}) => {
  return (
    <div
      onClick={(event) => singleClickHandler(event, entity, tabID)}
      onDoubleClick={() => doubleClickHandler(entity, tabID)}
      className={selected ? 'FileElement DetailFileElement DetailFileElementSelected' : 'FileElement DetailFileElement'}
    >
      <Icon icon={<img src={ entity.iconLink } alt="icon"/>} intent='none'/>
      <div style={{maxWidth: '25rem'}}><Text ellipsize='true' style={{color: "black"}}>{ entity.name }</Text></div>
      <HumanReadableTime epoch={ entity.viewedByMeTime }/>
      <HumanReadableTime epoch={ entity.modifiedTime }/>
      <div style={{marginLeft: 'auto', marginRight: '1rem'}}>{ fileSize }</div>
    </div>
  );
}

export default DetailViewElement;
