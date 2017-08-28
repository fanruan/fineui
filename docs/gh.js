const gh = require('gh-pages');

gh.publish('_book', () => {
    console.info('upload successfully');
});