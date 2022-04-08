import { useDispatch } from 'react-redux';
import { Button } from "@blueprintjs/core";

import { selectEntity } from '../services/fileManagerService';
import { openPath } from '../services/tabSlice';

const ParentDirectoryButton = ({ tabID, user, parentFolderID }) => {
  const dispatch = useDispatch();

  function switchToParentFolder() {
    selectEntity(parentFolderID, user)
      .then(parentFolder => {
        dispatch(openPath({
          id: tabID,
          path: {
            path: parentFolder.id,
            name: parentFolder.name,
            userID: user.minifiedID
          }
        }));
      })
  }

  return (
    <Button
      icon='arrow-up'
      minimal
      small
      className="ParentDirectoryButton"
      disabled={ !parentFolderID }
      onClick={switchToParentFolder}
    />
  );
}

export default ParentDirectoryButton;
