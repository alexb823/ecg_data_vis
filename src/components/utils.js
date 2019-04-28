const parser = new DOMParser();

//get the list of devise ids from the html at /wxapp2/ecgdata/liveecg
export const parseListOfDevises = str => {
  const nodeList = parser
    .parseFromString(str, 'text/html')
    .querySelectorAll('a > tt');
  return Array.from(nodeList).map(tt => tt.innerText.slice(0, -1));
};
