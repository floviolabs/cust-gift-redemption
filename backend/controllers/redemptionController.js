var express = require('express')
const Pool = require('pg').Pool
const { tokenvalidation } = require('../libs/tokenvalidation')
require('dotenv').config()

const pool = new Pool({
  user: process.env.DEV_DATABASE_USERNAME_CGR,
  host: process.env.DEV_DATABASE_HOST_CGR,
  database: process.env.DEV_DATABASE_NAME_CGR,
  password: process.env.DEV_DATABASE_PASSWORD_CGR,
  port: process.env.DEV_DATABASE_PORT_CGR,
})

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return res.sendStatus(401);
  }
  if(!tokenvalidation(token))
  {
    var output = {
      "status" : false,
      "message": "unrecognize"
      }

      res.contentType('application/json').status(200);
      var valued = JSON.stringify(output);
      return res.send(valued);
  }
  next();
};

var router = express.Router()
router.use(authenticateToken)

//Get Data by QR
router.post("/get-qr", function (req, res, next) {
  const in_qr = req.body.in_qr

  pool.query('SELECT * FROM fn_cgr_get_trx_redemption($1)',[in_qr], (err, results) => {
      if (err) {
        throw err
      }
      var output = {
          "status" : true,
          "message": "Get data successfull",
          "data": results.rows
      }
      console.log(in_qr)
      res.contentType('application/json').status(200)
      var valued = JSON.stringify(output)
      res.send(valued)
  })
})

// Submit new member
router.post("/submit", function (req, res, next) {
  const customerData = {
    name: req.body.name,
    email:  req.body.email,
    mobile:  req.body.mobile,
    birth_date:  req.body.birth_date,
    store:  req.body.store,
    member_status:  req.body.member_status,
  };

  pool.query('SELECT fn_cgr_insert_trx_cus_data($1)', [JSON.stringify(customerData)], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: err });
      return;
    }

    if(results.rows[0].fn_cgr_insert_trx_cus_data != "0") {
      const output = {
        status: true,
        message: "Data has been saved",
        data: results.rows[0].fn_cgr_insert_trx_cus_data,
      };
      res.json(output);
    }else{
      const output = {
        status: false,
        message: "Failed to save data",
        data: results.rows[0].fn_cgr_insert_trx_cus_data,
      };
      res.json(output);
    }

  });
});

//Update Redeem
router.post("/redeem-update", function (req, res, next) {
  const in_qr = req.body.in_qr

  pool.query('CALL sp_cgr_update_trx_redemption_status($1)',[in_qr], (err, results) => {
      if (err) {
        throw err
      }
      var output = {
          "status" : true,
          "message": "Gift Redeemed",
      }
      console.log(in_qr)
      res.contentType('application/json').status(200)
      var valued = JSON.stringify(output)
      res.send(valued)
  })
})


module.exports = router