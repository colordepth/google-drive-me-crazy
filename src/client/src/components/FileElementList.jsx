import { Spinner, Icon, Button } from "@blueprintjs/core";
import React, { useEffect, useState } from 'react';

import { selectEntitiesInsideFolder } from '../services/fileManagerService';
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
      {/* <div style={{fontSize: "15px", fontWeight: 300}}>Upload a new entity to populate the folder.</div> */}
      {/* <Button intent="primary" icon="upload" text="Upload"/> */}
    </div>
  );
}

const FileElementHeader = ({caretSortBy, isAscending, toggleIsAscending, setCaretSortBy}) => {

  return (
    <>
      <span style={{gridColumn: '1 / span 2', display: 'flex', alignItems: 'center'}} onClick={() => {toggleIsAscending(); setCaretSortBy('name')}}>
        <span style={{marginRight: '4px'}}>File Name</span>
        {caretSortBy==='name' && (!isAscending) && <Icon icon='caret-down' color='#777' size={13}/>}
        {caretSortBy==='name' && (isAscending) && <Icon icon='caret-up' color='#777' size={13}/>}
        {caretSortBy!=='name' && <Icon icon='double-caret-vertical' color='#777' size={13}/>}
      </span>
      <span style={{display: 'flex', alignItems: 'center'}} onClick={() => {toggleIsAscending(); setCaretSortBy('viewedByMeTime')}}>
        <span style={{marginRight: '5px'}} >Last Viewed</span>
        {caretSortBy==='viewedByMeTime' && isAscending && <Icon icon='caret-down' color='#777' size={13}/>}
        {caretSortBy==='viewedByMeTime' && (!isAscending) && <Icon icon='caret-up' color='#777' size={13}/>}
        {caretSortBy!=='viewedByMeTime' && <Icon icon='double-caret-vertical' color='#777' size={13}/>}
      </span>
      <span style={{display: 'flex', alignItems: 'center'}} onClick={() => {toggleIsAscending(); setCaretSortBy('modifiedTime')}}>
        <span style={{marginRight: '5px'}} >Last Modified</span>
        {caretSortBy==='modifiedTime' && isAscending && <Icon icon='caret-down' color='#777' size={13}/>}
        {caretSortBy==='modifiedTime' && (!isAscending) && <Icon icon='caret-up' color='#777' size={13}/>}
        {caretSortBy!=='modifiedTime' && <Icon icon='double-caret-vertical' color='#777' size={13}/>}
      </span>
      <span style={{display: 'flex', alignItems: 'center', margin: 'auto'}} onClick={() => {toggleIsAscending(); setCaretSortBy('quotaBytesUsed')}}>
        <span style={{marginRight: '5px'}} >Size</span>
        {caretSortBy==='quotaBytesUsed' && isAscending && <Icon icon='caret-down' color='#777' size={13}/>}
        {caretSortBy==='quotaBytesUsed' && (!isAscending) && <Icon icon='caret-up' color='#777' size={13}/>}
        {caretSortBy!=='quotaBytesUsed' && <Icon icon='double-caret-vertical' color='#777' size={13}/>}
      </span>
    </>
  );
}

const ListView = ({entities, user, view, tabID, hideScrollbar, sortBy, limit}) => {
  const style = hideScrollbar ? {overflowY: 'hidden'} : {};
  const [caretSortBy, setCaretSortBy] = useState(sortBy || "name");
  const [isAscending, setIsAscending] = useState(caretSortBy !== "name");

  const sortedFiles = (caretSortBy ? entities.filter(entity => entity.mimeType !== "application/vnd.google-apps.folder").sort((a, b) => {
    const bQuantity = caretSortBy === "name" ? b[caretSortBy].toLowerCase() : (b[caretSortBy] ? b[caretSortBy] : 0);
    const aQuantity = caretSortBy === "name" ? a[caretSortBy].toLowerCase() : (a[caretSortBy] ? a[caretSortBy] : 0);

    return (isAscending ? +1 : -1)*((bQuantity > aQuantity ? +1 : (bQuantity < aQuantity ? -1 : 0)))
  }) : entities.filter(entity => entity.mimeType !== "application/vnd.google-apps.folder")).slice(0, limit);
  
  const sortedFolders = (caretSortBy ? entities.filter(entity => entity.mimeType === "application/vnd.google-apps.folder").sort((a, b) => {
    if (!b[caretSortBy]) return b;

    const bQuantity = caretSortBy === "name" ? b[caretSortBy].toLowerCase() : b[caretSortBy];
    const aQuantity = caretSortBy === "name" ? a[caretSortBy].toLowerCase() : a[caretSortBy];

    return (isAscending ? +1 : -1)*((bQuantity > aQuantity ? +1 : (bQuantity < aQuantity ? -1 : 0)))
  }) : entities.filter(entity => entity.mimeType === "application/vnd.google-apps.folder")).slice(0, limit);

  return (
    <ul className="FileElementListContainer FileElementList" style={style}>
      <li className="DetailFileElementHeader" style={listStyle}>
        <FileElementHeader caretSortBy={caretSortBy} setCaretSortBy={setCaretSortBy} isAscending={isAscending} toggleIsAscending={() => setIsAscending(!isAscending)}/>
      </li>
      {
      [...sortedFolders, ...sortedFiles]
        .map(entity => (
          <li style={listStyle} key={entity.id}>
            <FileElement
              entity={entity}
              user={user}
              tabID={tabID}
              view={view}
            />
          </li>
        ))
      }
    </ul>
    );
}

