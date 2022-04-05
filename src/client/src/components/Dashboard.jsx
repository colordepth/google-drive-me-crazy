import { Icon } from "@blueprintjs/core";
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from "react-redux";
import { openPath } from "../services/tabSlice";
import { selectUsers } from "../services/userSlice";

import './Dashboard.css';

const UserCard = ({user, tabID}) => {
  // console.log("B", user);
  const dispatch = useDispatch();

  return (
    <div className='UserCard'>
      <div>
        <img src={user.photoLink} style={{borderRadius: '50%'}}/>
      </div>
      <div>
        <div onClick={() => {
            dispatch(openPath({
              id: tabID,
              path: {
                path: 'root',
                name: "College",
                userID: user.minifiedID
              }
            }));
          }}
        >
          <b style={{color: '#333'}}>College</b><br/><br/>
          <span style={{color: '#555'}}>{user.emailAddress}</span><br/>
        </div>
      </div>
    </div>
  );
}

const Dashboard = ({tab}) => {
  const users = useSelector(selectUsers);

  // return createPortal(, document.getElementById('root'));

  return (
    <div>
      <div className='DashboardElement'>
        <div className='DashboardTitle'>
          <Icon icon='unpin'/> <h2>Pinned</h2>
        </div>
        <div className='DashboardElementContents'>
          <div className='UserCard'>
            sample
          </div>
        </div>
      </div>
      <div className='DashboardElement'>
        <div className='DashboardTitle' style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <Icon icon='database' /> <h2>User Drives</h2>
        </div>
        <div className='DashboardElementContents'>
          {
            users.map(user => <UserCard key={user.minifiedID} user={user} tabID={tab.id}/>)
          }
          <div className='UserCard'>
            Add Account
          </div>
        </div>
      </div>
      <div className='DashboardElement'>
        <div className='DashboardTitle' style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <Icon icon='time' /> <h2>Recent Files</h2>
        </div>
        <div className='DashboardElementContents'>
          1 2 3
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
