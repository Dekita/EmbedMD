/**
 * EmbedMD: dekitarpg@gmail.com
 * https://github.com/Dekita/EmbedMD
 */
const { readdirSync, readFileSync } = require('fs');
const {MessageEmbed} = require('discord.js');
const embed_cache = {};

class EmbedMD {
    static _scanDir(directory) {
        return readdirSync(directory).filter(f => f.endsWith('.md'));
    }
    static prepareMD(filename, refresh_cache=false) {
        if (!embed_cache[filename] || refresh_cache) {
            embed_cache[filename] = {
                raw: readFileSync(filename, 'utf8'),
                description: undefined,
                thumbnail: undefined,
                timestamp: undefined,
                title: undefined,
                color: undefined,
                author: [],
                footer: [],
                fields: [],
                filename,
            };
        }
        return embed_cache[filename]; 
    }
    static parseDir(directory) {
        const returned_data = {};
        const info_files = this._scanDir(directory);
        for (const file of info_files) {
            const file_id = file.replace('.md','');
            const filename = `${directory}/${file}`;
            const file_data = this.prepareMD(filename);
            returned_data[file_id] = file_data;
        }
        return returned_data;
    }
    static parseMD(filename, replacers={}, log_embed_data=false, refresh_cache=false) {
        const embed_data = this.prepareMD(filename, refresh_cache);
        const chunks = this.format(embed_data.raw, replacers).split('#');
        chunks.shift() // <- discard before the first #
        while (chunks.length) {
            const type = (chunks.shift()||"").trim().toLowerCase();
            const data = (chunks.shift()||"").trim();
            switch (type.toUpperCase()) {
                case 'URL':
                case 'TITLE': 
                case 'COLOR': 
                case 'IMAGE': 
                case 'THUMBNAIL': 
                case 'TIMESTAMP': 
                case 'DESCRIPTION': 
                embed_data[type] = data.trim(); 
                break;
    
                case 'AUTHOR': 
                case 'FOOTER': 
                embed_data[type] = data.split(EmbedMD.delimiter).map(d=>d.trim());
                break;
    
                case 'FIELDS': 
                const field_lines = data.split(/\r\n|\n\r|\n|\r/);
                for (const field of field_lines) {
                    const [name, value, inline] = this.parseArray(field.split(EmbedMD.delimiter));
                    embed_data.fields.push({ name, value, inline })
                }
                break;
    
                case 'FIELD': 
                const [name, value, inline] = this.parseArray(data.split(EmbedMD.delimiter));
                embed_data.fields.push({ name, value, inline })
                break;
            }
        }
        if (log_embed_data) {
            const { raw, ...to_log} = embed_data;
            console.log('embed_data:', to_log);
        }
        return embed_data;
    }
    static getEmbed(md_embed_object, ...other) {
        const embed = new MessageEmbed();
        const embed_data = this.parseMD(md_embed_object.filename, ...other);
        for (const embed_element_data in embed_data) {
            if (!Object.hasOwnProperty.call(embed_data, embed_element_data)) continue;
            const element_funk = this.function_map[embed_element_data];
            const element_data = embed_data[embed_element_data];
            if (!embed[element_funk]) continue;
            if (Array.isArray(element_data)) {
                embed[element_funk](...element_data);
            } else {
                embed[element_funk](element_data);
            }
        }
        return embed;
    }
    // helper function to format strings using objects
    // ie: format("Hi name!", {name: 'DekiaRPG});
    // => "Hi DekitaRPG!"
    static format(str, objekt) {
        const regstr = Object.keys(objekt).join("|");
        const regexp = new RegExp(regstr,"gi");
        return str.replace(regexp, matched => {
            return objekt[matched.toLowerCase()];
        });
    }    
    // convert arrays like ['1', '5', 'false', 'some description']
    // to arrays like [1, 5, false, 'some description']
    static parseArray(field_data_array) {
        return field_data_array.map(element => {
            const v = element.toLowerCase().trim();
            const is_bool = ['true','false'].includes(v); 
            return is_bool ? v === 'true' : (isNaN(v) ? v.trim() : parseInt(v));
        });
    }
    
}

EmbedMD.delimiter = ',';

EmbedMD.function_map = {
    url: 'setURL',
    title: 'setTitle',
    color: 'setColor',
    author: 'setAuthor',
    description: 'setDescription',
    thumbnail: 'setThumbnail',
    fields: 'addFields',
    image: 'setImage',
    timestamp: 'setTimestamp',
    footer: 'setFooter',
}
Object.freeze(EmbedMD.function_map);

module.exports = EmbedMD;
