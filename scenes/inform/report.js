const { Scenes, Markup, Composer } = require("telegraf");
const { Report } = require("../../database/models");
const logger = require("../../utils/logger");
const regionScene = require("../common/region");

const scene = new Scenes.WizardScene(
  "report",
  (ctx) => {
    const { region, district } = ctx.session;
    if (!region || !district) return ctx.scene.enter("region");
    ctx.wizard.state.region = region.name;
    ctx.wizard.state.district = district.name;
    ctx.session.region = null;
    ctx.session.district = null;

    const text =
      "📸 Ajoyib! Marhamat, holatni tasvirlovchi fotosuratni yuborishingiz mumkin.";
    const keyboard = Markup.keyboard([["◀️ Orqaga"]]).resize();
    ctx.reply(text, keyboard);
    ctx.wizard.next();
  },
  (ctx) => {
    let photo = ctx.message?.photo;
    photo = photo && (photo[1] || photo[0]);
    if (!photo)
      return ctx.reply(
        "❗️ Iltimos, fotosurat yuborganingizga ishonch hosil qiling."
      );
    ctx.wizard.state.photo = photo.file_id;

    const text = "💬 Holat haqida izoh qoldirishingiz mumkin";
    ctx.reply(text);
    ctx.wizard.next();
  },
  (ctx) => {
    // Text handling
    const comment = ctx.message?.text;
    if (!comment) return ctx.reply("❗️ Iltimos, matn kiriting.");
    ctx.wizard.state.comment = comment;

    const text = "🛣 Holat joylashgan manzilni yuborishingiz mumkin";
    const keyboard = Markup.keyboard([
      [Markup.button.locationRequest("📍 Lokatsiyani jo'natish")],
      ["➡️ Lokatsiya yubormasdan o'tkazib yuborish"],
      ["◀️ Orqaga"],
    ]).resize();
    ctx.reply(text, keyboard);
    ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.message?.text !== "➡️ Lokatsiya yubormasdan o'tkazib yuborish") {
      const location = ctx.message?.location;
      if (!location)
        return ctx.reply(
          "❗️ Iltimos, lokatsiya yuborganingizga ishonch hosil qiling."
        );
      ctx.wizard.state.latitude = location.latitude;
      ctx.wizard.state.longitude = location.longitude;
    }

    ctx.wizard.state.reportedBy = ctx.session.user;
    const report = new Report(ctx.wizard.state);
    try {
      await report.save();
      ctx.reply(
        "✅ Bildirishnomangiz vazifalar ro'yhatiga qo'shildi, sizdan minnatdormiz!"
      );
    } catch (error) {
      logger.error(`SceneError: ${error.message}`, { type: "scene" });
      ctx.reply(
        "⚠️ Bildirishnomani saqlashda xatolik yuz berdi. Noqulaylik uchun uzr so'raymiz."
      );
    }

    ctx.scene.enter("main");
  }
);

scene.hears("◀️ Orqaga", (ctx) => ctx.scene.enter("main"));

module.exports = scene;
