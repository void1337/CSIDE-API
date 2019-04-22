//
// Application configuration
//
'use strict';

// Set the logging level.
const loglevel = process.env.LOGLEVEL || 'trace'
const pkey = process.env.PKEY

module.exports = {
    pkey:pkey,

    webPort: process.env.PORT || 3000,
    logger: require('tracer')
        .console({
            format: [
                "{{timestamp}} <{{title}}> {{file}}:{{line}} : {{message}}"
            ],
            preprocess: function (data) {
                data.title = data.title.toUpperCase();
            },
            dateformat: "isoUtcDateTime",
            level: loglevel
        })
}