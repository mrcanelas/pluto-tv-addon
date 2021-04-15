const { addonBuilder } = require("stremio-addon-sdk");
const uuid4 = require("uuid").v4;
const uuid1 = require("uuid").v1;
const url = require("url");
const { getCatalog } = require("./lib/getCatalog");

const manifest = {
  id: "community.PlutoTV",
  version: "0.0.2",
  icon: "https://i.imgur.com/xiYuHpf.jpg",
  background: "https://i.imgur.com/0xyDqA0.jpg",
  catalogs: [
    {
      type: "tv",
      id: "pluto.tv",
    },
  ],
  resources: ["catalog", "stream", "meta"],
  types: ["tv"],
  name: "Pluto.TV Addon",
  description:
    "Pluto TV é um serviço de Streaming gratuito americano de propriedade da Pluto Inc., uma subsidiária da ViacomCBS.",
};
const builder = new addonBuilder(manifest);

builder.defineCatalogHandler(async (args) => {
  const resp = await getCatalog();
  const metas = resp.map((el) => {
    return {
      id: `${el._id}`,
      name: `${el.name}`,
      poster: `${el.thumbnail.path}`,
      genres: [`${el.category}`],
      description: `${el.summary}`,
      posterShape: "square",
      type: "tv",
    };
  });
  return Promise.resolve({ metas });
});

builder.defineMetaHandler(async (args) => {
  const resp = await getCatalog();
  const meta = resp.find((resp) => resp._id == args.id);
  const metas = {
    id: meta._id,
    name: meta.name,
    type: args.type,
    genres: [`${meta.category}`],
    background: meta.featuredImage.path,
    logo: meta.colorLogoSVG.path,
    description: meta.summary,
  };
  return Promise.resolve({ meta: metas });
});

builder.defineStreamHandler(async (args) => {
  const resp = await getCatalog();
  const meta = resp.find((resp) => resp._id == args.id);
  let deviceId = uuid1();
  let sid = uuid4();
  if (meta.isStitched) {
    let m3uUrl = new URL(meta.stitched.urls[0].url);
    let queryString = url.search;
    let params = new URLSearchParams(queryString);

    // set the url params
    params.set("advertisingId", "");
    params.set("appName", "web");
    params.set("appVersion", "unknown");
    params.set("appStoreUrl", "");
    params.set("architecture", "");
    params.set("buildVersion", "");
    params.set("clientTime", "0");
    params.set("deviceDNT", "0");
    params.set("deviceId", deviceId);
    params.set("deviceMake", "Chrome");
    params.set("deviceModel", "web");
    params.set("deviceType", "web");
    params.set("deviceVersion", "unknown");
    params.set("includeExtendedEvents", "false");
    params.set("sid", sid);
    params.set("userId", "");
    params.set("serverSideAds", "true");

    m3uUrl.search = params.toString();
    m3uUrl = m3uUrl.toString();

    const metas = {
      url: m3uUrl,
      title: meta.name,
      name: "Pluto.tv",
    };
    return Promise.resolve({ streams: [metas] });
  }
});

module.exports = builder.getInterface();
