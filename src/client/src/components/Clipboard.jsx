import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Icon } from '@blueprintjs/core';

import { selectClipboard } from '../services/clipboardSlice';

const ClipboardItem = ({entity}) => {
  return (
    <li className='ClipboardItem'>
      <Icon icon={<img src={entity.iconLink} alt='clipboard item'/>} />
      <span>{entity.name}</span>
    </li>
  );
}

const Clipboard = () => {
  const [collapsed, setCollapsed] = useState(true);
  const clipboard = useSelector(selectClipboard);

  return (
    <div className={'Clipboard '.concat(clipboard.entities.length ? '' : 'Hidden')}>
      <div className='ClipboardHeader'>
        <span>Clipboard</span>
        <div style={{display: 'flex', gap: '5px'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', width: '30px', height: '30px', background: 'rgba(0, 50, 150, .08)', backgroundBlendMode: 'darken'}}>
            {clipboard.entities.length}
          </div>
          <Button
            icon={'caret-'.concat(collapsed ? 'up' : 'down')}
            minimal
            style={{borderRadius: '50%'}}
            onClick={(e) => {e.preventDefault(); setCollapsed(!collapsed);}}
          />
        </div>
      </div>
      <ul className={'ClipboardContent '.concat(collapsed ? 'Hidden' : '')}>
        { clipboard.entities.map(entity => <ClipboardItem key={entity.id} entity={entity}/>) }
      </ul>
    </div>
  );
}

export default Clipboard;
