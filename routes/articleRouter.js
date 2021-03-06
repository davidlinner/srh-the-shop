const express = require('express');
const db = require('../db/index');

const router = express.Router();

router.get('/:id', function (httpRequest, httpResponse, next) {
    const id = httpRequest.params.id;

    const model = {};

    db
        .query(`select * from articles where article_pk = ${id}`)
        .then(result => {
            if (result.rows.length < 1) {
                next();
            } else {
                model.article = result.rows[0]; // rows is always an array, even if we get only one item from the db
                return db.query(`select * from ratings where article_fk = ${id}`);
            }
        })
        .then(result => {
            model.ratings = result.rows;
            httpResponse.render('article', model);
        })
        .catch(err => next(err));

});

const INSERT_RATING = 'insert into ratings(date_rated, appreciates, author, message, rate, article_fk) VALUES (now(), 0, $1,$2,$3,$4)';

router.post('/:id/ratings', function (httpRequest, httpResponse, next) {
    const articleId = httpRequest.params.id;
    const rating = httpRequest.body;

    db
        .query(INSERT_RATING, [rating.author, rating.message, rating.rate, articleId])
        .then(result => {
            httpResponse.redirect(`/article/${articleId}`);
        })
        .catch(err => next(err));
});

router.post('/:articleId/ratings/:ratingId', function (httpRequest, httpResponse, next) {
    const ratingId = httpRequest.params.ratingId;
    const articleId = httpRequest.params.articleId;

    db
        .query('delete from ratings where rating_pk = $1', [ratingId])
        .then(result => {
            httpResponse.redirect(`/article/${articleId}`);
        })
        .catch(err => next(err));
});



module.exports = router;
