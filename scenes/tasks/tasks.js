const dayjs = require("dayjs");
const { Scenes, Markup } = require("telegraf");
const { Report } = require("../../database/models");
const { sendVerification } = require("../../utils/verification");

const scene = new Scenes.BaseScene("tasks");

scene.enter(async (ctx) => {
  const { region, district } = ctx.session;
  if (!region || !district) return ctx.scene.enter("region");
  const tasks = await Report.find({
    region: region.name,
    district: district.name,
    isCompleted: false,
  });
  const keyboard = Markup.keyboard(["◀️ Asosiy bo'lim"]).resize();
  if (tasks.length < 1) {
    let text = "🗒 Vazifalar ro'yhati bu hudud uchun bo'sh.";
    return ctx.reply(text, keyboard);
  }
  for (let task of tasks) {
    let text = `💬 Izoh: ${task.comment || "Izoh berilmagan."}\n\n🛣 Viloyat: ${
      task.region
    }\n🏢 Tuman: ${task.district}\n\nYuborilgan sana: ${dayjs(
      task.createdAt
    ).format("DD/MM/YYYY")}`;
    let buttons = [
      [
        Markup.button.callback(
          "✅ Bartaraf etilganini bildirish",
          `completed-${task._id}`
        ),
      ],
    ];
    if (task.latitude && task.longitude) {
      buttons.unshift([
        Markup.button.callback(
          "📍 Lokatsiyani ko'rish",
          `view-location-${task._id}`
        ),
      ]);
    }
    const keyboard = Markup.inlineKeyboard(buttons);
    ctx.replyWithPhoto(task.photo, {
      caption: text,
      ...keyboard,
    });
  }
  let text = "📝 Tanlashingiz mumkin";
  ctx.reply(text, keyboard);
});

scene.hears("◀️ Asosiy bo'lim", (ctx) => ctx.scene.enter("main"));

scene.action(/view-location-(.+)/g, async (ctx) => {
  const taskId = ctx.match[1];
  const task = await Report.findById(taskId);
  ctx.replyWithLocation(task.latitude, task.longitude);
  ctx.answerCbQuery("✅");
});

scene.action(/completed-(.+)/g, async (ctx) => {
  const taskId = ctx.match[1];
  const task = await Report.findById(taskId).populate("reportedBy");
  sendVerification(task, ctx.session.user);
  const text =
    "🥳 Sizdan benihoya minnatdormiz!\n✅ Muammo bartaraf etilgani haqidagi xabar tasdiqlash uchun yuborildi. Sizga javobni tez orada ma'lum qilamiz.";
  ctx.reply(text);
  ctx.deleteMessage();
  ctx.answerCbQuery("✅");
});

module.exports = scene;
