const { SlashCommandBuilder } = require('@discord.js/builders');

module.exports = {
data: new SlashCommandBuilder()
  .setname('test')
  .setDescription('Prabhjot is the most useless teen ever'),
  async execute(interaction, client) {
    await interaction.reply({ content: 'Be Sigma' })
}
