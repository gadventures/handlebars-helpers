/*global define, require, module, gettext */
(function(root, factory) {
  if (typeof exports !== 'undefined') {
      // Define as CommonJS export:
      module.exports = factory(require("underscore"), require("moment"), require("Handlebars"));
  } else if (typeof define === 'function' && define.amd) {
      // Define as AMD:
      define(["underscore", "moment", "Handlebars"], factory);
  } else {
      // Just run it:
      factory(root._, root.moment, root.Handlebars);
  }
}(this, function(_, moment, Handlebars) {
    function HandlebarsException(message) {
        this.message = message;
        this.name = 'HandlebarsException';
        this.stack = (new Error()).stack;
    }
    HandlebarsException.prototype = Error.prototype;

    var DATETIME_FORMATS = {
        datetime: 'MMMM Do YYYY, h:mm:ss a',
        date: 'MMMM Do YYYY'
    };

    var trim = function(string) {
        return string.replace(/^\s+|\s+$/g, '');
    };

    var pluck = function(item, field) {
        if (!_.isObject(item)) return item;

        var data = item;
        field.split('.').map(function(part) {
            if (typeof data[part] === "undefined") {
                return;
            } else {
                data = data[part];
            }
        });
        return data;
    };


    var humanize = function(date, format) {
        if (_.isString(format)) {
            format = (DATETIME_FORMATS[format]);
        } else {
            format = DATETIME_FORMATS.datetime;
        }

        if (typeof format === undefined) {
            throw new HandlebarsException(format + " is not a valid datetime format.");
        }

        return moment(date).format(format);
    };

    // Join an array of strings, with an optional `pluck` argument 
    // if the passed array contains objects, rather than simple items.
    // Default sepeator is ','
    //
    // Call with {{join <array> [field to pluck] [seperator]}}
    var join = function(array, field, sep) {
        if (!_.isString(sep)) sep = ', ';
        return _.map(array, function(item) {
            return pluck(item, field);
        }).join(sep);
    };


    // Similiar to join except it produces a better sentence structure by using
    // 'and' for the last element
    // TODO: Deprecate this shitty function, the "and" can be implemented in a more
    // generic way from the function call.
    var sentenceJoin = function(array, item, sep) {
        if (!_.isString(sep)) sep = ', ';

        var string = [];
        var items = pluck(array, item);

        string.push(_(_.head(items, items.length - 1)).join(sep));

        // lol oxford comma
        if (items.length > 2) string.push(sep);
        if (items.length > 1) string.push(' and ');

        string.push(_.last(items));

        return _(string).join('');
    };

    // The firstletter of the item should be uppercase.
    var sentenceCase = function(string) {
        string = trim(string);
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    var pluralize = function(array, single, multiple) {
        if (array.length > 1) return multiple;
        return single;
    };

    // Using the django-provided gettext implementation, get the raw template,
    // and pass it into gettext, returning the uncompiled translated text. This
    // is necessary if we are passing context into a translations.
    // Used as a block tag, e.g.
    //  {{#trans}}Welcome, {{ name }}{{/trans}}
    var trans = function(options) {
        var translated = gettext(options.fn(this));
        var tmpl = new Handlebars.compile(translated);
        return tmpl(this);
    };

    // Like trans, but much faster because assumes the template is already
    // compiled, having no context to manage. Goes right through to gettext
    // TODO: Just check for compiled template in trans.
    var simpleTrans = function(options) {
        return gettext(options.fn(this));
    };

    var localHelpers = {
        humanize: humanize,
        join: join,
        pluralize: pluralize,
        sentenceCase: sentenceCase,
        trans: trans,
        simpleTrans: simpleTrans,
    };

    // Register all helpers.
    for (var helper in localHelpers) {
        Handlebars.registerHelper(helper, localHelpers[helper]);
    }

    return Handlebars;
}));
