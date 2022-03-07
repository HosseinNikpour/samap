const pool = require('../db/pool');
const express = require('express');
const router = express.Router();
const func = require('../functions/index');
const name = "invoice_inquiry";

router.get(`/vw`, function (req, res) {
    let where = req.query.where ? req.query.where : '';
    let userId = req.query.userId;
    let query = `SELECT ii.* ,b1.title as vw_review_unit,i.name as vw_invoice_name ,r.name as vw_project_name,vw_contract_no
                 FROM ${name} as ii left join baseinfo as b1 on ii.review_unit_id =b1.id
                                          left join invoice as i on ii.invoice_id =i.id	
                                          left join  request_vw1 as r on r.id=i.project_id 
                 where (review_unit_id =(select unit_id from "user" where id=${userId} ) 
                        or (select role_id from "user" where id=${userId})>1) ${where} 					 						 
                 order by ii.id desc `;

   // console.log(query)
    pool.query(query).then((results) => {
        return res.send(results.rows);
    })
        .catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});
router.get(`/`, function (req, res) {

    let query = `SELECT c.* 
                FROM ${name} as c 
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
    let query = func.queryGen(name, 'insert', data, 'review_unit_id');
    // console.log(query);
    pool.query(query).then((results) => {
        return res.send(results.rows);

    }).catch((err) => {
        return res.send({ type: "Error", message: err.message })
    });
});


router.put('/:id', function (req, res) {
    //console.log(req.body)
    let data = JSON.parse(req.body.data);
    let files = req.files;
    // console.log(files.file_attachment_replay);
    let file_attachment_replay = files && files.file_attachment_replay ? func.saveFile(files.file_attachment_replay, name, 'attachment_replay', data.letter_shenase_replay.replaceAll('/','-')) : '';
    data["file_attachment_replay"] = data['file_attachment_replay'] == false ? '**d**' : file_attachment_replay;
    let query = func.queryGen(name, 'update', data);
    // console.log(query)
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