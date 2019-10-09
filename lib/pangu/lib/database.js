'use strict';

function savedb(article, config, isPost) {
  var content = config.search.content;
  var format = config.search.format;
  var tmp = {};
  if (article.title) {
    tmp.title = article.title;
  }
  if (article.path) {
    tmp.url = encodeURI(config.root + article.path);
  }
  if (content != false) {
    if (format == 'html') tmp.content = article.content.replace(
      /<td class="gutter">.*?<\/td>/g, '');
    else tmp.content = article._content;
  }
  if (isPost) {
    if (article.categories && article.categories.length > 0) {
      var categories = [];
      article.categories.forEach(function (cate) {
        categories.push(cate.name);
      });
      tmp.categories = categories;
    }
    if (article.tags && article.tags.length > 0) {
      var tags = [];
      article.tags.forEach(function (tag) {
        tags.push(tag.name);
      });
      tmp.tags = tags;
    }
  }
  return tmp;
}
module.exports = function (locals, config) {
  var searchfield = config.search.field;
  var database = [];
  if (searchfield == 'all' || searchfield == 'post') {
    locals.posts.sort(config.index_generator.order_by).each(post => {
      var tmp = savedb(post, config, true);
      database.push(tmp);
    });
  }
  if (searchfield == 'all' || searchfield == 'page') {
    locals.pages.each(page => {
      var tmp = savedb(page, config);
      database.push(tmp);
    });
  }
  return database;
}
