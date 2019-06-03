// import {rhythmSample, rhythmSample2} from './dummyData';


// Helper func to calculate time of the Event
// Example of EVENT_TIME from xml file 0:02:06.108
const calcEventUtc = (timeStamp, eventTimeStr) => {
  const timeArr =  eventTimeStr.split(':').join('.').split('.');
  const onlyMSec = parseInt(timeArr[2]+timeArr[3]);
  const hrToMs = parseInt(timeArr[0])*60*60*1000;
  const minToMs = parseInt(timeArr[1])*60*1000;
  const totalMs = onlyMSec+hrToMs+minToMs;
  // console.log(totalMs);
  const eventTime = timeStamp + totalMs;
  return eventTime;
};

// Helper func to convert event time to local time with milliseconds
const calcLocalTime = (eventUtc, ms) => {
  const localTime = new Date(eventUtc).toLocaleTimeString([], {
    hour12: false,
  });
  const mSec = ('000' + ms).slice(-3);
  const eventTime = localTime + '.' + mSec;
  return eventTime;
};

// returns an array of event obj with just name and UTC
export const mapRhythmData = rhythmData => {
  let events = [];

  if (Array.isArray(rhythmData.EVENT)) {
    events = rhythmData.EVENT.map(event => {
      const eventUtc = calcEventUtc( rhythmData.timeStamp, event.EVENT_TIME._text);
      const ms = new Date(eventUtc).getMilliseconds();
      return {
        descriptionFull: event.DESCRIPTION_FULL._text.toLowerCase(),
        eventTime: event.EVENT_TIME._text,
        eventLocTime: calcLocalTime(eventUtc, ms),
        eventUtc,
        ms,
      };
    });
  } else if (typeof rhythmData.EVENT === 'object') {
    const eventUtc = calcEventUtc(
      rhythmData.timeStamp,
      rhythmData.EVENT.EVENT_TIME._text
    );
    const ms = new Date(
      calcEventUtc(rhythmData.timeStamp, rhythmData.EVENT.EVENT_TIME._text)
    ).getMilliseconds();
    events.push({
      descriptionFull: rhythmData.EVENT.DESCRIPTION_FULL._text.toLowerCase(),
      eventTime: rhythmData.EVENT.EVENT_TIME._text,
      eventLocTime: calcLocalTime(eventUtc, ms),
      eventUtc,
      ms,
    });
  }
  return events;
};

// console.log(mapRhythmData(rhythmSample2));
// console.log(calcEventUtc(rhythmSample.timeStamp, rhythmSample.EVENT[2].EVENT_TIME._text));
