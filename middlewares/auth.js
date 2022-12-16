const { User } = require("../database/models");

module.exports = async (ctx, next) => {
  let { user } = ctx.session;
  if (user) return next();
  user = await User.findOne({
    telegramId: ctx.from.id,
  });
  if (user) {
    ctx.session.user = user;
    return next();
  }
  user = new User({
    telegramId: ctx.from.id,
  });
  await user.save();
  ctx.session.user = user;
  return next();
};
