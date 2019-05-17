import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  VictoryLine,
  VictoryChart,
  VictoryZoomContainer,
  VictoryTheme,
  VictoryBrushContainer,
  VictoryAxis,
} from 'victory';
import { parseSmoothECG } from './utils';

const App = () => {
  const baseUrl = '/wxapp2/ecgdata/liveecg/5C0347004129';
  let time = Date.parse('Thu, 16 May 2019 06:57:18 GMT');
  //State
  const [ecgData, setEcgData] = useState([]);
  const [zoomXDomain, setZoomXDomain] = useState([time, time + 6000]);
  const [entireDomain, setEntireDomain] = useState({});

  // only keeping track of the X dimension
  const handleZoom = domain => {
    setZoomXDomain(domain.x);
  };

  // Using zoomXDomain state to filter out all data that isn't currently visible
  const getData = () => {
    return ecgData.filter(d => d.x >= zoomXDomain[0] && d.x <= zoomXDomain[1]);
  };

  // Because we are dynamically changing the data prop on VictoryChart,
  // we must also explicitly set its entire domain
  const getEntireDomain = ecgData => {
    const firstXVal = ecgData[0].x;
    const lastXVal = ecgData[ecgData.length - 1].x;
    return { x: [firstXVal, lastXVal], y: [-2500, 3500] };
  };

  useEffect(() => {
    let timeStamp = Date.parse('Thu, 16 May 2019 06:57:18 GMT');
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
      .then(ecgData => {
        setEcgData(ecgData);
        setEntireDomain(getEntireDomain(ecgData));
      });
  }, []);

  return (
    <div>
      <VictoryChart
        theme={VictoryTheme.material}
        domain={entireDomain}
        width={900}
        height={470}
        scale={{ x: 'time' }}
        containerComponent={
          <VictoryZoomContainer
            responsive={false}
            allowZoom={false}
            zoomDimension="x"
            zoomDomain={{ x: zoomXDomain }}
            onZoomDomainChange={handleZoom}
          />
        }
      >
        <VictoryAxis offsetY={50} />
        <VictoryAxis dependentAxis offsetX={50} crossAxis={false} />

        <VictoryLine style={{ data: { stroke: 'tomato' } }} data={getData()} />
      </VictoryChart>
    </div>
  );
};

export default App;
