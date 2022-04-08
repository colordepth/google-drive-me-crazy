import { useDispatch } from 'react-redux';
import { Button } from "@blueprintjs/core";

import { pathHistoryBack } from '../services/tabSlice';

const BackButton = ({ tab }) => {
  const dispatch = useDispatch();

  return (
    <Button
      icon='arrow-left'
      minimal
      small
      disabled={tab.activePathIndex === 0}
      onClick={() => dispatch(pathHistoryBack(tab.id))}
    />
  );
}

export default BackButton;
