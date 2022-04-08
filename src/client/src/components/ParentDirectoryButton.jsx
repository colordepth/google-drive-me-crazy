import { Button } from "@blueprintjs/core";

const ParentDirectoryButton = () => {

  return (
    <Button
      icon='arrow-up'
      minimal
      small
      className="ParentDirectoryButton"
      // disabled={!(currentFolder && currentFolder.parents)}
      // onClick={switchToParentFolder}
    />
  );
}

export default ParentDirectoryButton;
