const express = require('express');
const db = require('../db/index');

const router = express.Router();

router.get('/', function(req, response, next) {

  db.query('select article_pk, teaser, price, caption from articles', (err, result) => {
    if(err){
      next(err);
    }

    response.render('index', { articles: result.rows });
  })

});

router.get('/article/:id', function(req, res, next) {
  const id = req.params.id;

  db.query(`select article_pk, teaser, description, price, caption from articles where article_pk = ${id}`, (err, result) => {
    if(err){
      next(err);
    }

    if(result.rows.length < 1){
      next();
    } else {
      const row = result.rows[0]; // const [row] = result.rows;

      res.render('article', { article: row });
    }
  })

});

module.exports = router;
