import React from 'react';
import { Icon, Text } from '@blueprintjs/core';
import { singleClickHandler, rightClickHandler, doubleClickHandler, HumanReadableTime} from './FileElement';

const TreeViewElement = React.memo(({entity, fileSize, selected, tabID, onlyFolders}) => {
  const classes = 'FileElement DetailFileElement'.concat(selected ? ' DetailFileElementSelected' : '')
  console.log(33, classes.concat(onlyFolders ? ' SidebarTreeElement' : ''));
  return (
    <div
      onClick={(event) => doubleClickHandler(entity, tabID)}
      onDoubleClick={() => doubleClickHandler(entity, tabID)}
      onContextMenu={(event) => rightClickHandler(event, entity, tabID)}
      className={classes.concat(onlyFolders ? ' SidebarTreeElement' : '')}
    >
      <Icon icon={<img src={ entity.iconLink } alt="icon"/>} intent='none'/>
      <div style={{maxWidth: '25rem'}}><Text ellipsize='true' style={{color: "black"}}>{ entity.name }</Text></div>
      {
        !onlyFolders && 
        <>
          <HumanReadableTime epoch={ entity.viewedByMeTime }/>
          <HumanReadableTime epoch={ entity.modifiedTime }/>
          <div style={{marginLeft: 'auto', marginRight: '1rem'}}>{ fileSize }</div>
        </>
      }
    </div>
  );
});

export default TreeViewElement;
