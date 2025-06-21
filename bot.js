import { Bot, InlineKeyboard } from "grammy";

// Вставь сюда токен своего бота
const bot = new Bot("7980157597:AAGlBG2Op2CY_5ihIiviH3OBIGW9WeHuU6c");

// /start — приветствие и правила
bot.command("start", (ctx) => {
  ctx.reply(`Привет! Это игра "Орел и Решка".\n
Ты можешь сделать ставку на Орла или Решку, а я подброшу монету и скажу результат.
Команды:
/play — начать игру
/help — правила игры`);
});

// /help — правила и команды
bot.command("help", (ctx) => {
  ctx.reply(`Правила игры:
- Сделай ставку на "Орел" или "Решка" командой /play
- Я подброшу монету случайно
- Если угадал — поздравляю!
- Хочешь — сыграй снова!`);
});

// /play — начало игры с кнопками для ставки
bot.command("play", async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text("Орел", "bet_heads")
    .text("Решка", "bet_tails");
  await ctx.reply("Сделай ставку:", { reply_markup: keyboard });
});

// Обработчик нажатий на кнопки ставок
bot.callbackQuery(/bet_(heads|tails)/, async (ctx) => {
  const userChoice = ctx.match[1]; // heads или tails

  // Генерируем случайный результат
  const coinResult = Math.random() < 0.5 ? "heads" : "tails";

  let resultText = coinResult === userChoice
    ? "Поздравляю! Ты выиграл 🎉"
    : "Увы, ты проиграл 😞";

  resultText += `\n\nВыпало: ${coinResult === "heads" ? "Орел" : "Решка"}`;

  // Кнопки для повтора
  const keyboard = new InlineKeyboard()
    .text("Да", "play_again_yes")
    .text("Нет", "play_again_no");

  // Ответ пользователю
  await ctx.editMessageText(resultText + "\n\nСыграем ещё?", {
    reply_markup: keyboard,
  });

  // Обязательный ответ на callback, чтобы убрать "часики"
  await ctx.answerCallbackQuery();
});

// Обработчики кнопок "Да" и "Нет"
bot.callbackQuery("play_again_yes", async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text("Орел", "bet_heads")
    .text("Решка", "bet_tails");
  await ctx.editMessageText("Сделай ставку:", { reply_markup: keyboard });
  await ctx.answerCallbackQuery();
});

bot.callbackQuery("play_again_no", async (ctx) => {
  await ctx.editMessageText("Спасибо за игру! Чтобы сыграть снова — введи /play");
  await ctx.answerCallbackQuery();
});


// Запуск бота
bot.start();
console.log("Бот запущен...");
