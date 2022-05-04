import { createSlice } from '@reduxjs/toolkit';
import { getAbout } from './userInfo';

function rainbow(numOfSteps, step) {
  // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
  // Adam Cole, 2011-Sept-14
  // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
  var r, g, b;
  var h = step / numOfSteps;
  var i = ~~(h * 6);
  var f = h * 6 - i;
  var q = 1 - f;
  switch(i % 6){
      case 0: r = 1; g = f; b = 0; break;
      case 1: r = q; g = 1; b = 0; break;
      case 2: r = 0; g = 1; b = f; break;
      case 3: r = 0; g = q; b = 1; break;
      case 4: r = f; g = 0; b = 1; break;
      case 5: r = 1; g = 0; b = q; break;
  }
  var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
  return (c);
}

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
        scopes,
        tags,    // custom
        createTagOpen     // custom
      }
       */
    ]
  },
  reducers: {
    addUser: (state, action) => {
      // only unique users
      const userInfo = {...action.payload, tags: [], createTagOpen: false};

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
    },
    addTag: (state, action) => {
      const {userID, tag} = action.payload;
      const user = state.users.find(user => (user.minifiedID && user.minifiedID === userID));

      if (user && !user.tags.find(t => t.name === tag))
        user.tags.push({name: tag, color: rainbow(10, user.tags.length)});
    },
    setCreateTagVisibility: (state, action) => {
      const {userID, visible} = action.payload;
      const user = state.users.find(user => (user.minifiedID && user.minifiedID === userID));

      if (user) user.createTagOpen = !!visible;
    }
  }
});

export const { addUser, removeUserByID, updateUser, clearInvalidUsers, addTag, setCreateTagVisibility } = userSlice.actions;
export const selectUsers = state => state.users.users;
export const selectUserByID = userID => state => selectUsers(state).find(user => user.minifiedID === userID);

export const fetchAndAddUser = (credentials, callback) => dispatch => {
  return new Promise(async (resolve) => {
    dispatch(updateUser({...credentials}));   // Update user if existing user. Does nothing if not existing.
    const about = await getAbout(credentials, ['user']);
    dispatch(updateUser({...about, ...credentials}));   // Update user if existing user. Does nothing if not existing.
    dispatch(addUser({...about, ...credentials}));      // Will add user if not existing user
    return resolve({...about, ...credentials});
  })
  .then((result) => {if (callback!==undefined) callback(); return result;} );
}

export default userSlice.reducer;
