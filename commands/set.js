import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import checkPermissions from '../utils/checkPermissions.js';

export default {
  data: new SlashCommandBuilder()
    .setName('set')
    .setDescription('Solicitar um set'),

  async execute(interaction) {
    if (!checkPermissions(interaction.member)) {
      return interaction.reply({ content: 'Você não tem permissão para usar este comando.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle('Solicitação de Set')
      .setDescription('Clique no botão abaixo para preencher as informações.')
      .setThumbnail(process.env.THUMBNAIL_URL);

    const button = new ButtonBuilder()
      .setCustomId('open_form')
      .setLabel('Solicitar Set')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    const channel = await interaction.guild.channels.fetch(process.env.CHANNEL_SETS);
    await channel.send({ embeds: [embed], components: [row] });

    await interaction.reply({ content: 'Set enviado!', ephemeral: true });
  }
};
