const axios = require("axios");
const moment = require("moment");

async function getCatalog() {
  let startTime = encodeURIComponent(
    moment().format("YYYY-MM-DD HH:00:00.000ZZ")
  );

  let stopTime = encodeURIComponent(
    moment().format("YYYY-MM-DD HH:00:00.000ZZ")
  );

  let url = `http://api.pluto.tv/v2/channels?start=${startTime}&stop=${stopTime}`;
  let catalog = {
    data: [],
  };
  try {
    catalog = await axios.get(url);
  } catch (err) {
    console.error(err);
  }
  return catalog.data;
}

module.exports = { getCatalog };
