const { Scenes, Markup } = require("telegraf");
const { Report } = require("../../database/models");

const scene = new Scenes.BaseScene("statistics:personal");

scene.enter(async (ctx) => {
  const reports = await Report.find({
    reportedBy: ctx.session.user._id,
  });
  const tasks = await Report.find({
    completedBy: ctx.session.user._id,
  });
  const completedReports = reports.filter(
    (report) => report.isCompleted === true
  ).length;
  const incompleteReports = reports.length - completedReports;
  const completedTasks = tasks.length;
  const text = `👤 Shaxsiy statistika:\n\n🤝 Xabar qilingan holatlar:\nJami: ${reports.length}\n✅ Bartaraf etilgan: ${completedReports}\n⏳ Vazifalar ro'yhatida: ${incompleteReports}\n\n😎 Siz tomoningizdan bartaraf etilgan holatlar: ${completedTasks}`;
  const keyboard = Markup.keyboard(["◀️ Orqaga"]).resize();
  ctx.reply(text, keyboard);
});

scene.hears("◀️ Orqaga", (ctx) => ctx.scene.enter("statistics"));

module.exports = scene;
