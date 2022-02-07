import { Button } from "@blueprintjs/core";
import { useNavigate } from 'react-router-dom';
import { popFromPath, selectPath } from '../services/pathSlice';
import store from '../services/store';

function switchToParentFolder(navigate) {
  store.dispatch(popFromPath());
  navigate(`/app/${selectPath(store.getState()).slice(-1)[0].id}`);
}

const ParentDirectoryButton = () => {
  const navigate = useNavigate();
  const currentFolder = selectPath(store.getState()).slice(-1)[0];

  return (
    <Button
      icon='arrow-up'
      intent="primary"
      text="Parent Directory"
      disabled={!(currentFolder && currentFolder.parents)}
      onClick={() => switchToParentFolder(navigate)}/>
  );
}

export default ParentDirectoryButton;