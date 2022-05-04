import { useState } from 'react';
import { addTag, setCreateTagVisibility } from '../services/userSlice';
import { selectActiveTab, toggleHighlight } from '../services/tabSlice';
import { Button, Overlay, InputGroup, Callout } from '@blueprintjs/core';
import { useDispatch, useSelector } from 'react-redux';
import { addFileToTag, selectEntity } from '../services/fileManagerService';

const CreateTag = ({ user }) => {
  const tab = useSelector(selectActiveTab);
  const dispatch = useDispatch();
  const [tagName, setTagName] = useState('');

  const tagExists = user && user.tags && user.tags.find(tag => tagName === tag.name);

  if (!user) return <></>;

  function submitTag() {
    if (tagName.length === 0) return alert("Please enter a tag name");

    dispatch(addTag({userID: user.minifiedID, tag: tagName.replace(' ', '&')}));
    dispatch(setCreateTagVisibility({userID: user.minifiedID, visible: false}));

    Object.keys(tab.highlightedEntities).forEach(async entityID => {
      await addFileToTag(entityID, [tagName, 'tag'], user);
      dispatch(toggleHighlight({tabID: tab.id, targetFile: await selectEntity(entityID, user)}))
    })
  }

  return (
    <Overlay
      isOpen={user.createTagOpen}
      onClose={() => dispatch(setCreateTagVisibility({userID: user.minifiedID, visible: false}))}
      onClosing={node => node.classList.toggle('OverlayCardClosing')} transitionDuration={300}
    >
      <form
        onSubmit={e => e.preventDefault()}
        className='OverlayCard'
        style={{marginTop: '10rem', maxHeight: '12rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column'}}
      >
        <InputGroup
          leftIcon="tag"
          onChange={(event) => {setTagName(event.target.value)}}
          value={tagName}
          placeholder="Research, School, Family..."
          rightElement={null}
        />
        {tagExists ?
          <Callout intent='danger'><div>Tag already exists</div></Callout>
          : <Callout intent='primary'><div>Note: Unused tags will be deleted on next sign in</div></Callout>
        }
        <Button type='submit' icon='plus' onClick={submitTag} intent='primary' disabled={tagExists && tagName.length}>
          Create Tag
        </Button>
      </form>
    </Overlay>
  );
}

export default CreateTag;
