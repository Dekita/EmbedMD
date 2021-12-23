[<img src="https://dekitarpg.com/img/header/md-embed-header.png" style="margin-top: 28px;">](https://dekitarpg.com/)
--------------------------------------------------------------------------------

# What is EmbedMD? 
EmbedMD, or `dekita-md-embed` is a simple module written by [DekitaRPG](https://dekitarpg.com) that allows you to load a markdown file, or directory of, and then convert the file(s) into discord.js embed objects! You can then send those embeds in discord.js like you normally would!!

Please note: `discord.js` is REQUIRED for this module to function.

## License TLDR
```Copyright (c) 2021 Dekita (dekitarpg@gmail.com)```
[[view license]](https://github.com/Dekita/md-embed/blob/main/LICENSE)

## System Requirements
[node.js](https://nodejs.org/) |
[discord.js](https://discord.js.org/)

## Author Information
[email](mailto://dekitarpg@gmail.com) | 
[website](https://dekitarpg.com/) | 
[twitter](https://twitter.com/dekitarpg) | 
[github](https://github.com/dekita/md-embed/)

## How To Use This Module In Your Own Projects:
Assuming you already have a `node.js` project that uses `discord.js`, getting setup with this module is incredibly straighforward! Just follow the examples below to get you started.

## Install EmbedMD 
```
npm i dekita-md-embed
```
## Require EmbedMD
```js
const EmbedMD = require('dekita-md-embed');
```

## Create Markdown Files
Once you have installed EmbedMD, create a file and save it as `filename.md`. Use the format detailed below for the file contents, and then it can be used as a template for creating discord.js embeds.
```
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
NOTE1: If using a hex color code within the `COLOR` field, remove the # or you will get errors! 
NOTE2: `FIELD`, `FIELDS`, `AUTHOR`, and `FOOTER` elements exprect multiple properties. These should be delimited using an `,` character! If you dont want to delimit with `,` then you can set a custom delimiter by setting the `EmbedMD.delimiter`. For example, to use `-`; 
```js
EmbedMD.delimiter = '-';
```

## Load A File Then Create Embed
```js
const embed_md = EmbedMD.prepareMD('/directory/path.md'); // cache embed files from path
const embed = EmbedMD.getEmbed(embed_md); // get embed using embed_md
```

## Load All Files From Directory Then Create Embed
```js
const embed_mds = EmbedMD.parseDir('/directory/path'); // cache embed files from path
const embed_ids = Object.keys(embed_mds); // array of filenames without.md and route
const embed = EmbedMD.getEmbed(embed_mds.embed_id); // get embed using embed_id
```

## Send Embed With discord.js
```js
// in some discord js command interaction:
await interaction.reply({embeds: [embed]});
```

## Formatting Embed Templates
Its entirely possible to have the embed parse information based on additional properties. For example, you might want to display user information or some data from a variable within your embed. Simply pass an object as the second argument to `getEmbed` with the properties that you want to replace within your .md file. For example, lets assume the following files:

file.md:
```md
# FOOTER #
user.name, user.avatar
``` 
file.js: 
```js
const embed_md = EmbedMD.prepareMD('./file.md');
const embed = EmbedMD.getEmbed(embed_md, {
    'user.avatar': interaction.user.displayAvatarURL(),
    'user.name': interaction.user.username,
    'creator.url': "https://dekitarpg.com",
}); 
```
With these files in place, an embed with only footer information will be created, and will use the interaction user information for the footer content when being initialized.

## Additional
You can also utilize the included helper functions for anything you might find useful. They are pretty handy!
```js
EmbedMD.format("Hi name!", {name: 'DekiaRPG'});
// => "Hi DekitaRPG!"

EmbedMD.parseArray(['1', '5', 'false', 'some description']);
// => [1, 5, false, 'some description']
```

## Actual Real Life Reviews
Tbh this is the most useful/creative/good-idea lib i've seen around here in a long time - Tim @ [[top.gg discord server]](https://discord.gg/dbl).
