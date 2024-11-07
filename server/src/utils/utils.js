const { createReadStream } = require("fs");
const csvParser = require("csv-parser");
const { pipeline } = require("stream/promises");

const transformRowToPlayer = (row, playerAttributes) => {
  const transformedRow = {};

  playerAttributes.forEach((attribute) => {
    if (row[attribute]) {
      transformedRow[attribute] = row[attribute];
    }
  });

  return transformedRow;
};

const parseCSVFile = async (filePath, playerAttributes) => {
  const thisArray = [];
  await pipeline(
    createReadStream(filePath).pipe(csvParser()),
    async (source) => {
      for await (const row of source) {
        const transformedRow = transformRowToPlayer(row, playerAttributes);
        thisArray.push(transformedRow);
      }
    }
  );

  return thisArray;
};

module.exports = { parseCSVFile };
