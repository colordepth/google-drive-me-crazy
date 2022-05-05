import { useState } from 'react';
import { Button, ButtonGroup, Text, Toaster, Position } from "@blueprintjs/core";

import FileUpload from './FileUpload';
import { useDispatch, useSelector } from 'react-redux';
import { clearClipboard, selectClipboard, setClipboard } from '../services/clipboardSlice';
import { renameEntity, moveEntitiesToFolder, trashEntity } from '../services/fileManagerService';
import { selectDirectoryTreeForUser, setDirectoryTreeTo, updateFilesAndFolders } from '../services/directoryTreeSlice';

const AppToaster = Toaster.create({
  className: "recipe-toaster",
  position: Position.BOTTOM_RIGHT,
});

function moveToClipboard(entities, mode, dispatch) {
  dispatch(setClipboard({entities, mode}));
  AppToaster.show({ message: `Added ${entities.length} items to clipboard`});
}

function trashEntities(entities, user) {
  AppToaster.show({ message: `Deleting ${entities.length} items...` });
  Promise.all(entities.map(entity => trashEntity(entity.id, user)))
  .then(() => AppToaster.show({ message: `Deleted ${entities.length} items`, intent: 'danger' }))
}

function pasteToFolder(clipboard, targetFolderID, credentials, dispatch) {
    // if directoryTree is not built, changes will not reflect on the screen.
  AppToaster.show({ message: `Pasting ${clipboard.entities.length} files...` });
  if (clipboard.mode === 'cut') {
    moveEntitiesToFolder(clipboard.entities, targetFolderID, credentials)
      .then(results => {
        console.log("Successfully moved", results);
        dispatch(clearClipboard());
        AppToaster.show({ message: `Pasted ${clipboard.entities.length} items successfully ✅`, intent: 'success'})
      })
  }
}

function renameSelectedFile(entityID, credentials) {
  // TODO: renameEntity will only reflect on screen after directory tree is initialized.
  const newName = prompt("Enter new file name");

  if (!newName) return;

  renameEntity(entityID, newName, credentials)
    .then(result => {
      console.log(result);
      AppToaster.show({ message: `Rename successful`, intent: 'success' });
    })
}

const ToolBar = ({ highlightedEntitiesList, user, targetFolderID, viewMode, setViewMode }) => {
  const [overlayState, setOverlayState] = useState(false);
  const clipboard = useSelector(selectClipboard);
  const dispatch = useDispatch();

  return (
    <div className="ToolBar" style={{display: 'flex', alignItems: 'center'}}>
      <FileUpload isOpen={overlayState} onClose={() => setOverlayState(false)} user={user} targetFolderID={targetFolderID}/>
      <Button
        small
        minimal
        icon='add'
        rightIcon="chevron-down"
        text="New"
        onClick={() => setOverlayState(true)}
        className = {!['storage-analyzer', 'storage-organizer'].find(x => targetFolderID==x) ? '' : 'Hidden'}
      />
      {targetFolderID === 'storage-organizer' && <span style={{display: 'flex', alignItems: 'center', fontWeight: '600', fontSize: '18px'}}>Duplicate Files</span>}
      <ButtonGroup>
        <Button small minimal icon='cut'
          className={highlightedEntitiesList.length ? '':'Hidden'}
          text="Cut"
          onClick={() => moveToClipboard(highlightedEntitiesList, 'cut', dispatch)}
        />
        <Button small minimal icon='duplicate'
          className={highlightedEntitiesList.length ? '':'Hidden'}
          text="Copy"
          onClick={() => moveToClipboard(highlightedEntitiesList, 'cut', dispatch)}
        />
        <Button small minimal icon='clipboard'
          className={clipboard.entities.length && !['storage-analyzer', 'storage-organizer'].find(x => targetFolderID==x) ? '':'Hidden'}
          text="Paste"
          onClick={() => pasteToFolder(clipboard, targetFolderID, user, dispatch)}
        />
      </ButtonGroup>
      <Button small minimal icon='edit'
        className={highlightedEntitiesList.length===1 ? '':'Hidden'}
        text="Rename"
        onClick={() => renameSelectedFile(highlightedEntitiesList[0].id, user)}
      />
      <Button small minimal intent='danger' icon='trash'
        className={highlightedEntitiesList.length ? '':'Hidden'}
        text="Trash"
        onClick={() => trashEntities(highlightedEntitiesList, user)}
      />
      
      <div style={{alignItems: 'stretch', overflow: 'hidden', marginLeft: 'auto', marginRight: '2rem', display: 'flex'}}>
        <span style={{display: 'flex', alignItems: 'center', padding: '0 1rem', fontWeight: '600', color: '#777', fontSize: '0.85rem'}}>
          Display
        </span>
        <ButtonGroup>
          <Button small style={{padding: '0 15px'}} icon='grid'
            onClick={() => setViewMode('icon-view')}
            active={viewMode === 'icon-view'}
            disabled={targetFolderID==='storage-analyzer'}
          />
          <Button small style={{padding: '0 15px'}} icon='th'
            onClick={() => setViewMode('detail-view')}
            active={viewMode === 'detail-view'}
          />
          <Button small style={{padding: '8px 15px'}} icon='diagram-tree'
            onClick={() => setViewMode('tree-view')}
            active={viewMode === 'tree-view'}
            disabled={targetFolderID==='storage-analyzer'}
          />
          {/* <Button small style={{padding: '0 15px'}} icon='list-columns'
            onClick={() => setViewMode('list-view')}
            active={viewMode === 'list-view'}
          />
          <Button small style={{padding: '0 15px'}} icon='two-columns'
            onClick={() => setViewMode('column-view')}
            active={viewMode === 'column-view'}
          /> */}
        </ButtonGroup>
      </div>
    </div>
    );
}

export default ToolBar;
