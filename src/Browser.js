const format  = require('util').format;
const getText = new (require('node-gettext'))();
const jfTpl   = require('jf-tpl');
/**
 * Instancia para usar como singleton la clase.
 *
 * @type {null|jf.translations.Browser}
 */
let instance  = null;
/**
 * Clase encargada de manejar el sistema de traducciones.
 * Permite manejar diferentes idiomas haciendo uso de los dominios de GetText.
 *
 * @namespace jf.translations
 * @class     jf.translations.Browser
 */
module.exports = class jfTranslationsBrowser
{
    /**
     * Agrega un idioma a las traducciones.
     *
     * @method addLanguage
     *
     * @param {String}      code         Código del idioma a usar.
     * @param {String}      domain       Dominio de las traducciones.
     * @param {Object|null} translations Contenido de las traducciones. Si no se especifican se leen desde un archivo.
     */
    addLanguage(code, domain = '', translations = null)
    {
        if (!domain)
        {
            domain = code;
        }
        if (translations)
        {
            getText.addTranslations(code, domain, translations);
            this.setLanguage(code, domain);
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
     * Se puede usar dos formatos para las etiquetas:
     *
     * - Usando un formato parecido a `printf`:
     * ```
     * this.tr('El archivo %s ocupa %d bytes', '/tmp/file.js', 1234);
     * ```
     *
     * - Usando un contexto:
     * ```
     * this.tr('El archivo {file} ocupa {size} bytes', { file: '/tmp/file.js', size: 1234 });
     * ```
     *
     * Ambos formatos pueden combinarse en la misma etiqueta.
     * Hay que tener presente que primero se resuelven los de
     * tipo `printf` y luego los que usan contexto.
     *
     * @method tr
     *
     * @param {String}        label  Texto a traducir.
     * @param {Object|String} args Contexto a usar para reemplazar variables.
     *
     * @return {String}
     *
     * @see https://nodejs.org/api/util.html#util_util_format_format_args
     */
    tr(label, ...args)
    {
        const _count   = label.split(/(?:^|[^%]|)%[djs]/).length - 1;
        const _context = {};
        const _params  = [];
        args.forEach(
            arg =>
            {
                if (arg === null || arg === undefined)
                {
                    // Evitamos que aparezcan textos como null o undefined.
                    _params.push('');
                }
                else
                {
                    switch (typeof arg)
                    {
                        case 'boolean':
                            _params.push(
                                _params.length < _count
                                    ? arg
                                    ? 'TRUE'
                                    : 'FALSE'
                                    : ''
                            );
                            break;
                        case 'number':
                        case 'string':
                            _params.push(
                                _params.length < _count
                                    ? arg
                                    : ''
                            );
                            break;
                        case 'object':
                            if (arg)
                            {
                                Object.assign(_context, arg);
                            }
                            break;
                    }
                }
            }
        );
        while (_params.length < _count)
        {
            _params.push('');
        }
        return jfTpl(
            {
                context : _context,
                keep    : true,
                tpl     : format(getText.gettext(label), ..._params)
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
     * @param {String} zero     Texto cuando `count = 0`.
     * @param {String} one      Texto cuando `count = 1`.
     * @param {String} plural   Texto cuando `count > 1`.
     * @param {Object|String}   args Contexto a usar para reemplazar variables.
     *
     * @return {String}
     */
    trn(count, zero, one, plural, ...args)
    {
        return this.tr(
            count === 0
                ? zero
                : count === 1
                ? one
                : plural,
            ...args
        );
    }

    /**
     * Devuelve la instancia del manejador de traducciones.
     * Permite usar la clase como un singleton.
     *
     * @return {null|jf.translations.Browser}
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
