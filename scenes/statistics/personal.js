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
  const text = `š¤ Shaxsiy statistika:\n\nš¤ Xabar qilingan holatlar:\nJami: ${reports.length}\nā Bartaraf etilgan: ${completedReports}\nā³ Vazifalar ro'yhatida: ${incompleteReports}\n\nš Siz tomoningizdan bartaraf etilgan holatlar: ${completedTasks}`;
  const keyboard = Markup.keyboard(["āļø Orqaga"]).resize();
  ctx.reply(text, keyboard);
});

scene.hears("āļø Orqaga", (ctx) => ctx.scene.enter("statistics"));

module.exports = scene;
