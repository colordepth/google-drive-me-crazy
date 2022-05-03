import { useState, useEffect } from 'react';
import { singleClickHandler, rightClickHandler, doubleClickHandler} from './FileElement';
import { fetchFileThumbnail } from '../services/fileManagerService';

const IconViewElement = ({entity, selected, user, tabID}) => {

  function thumbnailSetter() {
    // Use getGoogleFileThumbnail for google docs thumbnail. also gotta add google docs to scope

    entity && !entity.mimeType.startsWith('application/vnd.google-apps.') && entity.thumbnailLink && fetchFileThumbnail(entity, user)
    .then(data => {
      setThumbnailImage(URL.createObjectURL(data));
    })
    .catch(error => {
      console.error(error);
    })
  }

  const [thumbnailImage, setThumbnailImage] = useState(null);
  const bigIconLink = entity.iconLink.split('/').map((e,i) => i === 3 ? '128' : e).join('/');
  useEffect(thumbnailSetter, [entity, user]);

  return (
    <div
      onClick={(event) => singleClickHandler(event, entity, tabID)}
      onDoubleClick={() => doubleClickHandler(entity, tabID)}
      onContextMenu={(event) => rightClickHandler(event, entity, tabID)}
      className={selected ? 'FileElement IconFileElement IconFileElementSelected' : 'FileElement IconFileElement'}
    >
      <div>
        {
          thumbnailImage ? 
          <div className='ThumbnailImageContainer'>
            <img src={ thumbnailImage } className='ThumbnailImage' alt='thumbnail'/>
          </div>
          :
          <img src={ bigIconLink } className='BigIconImage' alt='icon'/>
        }
      </div>
      <div className='IconViewFileName'>{ entity.name }</div>
    </div>
  );
}

export default IconViewElement;
