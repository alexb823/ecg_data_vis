import React, { useState, useEffect } from 'react';
import {
  VictoryLine,
  VictoryChart,
  VictoryZoomContainer,
  VictoryTheme,
  VictoryBrushContainer,
  VictoryAxis,
} from 'victory';

const EcgGraph = ({ ecgData }) => {

  //State
  const [zoomXDomain, setZoomXDomain] = useState([0, 6000]);
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
    return { x: [firstXVal, lastXVal], y: [-3000, 4000] };
  };

  useEffect(() => {
    setEntireDomain(getEntireDomain(ecgData));
    setZoomXDomain([ecgData[0].x, ecgData[0].x + 6000]);
  }, [ecgData]);

  return (
    <div>
      <VictoryChart
        theme={VictoryTheme.material}
        domain={entireDomain}
        width={700}
        height={350}
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
        <VictoryAxis
          offsetY={50}
        />
        <VictoryAxis
          dependentAxis
          offsetX={50}
          crossAxis={false}
          tickFormat={mv => `${mv / 1000}mV`}
          style={{
            grid: { stroke: 'none' },
          }}
        />

        <VictoryLine
          style={{ data: { stroke: 'tomato', strokeWidth: '2px' } }}
          interpolation="natural"
          data={getData()}
        />
      </VictoryChart>

      <VictoryChart
        theme={VictoryTheme.material}
        domain={entireDomain}
        padding={{ top: 0, left: 50, right: 50, bottom: 30 }}
        width={700}
        height={80}
        scale={{ x: 'time' }}
        containerComponent={
          <VictoryBrushContainer
            responsive={false}
            brushDimension="x"
            brushDomain={{ x: zoomXDomain }}
            onBrushDomainChange={handleZoom}
          />
        }
      >
        <VictoryAxis offsetY={30} />
        <VictoryLine
          style={{
            data: { stroke: 'tomato', strokeWidth: '1px' },
          }}
          interpolation="bundle"
          data={getData()}
        />
      </VictoryChart>
    </div>
  );
};

export default EcgGraph;
