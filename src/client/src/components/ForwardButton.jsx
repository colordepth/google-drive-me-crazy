import { useDispatch } from 'react-redux';
import { Button } from "@blueprintjs/core";

import { pathHistoryForward } from '../services/tabSlice';

const ForwardButton = ({ tab }) => {
  const dispatch = useDispatch();

  return (
    <Button
      icon='arrow-right'
      minimal
      small
      disabled={tab.activePathIndex === tab.pathHistory.length-1}
      onClick={() => dispatch(pathHistoryForward(tab.id))}
    />
  );
}

export default ForwardButton;
