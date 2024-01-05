const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, client, } = require('@discordjs/builders');

const { EmbedBuilder, PermissionsBitField, Embed } = require('discord.js');



module.exports= {

    data: new SlashCommandBuilder()

    .setName('ban')

    .setDescription('Ban a member from this guild.')

    .addUserOption(option =>

     option.setName('user')

    .setDescription('The user you want to ban from the guild')

    .setRequired(true))

    

    //reason for the ban

    .addStringOption(option =>

        option.setName('reason')

        .setDescription('Reason For Ban')

        .setRequired(true)),



            async execute(interaction, client, args) {

               //defining needed things

                const users = interaction.options.getUser('user');

                const ID = users.id;

                const banUser = client.users.cache.get(ID)

                const user = interaction.user.username;

                const userID = interaction.user.id;



                //making permissions needed

            if(!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply({content: `Lack of permissions.`, ephemeral: true});

            if(interaction.member.id === ID) return await interaction.reply({content:`You cannot ban yourself.`});



                //no reason message

            let reason = interaction.options.getString('reason');

            if (!reason) reason = "No reason was given by the admin who banned you"



//dm message after ban

            const banEmbed = new EmbedBuilder()

            .setColor('Blue')

            .setTitle(`You have been permanently banned from ${interaction.guild.name}** | ${reason}`)

            .setThumbnail('https://cdn.discordapp.com/attachments/1149280168007962626/1185116306719113216/logo_1.png?ex=658e7091&is=657bfb91&hm=c5eaa3fcd6fefaa4f7ba99b95dc4f26d8e4b2ab260a266d226b5ef2f24381509&')

            .addFields(

            {name: 'Banning Staff User', value: `Banned by: <@${interaction.user.id}>`, inline: false},

            {name: '⏲️ Time:', value: `${new Date().toLocaleString()}`, inline: false} 

            )           

            .setFooter({ text: `Banned`})





//ban conformation

            const banconfEmbed = new EmbedBuilder()

            .setColor('Blue')

            .setTitle(`User: ( ${banUser} ) has been banned`)

            .setImage('https://cdn.discordapp.com/attachments/1149280168007962626/1171210033925734491/standard.gif?ex=655bd958&is=65496458&hm=736976518ee97b5c343179399577f75a7251d1fd3e6f75010aa079a303a87df0&')

            .setDescription(`Good bye :saluting_face:`)

            .setFooter({ text: `Developer Mar | TIW | TIW Development Team`})





            await interaction.guild.bans.create(banUser.id, {reason}).catch(err => { 

                return interaction.reply({ content: "I cannot ban this user, as they have higher permissions than me" })})





                await banUser.send({ embeds: [banEmbed] }).catch(err =>{

                    return;

                })





                await interaction.reply({embeds: [banconfEmbed] }).catch(err =>{

                    return;

                });

            }
