const { Scenes, Markup } = require("telegraf");

const scene = new Scenes.BaseScene("inform");

scene.enter((ctx) => {
  const text =
    "🪴 Bu bo'lim orqali siz ekologiyaga zarar keltirayotgan yoki zarar keltirish xavfi mavjud bo'lgan holatlar haqida xabar berishingiz mumkin. Sizning bildirishingiz vazifalar ro'yhatiga qo'shiladi va bartaraf etilgach tasdiqlashingiz mumkin bo'ladi.";
  const keyboard = Markup.keyboard([
    ["⚡️ Holat haqida bildirish"],
    ["◀️ Orqaga"],
  ]).resize();
  ctx.reply(text, keyboard);
});

scene.hears("⚡️ Holat haqida bildirish", (ctx) =>
  ctx.scene.enter("region", { nextScene: "report" })
);
scene.hears("◀️ Orqaga", (ctx) => ctx.scene.enter("main"));

module.exports = scene;
