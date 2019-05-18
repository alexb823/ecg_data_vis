import axios from 'axios';
const parser = new DOMParser();
const baseUrl = '/wxapp2/ecgdata/liveecg/5C0347004129';

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
// and parse the mod date as we filter for only unique date values
export const fetchModifiedDates = (folderName = '') => {
  return axios
    .get(`${baseUrl}/${folderName}`)
    .then(response => parseModifiedDates(response.data))
    .then(dates => dates.reverse());
};

// Fetch the folder name (date strings) for the device at /wxapp2/ecgdata/liveecg/:deviceId
// and parse the list of links
export const fetchDateStr = () => {
  return axios
    .get(`${baseUrl}`)
    .then(response => parseListOfLinks(response.data))
    .then(dates => dates.reverse());
};

// Put it all together
// Make an array of obj for creating a list of links
// Will have folder name to append to the baseUrl, and date modified for the link text
export const mapDatesAndFolders = () => {
  return Promise.all([fetchDateStr(), fetchModifiedDates()]).then(
    ([dateStrArr, dateModArr]) =>
      dateStrArr.map((date, idx) => {
        return { link: date, modDate: dateModArr[idx] };
      })
  );
};

// Parse the data files in the date folder
export const parseListOfFiles = str => {
  const nodeList = parser
    .parseFromString(str, 'text/html')
    .querySelectorAll('a > tt');
  return Array.from(nodeList).map(tt => tt.innerText);
};

// Fetch the data files for a date for the device at /wxapp2/ecgdata/liveecg/:deviceId/:folderNum
// and parse the list of links
export const fetchDataFile = folderName => {
  return axios
    .get(`${baseUrl}/${folderName}`)
    .then(response => parseListOfFiles(response.data))
    .then(files => files.reverse());
};

// Put it all together
// Make an array of obj for creating a list of links for files
// Will have file name to append to the baseUrl/folderName/:fileName, to get the file,
// and date modified (date needed for the graph)
export const mapDatesAndFiles = folderName => {
  return Promise.all([
    fetchDataFile(folderName),
    fetchModifiedDates(folderName),
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
export const parseSmoothECG = str => {
  const ecgNode = parser
    .parseFromString(str, 'text/html')
    .querySelector('body');
  return ecgNode.innerText
    .trim()
    .split('\n')
    .map(strNum => parseInt(strNum));
};

// Get the ecg data
// Parse the text file
// Map the x & y data points
export const fetchEcg = ecgDataRef => {
  console.log(ecgDataRef)
  let ecgRef = ecgDataRef.find(obj => obj.name.endsWith('_smoothECG.txt'));
  console.log(ecgRef)
  let timeStamp = Date.parse(ecgRef.modDate);
  return axios
    .get(`${baseUrl}/${ecgRef.linkEx}/${ecgRef.name}`)
    .then(response => parseSmoothECG(response.data))
    .then(ecg =>
      ecg.map(sample => {
        const dataPoint = { x: timeStamp, y: sample };
        timeStamp += 4;
        return dataPoint;
      })
    )
    // .then(ecgdata => console.log(ecgdata))
};

// // Option using modified time as key. Probably not correct
// export const mapDatesAndFiles = folderName => {
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
