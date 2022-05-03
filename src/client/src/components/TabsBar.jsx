import { Button, Icon } from "@blueprintjs/core";

import { useDispatch, useSelector } from 'react-redux';
import { createTab, selectActiveTab, selectTabs, switchActiveTab, deleteTab } from '../services/tabSlice';


const TabsBar = () => {
  const tabs = useSelector(selectTabs);
  const activeTab = useSelector(selectActiveTab);
  const dispatch = useDispatch();

  return (
    <div className="TabsBar">
      { 
        tabs && tabs.map(tabInfo => 
          <span
            className={tabInfo.id === activeTab.id ? "ActiveTab Tab" : "Tab"}
            onClick={() => dispatch(switchActiveTab(tabInfo.id))}
            key={tabInfo.id.concat('_tab')}
          >
            <span>{ tabInfo.pathHistory.at(tabInfo.activePathIndex).name }</span>
            <Icon
              icon='cross'
              size={13}
              style={{
                color: tabs.length === 1 ? '#ddd' : '#777',
                marginLeft: '3px'
                // cursor: tabs.length === 1 ? 'not-allowed' : 'inherit',
                // visibility: tabs.length === 1 ? 'hidden' : 'inherit'
              }}
              onClick={() => dispatch(deleteTab(tabInfo.id))}
            />
          </span>
        )
      }
      <Button
        minimal
        style={{marginLeft: "2px", alignSelf: "center", borderRadius: '50%'}}
        onClick={() => {
          const newTabID = dispatch(createTab())
          dispatch(switchActiveTab(newTabID))
        }}
      >
        <Icon icon='plus' color="#777"/>
      </Button>
    </div>
  );
}

export default TabsBar;
