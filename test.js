const assert       = require('assert');
const Translations = require('./index');
// Llamamos a i() en vez de almacenar la referencia y así
// verificamos también que se devuelva la misma instancia
Translations.i().poDir = __dirname;
Translations.i().addLanguage('test', 'ui');
let _values = [
    'No tienes productos en tu cesta - Traducido',
    'Tienes 1 producto en tu cesta - Traducido',
    'Tienes 2 productos en tu cesta - Traducido',
    'Tienes 3 productos en tu cesta - Traducido',
];
_values.forEach(
    (value, index) =>
    {
        assert.equal(
            Translations.i().trn(
                index,
                'No tienes productos en tu cesta',
                'Tienes 1 producto en tu cesta',
                'Tienes {count} productos en tu cesta',
                {
                    count : index
                }
            ),
            value
        );
    }
);
