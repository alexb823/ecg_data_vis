import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  VictoryLine,
  VictoryChart,
  VictoryZoomContainer,
  VictoryTheme,
  VictoryBrushContainer,
  VictoryAxis,
} from 'victory';
import Spinner from './Spinner';


const EcgGraph = ({ deviceId, status, ecgDataArr }) => {
  //State
  const [zoomXDomain, setZoomXDomain] = useState([0, 6000]);
  const [entireDomain, setEntireDomain] = useState({});

  // only keeping track of the X dimension
  const handleZoom = domain => {
    setZoomXDomain(domain.x);
  };

  // Using zoomXDomain state to filter out all data that isn't currently visible
  const getData = () => {
    return ecgDataArr.filter(
      dataPt => dataPt.x >= zoomXDomain[0] && dataPt.x <= zoomXDomain[1]
    );
  };

  // Because we are dynamically changing the data prop on VictoryChart,
  // we must also explicitly set its entire domain
  const getEntireDomain = ecgDataArr => {
    const firstXVal = ecgDataArr[0].x;
    const lastXVal = ecgDataArr[ecgDataArr.length - 1].x;
    return { x: [firstXVal, lastXVal], y: [-3000, 4000] };
  };

  useEffect(() => {
    if (ecgDataArr.length) {
      setEntireDomain(getEntireDomain(ecgDataArr));
      setZoomXDomain([ecgDataArr[0].x, ecgDataArr[0].x + 6000]);
    }
  }, [ecgDataArr]);

  if (status === 'fetching' || status === 'failed') {
    return <Spinner />;
  } else {
    return (
      <div>
        <VictoryChart
          theme={VictoryTheme.material}
          domain={entireDomain}
          width={734}
          height={394}
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
            style={{
              grid: { stroke: 'none' },
            }}
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
          width={734}
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
          <VictoryAxis offsetY={30} style={{ grid: { stroke: 'none' } }} />
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
  }
};

const mapStateToProps = ({ ecgData: { status, ecgDataArr } }) => {
  return { status, ecgDataArr };
};

export default connect(mapStateToProps)(EcgGraph);
