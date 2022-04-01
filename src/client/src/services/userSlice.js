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
      if (state.users.find(existing =>
          existing.refreshToken === userInfo.refreshToken ||
          existing.accessToken === userInfo.accessToken ||
          existing.permissionId === userInfo.permissionId
        ))
        return;

      state.users.push(userInfo);
    },
    removeUserByID: (state, action) => {
      const userID = action.payload;
      const newUsers = state.users.filter(user => user.minifiedID !== userID);
      state.users = newUsers;
    },
    updateUser: (state, action) => {

      const updatedData = action.payload;
      const userID = action.payload.minifiedID;
      const user = state.users.find(user =>
        user.minifiedID === userID ||
        user.refreshToken === updatedData.refreshToken ||
        user.accessToken === updatedData.accessToken ||
        user.permissionId === updatedData.permissionId
      );
      
      if (!user) return;

      Object.keys(updatedData).forEach(key => {
        user[key] = updatedData[key];
      })
    }
  }
});

export const { addUser, removeUserByID, updateUser } = userSlice.actions;
export const selectUsers = state => state.users.users;
export const selectUserByID = userID => state => selectUsers(state).find(user => user.minifiedID === userID);

export const fetchAndAddUser = credentials => dispatch => {
  dispatch(addUser(credentials));

  return new Promise(async () => {
    const about = await getAbout(credentials, ['user']);
    dispatch(updateUser({...about, ...credentials}));
  });
}

export default userSlice.reducer;
