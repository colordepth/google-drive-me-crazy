import { useEffect, useState } from 'react';
import { Button, Overlay, FileInput } from '@blueprintjs/core';

import { uploadSelectedFile, createFolder } from '../services/fileManagerService';

const FileUpload = ({isOpen, onClose, user, targetFolderID}) => {
  const [files, setFiles] = useState(null);
  const [fileInputText, setFileInputText] = useState("Choose file...");

  useEffect(() => files && files[0] && setFileInputText(files[0].name), [files]);

  return (
    <Overlay isOpen={isOpen} onClose={onClose}>
      <div className='OverlayCard'>
        <FileInput text={fileInputText} inputProps={{multiple: false}} onInputChange={(e) => setFiles(e.target.files)} />
        <Button icon='upload' onClick={() => files && uploadSelectedFile(files[0], targetFolderID, user)}>
          Upload
        </Button>
        <Button icon='folder-open' onClick={() => createFolder('aaa_create', targetFolderID, user)}>
          Create Folder
        </Button>
      </div>
    </Overlay>
  );
}

export default FileUpload
