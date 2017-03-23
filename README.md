# jfTranslations [![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Simple class for translations system.

See [here](https://github.com/smhg/gettext-parser#data-structure-of-parsed-mopo-files) for
data structure of parsed JSON translations files.

## Usage

[![npm install jfTranslations](https://nodei.co/npm/jf-translations.png?compact=true)](https://npmjs.org/package/jf-translations/)

### Examples

```js
File: translations/en.ui.json
{
    "charset"      : "utf-8",
    "translations" : {
        "" : {
            "Hola {name}, bienvenido a {site}" : {
                "msgstr" : ["Hello {name}, welcome {site}"]
            }
        }
    }
}
```

```js
// You can use it as singleton 
const translations = require('jf-translations').i();
// Or using new operator. 
const Translations = require('jf-translations');
const translations = new Translations();
//
translations.poDir = __dirname + '/translations';
translations.addLanguage('en', 'ui');
console.log(
    translations.tr(
        'Hola {name}, bienvenido a {site}',
        {
            name : 'Guest',
            site : 'home'
        }
    )
); // Hello Guest, welcome home
```

### Plurals
```js
const count = 20;
console.log(
    translations.trn(
        count,
        'You have no items in your cart',
        'You have 1 item in your cart',
        'You have {count} items in your cart',
        {
            count : count
        }
    )
); // You have 20 items in your cart
```