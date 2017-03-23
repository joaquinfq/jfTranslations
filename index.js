const fs      = require('fs');
const path    = require('path');
const getText = new (require('node-gettext'))();
const jfTpl   = require('jf-tpl');
/**
 * Instancia para usar como singleton la clase.
 *
 * @type {null|jf.Translations}
 */
let instance  = null;
/**
 * Clase encargada de manejar el sistema de traducciones.
 * Permite manejar diferentes idiomas haciendo uso de los dominios de GetText.
 *
 * @namespace jf
 * @class     jf.Translations
 */
module.exports = class jfTranslations {
    /**
     * Constructor de la clase.
     *
     * @param {String} poDir Ruta al directorio donde se encuentras las traducciones.
     *
     * @constructor
     */
    constructor(poDir = '')
    {
        /**
         * Ruta al directorio donde se encuentras las traducciones.
         *
         * @property poDir
         * @type     {String}
         */
        this.poDir = poDir;
    }

    /**
     * Agrega un idioma a las traducciones.
     *
     * @method addLanguage
     *
     * @param {String} code   Código del idioma a usar.
     * @param {String} domain Dominio de las traducciones.
     */
    addLanguage(code, domain = '')
    {
        const _dir = this.poDir;
        if (_dir)
        {
            if (!domain)
            {
                domain = code;
            }
            const _file = path.join(_dir, `${code}.${domain}.json`);
            if (fs.existsSync(_file))
            {
                getText.addTranslations(code, domain, require(_file));
                this.setLanguage(code, domain);
            }
        }
    }

    /**
     * Asigna el idioma a usar.
     *
     * @method setLanguage
     *
     * @param {String} code   Código del idioma a usar.
     * @param {String} domain Dominio de las traducciones.
     */
    setLanguage(code, domain = '')
    {
        getText.setLocale(code);
        getText.setTextDomain(domain || code);
    }

    /**
     * Traduce el texto especificado.
     * Si el texto incluye variables pueden especificarse en el contexto.
     *
     * @method tr
     *
     * @param {String} label   Texto a traducir.
     * @param {Object} context Contexto a usar para reemplazar variables.
     *
     * @return {String}
     */
    tr(label, context = {})
    {
        return jfTpl(
            {
                context,
                tpl : getText.gettext(label)
            }
        );
    }

    /**
     * Traduce el texto especificado permitiendo seleccionar plural o singular en función del valor pasado.
     * Si el texto incluye variables pueden especificarse en el contexto.
     *
     * @method trn
     *
     * @param {Number} count    Valor a usar para determinar si se usa el plural o el singular.
     * @param {String} singular Texto en singular.
     * @param {String} plural   Texto en plural.
     * @param {Object} context  Contexto a usar para reemplazar variables.
     *
     * @return {String}
     */
    trn(count, singular, plural, context = {})
    {
        return this.tr(
            count > 1
                ? plural
                : singular,
            context
        );
    }

    /**
     * Devuelve la instancia del manejador de traducciones.
     * Permite usar la clase como un singleton.
     *
     * @return {null|jf.Translations}
     */
    static i()
    {
        if (!instance)
        {
            instance = new this();
        }

        return instance;
    }
};
