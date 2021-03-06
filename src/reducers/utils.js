const domParser = new DOMParser();
import axios from 'axios';

// const fullUrl = '/wxapp2/ecgdata/liveecg/5C0347004129/20190523/20190523_211913_5C0347004129_rhythm.xml';
// const fullUrl = '/wxapp2/ecgdata/liveecg/5C0347004129/20190211/20190211_074021_5C0347004129_rhythm.xml';
export const baseUrl = '/wxapp2/ecgdata/liveecg';

// Parse list of devise ids from the html at /wxapp2/ecgdata/liveecg
// Or the list of folder names (6 digit date as name) at /wxapp2/ecgdata/liveecg/:deviceId
export const parseListOfLinks = str => {
  const nodeList = domParser
    .parseFromString(str, 'text/html')
    .querySelectorAll('a > tt');
  return Array.from(nodeList).map(tt => tt.innerText.slice(0, -1));
};

// Parse list of folder modified GMT dates for the device at
export const parseModifiedDates = str => {
  const nodeList = domParser
    .parseFromString(str, 'text/html')
    .querySelectorAll('td > tt');
  return [...nodeList]
    .map(tt => tt.innerText)
    .filter(str => str.endsWith(' GMT'));
};

// Parse the data files in the date folder
export const parseListOfFiles = str => {
  const nodeList = domParser
    .parseFromString(str, 'text/html')
    .querySelectorAll('a > tt');
  return Array.from(nodeList).map(tt => tt.innerText);
};

// parse the _smoothECG.txt file into an array of Int
// some files have 2 columns of text
export const parseSmoothECG = str => {
  const ecgNode = domParser
    .parseFromString(str, 'text/html')
    .querySelector('body');
  return ecgNode.innerText
    .trim()
    .split('\n')
    .reduce((acc, str) => {
      if (str.includes(' \t')) {
        acc.push(parseInt(str.split(' \t')[1]));
      } else {
        acc.push(parseInt(str));
      }
      return acc;
    }, []);
};

// Reduce the number of sample points
// Returns an array of averages based on sample rate
// input ([1,2,3,4,5,6,7,8], 3) will return [2, 5, 8]
export const resampleArray = (myArray, sampleRate) => {
  const results = [];

  while (myArray.length) {
    const sample = myArray.splice(0, sampleRate);
    const avg = sample.reduce((acc, num) => acc + num) / sample.length;
    results.push(Math.round(avg));
  }
  return results;
};


// //Testing fetching rhythm and converting from xml to json
// export const parseRhythm = (xml) => {
//   axios.post('/api/xmlToJson', {xml})
//   .then(response => response.data.OUTPUT)
// }

// export const fetchRhythmTest = () => {
//     return axios
//       .get(fullUrl)
//       .then(response => parseRhythm(response.data))
//       // .then(response => console.log(response.data))
//       .catch(error => console.log(error));
//   };
