import axios from 'axios';
const parser = new DOMParser();
const baseUrl = '/wxapp2/ecgdata/liveecg/5C0347004129';

// Parse list of devise ids from the html at /wxapp2/ecgdata/liveecg
// Or the list of date folder names for the device at /wxapp2/ecgdata/liveecg/:deviceId
export const parseListOfLinks = str => {
  const nodeList = parser
    .parseFromString(str, 'text/html')
    .querySelectorAll('a > tt');
  return Array.from(nodeList).map(tt => tt.innerText.slice(0, -1));
};

// Parse list of GMT folder modified dates for the device at
export const parseModifiedDates = str => {
  const nodeList = parser
    .parseFromString(str, 'text/html')
    .querySelectorAll('td > tt');
  return [...nodeList]
    .map(tt => tt.innerText)
    .filter(str => str.includes(' GMT'));
};

// Fetch the GMT folder modified dates for the device at /wxapp2/ecgdata/liveecg/:deviceId
export const fetchModifiedDates = () => {
  return axios
  .get(`${baseUrl}`)
  .then(response => parseModifiedDates(response.data))
  .then(dates => dates.reverse());
};

// Fetch the folder name date strings for the device at /wxapp2/ecgdata/liveecg/:deviceId
export const fetchDateStr = () => {
  return axios
    .get(`${baseUrl}`)
    .then(response => parseListOfLinks(response.data))
    .then(dates => dates.reverse());
};

// Make an array of obj for creating a list of links
// Folder name to append to the base Url and date modified for the link text
export const mapDates = () => {
  return Promise.all([fetchDateStr(), fetchModifiedDates()])
  .then(
    ([dateStrArr, dateModArr]) =>
      dateStrArr.map((date, idx) => {
        return { link: date, modDate: dateModArr[idx] };
      })
  )
  .then(dateMap => console.log(dateMap))
};

// parse the smoothECG.txt file into an array of Int
export const parseSmoothECG = str => {
  const ecgNode = parser
    .parseFromString(str, 'text/html')
    .querySelector('body');
  return ecgNode.innerText
    .trim()
    .split('\n')
    .map(strNum => parseInt(strNum));
};
