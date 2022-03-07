const pool = require('../db/pool');
const express = require('express');
const router = express.Router();
const func = require('../functions/index');
const name = "technical_committee_meeting";

router.get(`/`, function (req, res) {
    let tbName=req.query.tbName?req.query.tbName:name;
    let where=req.query.where?req.query.where:'';
        let query = `    SELECT c.* 
                         FROM ${tbName} as c 
                          ${where} 
                         order by c.id desc  `;
    pool.query(query).then((results) => {
        return res.send(results.rows);
    })
        .catch((err) => {
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
    let data = JSON.parse(req.body.data);
    let files = req.files;
    // console.log(files.file_attachment);
    let file_attachment = files && files.file_attachment ? func.saveFile(files.file_attachment, name, 'attachment', data.letter_shenase.replaceAll('/','-')) : '';
    data["file_attachment"] = file_attachment;
    let query = func.queryGen(name, 'insert', data);
    
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