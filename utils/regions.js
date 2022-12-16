const { regions, districts } = require("./regions.json");

const getDistrictsByRegion = (regionId) => {
  return districts.filter((district) => district.region_id === regionId);
};

const getRegionByName = (name) => {
  return regions.find((region) => region.name === name);
};

const getDistrictByName = (name, regionId = 0) => {
  return districts.find(
    (district) =>
      district.name === name &&
      (regionId === 0 || district.region_id === regionId)
  );
};

module.exports = {
  regions,
  districts,
  getDistrictsByRegion,
  getRegionByName,
  getDistrictByName,
};
