const { Scenes } = require("telegraf");

const scene = new Scenes.BaseScene("start");

scene.enter((ctx) => {
  const text =
    "Assalomu alaykum 👋\nTozalik xabarchisi botiga sizning tashfrifingizdan benihoyat xursandman. 😊\nBot atrof-muhitimizdagi ekologik muammolarga e'tiborni oshirish va tozalash ishlarini olib borishda samaradorlikni oshirish maqsadida ishlab chiqilgan. ✅\nSiz ham yashab turgan muhitingizga e'tiborli bo'lgan holda muammolar haqida xabar berishingiz yoki mavjud muammolarni bartaraf qilishda o'z hissangizni qo'shishingiz mumkin 🤝";
  ctx.reply(text);
  ctx.scene.enter("main");
});

module.exports = scene;
