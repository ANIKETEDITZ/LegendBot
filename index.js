const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions } = require(`discord.js`);

const prefix = '!';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on("ready", () => {
  console.log("Its Online, Go and check in server :))");

          client.user.setActivity(`Subscribe to Legend Gamerz •_•`, { type: "WATCHING" });

});


















client.login(process.env.BOTTOKEN);
