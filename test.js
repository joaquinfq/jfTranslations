const assert       = require('assert');
const Translations = require('./index');
// Llamamos a i() en vez de almacenar la referencia y así verificamos
// también que se devuelva la misma instancia ya configurada.
Translations.i().poDir = __dirname;
Translations.i().addLanguage('test', 'ui');
//------------------------------------------------------------------------------
function testPlaceholders()
{
    const _expected = 'El archivo /tmp/file.js ocupa 1234 bytes.';
    // Usando formato printf
    assert.equal(
        Translations.i().tr(
            'El archivo %s ocupa %d bytes.',
            '/tmp/file.js',
            1234
        ),
        _expected
    );
    // Usando contexto.
    assert.equal(
        Translations.i().tr(
            'El archivo {file} ocupa {size} bytes.',
            {
                file : '/tmp/file.js',
                size : 1234
            }
        ),
        _expected
    );
    // Mezclando ambos formatos.
    // Los objetos deben fusionarse y no importa su orden en
    // los parámetros ya que se separan y se fusionan.
    assert.equal(
        Translations.i().tr(
            'El archivo {file} ocupa %d bytes. El archivo %s ocupa {size} bytes.',
            1234,
            '/tmp/file2.js',
            {
                file : '/tmp/file.js'
            },
            {
                size : 4567
            }
        ),
        _expected + ' ' + _expected.replace('file.js', 'file2.js').replace('1234', '4567')
    );
}
//------------------------------------------------------------------------------
function testPlurals()
{
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
}
testPlaceholders();
testPlurals();
