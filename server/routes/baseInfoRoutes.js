const pool = require('../db/pool');
const express = require('express');
const router = express.Router();
const func = require('../functions/index');
const name = "baseInfo";

router.get(`/`, function (req, res) {
    let query = `SELECT * FROM ${name} order by group_id,sort  `;

    pool.query(query).then((results) => {
        return res.send(results.rows);
    })
        .catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});
router.get(`/:key`, function (req, res) {
    let query = `SELECT * FROM ${name} where group_id = ${req.params.key}order by sort  `;

    pool.query(query).then((results) => {
        return res.send(results.rows);
    })
        .catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});
router.post('/', function (req, res) {
    // let query = `INSERT INTO ${name}(title, sort, group_id)
    // VALUES  ('${req.body.title}',${req.body.sort},${req.body.group_id})`;
    let query = func.queryGen(name, 'insert', req.body);
    pool.query(query).then((results) => {
        return res.send(results.rows);
    }).catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});


router.put('/:id', function (req, res) {
    // let query = `UPDATE ${name}
	// SET title='${req.body.title}',  sort=${req.body.sort}, group_id=${req.body.group_id}
	// WHERE  id=${req.body.id};    `;
    let query = func.queryGen(name, 'update', req.body);
    pool.query(query).then((results) => {
        return res.send(results.rows);
    }).catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});
router.delete('/:id', function (req, res) {
    let query = `delete from ${name} WHERE  id=${req.params.id};    `;
    //    console.log(query);
    pool.query(query)
        .then((results) => {
            return res.send(results.rows);
        })
        .catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});
module.exports = router;