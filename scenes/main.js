const { Scenes, Markup } = require("telegraf");

const scene = new Scenes.BaseScene("main");

scene.enter((ctx) => {
  const text = "👇 Quyidagilardan birini tanlashingiz mumkin.";
  const keyboard = Markup.keyboard([
    ["📝 Xabar berish"],
    ["✔️ Vazifalar ro'yhati"],
    ["📊 Statistika"],
  ]).resize();
  ctx.reply(text, keyboard);
});

scene.hears("📝 Xabar berish", (ctx) => ctx.scene.enter("inform"));

scene.hears("✔️ Vazifalar ro'yhati", (ctx) =>
  ctx.scene.enter("region", { nextScene: "tasks" })
);

scene.hears("📊 Statistika", (ctx) => ctx.scene.enter("statistics"));

module.exports = scene;
