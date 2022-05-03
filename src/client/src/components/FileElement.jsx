import { Spinner } from '@blueprintjs/core';
import ReactTimeAgo from 'react-time-ago';
import React from 'react';
import { useSelector } from 'react-redux';
import { Menu, MenuItem, MenuDivider } from "@blueprintjs/core";
import { ContextMenu2 } from "@blueprintjs/popover2";

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

export function rightClickHandler(event, entity, tabID) {
  console.log('right click', entity, tabID);

  const tab = selectTab(tabID)(store.getState());

  if (Object.keys(tab.highlightedEntities).length === 0) {
    store.dispatch(toggleHighlight({tabID, targetFile: entity}));
  }
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

const FileElementContextMenu = ({target}) => {
  return (
    <ContextMenu2
      content={
        <Menu>
          <MenuItem icon="document-open" text="Open" />
          <MenuItem icon="folder-shared-open" text="Open folder in new tab" shouldDismissPopover={false} />
          {/* <MenuItem icon="star" text="Add to Starred" /> */}
          <MenuItem icon="star-empty" text="Remove from Starred" />
          <MenuDivider />
          <MenuItem icon="cut" text="Cut"/>
          <MenuItem icon="duplicate" text="Copy"/>
          <MenuItem icon="clipboard" text="Paste"/>
          <MenuDivider />
          <MenuItem icon="edit" text="Rename"/>
          <MenuItem icon="trash" text="Move to Trash" intent='danger' />
          <MenuItem icon="link" text="Share"/>
          <MenuItem icon="tag" text="Add to tags">
            <MenuItem icon="tag" text="Design"/>
            <MenuItem icon="tag" text="Programming"/>
            <MenuItem icon="tag" text="Photography"/>
          </MenuItem>
          <MenuDivider />
          <MenuItem icon="properties" text="Properties" />
      </Menu>
      }
    >
      {target}
    </ContextMenu2>
  );
}

const FileElement = React.memo(({entity, user, view, tabID, onlyFolders}) => {

  const selected = !!useSelector(selectHighlightedStatus(tabID, entity.id));

  let fileSize = humanFileSize(parseInt(entity.quotaBytesUsed));

  if (entity.mimeType === 'application/vnd.google-apps.folder' && !entity.childrenIDs)
    fileSize = <><Spinner size={20}/></>;

  const props = {entity, fileSize, selected, user, tabID, onlyFolders};

  if (view === 'icon-view') return <FileElementContextMenu target={<IconViewElement {...props} />} />
  if (view === 'tree-view') return <FileElementContextMenu target={<TreeViewElement {...props} />} />
  if (view === 'column-view') return <FileElementContextMenu target={<IconViewElement {...props} />} />

  return <FileElementContextMenu target={<DetailViewElement {...props} />} />;
});

// {<Icon icon='folder-close' intent='primary' style={iconStyle}/>}

export default FileElement;
