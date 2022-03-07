const pool = require('../db/pool');
const express = require('express');
const router = express.Router();
const func = require('../functions/index');
const name = "request";
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

router.get(`/`, function (req, res) {
    let tbName = req.query.tbName ? req.query.tbName : name;
    let where = req.query.where ? req.query.where : 'where 1=1 ';
    // let username=req.query.username?req.query.username:'12321'
    let userId = req.query.userId,
        token = req.query.token;
    if (!userId || !token) userId = 0;
    let user = jwt.verify(token, process.env.JWT_SECRET);
    if (!user || user.id != userId) userId = 0;

    let query = `    SELECT c.* 
                     FROM ${tbName} as c 
                      ${where} and ((select role_id from "user" where id=${userId})>1 
                      or applicant_id=(select unit_id from "user" where id=${userId})
                      or colleague_id=(select unit_id from "user" where id=${userId})
                      or contractor_id=(select company_id from "user" where id=${userId})
                     )
                     order by c.id desc  `;
    //  console.log(query);           
    pool.query(query).then((results) => {
        return res.send(results.rows);
    }).catch((err) => {
        return res.send({ type: "Error", message: err.message })
    });
});

router.get(`/:key`, function (req, res) {
    let query = `SELECT * FROM ${name} where id = ${req.params.key} `;

    pool.query(query).then((results) => {
        return res.send(results.rows);
    })
        .catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});
router.post('/', function (req, res) {
    // let qq = `Select nextval(pg_get_serial_sequence('${name}', 'id')) as current_identity`
    // // let qq=`SELECT IDENT_CURRENT ('${name}.id') as current_identity`
    // pool.query(qq).then((re) => {
    //     let idd = re.rows[0].current_identity

    let data = JSON.parse(req.body.data);
    let files = req.files;
    let file_attachment = files && files.file_attachment ? func.saveFile(files.file_attachment, name, 'attachment', data.letter_shenase.replaceAll('/','-')) : '';
    data["file_attachment"] = file_attachment;

    let query = func.queryGen(name, 'insert', data);

    pool.query(query).then((results) => {
        return res.send(results.rows);
    }).catch((err) => {
        return res.send({ type: "Error", message: err.message })
    });
    // }).catch((err) => {
    //     return res.send({ type: "Error", message: err.message })
    // });
});

router.put('/changeValues/:id', function (req, res) {
    //  let data = JSON.parse(req.body.data);
    let data = req.body;
    delete data.edit_date;
    delete data.editor_id;
    let query = func.queryGen(name, 'update', data);
    console.log(query)
    //let query = `update ${name} set request_state_id=${req.body.request_state_id} WHERE  id=${req.body.id};`
    pool.query(query).then((results) => {
        return res.send(results.rows);
    }).catch((err) => {
        return res.send({ type: "Error", message: err.message })
    });
});
router.put('/:id', function (req, res) {
    let data = JSON.parse(req.body.data);
    let files = req.files;
    // console.log(files.file_attachment);
    let file_attachment = files && files.file_attachment ? func.saveFile(files.file_attachment, name, 'attachment', data.letter_shenase.replaceAll('/','-')) : '';
    data["file_attachment"] = data['file_attachment'] == false ? '**d**' : file_attachment;
    let query = func.queryGen(name, 'update', data);
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