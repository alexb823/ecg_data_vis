const domParser = new DOMParser();
import axios from 'axios';

// const fullUrl = '/wxapp2/ecgdata/liveecg/5C0347004129/20190523/20190523_211913_5C0347004129_rhythm.xml';
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

// // parse the parseRhythm
// export const parseRhythm = str => {
//   const xml = domParser
//     .parseFromString(str, 'text/xml')
//     // console.log(parser.parse(xml))
//   return parser.parse(xml)
// };

// export const printXml = () => {
//   axios.get(fullUrl)
//   .then(response => response.data)
//   .then(str => parseRhythm(str))
//   .then(result => console.log(result))
// }
