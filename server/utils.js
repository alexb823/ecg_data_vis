const convert = require('xml-js');

const convertXml2json = (xml) => {
  return convert.xml2json(xml, {compact: true, spaces: 2, trim: true});
}

module.exports = {convertXml2json};
