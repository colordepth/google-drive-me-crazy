import { useState } from 'react';
import { Button, ButtonGroup } from "@blueprintjs/core";

import FileUpload from './FileUpload';

const ToolBar = ({ highlightedEntities, user, targetFolderID }) => {
  const [overlayState, setOverlayState] = useState(false);

  if (!highlightedEntities.length)
    return (
      <div className="ToolBar">
        <FileUpload isOpen={overlayState} onClose={() => setOverlayState(false)} user={user} targetFolderID={targetFolderID}/>
        <Button small minimal icon='add' rightIcon="chevron-down" text="New" onClick={() => setOverlayState(true)}/>
    </div>
    );
  return (
    <div className="ToolBar">
      <ButtonGroup>
        <Button small minimal icon='cut' text="Cut" />
        <Button small minimal icon='duplicate' text="Copy" />
        <Button small minimal disabled icon='clipboard' text="Paste" />
      </ButtonGroup>
      <Button small minimal icon='edit' text="Rename" />
      <Button small minimal intent='danger' icon='trash' text="Trash" />
    </div>
    );
}

export default ToolBar;
