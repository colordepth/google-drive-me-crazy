import { useEffect, memo } from 'react';
import ReactECharts from 'echarts-for-react';
import { useSelector } from 'react-redux';

import NavigationBar from './NavigationBar';
import './StorageAnalyzer.css';

import { selectFilesForUser } from '../services/fileManagerService';
import { selectUserByID } from '../services/userSlice';

import { humanFileSize } from '../services/filesMiscellaneous';

const halfPieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animationDurationUpdate: 5000,
  tooltip: {
    trigger: "item",
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
      startAngle: 180,
      endAngle: 360,
      name: '',
      type: 'pie',
      label: {
        show: false,
      },
      itemStyle: {
        borderRadius: 0,
        borderColor: '#f8f6fb',
        borderWidth: 0
      },
      data: [],
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

  const invisibleHalf = data.reduce((halfObj, curObj) => {
    halfObj.quotaBytesUsed += curObj.quotaBytesUsed;
    halfObj.count += curObj.count;
    return halfObj
  }, {
    name: null,
    count: 0,
    quotaBytesUsed: 0,
    itemStyle:{opacity:0},
    tooltip:{show:false} 
  });

  const newSeries = { ...halfPieOptions.series, title, data: data.concat(invisibleHalf).map(obj => {return {...obj, value: obj[dataPoint]}}) };
  const newOption = { ...halfPieOptions, series: newSeries };

  // chartRef.resize();
  chartRef.setOption(newOption);

  chartRef.on('mousemove', params => {
    if (params.data.name === null) chartRef.getZr().setCursorStyle('default')
  })
}

const DonutChart = memo(({name, className}) => {

  return (
    <div className={className}>
      <div className='HalfDonutContainer'>
        <ReactECharts
          option={halfPieOptions}
          notMerge={false}
          lazyUpdate={false}
          ref={(e) => { chartRefs[name] = e }}
          onChartReady={() => console.log("chart", name, "ready")}
          onEvents={{'click': (event) => console.log("clicked", event)}}
          className='FileTypeChart'
          // width={100}
          // height={100}
          // opts={{ renderer: "svg" }}
        />
      </div>
      <div className='HalfDonutLegend'>
        <li>Application</li>
        <li>Images</li>
        <li>Videos</li>
        <li>Documents</li>
        <li>Other</li>
      </div>
    </div>
  );
});

const StorageAnalyzer = ({ userID, tab }) => {

  const allFiles = useSelector(selectFilesForUser(userID));
  const user = useSelector(selectUserByID(userID));
  const files = allFiles && allFiles.filter(file => 
    file.owners && file.owners.length && file.owners[0].me
  );

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
    
  }, [files]);


  return (
    <div className='StorageAnalyzer'>
      <NavigationBar tab={ tab } user= { user } />
      <div className='StorageGraphs'>
        <div className='TopLeft Card'>
          Network stuff
        </div>
        <div className='BottomLeft Card'>
          extensions
        </div>
        <div className='Middle Card'>
          Drive Activity
        </div>
        <div className='BottomRight Card'>
          Folder Size Sunburst
        </div>
        <DonutChart name='fileSize' className='TopRight Card'/>
      </div>
    </div>
  );  
}

export default StorageAnalyzer;
