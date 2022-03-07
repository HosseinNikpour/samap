const pool = require('../db/pool');
const express = require('express');
const router = express.Router();
const func = require('../functions/index');
const name = "permission_structure";
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

router.get(`/`, function (req, res) {

    let query = `SELECT c.*,u.name as vw_user_name
                FROM ${name} as c left join [user] as u on c.user_id=u.id
                order by c.id desc  `;
    pool.query(query).then((results) => {
        return res.send(results.rows);
    })
        .catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});
router.get(`/:key`, function (req, res) {
    let userId = req.query.userId,
        token = req.query.token;

    if (!userId || !token) return res.send({ per_id: -1 })
    let user = jwt.verify(token, process.env.JWT_SECRET);
    if (!user || user.id != userId) return res.send({ per_id: -1 })

    if (user.role === 10) return res.send({ per_id: 100 });//admin
    let query = `SELECT max(permission_id) as permission_id FROM ${name} 
                    where entity_id = ${req.params.key}  and user_id =${userId} `;
   
    pool.query(query).then((results) => {
        if (results.rows[0])
            return res.send({ per_id: results.rows[0].permission_id });
        return res.send({ per_id: 0 });
    }).catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});
router.post('/', function (req, res) {
    let query = func.queryGen(name, 'insert', req.body);
    pool.query(query).then((results) => {

        return res.send(results.rows);
    }).catch((err) => {
        return res.send({ type: "Error", message: err.message })
    });
});
router.put('/:id', function (req, res) {
    //  let data = JSON.parse(req.body.data);

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