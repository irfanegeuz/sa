const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

const filter = function(message, array, boolean, text) {
  if (array.some(word => message.content.toLowerCase().replace(/[^\p{L} ]+/gu, "").includes(word))) {
    if (boolean) {
      setTimeout(() => {
        if (!message.deleted) {
          message.delete();
        };
      }, 1000)

      message.channel.send(`<@${message.member.id}>, ${text}`).then(m => { if (!m.deleted) m.delete({timeout: 10000}) });
    };
  };
};

const reklamfilter = function(message, boolean, text) {
  let discordInvite = /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i;
  if (message.member.hasPermission('ADMINISTRATOR')) return;

  if (discordInvite.test(message.content.toLowerCase())) {
    if (boolean) {
      setTimeout(() => {
        if (!message.deleted) {
          message.delete();
        };
      }, 1000)

      message.channel.send(`<@${message.member.id}>, ${text}`).then(m => { if (!m.deleted) m.delete({timeout: 10000}) });
    };
  };
};

client.on('ready', async () => {
  console.log("Hazırım! - vexdy#3576");
});

client.on("message", async (message) => {
  if (message.channel.type == "dm" || message.author.bot) return;
  let kufur = config.protection.kufur, tos = config.protection.tos, reklam = config.protection.reklam;
  let tosArray = config.words.tos, kufurArray = config.words.kufur;

  filter(message, tosArray, tos, "Sohbet filtremize takıldınız, lütfen mesajınızı **düzgün bir biçimde** tekrardan yazın.\n — Örnek: \`Hile\` yazmak yerine \`yazılım\` yazarak cümleni tekrar yaz.");
  filter(message, kufurArray, kufur, "**Bu sunucuda küfür etmek yasaktır.**");
  reklamfilter(message, reklam, "**Bu sunucuda reklam yapamazsın!**")
});

client.on("messageUpdate", async (oldMessage, newMessage) => {
  if (newMessage.author.bot || newMessage.channel.type == "dm") return;
  let kufur = config.protection.kufur, tos = config.protection.tos, reklam = config.protection.reklam;
  let tosArray = config.words.tos, kufurArray = config.words.kufur;
    
  filter(newMessage, tosArray, tos, "Sohbet filtremize takıldınız, bir dahakine mesajınızı **düzgün bir biçimde** editleyin.\n — Örnek: \`Hile\` yazmak yerine \`yazılım\` yazarak cümleni tekrar yaz.");
  filter(newMessage, kufurArray, kufur, "**Bu sunucuda küfür etmek yasaktır.**");
  reklamfilter(newMessage, reklam, "**Bu sunucuda reklam yapamazsın!**")
});

client.on('message', async (message) => {

  if (message.channel.type == "dm") return;
  const prefix = config.bot.prefix;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (!message.content.startsWith(prefix) || message.author.bot || message.channel.type == "dm") return;

  if (command == "link") {
    if (!message.member.roles.cache.find(r => r.id == "773476310407446548")) { return message.reply("Link alabilmek için yetkin yok.") }
    try {
        await message.author.send(`Onay sunucusuna girmek için bu discorda gitmelisin! — ${config.link}`);
        message.reply('**mesaj gönderildi!**');
    } catch (e) {
        let embed = new Discord.MessageEmbed()
          .setDescription(`<@${message.author.id}>, sana mesaj gönderemiyorum. Lütfen **özel mesajlarını aç!**`)
          .setImage('https://vexdy.xyz/f/mesaj.png')
          .setColor('RANDOM')
        
        message.channel.send(embed);
    };
  };
});



client.login(config.bot.token);