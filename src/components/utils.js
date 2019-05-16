const parser = new DOMParser();

//get the list of devise ids from the html at /wxapp2/ecgdata/liveecg
export const parseListOfDevises = str => {
  const DeviseNodeList = parser
    .parseFromString(str, 'text/html')
    .querySelectorAll('a > tt');
  return Array.from(DeviseNodeList).map(tt => tt.innerText.slice(0, -1));
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
  // console.log(
  //   ecgNode.innerText
  //     .trim()
  //     .split('\n')
  //     .map(strNum => parseInt(strNum))
  // );
};
