import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div>
      <div className='DashboardElement'>
        <div className='DashboardTitle'>Pinned folders</div>
        <div className='DashboardElementContents'>
          1 2 3
        </div>
      </div>
      <div className='DashboardElement'>
        <div className='DashboardTitle'>User drives</div>
        <div className='DashboardElementContents'>
          1 2 3
          <div>
            <Link to='/qvuQXkR7SAA=/storage-analyzer'>Storage</Link>
          </div>
          <div>
            <Link to='/qvuQXkR7SAA=/root'>File Explorer</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
