import { useEffect } from 'react';

import { refreshToken } from '../services/auth';
import { clearInvalidUsers, fetchAndAddUser, selectUsers } from '../services/userSlice';
import { getQuotaDetails } from '../services/userInfo';
import { clearFetchStatus, fetchDirectoryStructure } from '../services/directoryTreeSlice';
import { useDispatch, useSelector } from 'react-redux';

const UserManager = () => {
  const users = useSelector(selectUsers);
  const dispatch = useDispatch();

  if (localStorage.getItem('refresh_token')) {

    dispatch(fetchAndAddUser({
      refreshToken: localStorage.getItem('refresh_token'),
      accessToken: localStorage.getItem('access_token'),
      expiryDate: localStorage.getItem('expiry_date'),
      scope: localStorage.getItem('scope')
    }));

    ['refresh_token', 'access_token', 'expiry_date', 'scope', 'token_type']
      .forEach(key =>
        localStorage.removeItem(key)
      );
  }

  const setTokenRefreshTimeout = (user, expiryDate) => {
    clearTimeout(user.refreshTimeout);

    return setTimeout(() => {
      refreshToken(user)
        .then((data) => {
          console.log("Refreshed user token");
          dispatch(fetchAndAddUser({
            refreshToken: user.refreshToken,
            accessToken: data.access_token,
            expiryDate: data.expiry_date,
            scope: data.scope,
            refreshTimeout: setTokenRefreshTimeout(user, data.expiry_date)
          }))
        })
        // .then(() => window.location.reload(false))
        .catch((error) => {
          alert(JSON.stringify(error));

          let newRefreshToken = prompt(`Enter new refresh token for ${user.emailAddress}`);
          
          if (!newRefreshToken) return;

          dispatch(fetchAndAddUser({
            minifiedID: user.minifiedID,
            refreshToken: newRefreshToken,
            permissionId: user.permissionId,
          }))
        });
    }, (expiryDate - new Date()) - 10*60*1000);   // 10 minutes before expiry
  };

  useEffect(() => {
    dispatch(clearInvalidUsers());

    users.forEach(user => {
      console.log(user);
      dispatch(clearFetchStatus(user.minifiedID));

      getQuotaDetails(user)
        .then(data => console.log(data));

      dispatch(fetchAndAddUser({
        refreshToken: user.refreshToken,
        accessToken: user.accessToken,
        refreshTimeout: setTokenRefreshTimeout(user, user.expiryDate)
      }))
      .then(() => dispatch(fetchDirectoryStructure(user.minifiedID))) // Remove this once directory is persisted.

    });
  }, []);

  return (
    <>
      <div style={{margin: "0 1rem", position: "fixed", "top": "3px", "right": "3px"}}>
        <img
          src={users.at(0) && users[0].photoLink}
          alt="user profile"
          referrerPolicy="no-referrer"
          style={{borderRadius: '50%', width: '32px', height: '32px'}}
        />
      </div>
    </>
  );
}

export default UserManager;
