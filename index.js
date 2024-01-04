const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions } = require(`discord.js`);

const prefix = '!';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on("ready", () => {
  console.log("Its Online, Go and check in server :))");

          client.user.setActivity(`Subscribe to Legend Gamerz •_•`, { type: "WATCHING" });

});

client.on("messageCreate", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);

  const command = args.shift().toLowerCase;


  //message array

  const messageArray = message.content.split(" ")
  const argument = messageArray.slice(1);
  const cmd = messageArray[0];

  //CMDS
//TEST CMDS

if ( command === 'test' ) {
  messagw.channel.send(" मैं अब  discord.js v14 पर आगया लेकिन प्रभजोत अभी भी सुतिया है ")
}

  




})










client.login(process.env.BOTTOKEN);
