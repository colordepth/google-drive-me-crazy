import { useState, useEffect } from 'react';
import { singleClickHandler, doubleClickHandler} from './FileElement';
import { fetchFileThumbnail } from '../services/files';

const IconViewElement = ({file, fileSize, selected, folderOpenHandler, user}) => {
  const bigIconLink = file.iconLink.split('/').map((e,i) => i === 3 ? '128' : e).join('/');

  const [thumbnailImage, setThumbnailImage] = useState(null);

  useEffect(() => {
    // Use getGoogleFileThumbnail for google docs thumbnail. also gotta add google docs to scope
    file && !file.mimeType.startsWith('application/vnd.google-apps.') && file.thumbnailLink && fetchFileThumbnail(file, user)
    .then(data => {
      // console.log(URL.createObjectURL(data));
      setThumbnailImage(URL.createObjectURL(data));
    })
    .catch(error => {
      // console.log(132);
      console.error(error);
    })
  }, [file]);

  return (
    <div
      onClick={(event) => singleClickHandler(event, file)}
      onDoubleClick={() => doubleClickHandler(file, folderOpenHandler)}
      className={selected ? 'IconFileElement IconFileElementSelected' : 'IconFileElement'}
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
      <div className='IconViewFileName'>{ file.name }</div>
    </div>
  );
}

export default IconViewElement;
