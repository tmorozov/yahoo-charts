import fs from "node:fs";
import { Readable } from "node:stream";
import symbols from "../config/symbols.json" assert { type: "json" };
import periods from "../config/periods.json" assert { type: "json" };

const myHeaders = new Headers();
myHeaders.append("Accept", "application/json");
myHeaders.append("X-API-KEY", process.env.YAHOO_API_KEY);

const init = {
  method: "GET",
  headers: myHeaders,
};

async function loadDataIntoFile(url, path) {
  const fileStream = fs.createWriteStream(path);
  const request = new Request(url, init);
  const response = await fetch(request);
  return new Promise((resolve, reject) => {
    const nodeStream = Readable.fromWeb(response.body);

    nodeStream.pipe(fileStream);
    nodeStream.on("error", reject);
    nodeStream.on("finish", resolve);
  });
}

// const url =
//   "https://alpha.financeapi.net/symbol/get-chart?period=1Y&symbol=XLP";
// "https://yfapi.net/v8/finance/chart/SPY?comparisons=XLP%2CXLU%2CXLE&range=1y&region=US&interval=1d&lang=en&events=div%2Csplit";

async function loadAll() {
  const promises = [];
  for (const symbol of symbols) {
    for (const period of periods) {
      const url = `https://alpha.financeapi.net/symbol/get-chart?period=${period}&symbol=${symbol}`;
      const path = `${period}_${symbol}.json`;

      promises.push(loadDataIntoFile(url, path));
    }
  }

  return Promise.all(promises);
}

loadAll()
  .then(() => {
    console.log("done");
  })
  .catch((e) => console.error(e));
