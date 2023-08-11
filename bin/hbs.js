import * as fs from 'fs';
import child_process from 'child_process';

const exec = child_process.exec;

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

export default precompileHbsTemplates;
