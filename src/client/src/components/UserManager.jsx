import { useEffect } from 'react';

import { refreshToken } from '../services/auth';
import { clearInvalidUsers, fetchAndAddUser, selectUsers } from '../services/userSlice';
import { getQuotaDetails } from '../services/userInfo';
import { selectActiveTab } from '../services/tabSlice';
import { clearFetchStatus, fetchDirectoryStructure } from '../services/directoryTreeSlice';
import { useDispatch, useSelector } from 'react-redux';

import CreateTag from './CreateTag';

const UserManager = () => {
  const users = useSelector(selectUsers);
  const tab = useSelector(selectActiveTab);
  const currentUserID = tab.pathHistory.at(-1).userID;
  const displayedUser = currentUserID ? users.find(user => user.minifiedID === currentUserID): users.at(0);
  const dispatch = useDispatch();

  if (sessionStorage.getItem('refresh_token')) {

    dispatch(fetchAndAddUser({
      refreshToken: sessionStorage.getItem('refresh_token'),
      accessToken: sessionStorage.getItem('access_token'),
      expiryDate: sessionStorage.getItem('expiry_date'),
      scope: sessionStorage.getItem('scope')
    }));

    ['refresh_token', 'access_token', 'expiry_date', 'scope', 'token_type']
      .forEach(key =>
        sessionStorage.removeItem(key)
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
          }, () => window.location.reload(false)))
          // .then()
        })
        .catch((error) => {
          console.error(error);
          window.location.reload();

          // let newRefreshToken = prompt(`Enter new refresh token for ${user.emailAddress}`);
          
          // if (!newRefreshToken) return;

          // console.log("Updating refresh token", newRefreshToken);

          // dispatch(fetchAndAddUser({
          //   minifiedID: user.minifiedID,
          //   refreshToken: newRefreshToken,
          //   permissionId: user.permissionId,
          // }))
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
      }, () => dispatch(fetchDirectoryStructure(user.minifiedID))))  // Remove this once directory is persisted.))
      // .then(() => dispatch(fetchDirectoryStructure(user.minifiedID))) // Remove this once directory is persisted.
    });
  }, [users.length]);

  return (
    <>
      <div
        style={{margin: "0 1rem", position: "fixed", "top": "3px", "right": "3px"}}
        title={displayedUser && displayedUser.emailAddress}
      >
        <img
          src={displayedUser && displayedUser.photoLink}
          alt="user profile"
          referrerPolicy="no-referrer"
          style={{borderRadius: '50%', width: '32px', height: '32px'}}
        />
      </div>
      <CreateTag user={displayedUser} />
    </>
  );
}

export default UserManager;
