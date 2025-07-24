import {
  InteractionType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js';

export default function (client) {
  client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (command) await command.execute(interaction);
    }

    if (interaction.isButton()) {

      if (interaction.customId === 'open_form') {
        const modal = new ModalBuilder()
          .setCustomId('set_modal')
          .setTitle('Solicitar Set')
          .addComponents(
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId('nome')
                .setLabel('Nome')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId('id')
                .setLabel('ID')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId('org')
                .setLabel('Organização')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId('cargo')
                .setLabel('Cargo')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
            )
          );
        await interaction.showModal(modal);
      }

      if (interaction.customId.startsWith('accept_set:')) {
        const userId = interaction.customId.split(':')[1];
        const modal = new ModalBuilder()
          .setCustomId(`modal_aprovar:${userId}`)
          .setTitle('Aprovar Set – Informar ID do Cargo')
          .addComponents(
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId('cargo_id')
                .setLabel('ID do Cargo a adicionar')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
            )
          );
        await interaction.showModal(modal);
      }


      if (interaction.customId.startsWith('reject_set:')) {
        const userId = interaction.customId.split(':')[1];
        const modal = new ModalBuilder()
          .setCustomId(`modal_recusa:${userId}`)
          .setTitle('Motivo da recusa')
          .addComponents(
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId('motivo')
                .setLabel('Motivo')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
            )
          );
        await interaction.showModal(modal);
      }
    }

    if (interaction.type === InteractionType.ModalSubmit) {
      if (interaction.customId.startsWith('modal_aprovar:')) {
        const userId = interaction.customId.split(':')[1];
        const cargoId = interaction.fields.getTextInputValue('cargo_id');

        try {
          const guild = interaction.guild;
          const member = await guild.members.fetch(userId);

          // Pegar as mensagens anteriores com embed para pegar NOME e ID
          const msg = await interaction.channel.messages.fetch(interaction.message.id);
          const embed = msg.embeds[0];

          const nome = embed.fields.find(f => f.name === 'Nome')?.value ?? '';
          const idCustom = embed.fields.find(f => f.name === 'ID')?.value ?? '';

          // 1. Renomear o usuário
          await member.setNickname(`${nome} | ${idCustom}`);

          // 2. Adicionar o cargo
          await member.roles.add(cargoId);

          // 3. Avisar no canal de avisos
          const avisoChannel = await guild.channels.fetch(process.env.CHANNEL_AVISOS);
          await avisoChannel.send(`<@${userId}>, seu set foi **aprovado**!`);

          await interaction.reply({ content: `✅ Set aprovado, cargo adicionado e nickname atualizado.`, ephemeral: true });

          // 4. Editar a mensagem de solicitação
          await msg.edit({ content: '✅ Aprovado', components: [] });

        } catch (err) {
          console.error('Erro ao aprovar set:', err);
          await interaction.reply({ content: '❌ Erro ao aprovar o set. Verifique se o ID do cargo está correto.', ephemeral: true });
        }
      }

      if (interaction.customId === 'set_modal') {
        const nome = interaction.fields.getTextInputValue('nome');
        const id = interaction.fields.getTextInputValue('id');
        const org = interaction.fields.getTextInputValue('org');
        const cargo = interaction.fields.getTextInputValue('cargo');

        const embed = new EmbedBuilder()
          .setTitle('Novo Set Solicitado')
          .addFields(
            { name: 'Nome', value: nome },
            { name: 'ID', value: id },
            { name: 'Organização', value: org },
            { name: 'Cargo', value: cargo },
            { name: 'Membro', value: `<@${interaction.user.id}>` }
          )
          .setColor('Blue');

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId(`accept_set:${interaction.user.id}`).setLabel('Aceitar').setStyle(ButtonStyle.Success),
          new ButtonBuilder().setCustomId(`reject_set:${interaction.user.id}`).setLabel('Recusar').setStyle(ButtonStyle.Danger)
        );

        const canalSolicitacoes = await interaction.guild.channels.fetch(process.env.CHANNEL_SOLICITACOES);
        await canalSolicitacoes.send({ embeds: [embed], components: [row] });

        await interaction.reply({ content: 'Solicitação enviada!', ephemeral: true });
      }

      if (interaction.customId.startsWith('modal_recusa:')) {
        const userId = interaction.customId.split(':')[1];
        const motivo = interaction.fields.getTextInputValue('motivo');
        const canalAvisos = await interaction.guild.channels.fetch(process.env.CHANNEL_AVISOS);
        await canalAvisos.send(`<@${userId}>, seu set foi **recusado**.\nMotivo: ${motivo}`);
        await interaction.reply({ content: 'Recusa enviada.', ephemeral: true });
      }
    }
  });
}
