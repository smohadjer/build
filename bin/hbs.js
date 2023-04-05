const fs = require('fs');
const exec = require('child_process').exec;

const precompileHbsTemplates = () => {
    const shell_command = 'handlebars --extension hbs --namespace myApp.templates app/resources/hbs -f public/resources/js/lib/handlebars.templates.js';

    fs.readdir('app/resources/hbs/', (err, files) => {
        if (files) {
            exec(shell_command);
        } else {
            console.log('No handlebars templates found.');
        }
    });
}

precompileHbsTemplates();

module.exports = precompileHbsTemplates;
