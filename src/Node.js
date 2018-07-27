const jfTranslationsBrowser = require('./Browser');
const fs                    = require('fs');
const path                  = require('path');
/**
 * Clase encargada de manejar el sistema de traducciones.
 * Permite manejar diferentes idiomas haciendo uso de los dominios de GetText.
 *
 * @namespace jf.translations
 * @class     jf.translations.Node
 * @extends   jf.translations.Browser
 */
module.exports = class jfTranslationsNode extends jfTranslationsBrowser
{
    /**
     * Constructor de la clase.
     *
     * @param {String} poDir Ruta al directorio donde se encuentras las traducciones.
     *
     * @constructor
     */
    constructor(poDir = '')
    {
        super();
        /**
         * Ruta al directorio donde se encuentran las traducciones.
         *
         * @property poDir
         * @type     {String}
         */
        this.poDir = poDir;
    }

    /**
     * @override
     */
    addLanguage(code, domain = '', translations = null)
    {
        if (!translations)
        {
            const _dir = this.poDir;
            if (_dir)
            {
                const _file = path.join(
                    _dir,
                    domain
                        ? `${code}.${domain}.json`
                        : `${code}.json`
                );
                if (fs.existsSync(_file))
                {
                    translations = require(_file);
                }
            }
        }
        super.addLanguage(code, domain, translations);
    }
};
