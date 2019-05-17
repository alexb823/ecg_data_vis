import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  VictoryLine,
  VictoryChart,
  VictoryZoomContainer,
  VictoryBrushContainer,
  VictoryAxis,
} from 'victory';
import { parseSmoothECG } from './utils';

const App = () => {
  const baseUrl = '/wxapp2/ecgdata/liveecg/5C0347004129';
  let time = Date.parse('Thu, 16 May 2019 06:57:18 GMT');
  let timeStamp = Date.parse('Thu, 16 May 2019 06:57:18 GMT');
  const [ecgData, setEcgData] = useState([]);
  const [zoomDomain, setZoomDomain] = useState({ x: [time, time + 6000] });
  // const [selectDomain, setSelectDomain] = useState({ x: [time, time + 6000] });

  const handleZoom = domain => {
    setZoomDomain(domain);
  };

  const handleBrush = domain => {
    setSelectDomain(domain);
  };

  useEffect(() => {
    axios
    .get(`${baseUrl}/20190516/20190516_145335_5C0347004129_smoothECG.txt`)
    .then(response => parseSmoothECG(response.data))
    .then(ecg =>
      ecg.map(sample => {
        const dataPoint = { x: timeStamp, y: sample, flat: 0 };
        timeStamp += 4;
        return dataPoint;
      })
    )
    .then(dataPoints => setEcgData(dataPoints))
  }, [])

  return (
    <div>
      <VictoryChart
        width={600}
        height={470}
        scale={{ x: 'time' }}
        containerComponent={
          <VictoryZoomContainer
            responsive={true}
            allowZoom={false}
            zoomDimension="x"
            zoomDomain={zoomDomain}
            onZoomDomainChange={handleZoom}
          />
        }
      >
        <VictoryLine style={{ data: { stroke: 'tomato' } }} data={ecgData} />
      </VictoryChart>

      {/* <VictoryChart
        padding={{ top: 0, left: 50, right: 50, bottom: 30 }}
        width={600}
        height={100}
        scale={{ x: 'time' }}
        containerComponent={
          <VictoryBrushContainer
            responsive={false}
            brushDimension="x"
            brushDomain={zoomDomain}
            onBrushDomainChange={handleZoom}
          />
        }
      >
        tickFormat={x => new Date(x).getUTCMilliseconds()}
        <VictoryAxis  />
        <VictoryLine
          style={{data: { stroke: 'tomato' }}}
          data={ecgData}
          x='x'
          y='flat'
        />
      </VictoryChart> */}
    </div>
  );
};

export default App;
