const pool = require('../db/pool');
const express = require('express');
const router = express.Router();
const func = require('../functions/index');
const name = "invoice_logistics";

router.get(`/`, function (req, res) {

         let query = `SELECT ia.* ,r.name as vw_project,vw_contract_no,i.name as vw_invoice_name
                            ,i.invoice_no as vw_invoice_no,i.invoice_date as vw_invoice_date 
                      FROM ${name} as ia  left join invoice as i on ia.invoice_id=i.id
                                          left join request_vw1 as r on i.project_id=r.id
                           
                      order by ia.id desc  `;
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
   // console.log(data);
    let file_attachment = files && files.file_attachment ? func.saveFile(files.file_attachment, name, 'attachment', data.letter_shenase.replaceAll('/','-') ) : '';
    data["file_attachment"] = file_attachment;
    let query = func.queryGen(name, 'insert', data);
    //let query = func.queryGen(name, 'insert', req.body);

    pool.query(query).then((results) => {
        return res.send(results.rows);
    }).catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});

router.put('/:id', function (req, res) {
    let data = JSON.parse(req.body.data);
    let files = req.files;
    // console.log(data);
    let file_attachment = files && files.file_attachment ? func.saveFile(files.file_attachment, name, 'attachment', data.letter_shenase.replaceAll('/','-')) : '';
    data["file_attachment"] = data['file_attachment'] == false ? '**d**' : file_attachment;
    let query = func.queryGen(name, 'update', data);
    //let query = func.queryGen(name, 'update', req.body);
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