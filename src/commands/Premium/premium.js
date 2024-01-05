const {
    Client,
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');
const voucher_codes = require('voucher-code-generator');
const premiumCodeDB = require('../../Structures/Schemas/premiumCodeDB');
const premiumGuildDB = require('../../Structures/Schemas/premiumGuildDB');
const moment = require('moment');
const ms = require('ms');

const command = new SlashCommandBuilder()
    .setName('premium')
    .setDescription('All the premium commands')
    .addSubcommand((subcommand) =>
        subcommand
            .setName('create')
            .setDescription('Create a subscription code')
            .addStringOption((option) =>
                option
                    .setName('plan')
                    .setDescription('Select the length of the code')
                    .addChoices(
                        { name: 'Hourly', value: 'hourly' },
                        { name: 'Daily', value: 'daily' },
                        { name: 'Weekly', value: 'weekly' },
                        { name: 'Monthly', value: 'monthly' },
                        { name: 'Yearly', value: 'yearly' },
                        { name: 'Life Time', value: 'lifetime' },
                    )
                    .setRequired(true),
            )
            .addUserOption((option) =>
                option.setName('user').setDescription("Send this code to a user's DM").setRequired(false),
            )
            .addNumberOption((option) =>
                option.setName('amount').setDescription('Number of codes to generate').setRequired(false),
            ),
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName('redeem')
            .setDescription('Redeem a subscription code')
            .addStringOption((option) =>
                option.setName('code').setDescription('Enter the code to redeem').setRequired(true),
            ),
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName('remove')
            .setDescription('Remove a subscription of a guild')
            .addStringOption((option) =>
                option.setName('guild').setDescription('Guild ID of a server').setRequired(true),
            )
            .addStringOption((option) =>
                option.setName('reason').setDescription('Reason for removing subscription').setRequired(false),
            ),
    )
    .addSubcommand((subcommand) => subcommand.setName('list').setDescription('See all the premium guilds'));

// Add a custom 'variables' property to the command
command.path = 'Premium/premium.js';
command.category = 'Premium';
command.developer = false;
command.premium = false;
command.cooldown = ms('5m');

module.exports = {
    data: command,

    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const cmd = interaction.options.getSubcommand();
        switch (cmd) {
            case 'create':
                {
                    const plan = interaction.options.getString('plan');
                    const buyer = interaction.options.getUser('user');
                    let amount = interaction.options.getNumber('amount');

                    if (!amount) {
                        amount = 1;
                    }
                    let codes = [];

                    for (var i = 0; i < amount; i++) {
                        const codePremium = voucher_codes.generate({
                            pattern: '####-####-####',
                        });
                        const code = codePremium.toString().toUpperCase();
                        const findCode = await premiumCodeDB.findOne({ code: code });

                        if (!findCode) {
                            premiumCodeDB.create({
                                code: code,
                                plan: plan,
                                expiresAt: Date.now() + ms('10sec'),
                            });

                            codes.push(`${i + 1}- ${code}`);
                        }
                    }

                    const embed = new EmbedBuilder()
                        .setTitle('Code(s) Generated')
                        .setDescription(
                            '> Generated **' + codes.length + '** Premium Code(s):\n```\n' + codes.join('\n') + '\n```',
                        )
                        .addFields(
                            {
                                name: 'Plan Type',
                                value: `\`\`\`${plan}\`\`\``,
                                inline: false,
                            },
                            {
                                name: 'How To Redeem:',
                                value: `\`\`\`/premium redeem <code>\`\`\``,
                                inline: false,
                            },
                        )
                        .setColor('Green')
                        .setTimestamp();

                    await interaction.reply({ embeds: [embed] });
                    if (buyer) {
                        const embed = new EmbedBuilder()
                            .setTitle('Subscription Code(s) Delivery')
                            .setDescription(
                                'Thanks for your patience, here is your subscription code(s) you ordered. Hope you like our premium commands and features.\n\n```Premium Code(s):\n' +
                                    codes.join('\n') +
                                    '\n```',
                            )
                            .addFields(
                                {
                                    name: 'Plan Type',
                                    value: `\`\`\`${plan}\`\`\``,
                                    inline: false,
                                },
                                {
                                    name: 'How To Redeem:',
                                    value: `\`\`\`/premium redeem <code>\`\`\``,
                                    inline: false,
                                },
                            )
                            .setColor('Green')
                            .setTimestamp();
                        buyer.send({ embeds: [embed] });
                    }
                }
                break;
            case 'redeem':
                {
                    try {
                        const input = interaction.options.getString('code');
                        let guild = await premiumGuildDB.findOne({ ID: interaction.guild.id });
                        const code = await premiumCodeDB.findOne({ code: input.toUpperCase() });

                        if (guild && guild?.isPremium) {
                            const embed = new EmbedBuilder()

                                .setTitle('Code Redemption Failed')
                                .setColor('Red')
                                .setTimestamp()
                                .setDescription('You are already a premium user, you can redeem the code later.');

                            return interaction.reply({ embeds: [embed] });
                        }

                        if (code) {
                            const plan = code.plan;
                            const codeID = code.code;
                            const planDurations = {
                                one: ms('10 seconds'),
                                hourly: ms('1 hour'),
                                daily: ms('1 day'),
                                weekly: ms('1 week'),
                                monthly: ms('1 month'),
                                yearly: ms('1 year'),
                                lifetime: ms('100 year'), // 25 years for "lifetime"
                            };

                            const planDuration = planDurations[plan];
                            const expiresAt = moment()
                                .add(planDuration, 'milliseconds')
                                .format('dddd, MMMM Do YYYY HH:mm:ss');

                            if (guild) {
                                guild.ID = interaction.guild.id;
                                guild.isPremium = true;
                                guild.premium.ID = codeID;
                                guild.premium.redeemedAt = Date.now();
                                guild.premium.redeemedBy = interaction.user.username;
                                guild.premium.expiresAt = Date.now() + planDuration;
                                guild.premium.plan = plan;
                                guild.save().catch((err) => {
                                    betterlog.error(err);
                                });
                            } else {
                                guild = await new premiumGuildDB({
                                    ID: interaction.guild.id,
                                    isPremium: true,
                                    ['premium.ID']: codeID,
                                    ['premium.redeemedAt']: Date.now(),
                                    ['premium.redeemedBy']: interaction.user.username,
                                    ['premium.expiresAt']: Date.now() + planDuration,
                                    ['premium.plan']: plan,
                                })
                                    .save()
                                    .catch((err) => {
                                        betterlog.error(err);
                                    });
                            }

                            await client.guildSettings.set(interaction.guild.id, guild);

                            await code.deleteOne().catch(() => {});

                            const embed = new EmbedBuilder()
                                .setAuthor({
                                    name: `Premium Redeemed!`,
                                    iconURL: interaction.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    `Congratulations ${interaction.user}. You've successfully redeemed a premium code with the following details.`,
                                )
                                .setThumbnail(interaction.user.displayAvatarURL())
                                .setColor('Green')
                                .setTimestamp()
                                .addFields([
                                    {
                                        name: `Redeemed For`,
                                        value: `\`\`\`${interaction.guild.name} / ${interaction.guild.id}\`\`\``,
                                        inline: false,
                                    },
                                    {
                                        name: `Redeemed By`,
                                        value: `\`\`\`${interaction.user.username} / ${interaction.user.id}\`\`\``,
                                        inline: false,
                                    },
                                    {
                                        name: `Plan Type`,
                                        value: `\`\`\`${plan.charAt(0).toUpperCase() + plan.slice(1)}\`\`\``,
                                        inline: false,
                                    },
                                    {
                                        name: `Expired Time`,
                                        value: `\`\`\`${expiresAt}\`\`\``,
                                        inline: false,
                                    },
                                ]);

                            await interaction.reply({ embeds: [embed] });
                        } else {
                            const embed = new EmbedBuilder()
                                .setTitle('Code Redemption Failed')
                                .setColor('Red')
                                .setDecription(
                                    'The code you entered is invalid. Please check your code and try again later',
                                )
                                .setTimestamp();

                            await interaction.reply({ embeds: [embed] });
                        }
                    } catch (error) {
                        console.error(error);
                        const embed = new EmbedBuilder()
                            .setTitle('Error')
                            .setDescription('An error occured while redeeming your code, please try again later')
                            .setColor('Red')
                            .setTimestamp();

                        await interaction.reply({ embeds: [embed], ephemeral: true });
                    }
                }
                break;
            case 'list':
                {
                    //has the interaction already been deferred? If not, defer the reply.
                    if (interaction.deferred == false) {
                        await interaction.deferReply({ ephemeral: true });
                    }

                    const itemsPerPage = 5; // Number of premium users per page
                    let currentPage = 0;

                    const generateEmbed = (page, data, itemsPerPage, client) => {
                        const totalPages = Math.ceil(data.size / itemsPerPage);

                        const embed = new EmbedBuilder()
                            .setColor('Blue')
                            .setTitle('All Premium Guilds')
                            .setFooter({ text: `Page ${page + 1}/${totalPages}` });

                        if (data.size === 0) {
                            embed.setDescription('No Premium Guilds Found');
                            return embed;
                        }

                        const premiumData = [...data.values()].filter((item) => item.isPremium === true);

                        const startIndex = page * itemsPerPage;
                        const endIndex = startIndex + itemsPerPage;

                        premiumData.slice(startIndex, endIndex).forEach((data) => {
                            const guildId = data.ID;
                            const isPremium = data.isPremium;
                            const premiumInfo = data.premium;
                            const guild = client.guilds.cache.get(guildId);

                            const redeemedAt = new Date(premiumInfo.redeemedAt);
                            const expiresAt = new Date(premiumInfo.expiresAt);
                            const redeemedBy = premiumInfo.redeemedBy;

                            embed.addFields({
                                name: `Guilds Premium Information - ${guild.name}`,
                                value:
                                    `**Guild ID:** ${guildId}\n` +
                                    `**Is Premium:** ${isPremium ? 'Yes' : 'No'}\n` +
                                    `**Premium Plan:** ${premiumInfo.plan}\n` +
                                    `**Redeemed By:** ${redeemedBy}\n` +
                                    `**Redeemed At:** ${redeemedAt.toLocaleString()}\n` +
                                    `**Expires At:** ${expiresAt.toLocaleString()}`,
                                inline: false,
                            });
                        });

                        return embed;
                    };

                    // Assuming data is a Map
                    const data = await client.guildSettings;

                    const totalPages = Math.ceil(data.size / itemsPerPage);
                    const row = new ActionRowBuilder();

                    if (totalPages > 1) {
                        row.addComponents(
                            new ButtonBuilder()
                                .setCustomId('firstPage')
                                .setLabel('First')
                                .setStyle(ButtonStyle.PRIMARY),
                            new ButtonBuilder()
                                .setCustomId('previousPage')
                                .setLabel('Previous')
                                .setStyle(ButtonStyle.PRIMARY),
                            new ButtonBuilder().setCustomId('nextPage').setLabel('Next').setStyle(ButtonStyle.PRIMARY),
                            new ButtonBuilder().setCustomId('lastPage').setLabel('Last').setStyle(ButtonStyle.PRIMARY),
                        );

                        row.components[0].setDisabled(true);
                        row.components[1].setDisabled(true);

                        const initialMessage = await interaction.editReply({
                            embeds: [generateEmbed(currentPage, data, itemsPerPage, client)],
                            components: [row],
                            ephemeral: true,
                        });

                        const filter = (i) =>
                            ['firstPage', 'previousPage', 'nextPage', 'lastPage'].includes(i.customId);
                        const collector = initialMessage.createMessageComponentCollector({ filter, time: ms('5m') });

                        collector.on('collect', async (i) => {
                            switch (i.customId) {
                                case 'firstPage':
                                    currentPage = 0;
                                    break;
                                case 'previousPage':
                                    if (currentPage > 0) {
                                        currentPage--;
                                    }
                                    break;
                                case 'nextPage':
                                    if (currentPage < totalPages - 1) {
                                        currentPage++;
                                    }
                                    break;
                                case 'lastPage':
                                    currentPage = totalPages - 1;
                                    break;
                            }

                            const components = [row];

                            components[0].components[0].setDisabled(currentPage === 0);
                            components[0].components[1].setDisabled(currentPage === 0);
                            components[0].components[2].setDisabled(currentPage === totalPages - 1);
                            components[0].components[3].setDisabled(currentPage === totalPages - 1);

                            await i.update({
                                embeds: [generateEmbed(currentPage, data, itemsPerPage, client)],
                                components: components,
                            });
                        });

                        collector.on('end', () => {
                            initialMessage.edit({ components: [] });
                        });
                    } else {
                        await interaction.editReply({
                            embeds: [generateEmbed(currentPage, data, itemsPerPage, client)],
                            ephemeral: true,
                        });
                    }
                }
                break;
        }
    },
};

                         
