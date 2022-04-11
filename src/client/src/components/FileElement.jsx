import { Spinner } from '@blueprintjs/core';
import ReactTimeAgo from 'react-time-ago';
import React from 'react';
import { useSelector } from 'react-redux';

import { humanFileSize } from '../services/filesMiscellaneous';
import { clearHighlights, toggleHighlight, selectHighlightedStatus } from '../services/tabSlice';
import store from '../services/store';
import { openPath, selectTab } from '../services/tabSlice';

import DetailViewElement from './DetailViewElement';
import IconViewElement from './IconViewElement';
import TreeViewElement from './TreeViewElement';

import './FileElement.css';

export const HumanReadableTime = ({epoch}) => {
  if (epoch)
    return <span><ReactTimeAgo date={ new Date(epoch)}/></span>
  return <span style={{marginLeft: '2rem'}}>-</span>
}

export function singleClickHandler(event, entity, tabID) {
  console.log('single click', entity, tabID);
  if (!event.ctrlKey) {
    store.dispatch(clearHighlights(tabID));
  }

  store.dispatch(toggleHighlight({tabID, targetFile: entity}));
}

export function doubleClickHandler(entity, tabID) {
  console.log('double click', entity);

  if (entity.mimeType === 'application/vnd.google-apps.folder')
  {
    const tab = selectTab(tabID)(store.getState());

    store.dispatch(openPath({
      id: tabID,
      path: {
        path: entity.id,
        name: entity.name,
        userID: tab.pathHistory.at(tab.activePathIndex).userID
      }
    }));
      
  }
  else
    window.open(entity.webViewLink);
}

const FileElement = React.memo(({entity, user, view, tabID}) => {

  const selected = !!useSelector(selectHighlightedStatus(tabID, entity.id));

  let fileSize = humanFileSize(parseInt(entity.quotaBytesUsed));

  if (entity.mimeType === 'application/vnd.google-apps.folder' && !entity.childrenIDs)
    fileSize = <><Spinner size={20}/></>;

  const props = {entity, fileSize, selected, user, tabID};

  if (view === 'icon-view') return <IconViewElement {...props} />
  if (view === 'tree-view') return <TreeViewElement {...props} />
  if (view === 'column-view') return <IconViewElement {...props} />

  return <DetailViewElement {...props} />;
});

// {<Icon icon='folder-close' intent='primary' style={iconStyle}/>}

export default FileElement;
