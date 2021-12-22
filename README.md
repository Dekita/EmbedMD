# README #
EmbedMD written by dekitarpg@gmail.com

This simple module allows you to load a markdown file, or directory of, and then convert the file(s) into discord.js embed objects!

### Install EmbedMD ###
```
npm i dekita-embed-md
```

### Require EmbedMD ###
```js
// EmbedMD specific code:
const EmbedMD = require('dekita-embed-md');// load module
```

### EmbedMD File Structure ###
```ruby
# TITLE #
content 

# COLOR #
default

# AUTHOR #
user.name, user.avatar, https://discord.com/

# THUMBNAIL #
bot.avatar

# DESCRIPTION #
Some description...

# FOOTER #
user.name, user.avatar

# FIELD #
label, string, true

# FIELDS #
label, string, true

# TIMESTAMP #
false
```

### Load single file and get embed ###
```js
const embed_md = EmbedMD.prepareMD('/directory/path.md'); // cache embed files from path
const embed = EmbedMD.getEmbed(embed_md); // get embed using embed_md
```

### Load all files from directory and get embed ###
```js
const embed_mds = EmbedMD.parseDir('/directory/path'); // cache embed files from path
const embed_ids = Object.keys(embed_mds); // array of filenames without.md and route
const embed = EmbedMD.getEmbed(embed_mds.embed_id); // get embed using embed_id
```

### PRO GAMER ###
Its entirely possible to have the embed parse information based on additional properties. For example, you might want to display user information or some data from a variable within your embed. Simply pass an object as the second argument to `getEmbed` with the properties that you want to replace within your .md file. For example, lets assume the following files:
md file:
```md
# FOOTER #
user.name, user.avatar
``` 
in your js file: 
```js
const embed_md = EmbedMD.prepareMD('/directory/path.md');
const embed = EmbedMD.getEmbed(embed_md, {
    'user.avatar': interaction.user.displayAvatarURL(),
    'user.name': interaction.user.username,
}); 
```

### Send embed with discord.js ###
```js
// in some discord js command interaction:
await interaction.reply({embeds: [embed]});
```



