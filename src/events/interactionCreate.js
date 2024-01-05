const { Interaction } = require("discord.js");
const os = require('os');

module.exports = {
name: 'interactionCreate',
async execute(interaction, client) {
if (!interaction.isCommand()) return;

const command = client.commands.get(interaction.commandName);

if (!command) return

try{


await command.execute(interaction, client);
} catch (error) {
console.log(error);
await interaction.reply({
content: 'There was an error while executing this command!',
ephemeral: true
});
}

},

};

        try{
         async function handleInteraction(interaction, client) {
          await command.execute(interaction, client);
         }
        } catch (error) {

          console.log(error);



          const channelID = '1192758388489195572';

          const channel = client.channels.cache.get(channelID);   

        



          const embed = new EmbedBuilder()

          .setColor('#FF0000')

          .setTimestamp()

          .setFooter({ text: 'Error Reported At' })

          .setTitle('Command Execution Error')

          .setDescription('An error occurred while executing the command.')

          .addFields(

            { name: '> •   Command', value: `\`\`\`${interaction.commandName}\`\`\`` },

            { name: '> •   Triggered By', value: `\`\`\`${interaction.user.username}#${interaction.user.discriminator}\`\`\`` },

            { name: '> •   Error Stack', value: `\`\`\`${error.stack}\`\`\`` },

            { name: '> •   Error Message', value: `\`\`\`${error.message}\`\`\`` }

          );

        

        const yellowButton = new ButtonBuilder()

          .setCustomId('change_color_yellow')

          .setLabel('Mark As Pending')

          .setStyle('1');

        

        const greenButton = new ButtonBuilder()

          .setCustomId('change_color_green')

          .setLabel('Mark As Solved')

          .setStyle('3');

        

        const redButton = new ButtonBuilder()

          .setCustomId('change_color_red')

          .setLabel('Mark As Unsolved')

          .setStyle('4');

        

        const row = new ActionRowBuilder()

          .addComponents(yellowButton, greenButton, redButton);

        

        // Handle button interactions for the specific message

        client.on('interactionCreate', async (interaction) => {

          try {

            if (!interaction.isButton()) return;

            if (interaction.message.id !== message.id) return; // Only handle button interactions for the specific message

        

            const { customId } = interaction;

        

            if (customId === 'change_color_yellow') {

              // Change the embed color to yellow

              embed.setColor('#FFFF00');

              await interaction.reply({

                content: 'This error has been marked as pending.',

                ephemeral: true,

              });

            } else if (customId === 'change_color_green') {

              // Change the embed color to green

              embed.setColor('#00FF00');

              await interaction.reply({

                content: 'This error has been marked as solved.',

                ephemeral: true,

              });

            } else if (customId === 'change_color_red') {

              // Change the embed color to red

              embed.setColor('#FF0000');

              await interaction.reply({

                content: 'This error has been marked as unsolved.',

                ephemeral: true,

              });

            }

        

            // Update the existing message with the modified embed

            await message.edit({ embeds: [embed], components: [row] });

        

            // Acknowledge the button click by deferring the interaction

            await interaction.deferUpdate();

          } catch (error) {

            console.log('Error in button interaction:', error);

          }

        });

        

        // Send the initial embed with buttons

        async function sendMessage() {
    const message = await channel.send({ embeds: [embed], components: [row] });  
}

sendMessage();      

        

      

      
async function handleInteraction(interaction) {


      await interaction.reply({

        content: 'There was an error while executing this command. I have sent your crash report to the support server. If this persists, please contact the developer by making a support request.',

        ephemeral: true,

      });

    }

   };
const cliProgress = require('cli-progress'); 

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log('Ready!');

        const commandCount = client.commands.size; 
        const totalMembers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
        const totalGuilds = client.guilds.cache.size;
        const botVersion = '1.0.0'; 
        const botOwner = 'Legend Gamerz'; 

        function displayAdvancedConsole() {
            console.clear();
            console.log('==================================');
            console.log('Bot Status Console');
            console.log('==================================');
            console.log(`Command Count: ${commandCount}`);
            console.log(`Total Members: ${totalMembers}`);
            console.log(`Total Guilds: ${totalGuilds}`);
            console.log(`Bot Launch Time: ${new Date().toLocaleString()}`);
            console.log(`Bot Version: ${botVersion}`);
            console.log(`Storage Used: ${Math.round((os.totalmem() - os.freemem()) / 1024 / 1024)} MB`);
            console.log(`Total RAM: ${Math.round(os.totalmem() / 1024 / 1024)} MB`);
            console.log(`CPU: ${os.cpus()[0].model}`);
            console.log(`Bot Owner: ${botOwner}`);
            console.log('==================================');
        }

        async function pickPresence() {
            const option = Math.floor(Math.random() * statusArray.length);
            try {
                await client.user.setPresence({
                    activities: [
                        {
                            name: statusArray[option].content,
                            type: statusArray[option].type,
                        },
                    ],
                    status: statusArray[option].status,
                });
            } catch (error) {
                console.error(error);
            }
        }

        displayAdvancedConsole();
    },
};
