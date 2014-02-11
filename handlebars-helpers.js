/*global define, require, module, gettext */
(function(root, factory) {
  if (typeof exports !== 'undefined') {
      // Define as CommonJS export:
      module.exports = factory(require("underscore"), require("moment"), require("handlebars"));
  } else if (typeof define === 'function' && define.amd) {
      // Define as AMD:
      define(["underscore", "moment", "handlebars"], factory);
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

    // --- Conveniece Functions!
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


    // --- Actual Helpers
    
    // Name helpers assuming the following GAPI name format: {
    //  "legal_first_name": "Bob",
    //  "legal_last_name": "Barker",
    //  "legal_middle_name": null,
    //  "common_name": "Price is Right Bob",
    //  "title": "Mr"
    // }
    var legalName = function(name) {
        return [
            name.legal_first_name,
            name.legal_middle_name ? name.legal_middle_name : '',
            name.legal_last_name
        ].join(' ');
    };
    var commonName = function(name) {
        if (name.common_name) {
            return name.common_name;
        }
        return name.legal_first_name;
    };
    
    // Given two dates, print out either a single date, or a range, using the
    // provide separator.
    var dateRange = function(date1, date2, separator) {
        separator = (separator || " to ");
        var parts = [date1];
        if (date1 != date2) parts.push(date2);
        return parts.join(separator);
    };

    var prettyDateRange = function(date1, date2, separator, dateformat) {
        // Do our best to identify the dateformat if it wasn't passed.
        if (!_.isString(dateformat)) {
            dateformat = date1.indexOf(':') > 0 ? 'datetime' : 'date';
        }
        return dateRange(humanize(date1, dateformat), humanize(date2, dateformat), separator);
    };

    // Given a date string, make it human readable.
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
        commonName: commonName,
        dateRange: dateRange,
        humanize: humanize,
        join: join,
        legalName: legalName,
        pluralize: pluralize,
        prettyDateRange: prettyDateRange,
        sentenceCase: sentenceCase,
        simpleTrans: simpleTrans,
        trans: trans,
    };

    // Register all helpers.
    for (var helper in localHelpers) {
        Handlebars.registerHelper(helper, localHelpers[helper]);
    }

    return Handlebars;
}));
