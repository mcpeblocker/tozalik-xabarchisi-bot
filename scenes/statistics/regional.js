const { Scenes, Markup } = require("telegraf");
const { Report } = require("../../database/models");
const { getDistrictsByRegion } = require("../../utils/regions");

const scene = new Scenes.BaseScene("statistics:regional");

scene.enter(async (ctx) => {
  const { region } = ctx.session;
  const reports = await Report.find({
    region: region.name,
  });
  const totalCompleted = reports.filter(
    (report) => report.isCompleted === true
  ).length;
  const totalIncomplete = reports.length - totalCompleted;
  let text = `📊 ${region.name} viloyati uchun hududiy statistika:\n\nViloyat bo'yicha\nJami ${reports.length} holatdan\n✅${totalCompleted} tasi bartaraf etilgan\n❌${totalIncomplete} tasi hali bartaraf etilmagan.`;
  const keyboard = Markup.keyboard(["◀️ Orqaga"]).resize();
  ctx.reply(text, keyboard);
  const districts = getDistrictsByRegion(region.id);
  let districtsText = "";
  for (let district of districts) {
    let districtReports = reports.filter(
      (report) => report.district === district.name
    );
    let completed = districtReports.filter(
      (report) => report.isCompleted === true
    ).length;
    let incomplete = districtReports.length - completed;
    districtsText += `\n\n${district.name} tuman: Jami ${districtReports.length} - ✅${completed}:${incomplete}❌`;
  }
  ctx.reply(districtsText);
});

scene.hears("◀️ Orqaga", (ctx) => ctx.scene.enter("statistics"));

module.exports = scene;