const IconView = ({entities, sortBy, limit, user, view, tabID, hideScrollbar}) => {
  const style = hideScrollbar ? {overflowY: 'hidden'} : {};

  const [caretSortBy, setCaretSortBy] = useState(sortBy);
  const [isAscending, setIsAscending] = useState(caretSortBy !== "name");

  const sortedFiles = (caretSortBy ? entities.filter(entity => entity.mimeType !== "application/vnd.google-apps.folder").sort((a, b) => {
    const bQuantity = caretSortBy === "name" ? b[caretSortBy].toLowerCase() : (b[caretSortBy] ? b[caretSortBy] : 0);
    const aQuantity = caretSortBy === "name" ? a[caretSortBy].toLowerCase() : (a[caretSortBy] ? a[caretSortBy] : 0);

    return (isAscending ? +1 : -1)*((bQuantity > aQuantity ? +1 : (bQuantity < aQuantity ? -1 : 0)))
  }) : entities.filter(entity => entity.mimeType !== "application/vnd.google-apps.folder")).slice(0, limit);
  
  const sortedFolders = (caretSortBy ? entities.filter(entity => entity.mimeType === "application/vnd.google-apps.folder").sort((a, b) => {
    if (!b[caretSortBy]) return b;

    const bQuantity = caretSortBy === "name" ? b[caretSortBy].toLowerCase() : b[caretSortBy];
    const aQuantity = caretSortBy === "name" ? a[caretSortBy].toLowerCase() : a[caretSortBy];

    return (isAscending ? +1 : -1)*((bQuantity > aQuantity ? +1 : (bQuantity < aQuantity ? -1 : 0)))
  }) : entities.filter(entity => entity.mimeType === "application/vnd.google-apps.folder")).slice(0, limit);


  return (
    <div className="FileElementListContainer" style={style}>
      <ul className="FileElementList IconViewList">
        {
        [...sortedFolders, ...sortedFiles]
          .map(entity => (
            <li style={listStyle} key={entity.id}>
              <FileElement
                entity={entity}
                user={user}
                tabID={tabID}
                view={view}
              />
            </li>
          ))
        }
      </ul>
    </div>
    );
}

const requestedFields = ["id", "name", "mimeType",
"quotaBytesUsed", "webViewLink", "webContentLink", "iconLink", "modifiedTime", "viewedByMeTime"];

const TreeFolder = React.memo(({entity, sortBy, limit, user, tabID, onlyFolders}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [childrenEntities, setChildrenEntities] = useState(null);

  useEffect(() => {
    if (entity.mimeType !== 'application/vnd.google-apps.folder')
      setChildrenEntities([]);
    else
      selectEntitiesInsideFolder(entity.id, user, requestedFields)
        .then(entities => setChildrenEntities(entities));
  }, [entity]);

  console.log("how much do i render?");

  return (
    <>
      <div style={{display: 'flex', marginLeft: '0px', alignItems: 'center'}}>
        <Button
          onClick={() => setIsCollapsed(!isCollapsed)}
          minimal
          style={{borderRadius: '50%', width: '3px', height: '3px'}}
          className={
            childrenEntities && (
              childrenEntities.length===0 || (onlyFolders && !childrenEntities.find(entity => entity.mimeType === 'application/vnd.google-apps.folder'))
            )
            ? 'HiddenSidebarButton' : ''}
        >
          <Icon
            icon={'chevron-' + (isCollapsed ? 'right' : 'down')}
            color='#677'
            size={14}
          />
        </Button>
        <FileElement
          entity={entity}
          user={user}
          tabID={tabID}
          view='tree-view'
          onlyFolders={onlyFolders}
        />
      </div>
      {
        !isCollapsed && <ul style={{paddingLeft: '8px'}}>
        {
          !childrenEntities ? <Spinner size={20}/> :
          childrenEntities.map(entity => 
            <li key={entity.id} style={{listStyle: 'none', marginLeft: '0.4rem'}}>
              {
                entity.mimeType === 'application/vnd.google-apps.folder'  ?
                <TreeFolder
                  entity={entity}
                  user={user}
                  sortBy={sortBy}
                  limit={limit}
                  tabID={tabID}
                  onlyFolders={onlyFolders}
                />
                :
                onlyFolders ? <></> : <TreeFile
                  entity={entity}
                  user={user}
                  tabID={tabID}
                />
              }
            </li>
          )
        }
        </ul>
      }
    </>
  );
});

