/**
 * EmbedMD: dekitarpg@gmail.com
 * https://github.com/Dekita/EmbedMD
 */
const { readdirSync, readFileSync } = require('fs');
const {MessageEmbed} = require('discord.js');
const embed_cache = {};

/** 
* The main namespace for the dekita-md-embed module.
* 
* NOTE: This is a static class. Do not create a new instance of it!
* @class
**/
class EmbedMD {
    /**
    * Throws an error when attempting to create instance.
    * @constructor
    **/
    constructor(){
        throw new Error("EmbedMD is a static class. You cannot create an instance!")
    }
    /**
    * @param {string} directory - The directory to scan for .md files
    * @returns {String[]} An array of strings each containing a path to a .md file within the given directory. 
    * @private
    * @method 
    */
    static _scanDir(directory) {
        return readdirSync(directory).filter(f => f.endsWith('.md'));
    }

    /**
    * @param {string} filename - The file path for the markdown file to parse
    * @param {object} [replacers={}] - Object in format of {replacer: value}
    * @param {boolean} [log=false] - Log the embed object to console for debugging?
    * @param {boolean} [refresh=false] - Refresh the cache and reload data?
    * @returns {EmbedMD~Embed} Data used for future calls to {@link EmbedMD.getEmbed}
    */
     static _parseMD(filename, replacers={}, log_embed_data=false, refresh_cache=false) {
        const embed_data = this.prepareMD(filename, refresh_cache);
        const chunks = this.format(embed_data.raw, replacers).split(EmbedMD.splitter);
        embed_data.fields = [] // <- reset fields to stop duplicates
        chunks.shift() // <- discard before the first #
        while (chunks.length) {
            const type = (chunks.shift()||"").trim().toLowerCase();
            const data = (chunks.shift()||"").trim();
            switch (type.toUpperCase()) {
                case 'AUTHOR': 
                const [a_name, a_url, a_iconURL] = data.split(EmbedMD.delimiter).map(d=>d.trim());
                embed_data[type] = {name: a_name, url: a_url, iconURL: a_iconURL};
                break;

                case 'FOOTER': 
                const [footer_text, footer_iconURL] = data.split(EmbedMD.delimiter).map(d=>d.trim());
                embed_data[type] = {text: footer_text, iconURL: footer_iconURL};
                break;

                case 'TIMESTAMP': 
                if (data.trim().toLowerCase() === 'true') embed_data[type] = Date.now(); 
                break;
    
                case 'FIELDS': 
                for (const field of data.split(EmbedMD.newlines)) {
                    const [name, value, inline] = this.parseArray(field.split(EmbedMD.delimiter));
                    embed_data.fields.push({ name, value, inline })
                }
                break;
    
                case 'FIELD': 
                const [name, value, inline] = this.parseArray(data.split(EmbedMD.delimiter));
                embed_data.fields.push({ name, value, inline })
                break;

                // case 'URL':
                // case 'TITLE': 
                // case 'COLOR': 
                // case 'IMAGE': 
                // case 'THUMBNAIL': 
                // case 'DESCRIPTION': 
                // embed_data[type] = data.trim(); 
                // break;

                default: 
                embed_data[type] = data.trim(); 
                break;
            }
        }
        if (log_embed_data) {
            const {raw,...to_log} = embed_data;
            console.log('embed_data:', to_log);
        }
        return embed_data;
    }    

    /**
    * @param {string} filename - The filename.md  to prepare for embed
    * @param {boolean} [refresh_cache=false] - Should the cache for this file be refreshed? 
    * @returns {EmbedMD~Embed} Data used for future calls to {@link EmbedMD.getEmbed}
    */
    static prepareMD(filename, refresh_cache) {
        if (!embed_cache[filename] || refresh_cache) {
            embed_cache[filename] = {
                raw: readFileSync(filename, 'utf8'),
                description: undefined,
                thumbnail: undefined,
                timestamp: undefined,
                title: undefined,
                color: undefined,
                author: undefined,
                footer: undefined,
                fields: undefined,
                url: undefined,
                filename,
            };
        }
        return embed_cache[filename]; 
    }

    /**
     * Scans a directory for all .md files within it, then stores each file
     * within an internal cache using its filename as the id. 
     * @param {string} directory - The directory to parse for .md files
     * @note multiple files of the same name will overwrite one another!!
    * @returns {EmbedMD~Embed[]} An array of {@link EmbedMD~Embed} objects for all .md files within given directory. 
    */
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

    /**
    * @param {EmbedMD~Embed} md_embed - An object returned from either {@link EmbedMD.prepareMD} or {@link EmbedMD.parseDir} 
    * @param {object} [replacers={}] - The replacer object in format of {replacer: value}
    * @param {boolean} [log=false] - Log the embed object to console for debugging?
    * @param {boolean} [refresh=false] - Refresh the cache for file and reload data?
    * @returns {MessageEmbed} A discord.js message embed object. See [discord.js documentation](https://discord.js.org/#/docs/main/stable/class/MessageEmbed) for full object details.
    */
    static getEmbed(md_embed_object, ...other) {
        const embed = new MessageEmbed();
        const embed_data = this._parseMD(md_embed_object.filename, ...other);
        for (const embed_element_data in embed_data) {
            if (!Object.hasOwnProperty.call(embed_data, embed_element_data)) continue;
            const element_funk = this.function_map[embed_element_data];
            if (!embed[element_funk]) continue;
            const element_data = embed_data[embed_element_data];
            if (element_data === undefined) continue;
            if (!Array.isArray(element_data)) embed[element_funk](element_data);
            else if (element_data.length) embed[element_funk](...element_data);

        }
        return embed;
    }

