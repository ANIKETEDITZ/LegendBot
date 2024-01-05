const { Interaction } = require("discord.js");

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
if (command) {
    let guild = client.guildSettings.get(interaction.guild.id);
    if (command.data.premium && !guild.isPremium) {
        return interaction.reply(
            `This Server doesn't have Premium Subscription. Contact Developer for queries.`,
        );
    } else {
        return await command.execute(interaction, client);
    }
}


};