const TreeFile = React.memo(({entity, user, tabID}) => {
  console.log("how much do i render?");

  return (
    <>
      <div style={{display: 'flex', marginLeft: '30px', alignItems: 'center'}}>
        <FileElement
          entity={entity}
          user={user}
          tabID={tabID}
          view='tree-view'
        />
      </div>
    </>
  );
});

export const TreeView = React.memo(({entities, sortBy, limit, user, view, tabID, onlyFolders, hideScrollbar}) => {
  // List of trees below a Header
  const style = hideScrollbar ? {overflowY: 'hidden'} : {};
  const [caretSortBy, setCaretSortBy] = useState(sortBy);
  const [isAscending, setIsAscending] = useState(caretSortBy !== "name");

  const sortedFiles = (caretSortBy ? entities.filter(entity => entity.mimeType !== "application/vnd.google-apps.folder").sort((a, b) => {
    const bQuantity = caretSortBy === "name" ? b[caretSortBy].toLowerCase() : (b[caretSortBy] ? b[caretSortBy] : 0);
    const aQuantity = caretSortBy === "name" ? a[caretSortBy].toLowerCase() : (a[caretSortBy] ? a[caretSortBy] : 0);

    return (isAscending ? +1 : -1)*((bQuantity > aQuantity ? +1 : (bQuantity < aQuantity ? -1 : 0)))
  }) : entities.filter(entity => entity.mimeType !== "application/vnd.google-apps.folder")).slice(0, limit);
  
  const sortedFolders = (caretSortBy ? entities.filter(entity => entity.mimeType === "application/vnd.google-apps.folder").sort((a, b) => {
    if (!b[caretSortBy]) return b;

    const bQuantity = caretSortBy === "name" ? b[caretSortBy].toLowerCase() : b[caretSortBy];
    const aQuantity = caretSortBy === "name" ? a[caretSortBy].toLowerCase() : a[caretSortBy];

    return (isAscending ? +1 : -1)*((bQuantity > aQuantity ? +1 : (bQuantity < aQuantity ? -1 : 0)))
  }) : entities.filter(entity => entity.mimeType === "application/vnd.google-apps.folder")).slice(0, limit);


  return (
    <ul className={"FileElementListContainer FileElementList TreeViewList".concat(onlyFolders ? " SidebarTreeList" : "")} style={style}>
      {!onlyFolders && 
      <li className="DetailFileElementHeader" style={listStyle}>
        <FileElementHeader caretSortBy={caretSortBy} setCaretSortBy={setCaretSortBy} isAscending={isAscending} toggleIsAscending={() => setIsAscending(!isAscending)}/>
      </li>
      }
      {
      [...sortedFolders, ...sortedFiles]
        .map(entity => (
          <li style={listStyle} key={entity.id}>
            {
              entity.mimeType === 'application/vnd.google-apps.folder'  ?
              <TreeFolder
                entity={entity}
                user={user}
                sortBy={sortBy}
                limit={limit}
                tabID={tabID}
                onlyFolders={onlyFolders}
              />
              :
              onlyFolders ? <></> :
              <TreeFile
                entity={entity}
                user={user}
                tabID={tabID}
              />
            }
          </li>
        ))
      }
    </ul>
    );
});

const ColumnView = ({entities, sortBy, limit, user, view, tabID, hideScrollbar}) => {
  const style = hideScrollbar ? {overflowY: 'hidden'} : {};

  return (
    <ul className="FileElementListContainer FileElementList IconViewList" style={style}>
      {
      entities
        .map(entity => (
          <li style={listStyle} key={entity.id}>
            <FileElement
              entity={entity}
              user={user}
              view={view}
              tabID={tabID}
            />
          </li>
        ))
      }
    </ul>
    );
}

const FileElementList = ({entities, sortBy, loading, limit, user, view, tabID, hideScrollbar}) => {

  if (!user) return <></>;

  if (!entities || loading)
    return (<div className="FileElementListContainer FileElementList centre-content"><Spinner/></div>);

  if (entities.length === 0)
    return (<div className="FileElementListContainer FileElementList centre-content"><EmptyFolder/></div>);

  const props = {entities, sortBy: sortBy || "name", loading, limit, user, view, tabID, onlyFolders: false, hideScrollbar};

  if (view === 'icon-view') return <IconView {...props} />
  if (view === 'tree-view') return <TreeView {...props} />
  // if (view === 'column-view') return <ColumnView {...props} />  

  return <ListView {...props} />
}

export default FileElementList;