    /**
    * A handy dandy helper function to format strings using object properties
    * @param {string} base_string - The string to format
    * @param {object} [replacers_objekt={}] - The object with properties to use as replacers.
    * @returns {string} The formatted string after using properties from given object as replacers.
    * @example 
    * EmbedMD.format("Hi name!", {name: 'DekiaRPG});
    * // => "Hi DekitaRPG!"
    */
    static format(base_string, replacers_objekt={}) {
        const objekt = {...this.global_replacers, ...replacers_objekt};
        const regstr = Object.keys(objekt).join("|");
        const regexp = new RegExp(regstr,"gi");
        return base_string.replace(regexp, matched => {
            return objekt[matched.toLowerCase()];
        });
    }

    /**
    * A helper function to map arrays of strings that contain numbers or booleans to their respective types.
    * @param {array} array - the array to parse 
    * @returns {any[]} A clone of array with types converted where possible.
    * @example
    * EmbedMD.parseArray(['1', '5', 'false', 'some description'])
    * // => [1, 5, false, 'some description']
    */
    static parseArray(field_data_array) {
        return field_data_array.map(element => {
            const v = element.toLowerCase().trim();
            const is_bool = ['true','false'].includes(v); 
            return is_bool ? v === 'true' : (isNaN(v) ? v.trim() : parseInt(v));
        });
    }

    /**
    * Sets a global replacer string.(used for all md embeds)
    * @param {string} [string] - The id string to replace globally with value.
    * @param {string} [value] - The value to be replaced globally.
    */
    static setGlobalReplacer(id_string, value) {
        if (!this._global_replacers) this._global_replacers = {};
        this._global_replacers[id_string] = value;
    }

    /**
    * UN-Sets a global replacer string. (used for all md embeds)
    * @param {string} [string] - The id string for the replacer to remove.
    */
    static unsetGlobalReplacer(id_string) {
        this._global_replacers[id_string] = null;
        delete this._global_replacers[id_string];
    }

    /**
    * Contains an object with all key: value pairs for replacers added
    * using {@link EmbedMD.setGlobalReplacer}.
    * 
    * Default: `{}`
    * @read_only 
    * @type {object} 
    */
    static get global_replacers() {
        return this._global_replacers || {};
    }
}

/**
* Contains the regexp splitter used to determine newlines
* 
* Default: `/\r\n|\n\r|\n|\r/`
* @type {string}
*/
EmbedMD.newlines = /\r\n|\n\r|\n|\r/;

/**
* Contains the main splitter used for parsing elements
* 
* Default: `#`
* @type {string}
*/

EmbedMD.splitter = '#';

/**
* Contains the delimiter used for parsing fields with multiple elements
* 
* Default: `,`
* @type {string}
*/
EmbedMD.delimiter = ' ::';

/**
* An object containing key value pairs where the key is an identifier for the 
* type of information, and the value is a string identifier for the discord.js
* MessageEmbed object function to call when creating the embed object.
* @enum {object} 
*/
EmbedMD.function_map = {
    /**
    * @description Function called when setting embed url.
    * @type {string}
    */
    url: 'setURL',
    /**
    * @description Function called when setting embed title.
    * @type {string}
    */
    title: 'setTitle',
    /**
    * @description Function called when setting embed color.
    * @type {string}
    */
    color: 'setColor',
    /**
    * @description Function called when setting embed author.
    * @type {string}
    */
    author: 'setAuthor',
    /**
    * @description Function called when setting embed description.
    * @type {string}
    */
    description: 'setDescription',
    /**
    * @description Function called when setting embed thumbnail.
    * @type {string}
    */
    thumbnail: 'setThumbnail',
    /**
    * @description Function called when setting embed fields.
    * @type {string}
    */
    fields: 'addFields',
    /**
    * @description Function called when setting embed image.
    * @type {string}
    */
    image: 'setImage',
    /**
    * @description Function called when setting embed timestamp.
    * @type {string}
    */
    timestamp: 'setTimestamp',
    /**
    * @description Function called when setting embed footer.
    * @type {string}
    */
    footer: 'setFooter',
};

/**
* An object containing key value pairs where the key is a string identifier, 
* and the value is an object with the properties detailed below:
* @typedef EmbedMD~Embed
* @property {string} raw - Contains the raw .md file data.
* @property {string} filename - Contains the filename for this data.
* @property {undefined|string} description - Contains the parsed description string.
* @property {undefined|string} thumbnail - Contains the parsed thumbnail string.
* @property {undefined|string} timestamp - Contains the timestamp of embed creation.
* @property {undefined|string} title - Contains the parsed title string.
* @property {undefined|string} color - Contains the parsed color string.
* @property {undefined|string} url - Contains the parsed url string.
* @property {undefined|string[]} author - Contains the parsed author array.
* @property {undefined|string[]} footer - Contains the parsed footer array.
* @property {undefined|object[]} fields - Contains the parsed field objects array.
*/

// Export the module <3
module.exports = EmbedMD;
