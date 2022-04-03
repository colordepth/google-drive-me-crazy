import { Icon } from "@blueprintjs/core";
import { useDispatch, useSelector } from "react-redux";
import { openPath } from "../services/tabSlice";
import { selectUsers } from "../services/userSlice";

import './Dashboard.css';

const Dashboard = ({tab}) => {
  const users = useSelector(selectUsers);
  const dispatch = useDispatch();

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
            users.map(user => {
              return <>
                <div key={user.id} className='UserCard'>
                  <div>
                    <img src={user.photoLink} style={{borderRadius: '50%'}}/>
                  </div>
                  <div>
                    <div onClick={() => {
                        dispatch(openPath({
                          id: tab.id, 
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
              </>
            })
          }
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
