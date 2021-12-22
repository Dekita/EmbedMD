const EmbedMD = require('dekita-md-embed');

const embed_md = EmbedMD.parseMD('./template.md');
const embed = EmbedMD.getEmbed(embed_md, {
    'bot.avatar': interaction.client.user.displayAvatarURL(),
    'bot.name': interaction.client.user.username,
    'user.avatar': interaction.user.displayAvatarURL(),
    'user.name': interaction.user.username,
    'creator.url': "https://dekitarpg.com",
});

// in some discord.js command interaction:
await interaction.reply({embeds: [embed]});
