const { Scenes, Markup } = require("telegraf");
const { Report } = require("../../database/models");

const scene = new Scenes.BaseScene("statistics");

scene.enter((ctx) => {
  const text = "Qaysi turdagi statistikani ko'rishni hohlaysiz?";
  const keyboard = Markup.keyboard([
    ["👤 Shaxsiy statistika"],
    ["📊 Hududiy statistika"],
    ["◀️ Orqaga"],
  ]).resize();
  ctx.reply(text, keyboard);
});

scene.hears("👤 Shaxsiy statistika", (ctx) =>
  ctx.scene.enter("statistics:personal")
);

scene.hears("📊 Hududiy statistika", (ctx) =>
  ctx.scene.enter("region", {
    nextScene: "statistics:regional",
    onlyRegion: true,
  })
);

scene.hears("◀️ Orqaga", (ctx) => ctx.scene.enter("main"));

module.exports = scene;
