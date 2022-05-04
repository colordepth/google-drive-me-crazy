import { Spinner } from '@blueprintjs/core';
import ReactTimeAgo from 'react-time-ago';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, MenuItem, MenuDivider } from "@blueprintjs/core";

import { createTab, switchActiveTab } from '../services/tabSlice';
import { ContextMenu2 } from "@blueprintjs/popover2";

import { humanFileSize } from '../services/filesMiscellaneous';
import { clearHighlights, toggleHighlight, selectHighlightedStatus, selectActiveTab } from '../services/tabSlice';
import store from '../services/store';
import { openPath, selectTab } from '../services/tabSlice';

import DetailViewElement from './DetailViewElement';
import IconViewElement from './IconViewElement';
import TreeViewElement from './TreeViewElement';

import './FileElement.css';
import { addFileToTag, selectEntity } from '../services/fileManagerService';
import { selectUserByID, setCreateTagVisibility } from '../services/userSlice';
import { updateProperty } from '../services/filesUpdate';

export const HumanReadableTime = ({epoch}) => {
  if (epoch)
    return <span><ReactTimeAgo date={ new Date(epoch)}/></span>
  return <span style={{marginLeft: '2rem'}}>-</span>
}

export function singleClickHandler(event, entity, tabID) {
  console.log('single click', entity, tabID);
  if (!(event.ctrlKey || event.metaKey)) {
    store.dispatch(clearHighlights(tabID));
  }

  store.dispatch(toggleHighlight({tabID, targetFile: entity}));
}

export function rightClickHandler(event, entity, tabID) {
  console.log('right click', entity, tabID);

  const tab = selectTab(tabID)(store.getState());

  if (!tab.highlightedEntities[entity.id]) {
    store.dispatch(clearHighlights(tabID));
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

const FileElementContextMenu = React.memo(({target}) => {
  const tab = useSelector(selectActiveTab);
  const userID = tab.pathHistory.at(-1).userID;
  const user = useSelector(selectUserByID(userID));
  const entity = target.props.entity;
  const highlightedEntities = tab.highlightedEntities;
  const multipleSelected = Object.keys(highlightedEntities).length > 1;
  const dispatch = useDispatch();

  async function openContainingFolder() {
    const parent = await selectEntity(entity.parents[0], user);

    const newTabID = dispatch(createTab({
      pathObject: {
        name: parent.name,
        path: entity.parents[0],
        userID
      }
    }));
    dispatch(switchActiveTab(newTabID));
    dispatch(toggleHighlight({tabID: newTabID, targetFile: entity}));
  }

  function addHighlightedItemsToTag(tag) {
    console.log("added items to tag", tag.name);
  
    Object.keys(tab.highlightedEntities).forEach(async entityID => {
      await addFileToTag(entityID, [tag.name, 'tag'], user);
      dispatch(toggleHighlight({tabID: tab.id, targetFile: await selectEntity(entityID, user)}))
    })
  }

  return (
    <ContextMenu2
      content={
        <Menu>
          {!multipleSelected && <MenuItem icon="document-open" text="Open" onClick={() => doubleClickHandler(entity, tab.id)} />}
          {
          !multipleSelected && entity.parents && 
            <MenuItem
              icon="folder-shared-open"
              text="Open containing folder"
              shouldDismissPopover={false}
              onClick = {openContainingFolder}
            />
          }
          {/* <MenuItem icon="star" text="Add to Starred" /> */}
          {/* <MenuItem icon="star-empty" text="Remove from Starred" /> */}
          {!multipleSelected && <MenuDivider />}
          <MenuItem icon="cut" text="Cut"/>
          <MenuItem icon="duplicate" text="Copy"/>
          {/* <MenuItem icon="clipboard" text="Paste"/> */}
          <MenuDivider />
          {!multipleSelected && <MenuItem icon="edit" text="Rename"/>}
          <MenuItem icon="trash" text="Move to Trash" intent='danger' />
          {!multipleSelected && <MenuItem icon="link" text="Share"/>}
          <MenuItem icon="tag" text="Add to tags">
            {user && user.tags.map(tag => <MenuItem key={tag.name} icon="tag" text={tag.name.replace('&', ' ')} onClick={() => addHighlightedItemsToTag(tag)}/>)}
            <MenuDivider />
            <MenuItem icon="plus" text="Create Tag" onClick={() => {dispatch(setCreateTagVisibility({userID: user.minifiedID, visible: true}))}}/>
          </MenuItem>
          <MenuDivider />
          {!multipleSelected && <MenuItem icon="properties" text="Properties" />}
      </Menu>
      }
    >
      {target}
    </ContextMenu2>
  );
});

const FileElement = React.memo(({entity, user, view, tabID, onlyFolders}) => {
  const selected = !!useSelector(selectHighlightedStatus(tabID, entity.id));

  let fileSize = humanFileSize(parseInt(entity.quotaBytesUsed));

  if (entity.mimeType === 'application/vnd.google-apps.folder' && !entity.childrenIDs)
    fileSize = <><Spinner size={20}/></>;

  const props = {entity, fileSize, selected, user, tabID, onlyFolders};

  if (view === 'icon-view') return <FileElementContextMenu target={<IconViewElement {...props} />}/>
  if (view === 'tree-view') return <FileElementContextMenu target={<TreeViewElement {...props} />}/>
  if (view === 'column-view') return <FileElementContextMenu target={<IconViewElement {...props} />}/>

  return <FileElementContextMenu target={<DetailViewElement {...props} />}/>;
});

// {<Icon icon='folder-close' intent='primary' style={iconStyle}/>}

export default FileElement;
