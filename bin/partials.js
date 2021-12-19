const fs = require('fs');
const handlebars = require('handlebars');

module.exports = {
  registerPartials: () => {
    handlebars.registerPartial(
      'header',
      fs.readFileSync('app/content/shared/header.html', 'utf8')
    );
    handlebars.registerPartial(
      'footer',
      fs.readFileSync('app/content/shared/footer.html', 'utf8')
    );
    handlebars.registerPartial(
      'meta',
      fs.readFileSync('app/content/shared/meta.html', 'utf8')
    );
    handlebars.registerPartial(
      'styles',
      fs.readFileSync('app/includes/styles.html', 'utf8')
    );
    handlebars.registerPartial(
      'scripts',
      fs.readFileSync('app/includes/scripts.html', 'utf8')
    );
  }
}
