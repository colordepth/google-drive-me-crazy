import { createSlice } from '@reduxjs/toolkit';
import { getAbout } from './userInfo';

export const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [
      /*
      {
        displayName,
        emailAddress,
        permissionId,
        photoLink,
        minifiedID,
        accessToken,
        refreshToken,
        expiryDate,
        scopes
      }
       */
    ]
  },
  reducers: {
    addUser: (state, action) => {
      // only unique users
      const userInfo = action.payload;

      if (!(userInfo.minifiedID || userInfo.refreshToken || userInfo.accessToken || userInfo.permissionId))
        // If none of the unique things provided
        return;

      if (state.users.find(existing =>
        (existing.minifiedID && existing.minifiedID === userInfo.minifiedID) ||
        (existing.refreshToken && existing.refreshToken === userInfo.refreshToken) ||
        (existing.accessToken && existing.accessToken === userInfo.accessToken) ||
        (existing.permissionId && existing.permissionId === userInfo.permissionId)
        ))
        return;

      state.users.push(userInfo);
    },
    clearInvalidUsers: (state) => {
      state.users = state.users.filter(user => {
        return !!user.minifiedID
      });
    },
    removeUserByID: (state, action) => {
      const userID = action.payload;
      const newUsers = state.users.filter(user => user.minifiedID !== userID);
      state.users = newUsers;
    },
    updateUser: (state, action) => {

      const updatedData = action.payload;
      const user = state.users.find(user =>
        (user.minifiedID && user.minifiedID === updatedData.minifiedID) ||
        (user.refreshToken && user.refreshToken === updatedData.refreshToken) ||
        (user.accessToken && user.accessToken === updatedData.accessToken) ||
        (user.permissionId && user.permissionId === updatedData.permissionId)
      );

      if (!user) return;

      Object.keys(updatedData).forEach(key => {
        user[key] = updatedData[key];
      })
    }
  }
});

export const { addUser, removeUserByID, updateUser, clearInvalidUsers } = userSlice.actions;
export const selectUsers = state => state.users.users;
export const selectUserByID = userID => state => selectUsers(state).find(user => user.minifiedID === userID);

export const fetchAndAddUser = credentials => dispatch => {
  dispatch(addUser(credentials));
  dispatch(updateUser(credentials));    // Will update creds if user already existed

  return new Promise(async () => {
    const about = await getAbout(credentials, ['user']);
    dispatch(updateUser({...about, ...credentials}));
  });
}

export default userSlice.reducer;
