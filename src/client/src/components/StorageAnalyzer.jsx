import { useEffect, useState, useRef, memo } from 'react';
import ReactECharts from 'echarts-for-react';
import { useSelector, useDispatch } from 'react-redux';

import FileElementList from './FileElementList';
import StatusBar from './StatusBar';
import './StorageAnalyzer.css';

import { selectFilesForUser, selectStoreStatusForUser } from '../services/directoryTreeSlice';

function humanFileSize(size) {
  var i = !size ? 0 : Math.floor( Math.log(size) / Math.log(1024) );
  return ( size / Math.pow(1024, i) ).toFixed(1) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};

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
      data: [],
      radius: ['35%', '60%'],
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

  const newSeries = { ...defaultOptions.series, title, data: data.map(key => {return {...key, value: key[dataPoint]}}) };
  const newTitle =  { ...defaultOptions.title, text: title };
  const newLegend = { ...defaultOptions.legend, data: data.map(key => key.name) }
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

const StorageAnalyzer = () => {

  const files = useSelector(selectFilesForUser('qvuQXkR7SAA='));
  const status = useSelector(selectStoreStatusForUser('qvuQXkR7SAA='));

  // const dispatch = useDispatch();
  const [data, setData] = useState([]);
  // const user = useSelector(selectUsers).find(user => user.minifiedID === 'qvuQXkR7SAA=');

  // useEffect(() => {dispatch(fetchDirectoryStructure('qvuQXkR7SAA=', requestedFields))}, [user]);

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

  return (
    <div className='StorageAnalyzer'>
      <div className='StorageGraphs'>
        <DonutChart name='fileSize'/>
        <DonutChart name='fileCount'/>
      </div>
      <FileElementList files={files} foldersFirst={false} sortBy='quotaBytesUsed'/>
      <StatusBar noOfFiles={files && files.length}/>
    </div>
  );  
}

export default StorageAnalyzer;
