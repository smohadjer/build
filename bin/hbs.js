const fs = require('fs');
const exec = require('child_process').exec;
const shell_command = 'handlebars --extension hbs --namespace myApp.templates app/resources/hbs -f public/resources/js/handlebars.templates.js';

fs.readdir('app/resources/hbs/', (err, files) => {
    if (files) {
        exec(shell_command);
    } else {
        console.log('No handlebars templates found.');
    }
});
