const assert       = require('assert');
const Translations = require('./index');
// Llamamos a i() en vez de almacenar la referencia y así
// verificamos también que se devuelva la misma instancia
Translations.i().poDir = __dirname;
Translations.i().addLanguage('test', 'ui');
let _values = [
    'Traducción singular `arg1`',
    'Traducción singular `arg1`',
    'Traducción plural `arg1-arg2`',
    'Traducción plural `arg1-arg2`'
];
_values.forEach(
    (value, index) =>
    {
        assert.equal(
            Translations.i().trn(
                index,
                'Singular `{arg1}`',      // Si index < 2
                'Plural `{arg1}-{arg2}`', // Si index > 1
                {
                    arg1 : 'arg1',
                    arg2 : 'arg2'
                }
            ),
            value
        );
    }
);
