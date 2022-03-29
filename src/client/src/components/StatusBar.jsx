const StatusBar = ({noOfFiles, noOfSelectedFiles}) => {
  return (
    <div className="StatusBar">
      <span>{noOfSelectedFiles ?
        "Selected " + noOfSelectedFiles + " items"
        : ""}
      </span>
      <span style={{marginRight: '2rem'}}>
        { noOfFiles ? `${noOfFiles} items` : "" }
      </span>
    </div>
  );
}

export default StatusBar;
