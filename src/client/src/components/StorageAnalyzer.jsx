import { useEffect, useState, useRef, memo } from 'react';
import ReactECharts from 'echarts-for-react';
import { useDispatch, useSelector } from 'react-redux';

import FileElementList from './FileElementList';
import NavigationBar from './NavigationBar';
import StatusBar from './StatusBar';
import './StorageAnalyzer.css';

import { selectFilesForUser, selectActiveMajorFetchCount } from '../services/fileManagerService';
import { selectUserByID } from '../services/userSlice';
import { clearHighlights } from '../services/tabSlice';

import { humanFileSize } from '../services/filesMiscellaneous';
import ToolBar from './ToolBar';

function resetHighlightedFiles(clickedNode, dispatch, tabID) {
  const fileElementsDOM = Array.from(document.getElementsByClassName('FileElement'));
  const contextMenuDOM = Array.from(document.getElementsByClassName('bp3-menu'));

  let clickedOnFileElement = false;
  let clickedOnContextMenu = false;

  fileElementsDOM.forEach(fileElement => {
    if (fileElement.contains(clickedNode)) {
      clickedOnFileElement = true;
    }
  })

  contextMenuDOM.forEach(menu => {
    if (menu.contains(clickedNode)) {
      clickedOnContextMenu = true;
    }
  })

  if (!clickedOnFileElement && !clickedOnContextMenu) dispatch(clearHighlights(tabID));
}

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animationDurationUpdate: 5000,
  legend: {
    orient: 'horizontal',
    x: 'center',
    y: '12%',
    data: []
  },
  title: {
    text: '',
    left: 'center',
    top: 'top'
  },
  tooltip: {
    trigger: "item",  //item
    axisPointer: {
      type: "shadow",
    },
    formatter: (params) => {
      return `
        <div style='font-size: 1em; min-width: 14em;'>
          <div style='padding: 0.32em; margin-right: 2px; border-radius: 50%; background: ${params.color}; display: inline-block;'></div>
          ${params.name} <br/>
          <div style='display: flex; justify-content: space-between'>
            <span>Size: <b>${humanFileSize(params.data.quotaBytesUsed)}</b></span>
            <span>Count: <b>${params.data.count} files</b></span>
          </div>
          <!--<b>${params.percent}%</b>-->
        </div>
        `;
    }
  },
  series: [
    {
      name: '',
      type: 'pie',
      itemStyle: {
        borderRadius: 0,
        borderColor: '#f8f6fb',
        borderWidth: 0
      },
      // labelLine: {
      //   length: 30
      // },
      // label: {
      //   formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
      //   backgroundColor: '#F6F8FC',
      //   borderColor: '#8C8D8E',
      //   borderWidth: 1,
      //   borderRadius: 4,
      //   rich: {
      //     a: {
      //       color: '#6E7079',
      //       lineHeight: 22,
      //       align: 'center'
      //     },
      //     hr: {
      //       borderColor: '#8C8D8E',
      //       width: '100%',
      //       borderWidth: 1,
      //       height: 0
      //     },
      //     b: {
      //       color: '#4C5058',
      //       fontSize: 14,
      //       fontWeight: 'bold',
      //       lineHeight: 33
      //     },
      //     per: {
      //       color: '#fff',
      //       backgroundColor: '#4C5058',
      //       padding: [3, 4],
      //       borderRadius: 4
      //     }
      //   }
      // },
      data: [],
      // radius: ['35%', '60%'],
      radius: ['30%', '50%'],
      center: ['50%', '67%']
    }
  ]
}

var chartRefs = {};

window.onresize = () => {
  Object.keys(chartRefs).forEach(key => chartRefs[key].resize());
}

function updateChart(chartName, data, dataPoint, title='') {

  const chartRef = chartRefs[chartName].getEchartsInstance();

  const label = {
    formatter: (params) => {

      let accompanyingValue = params.data[dataPoint];

      if (dataPoint == 'quotaBytesUsed') {
        accompanyingValue = humanFileSize(accompanyingValue);
      }

      return `${params.data.name} (${accompanyingValue})`
    }
  }

  const newSeries = { ...defaultOptions.series, title, label, data: data.map(obj => {return {...obj, value: obj[dataPoint]}}) };
  const newTitle =  { ...defaultOptions.title, text: title };
  const newLegend = { ...defaultOptions.legend, data: data.map(obj => obj.name) }
  const newOption = { ...defaultOptions, title: newTitle, legend: newLegend, series: newSeries };

  // chartRef.resize();
  chartRef.setOption(newOption);
}

const DonutChart = memo(({name}) => {
  const chartRef = useRef(null);

  return (
    <ReactECharts
      option={defaultOptions}
      notMerge={false}
      lazyUpdate={false}
      ref={(e) => { chartRefs[name] = e }}
      onChartReady={() => console.log("chart ready")}
      onEvents={{'click': (event) => console.log("clicked", event)}}
      className='FileTypeChart'
      // width={100}
      // height={100}
      // opts={{ renderer: "svg" }}
    />
  );
});

const StorageAnalyzer = ({ userID, tab }) => {

  const allFiles = useSelector(selectFilesForUser(userID));
  const user = useSelector(selectUserByID(userID));
  const files = allFiles && allFiles.filter(file => 
    file.owners && file.owners.length && file.owners[0].me
  );
  const dispatch = useDispatch();
  // const activeMajorFetchCount = useSelector(selectActiveMajorFetchCount(userID));

  console.log("Storage analyzer rerender");

  useEffect(() => {
    if (!files) return;

    let filesData = {};
    let mimeTypes = [];

    files.forEach(file => {
      if (!file.mimeType) return;

      const key = file.mimeType.split('/')[0];

      if (!filesData[key]) {
        filesData[key] = {
          name: key.charAt(0).toUpperCase() + key.substring(1),
          quotaBytesUsed: 0,
          count: 0
        };
      }

      if (file.quotaBytesUsed)
        filesData[key].quotaBytesUsed += parseInt(file.quotaBytesUsed);
        filesData[key].count += 1;
    })

    for (let key in filesData) {      
        if (filesData.hasOwnProperty(key)) mimeTypes.push(key);
    }

    const newData = Object.keys(filesData).map(key => {
      return {
        name: filesData[key].name,
        quotaBytesUsed: filesData[key].quotaBytesUsed,
        count: filesData[key].count
      }
    });

    updateChart('fileSize', newData, 'quotaBytesUsed', 'File size');
    updateChart('fileCount', newData, 'count', 'Number of files');
    
  }, [files]);

  const highlightedEntitiesList = Object
    .keys(tab.highlightedEntities)
    .map(entityID => tab.highlightedEntities[entityID]);

  return (
    <div className='StorageAnalyzer' onClick={(event) => resetHighlightedFiles(event.target, dispatch, tab.id)}>
      {/* <ToolBar
        highlightedEntitiesList={ highlightedEntitiesList }
        user={ user }
        targetFolderID={ 'storage-analyzer' }
        viewMode={ 'detail-view' }
        setViewMode={ () => {} }
      /> */}
      <NavigationBar tab={ tab } user= { user } folderOpenHandler={ () => {} } />
      <div className='StorageGraphs'>
        <DonutChart name='fileSize'/>
        <DonutChart name='fileCount'/>
      </div>
      <FileElementList
        loading={!(files && files.length)}
        entities={files}
        foldersFirst={false}
        sortBy='quotaBytesUsed'
        limit={100}
        user={user}
        tabID={tab.id}
        view='detail-view'
      />
      <StatusBar noOfFiles={files && files.length}/>
    </div>
  );  
}

export default StorageAnalyzer;
