const dayjs = require("dayjs");
const { Markup } = require("telegraf");
const bot = require("../core/bot");
const { Report, User } = require("../database/models");

function sendVerification(task, completedBy) {
  const text = `š Hurmatli foydalanuvchi, sizning yuborgan ma'lumotlarizga ko'ra aniqlangan muammo bartaraf etilgani haqida xabar oldik.\nSizdan bu xabar haqiqatdan to'g'ri ekanini tasdiqlashingizni so'raymiz ā.\n\nSiz yuborgan ma'lumotlar:\nViloyat: ${
    task.region
  }\nTuman: ${task.district}\nIzoh: ${task.comment || "Izoh berilmagan."}`;
  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback(
        "ā Tasdiqlash",
        `verify-${task._id}-${completedBy._id}`
      ),
      Markup.button.callback(
        "ā Rad etish",
        `decline-${task._id}-${completedBy._id}`
      ),
    ],
  ]);
  bot.telegram.sendPhoto(task.reportedBy.telegramId, task.photo, {
    caption: text,
    ...keyboard,
  });
}

function handleVerification() {
  bot.action(/verify-(.+)-(.+)/g, async (ctx) => {
    const taskId = ctx.match[1];
    const completedById = ctx.match[2];
    const task = await Report.findById(taskId);
    const completedBy = await User.findById(completedById);
    task.isCompleted = true;
    task.completedBy = completedBy;
    await task.save();
    let text = `ā Siz tomoningizdan bartaraf etilgan muammo tasdiqlandi.\nš¤ Hamkorligingiz uchun minnatdormiz!\n\nMa'lumotlar:\n${generateDetails(
      task
    )}`;
    bot.telegram.sendPhoto(completedBy.telegramId, task.photo, {
      caption: text,
    });
    text = `š Tasdiqlaganingiz uchun tashakkur! Xabar yuboruvchisiga tasdiqlaganingiz haqida bildirdik!\nEndilikda bu holat vazifalar ro'yhatida ko'rsatilmaydi.\nš¤ Hamkorligingiz uchun minnatdormiz!\n\nMa'lumotlar:\n${generateDetails(
      task
    )}`;
    ctx.replyWithPhoto(task.photo, { caption: text });
    ctx.deleteMessage();
    ctx.answerCbQuery("ā");
  });

  bot.action(/decline-(.+)-(.+)/g, async (ctx) => {
    const taskId = ctx.match[1];
    const completedById = ctx.match[2];
    const task = await Report.findById(taskId);
    const completedBy = await User.findById(completedById);
    let text = `ā Siz tomoningizdan bartaraf etilgan muammo tasdiqlanmadi.\nš¤ Hamkorligingiz uchun minnatdormiz!\n\nMa'lumotlar:\n${generateDetails(
      task
    )}`;
    bot.telegram.sendPhoto(completedBy.telegramId, task.photo, {
      caption: text,
    });
    text = `š Tasdiqlashni bekor qilganingiz uchun uchun tashakkur! Xabar yuboruvchisiga rad etilganingiz haqida bildirdik!\nBu holat vazifalar ro'yhatidan o'chirilmaydi.\nš¤ Hamkorligingiz uchun minnatdormiz!\n\nMa'lumotlar:\n${generateDetails(
      task
    )}`;
    ctx.replyWithPhoto(task.photo, { caption: text });
    ctx.deleteMessage();
    ctx.answerCbQuery("ā");
  });
}

function generateDetails(task) {
  return `Viloyat: ${task.region}\nTuman: ${task.district}\nIzoh: ${
    task.comment || "Izoh berilmagan."
  }\n\nYuborilgan sana: ${dayjs(task.createdAt).format("DD/MM/YYYY")}`;
}

module.exports = {
  sendVerification,
  handleVerification,
};
