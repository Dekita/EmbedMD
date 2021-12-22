# README #
EmbedMD written by dekitarpg@gmail.com

This simple module allows you to load a markdown file, or directory of, and then convert the file(s) into discord.js embed objects! You can then send those embeds in discord.js like you normally would!!

### Install EmbedMD ###
```
npm i dekita-md-embed
```

### Require EmbedMD ###
```js
// EmbedMD specific code:
const EmbedMD = require('dekita-md-embed');// load module
```

### EmbedMD File Structure ###
```markdown
# URL #
creator.url

# TITLE #
title text... 

# COLOR #
RANDOM

# AUTHOR #
user.name, user.avatar, creator.url

# THUMBNAIL #
bot.avatar

# DESCRIPTION #
description text...

# FOOTER #
user.name, user.avatar

# FIELD #
label, string, true

# FIELDS #
label, string, true

# TIMESTAMP #
false
```
note: `FIELD`, `FIELDS`, `AUTHOR`, and `FOOTER` elements exprect multiple properties. These should be delimited using an `,` character! If you dont want to delimit with `,`, then you can set a custom delimiter by setting the `EmbedMD.delimiter`. For example, to use `-`; 

note2: If using a hex color code within the `COLOR` field, remove the # or you will get errors! 
```js
EmbedMD.delimiter = '-';
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
    'creator.url': "https://dekitarpg.com",
}); 
```

### Send embed with discord.js ###
```js
// in some discord js command interaction:
await interaction.reply({embeds: [embed]});
```

### Additional ###
You can also utilize the included format function (the one that replaces strings from properties defined in an object) for anything you might find useful. Its a handy little blighter! 
```js
EmbedMD.format("Hi name!", {name: 'DekiaRPG'});
// => "Hi DekitaRPG!"

EmbedMD.parseArray(['1', '5', 'false', 'some description']);
// => [1, 5, false, 'some description']
```


### Full Functions List ###
```js
EmbedMD.parseDir(directory);
// parses `directory` for .md files, then parses each file in prepration for creating embeds. 

const md_data = EmbedMD.prepareMD(filepath);
// prepare single .md file for passing to getEmbed

EmbedMD.getEmbed(md_data, replacers={}, log=false, refresh=false);
// parses the md_data and then returns a discord.js embed object.
// uses properties within the `replacer` object to replace contents within the md file.
// `log` determines if the embed object should be logged to console - useful for debugging.
// `refresh` is a boolean to determine if the md file should be reloaded, or if we can use cache.
// `parseMD()` will only prepare

EmbedMD.format(string, object);
// Replaces `string` elements that match properties from `object`. 

EmbedMD.parseArray(array);
// Parse an array of strings where some are integers or booleans into an array of those objects.
```
