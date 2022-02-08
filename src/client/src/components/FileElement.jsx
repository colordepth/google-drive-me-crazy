import { Icon } from "@blueprintjs/core";

const style = {marginRight: '0.75rem'};

const File = ({file}) => {
  return (
    <>
      <Icon icon='document' intent='none' style={style}/>{file.name}  |  { file.quotaBytesUsed} bytes
    </>
  );
}

const Folder = ({file}) => {
  return (
    <>
      <Icon icon='folder-close' intent='primary' style={style}/> {file.name}
    </>
  );
}

const FileElement = ({file}) => {

  if (file.mimeType === "application/vnd.google-apps.folder")
    return <><Folder file={file}/></>;
  else
    return <><File file={file}/></>;
}

export default FileElement;