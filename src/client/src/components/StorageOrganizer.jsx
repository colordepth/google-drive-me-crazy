import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Icon } from "@blueprintjs/core";

import FileElementList from './FileElementList';
import FileElement from './FileElement';
import NavigationBar from './NavigationBar';
import StatusBar from './StatusBar';
import './StorageAnalyzer.css';

import { selectFilesForUser, selectActiveMajorFetchCount } from '../services/fileManagerService';
import { selectUserByID } from '../services/userSlice';
import { clearHighlights } from '../services/tabSlice';

import { humanFileSize } from '../services/filesMiscellaneous';
import ToolBar from './ToolBar';

function resetHighlightedFiles(clickedNode, dispatch, tabID) {
  const fileElementsDOM = Array.from(document.getElementsByClassName('FileElement'));

  let clickedOnFileElement = false;

  fileElementsDOM.forEach(fileElement => {
    if (fileElement.contains(clickedNode)) {
      clickedOnFileElement = true;
    }
  })

  if (!clickedOnFileElement) dispatch(clearHighlights(tabID));
}

const DuplicateFilesManager = ({ userID, tab }) => {
  
  const [viewMode, setViewMode] = useState('list-view');
  const allFiles = useSelector(selectFilesForUser(userID));
  const user = useSelector(selectUserByID(userID));
  const [duplicateFilesLists, setDuplicateFilesLists] = useState([]);

  useEffect(() => {
    const fileChecksumMap = {};

    allFiles && allFiles.filter(file => 
        file.owners && file.owners.length && file.owners[0].me
      ).forEach(file => {
        if (!file.md5Checksum) return;
        if (!fileChecksumMap[file.md5Checksum])
          fileChecksumMap[file.md5Checksum] = [];
        fileChecksumMap[file.md5Checksum].push(file);
      });

    const duplicateFilesList = Object.values(fileChecksumMap).filter(filesList => filesList.length > 1);
    setDuplicateFilesLists(duplicateFilesList);
  }, [allFiles]);

  const dispatch = useDispatch();

  const highlightedEntitiesList = Object
    .keys(tab.highlightedEntities)
    .map(entityID => tab.highlightedEntities[entityID]);

  return (
    <div className='StorageOrganizer' onClick={(event) => resetHighlightedFiles(event.target, dispatch, tab.id)}>
      <NavigationBar tab={ tab } user= { user } folderOpenHandler={ () => {} } />
      <ToolBar
        highlightedEntitiesList={ highlightedEntitiesList }
        user={ user }
        targetFolderID={ 'storage-analyzer' }
        viewMode={ viewMode }
        setViewMode={ setViewMode }
      />
      <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'scroll'}}>
        {
          duplicateFilesLists.map(filesList => <div>
            {/* <div style={{display: 'flex', justifyContent: 'center', background: '#FBFBFD'}}>
              <div>
                <FileElement
                  entity={filesList[0]}
                  user={user}
                  tabID={tab.id}
                  view={'icon-view'}
                />
              </div>
            </div> */}
            <FileElementList
              entities={filesList}
              foldersFirst={false}
              sortBy='quotaBytesUsed'
              user={user}
              tabID={tab.id}
              view={ viewMode }
              hideScrollbar={true}
            />
            {/* <StatusBar noOfFiles={filesList.length}/> */}
          </div>)
        }
      </div>
    </div>
  );  
}

const StorageOrganizer = ({ userID, tab }) => {
  return <DuplicateFilesManager userID={userID} tab={tab} />;
}

const UntitledFilesManager = ({ userID, tab }) => {

  const [viewMode, setViewMode] = useState('icon-view');
  const allFiles = useSelector(selectFilesForUser(userID));
  const user = useSelector(selectUserByID(userID));

  const untitledFiles = allFiles && allFiles.filter(file => 
      file.owners && file.owners.length && file.owners[0].me
    ).filter(file => /untitled/.exec(file.name.toLowerCase()));

  const dispatch = useDispatch();

  const highlightedEntitiesList = Object
    .keys(tab.highlightedEntities)
    .map(entityID => tab.highlightedEntities[entityID]);

  return (
    <div className='StorageOrganizer' onClick={(event) => resetHighlightedFiles(event.target, dispatch, tab.id)}>
      <NavigationBar tab={ tab } user= { user } folderOpenHandler={ () => {} } />
      <ToolBar
        highlightedEntitiesList={ highlightedEntitiesList }
        user={ user }
        targetFolderID={ 'storage-analyzer' }
        viewMode={ viewMode }
        setViewMode={ setViewMode }
      />
      <FileElementList
        loading={!(untitledFiles && untitledFiles.length)}
        entities={untitledFiles}
        foldersFirst={false}
        sortBy='quotaBytesUsed'
        user={user}
        tabID={tab.id}
        view={ viewMode }
      />
      <StatusBar noOfFiles={untitledFiles && untitledFiles.length}/>
    </div>
  );  
}

export default StorageOrganizer;
