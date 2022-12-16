const { Scenes, Markup } = require("telegraf");
const {
  regions,
  getDistrictsByRegion,
  getRegionByName,
  getDistrictByName,
} = require("../../utils/regions");

const scene = new Scenes.WizardScene(
  "region",
  (ctx) => {
    const text = "👇 Viloyatlardan birini tanlang.";
    const keyboard = Markup.keyboard(
      [...regions.map((region) => region.name), "◀️ Asosiy bo'lim"],
      {
        wrap: (btn, _, currentRow) =>
          btn === "◀️ Asosiy bo'lim" || currentRow.length === 2,
      }
    ).resize();
    ctx.reply(text, keyboard);
    ctx.wizard.next();
  },
  (ctx) => {
    const name = ctx.message?.text;
    if (!name) return ctx.reply("❗️ Iltimos quyidagilardan birini tanlang!");

    const region = getRegionByName(name);
    if (!region) return ctx.reply("❗️ Iltimos quyidagilardan birini tanlang!");
    ctx.session.region = region;

    const { onlyRegion } = ctx.scene.state;
    if (onlyRegion) {
      return ctx.scene.enter(ctx.scene.state?.nextScene || "main");
    }

    const text = "👇 Tumanlardan birini tanlang.";
    const keyboard = Markup.keyboard(
      [
        ...getDistrictsByRegion(region.id).map((district) => district.name),
        "◀️ Asosiy bo'lim",
      ],
      {
        wrap: (btn, _, currentRow) =>
          btn === "◀️ Asosiy bo'lim" || currentRow.length === 2,
      }
    ).resize();
    ctx.reply(text, keyboard);
    ctx.wizard.next();
  },
  (ctx) => {
    const name = ctx.message?.text;
    if (!name) return ctx.reply("❗️ Iltimos quyidagilardan birini tanlang!");

    const { region } = ctx.session;
    const district = getDistrictByName(name, region.id);
    if (!district)
      return ctx.reply("❗️ Iltimos quyidagilardan birini tanlang!");
    ctx.session.district = district;

    ctx.scene.enter(ctx.scene.state?.nextScene || "main");
  }
);

scene.hears("◀️ Asosiy bo'lim", (ctx) => ctx.scene.enter("main"));

module.exports = scene;
