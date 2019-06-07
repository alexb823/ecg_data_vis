import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  VictoryLine,
  VictoryChart,
  VictoryZoomContainer,
  VictoryTheme,
  VictoryBrushContainer,
  VictoryAxis,
  VictoryLabel,
} from 'victory';
import Spinner from './Spinner';
import { selectedAnEvent } from '../reducers/highlightedEventReducer';

const EcgGraph = ({
  deviceId,
  status,
  ecgDataArr,
  highlightedEvent,
  selectedAnEvent,
}) => {
  //State
  const [zoomXDomain, setZoomXDomain] = useState([0, 6000]);
  const [entireDomain, setEntireDomain] = useState({});

  // only keeping track of the X dimension
  // Keeps the two line charts insync, and keeps vals used by getData filter updated
  const handleZoom = zoomDomain => {
    setZoomXDomain(zoomDomain.x);
  };

  // Using zoomXDomain state to filter out all data that isn't currently visible
  // Returns an array of data points in the zoomXDomain range (curent range is 6sec)
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

  // Helper func to calculate starting and ending points of the visible data, for when a rhythm event is selected.
  // Will help render the graph with the selected event label centered on the graph, or as close to center as possible
  const calcStartAndEndVal = eventUtc => {
    const [firstXVal, lastXVal] = getEntireDomain(ecgDataArr).x;
    let startVal = firstXVal;
    let endVal = lastXVal;
    if (firstXVal < eventUtc - 3000 && lastXVal > eventUtc + 3000) {
      startVal = eventUtc - 3000;
      endVal = startVal + 6000;
    } else if (firstXVal >= eventUtc - 3000) {
      endVal = startVal + 6000;
    } else {
      startVal = endVal - 6000;
    }
    return [startVal, endVal];
  };

  useEffect(() => {
    if (ecgDataArr.length) {
      setEntireDomain(getEntireDomain(ecgDataArr));
      if (highlightedEvent.eventUtc) {
        setZoomXDomain(calcStartAndEndVal(highlightedEvent.eventUtc));
      } else {
        setZoomXDomain([ecgDataArr[0].x, ecgDataArr[0].x + 6000]);
      }
    }
  }, [ecgDataArr, highlightedEvent]);

  if (status === 'fetching' || status === 'failed') {
    return <Spinner />;
  } else if (!ecgDataArr.length) {
    return null;
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
              zoomDomain={{ x: zoomXDomain }} //only passing in x, because y doesn't change
              onZoomDomainChange={handleZoom}
            />
          }
        >
          <VictoryAxis
            offsetY={50}
            style={{
              grid: { stroke: 'none' },
            }}
            tickFormat={t =>
              new Date(t).toLocaleTimeString([], { hour12: false })
            }
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
            style={{ data: { stroke: 'black', strokeWidth: '2px' } }}
            interpolation="natural"
            data={getData()}
          />
          {highlightedEvent.eventUtc && (
            <VictoryLine
              style={{
                data: { stroke: 'tomato', strokeWidth: 1 },
                labels: { angle: 90, fill: 'tomato', fontSize: 12, fontWeight: 'bold' }, //vertical option
                // labels: { angle: 0, fill: 'tomato', fontSize: 12} //horizontal option
              }}
              labels={[`${highlightedEvent.descriptionShort}`]}
              labelComponent={
                <VictoryLabel y={50} dy={-15} textAnchor="start" />
              } //vertical option
              // labelComponent={<VictoryLabel y={50} dx={5} textAnchor="start" verticalAnchor="start"/>} //horizontal option
              x={() => highlightedEvent.eventUtc}
            />
          )}
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
              defaultBrushArea="disable"
              brushDomain={{ x: zoomXDomain }}
              onBrushDomainChange={handleZoom}
            />
          }
        >
          <VictoryAxis
            offsetY={30}
            style={{ grid: { stroke: 'none' } }}
            tickFormat={t =>
              new Date(t).toLocaleTimeString([], { hour12: false })
            }
          />
          <VictoryLine
            style={{
              data: { stroke: 'black', strokeWidth: '1px' },
            }}
            interpolation="bundle"
            data={getData()}
          />
        </VictoryChart>
      </div>
    );
  }
};

const mapStateToProps = ({
  ecgData: { status, ecgDataArr },
  highlightedEvent,
}) => {
  return { status, ecgDataArr, highlightedEvent };
};

const mapDispatchToProps = dispatch => {
  return {
    selectedAnEvent: rhythmEvent => dispatch(selectedAnEvent(rhythmEvent)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EcgGraph);
