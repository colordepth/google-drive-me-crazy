import { useEffect, memo } from 'react';
import ReactECharts from 'echarts-for-react';
import { useSelector } from 'react-redux';

import NavigationBar from './NavigationBar';
import './StorageAnalyzer.css';

import { selectFilesForUser } from '../services/fileManagerService';
import { selectUserByID } from '../services/userSlice';

import { humanFileSize } from '../services/filesMiscellaneous';

const item1 = {
  color: '#F54F4A'
};
const item2 = {
  color: '#FF8C75'
};
const item3 = {
  color: '#FFB499'
};
const sunburstData = [
  {
    children: [
      {
        value: 5,
        children: [
          {
            value: 1,
            itemStyle: item1
          },
          {
            value: 2,
            children: [
              {
                value: 1,
                itemStyle: item2
              }
            ]
          },
          {
            children: [
              {
                value: 1
              }
            ]
          }
        ],
        itemStyle: item1
      },
      {
        value: 10,
        children: [
          {
            value: 6,
            children: [
              {
                value: 1,
                itemStyle: item1
              },
              {
                value: 1
              },
              {
                value: 1,
                itemStyle: item2
              },
              {
                value: 1
              }
            ],
            itemStyle: item3
          },
          {
            value: 2,
            children: [
              {
                value: 1
              }
            ],
            itemStyle: item3
          },
          {
            children: [
              {
                value: 1,
                itemStyle: item2
              }
            ]
          }
        ],
        itemStyle: item1
      }
    ],
    itemStyle: item1
  },
  {
    value: 9,
    children: [
      {
        value: 4,
        children: [
          {
            value: 2,
            itemStyle: item2
          },
          {
            children: [
              {
                value: 1,
                itemStyle: item1
              }
            ]
          }
        ],
        itemStyle: item1
      },
      {
        children: [
          {
            value: 3,
            children: [
              {
                value: 1
              },
              {
                value: 1,
                itemStyle: item2
              }
            ]
          }
        ],
        itemStyle: item3
      }
    ],
    itemStyle: item2
  },
  {
    value: 7,
    children: [
      {
        children: [
          {
            value: 1,
            itemStyle: item3
          },
          {
            value: 3,
            children: [
              {
                value: 1,
                itemStyle: item2
              },
              {
                value: 1
              }
            ],
            itemStyle: item2
          },
          {
            value: 2,
            children: [
              {
                value: 1
              },
              {
                value: 1,
                itemStyle: item1
              }
            ],
            itemStyle: item1
          }
        ],
        itemStyle: item3
      }
    ],
    itemStyle: item1
  },
  {
    children: [
      {
        value: 6,
        children: [
          {
            value: 1,
            itemStyle: item2
          },
          {
            value: 2,
            children: [
              {
                value: 2,
                itemStyle: item2
              }
            ],
            itemStyle: item1
          },
          {
            value: 1,
            itemStyle: item3
          }
        ],
        itemStyle: item3
      },
      {
        value: 3,
        children: [
          {
            value: 1
          },
          {
            children: [
              {
                value: 1,
                itemStyle: item2
              }
            ]
          },
          {
            value: 1
          }
        ],
        itemStyle: item3
      }
    ],
    itemStyle: item1
  }
];

const sunburstOption = {
  series: {
    radius: ['15%', '80%'],
    type: 'sunburst',
    sort: undefined,
    emphasis: {
      focus: 'ancestor'
    },
    data: sunburstData,
    label: {
      rotate: 'radial'
    },
    levels: [],
    itemStyle: {
      color: '#ddd',
      borderWidth: 2
    }
  }
};

const driveActivityOptions = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  legend: {
    data: ['Documents', 'Videos', 'Images', 'Compressed', 'Other']
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: 'Documents',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: 'Videos',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: [220, 182, 191, 234, 290, 330, 310]
    },
    {
      name: 'Images',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: [150, 232, 201, 154, 190, 330, 410]
    },
    {
      name: 'Compressed',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: [320, 332, 301, 334, 390, 330, 320]
    },
    {
      name: 'Other',
      type: 'line',
      stack: 'Total',
      label: {
        show: true,
        position: 'top'
      },
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: [820, 932, 901, 934, 1290, 1330, 1320]
    }
  ]
};

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
        <li>Documents</li>
        <li>Videos</li>
        <li>Documents</li>
        <li>Other</li>
      </div>
    </div>
  );
});

const DriveActivityChart = memo(({name, className}) => {

  return (
    <div className={className} style={{height: '300px'}}>
      <h1>Drive Activity</h1>
      <ReactECharts
        option={driveActivityOptions}
        notMerge={false}
        lazyUpdate={false}
        ref={(e) => { chartRefs[name] = e }}
        onChartReady={() => console.log("chart", name, "ready")}
        onEvents={{'click': (event) => console.log("clicked", event)}}
        className='DriveActivityChart'
        // width='100%'
        height={100}
        // opts={{ renderer: "svg" }}
      />
    </div>
  );
});

const FoldersSunburstChart = memo(({name, className}) => {

  return (
    <div className={className} style={{height: '350px'}}>
      <h2>Folder Size</h2>
      <ReactECharts
        option={sunburstOption}
        notMerge={false}
        lazyUpdate={false}
        ref={(e) => { chartRefs[name] = e }}
        onChartReady={() => console.log("chart", name, "ready")}
        onEvents={{'click': (event) => console.log("clicked", event)}}
        className='FolderSunburstChart'
        // width='100%'
        // height={100}
        // opts={{ renderer: "svg" }}
      />
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
        <DriveActivityChart name='driveActivity' className='Middle Card' />
        <FoldersSunburstChart name='folderSunburst' className='BottomRight Card' />
        <DonutChart name='fileSize' className='TopRight Card'/>
      </div>
    </div>
  );  
}

export default StorageAnalyzer;
