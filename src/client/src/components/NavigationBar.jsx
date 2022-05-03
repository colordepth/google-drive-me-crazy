import { useEffect, useState } from 'react';
import { Breadcrumbs, InputGroup } from "@blueprintjs/core";

import { selectEntity, calculatePathFromEntityID } from '../services/fileManagerService';
import BackButton from './BackButton';
import ForwardButton from './ForwardButton';
import ParentDirectoryButton from './ParentDirectoryButton';

const NavigationBar = ({ tab, user, folderOpenHandler }) => {
  const currentFolderID = tab.pathHistory.at(tab.activePathIndex).path;
  const [currentFolder, setCurrentFolder] = useState(null);
  const [breadcrumbItems, setBreadCrumbItems] = useState([]);

  console.log("Navigation bar render");

  useEffect(() => {
    if (!user) return setBreadCrumbItems([{
      icon: "home",
      intent: "primary",
      text: 'Home'
    }]);;

    if (currentFolderID === 'storage-analyzer') return setBreadCrumbItems([{
      icon: "database",
      intent: "primary",
      text: 'Storage Analyzer'
    }]);

    if (currentFolderID === 'storage-organizer') return setBreadCrumbItems([{
      icon: "clean",
      intent: "primary",
      text: 'Storage Organizer'
    }]);

    selectEntity(currentFolderID, user)
      .then(entity => setCurrentFolder(entity))

    calculatePathFromEntityID(currentFolderID, user)
      .then(path => {

        let result = [];
        path.forEach(folder => result.push({
          icon: "folder-open",
          intent: "primary",
          text: folder.name,
          onClick: () => folderOpenHandler(folder)
        }))
        result[0] = { ...result[0], icon: "cloud" };
        setBreadCrumbItems(result);
      })
    },
    [tab.activePathIndex]
  );

  const parentFolderID = currentFolder && currentFolder.parents && currentFolder.parents[0];

  return (
    <div className="NavigationBar">
      <BackButton tab={tab}/>
      <ForwardButton tab={tab}/>
      <ParentDirectoryButton tabID={tab.id} user={user} parentFolderID={parentFolderID}/>
      <Breadcrumbs className="AddressBar" items={breadcrumbItems} fill/>
      <InputGroup
        leftIcon="search"
        onChange={() => {}}
        placeholder="Search..."
        rightElement={null}
        fill
      />
    </div>
  );
}

export default NavigationBar;
