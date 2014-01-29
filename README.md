Handlebars Helpers
==================

Various helpers used by gadventures.com for helping render Handlebar templates.


Makes the following assumptions:

* Django's gettext implementation is provided via its [Javascript Catalog](https://docs.djangoproject.com/en/dev/topics/i18n/translation/#internationalization-in-javascript-code)
* You're using the dependencies listed in package.json (duh!)

Usage
===

Add this project to your dependencies, and include it after Handlebar:

    var Handlebars = require('handlebars');
    require('handlebars-helpers');

At this point, all the helpers in this module will be registered into
Handlebars, you can use them in your templates as you would any other Handlebars
helper, e.g.

    {{ humanize this.departure_date }}

Test
===

    npm install -g mocha
    mocha test

Contribute
===

Please!
