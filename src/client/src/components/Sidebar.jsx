import { Icon } from "@blueprintjs/core";

const SidebarElement = ({ icon, text, size })  => {
  return (
    <div className="SidebarElement">
      <Icon icon={ icon } size={size} style={{paddingRight: '0.6rem'}}/>
      { text }
    </div>
  );
}

const Sidebar = () => {
  return (
    <div className="SideBar">
      <div className="SidebarBlock">
        <div className="HomeHeader">
          <Icon icon='home' size={15} style={{paddingRight: '0.6rem'}}/>
          Home
        </div>
      </div>
      <div className="SidebarBlock"> 
        <div className="SidebarHeader">
          <Icon icon='star' size={15} style={{paddingRight: '0.6rem'}}/>
          Starred
        </div>
        <SidebarElement icon='folder-open' text='Avant Garde' />
        <SidebarElement icon='folder-open' text='Minerva' />
        <SidebarElement icon='folder-open' text='Ruhaniyat' />
      </div>
      <div className="SidebarBlock">
        <div className="SidebarHeader">
          <Icon icon='cloud' size={15} style={{paddingRight: '0.6rem'}}/>
          Drives
        </div>
        <SidebarElement icon='cloud' size={15} text='College Drive' />
        <SidebarElement icon='cloud' size={15} text='Personal Drive' />
      </div>
      <div className="SidebarBlock">
        <div className="SidebarHeader">
          <Icon icon='history' size={15} style={{paddingRight: '0.6rem'}}/>
          Recent
        </div>
        <SidebarElement icon='document' size={14} text='Planner.xlsx' />
        <SidebarElement icon='document' size={14} text='Resume.pdf' />
        <SidebarElement icon='document' size={14} text='Literature Survey.docx' />
      </div>
      <div className="SidebarBlock">
        <div className="SidebarHeader">
          <Icon icon='trash' size={15} style={{paddingRight: '0.6rem'}}/>
          Trash
        </div>
        <div style={{marginTop: "4px"}}className="SidebarHeader">
          <Icon icon='database' size={15} style={{paddingRight: '0.6rem'}}/>
          Storage
        </div>
      </div>
      <div className="SidebarBlock">
        <div className="SidebarHeader">
          <Icon icon='tag' size={15} style={{paddingRight: '0.6rem'}}/>
          Tags
        </div>
        <div className="SidebarElement">
          <Icon icon='full-circle' size={14} style={{color: 'maroon', paddingRight: '0.6rem'}}/>
          Design
        </div>
        <div className="SidebarElement">
          <Icon icon='full-circle' size={14} style={{color: 'teal', paddingRight: '0.6rem'}}/>
          Dev
        </div>
        <div className="SidebarElement">
          <Icon icon='full-circle' size={14} style={{color: 'orange', paddingRight: '0.6rem'}}/>
          Games
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
