import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from "@blueprintjs/core";

import { popFromPath, selectPath } from '../services/pathSlice';

const ParentDirectoryButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const path = useSelector(selectPath);
  const currentFolder = path.slice(-1)[0];

  function switchToParentFolder() {
    navigate('/' + currentFolder.parents[0]);
    dispatch(popFromPath());
  }

  return (
    <Button
      icon='arrow-up'
      minimal
      small
      className="ParentDirectoryButton"
      disabled={!(currentFolder && currentFolder.parents)}
      onClick={switchToParentFolder}/>
  );
}

export default ParentDirectoryButton;
