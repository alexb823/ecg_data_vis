import axios from 'axios';
const parser = new DOMParser();
// const baseUrl = '/wxapp2/ecgdata/liveecg/5C0347004129';
export const baseUrl = '/wxapp2/ecgdata/liveecg';

// Parse list of devise ids from the html at /wxapp2/ecgdata/liveecg
// Or the list of folder names (6 digit date as name) at /wxapp2/ecgdata/liveecg/:deviceId
export const parseListOfLinks = str => {
  const nodeList = parser
    .parseFromString(str, 'text/html')
    .querySelectorAll('a > tt');
  return Array.from(nodeList).map(tt => tt.innerText.slice(0, -1));
};

// Parse list of folder modified GMT dates for the device at
export const parseModifiedDates = str => {
  const nodeList = parser
    .parseFromString(str, 'text/html')
    .querySelectorAll('td > tt');
  return [...nodeList]
    .map(tt => tt.innerText)
    .filter(str => str.endsWith(' GMT'));
};

// Fetch the folder modified GMT dates for the device at /wxapp2/ecgdata/liveecg/:deviceId
// Or file modified GMT dates at /wxapp2/ecgdata/liveecg/:deviceId/:folderName
// and parse the mod date as we filter for only unique date values
export const fetchModifiedDates = (deviceId, folderName = '') => {
  return axios
    .get(`${baseUrl}/${deviceId}/${folderName}`)
    .then(response => parseModifiedDates(response.data))
    .then(dates => dates.reverse());
};


// Parse the data files in the date folder
export const parseListOfFiles = str => {
  const nodeList = parser
    .parseFromString(str, 'text/html')
    .querySelectorAll('a > tt');
  return Array.from(nodeList).map(tt => tt.innerText);
};

// Fetch the data files for a date for the device
// at /wxapp2/ecgdata/liveecg/:deviceId/:folderName
// and parse the list of links
// Returns an array of file names in the folder
export const fetchDataFile = (deviceId, folderName) => {
  return axios
    .get(`${baseUrl}/${deviceId}/${folderName}`)
    .then(response => parseListOfFiles(response.data))
    .then(files => files.reverse());
};

// Put it all together
// Returns an array of ecgDataRef obj for creating a list of links for files
// Each obj will have date/folderName (linkEx) & file name (name) to append to the baseUrl/:deviseId/:folderName/:fileName
// This combined url used to get the file, and date modified (date also needed for the graph)
// folder name is the 8 dig number with the year and date (ex: 20190519)
export const mapDatesAndFileNames = (deviceId, folderName) => {
  return Promise.all([
    fetchDataFile(deviceId, folderName),
    fetchModifiedDates(deviceId, folderName),
  ])
    .then(([filesArr, dateModArr]) =>
      filesArr.reduce((acc, fileName, index) => {
        const strArr = fileName.split('_');
        const fileKey = `${strArr[0]}_${strArr[1]}`;
        const modDate = dateModArr[index];
        const utc = Date.parse(modDate);
        if (acc[fileKey]) {
          acc[fileKey].push({ name: filesArr[index], modDate, utc, linkEx: strArr[0] });
        } else {
          acc[fileKey] = [{ name: filesArr[index], modDate, utc, linkEx: strArr[0] }];
        }
        return acc;
      }, {})
    )
    .then(files => {
      return Object.keys(files).map(key => {
        return files[key];
      });
    });
};

// parse the _smoothECG.txt file into an array of Int
// some files have 2 columns of text
const parseSmoothECG = str => {
  const ecgNode = parser
    .parseFromString(str, 'text/html')
    .querySelector('body');
  return ecgNode.innerText
    .trim()
    .split('\n')
    .reduce((acc, str) => {
      if (str.includes(' \t')) {
        acc.push(parseInt(str.split(' \t')[1]))
      } else {
        acc.push(parseInt(str))
      }
      return acc;
    }, []);
};

// Get the ecg data txt file and parse the text
// Map the x & y data points
// Returns an array of objects with x and y values for the ecg graph
export const fetchEcg = (deviceId, ecgDataRef) => {
  let ecgRef = ecgDataRef.find(obj => obj.name.endsWith('_smoothECG.txt'));
  let timeStamp = Date.parse(ecgRef.modDate);
  return axios
    .get(`${baseUrl}/${deviceId}/${ecgRef.linkEx}/${ecgRef.name}`)
    .then(response => parseSmoothECG(response.data))
    .then(ecg =>
      ecg.map(sample => {
        const dataPoint = { x: timeStamp, y: sample };
        timeStamp += 4;
        return dataPoint;
      })
    )
};

// // Option using modified time as key. Probably not correct
// export const mapDatesAndFileNames = folderName => {
//   return Promise.all([
//     fetchDataFile(folderName),
//     fetchModifiedDates(folderName),
//   ])
//     .then(([filesArr, dateModArr]) =>
//       dateModArr.reduce((acc, date, index) => {
//         if (acc[date]) acc[date].push(filesArr[index]);
//         else acc[date] = [filesArr[index]];
//         return acc;
//       }, {})
//     )
//     .then(files => {
//       return Object.keys(files).map(key => {
//         return { files: files[key], gmt: key, utc: Date.parse(key) };
//       });
//     })
//     .then(filesArr => filesArr.sort((a, b) => a.utc - b.utc));
// };
