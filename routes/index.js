var express = require('express');
var router = express.Router();
var muxCtr = require('../app/controller/mux');
var cardCtr = require('../app/controller/card');
var almCtr = require('../app/controller/alarm');
var snmp = require ("net-snmp");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// GET ADD DEVICE PAGE
router.get('/add', function(req, res, next) {
  res.render('add-device',{
    result:{
        code:1,
        status:""
    }
  });
});

// ADD MUX
router.post('/add', muxCtr.addMux);

// GET MUX
router.get('/getMux', muxCtr.getMux);

// GET MUX DETAIL PAGE

router.get('/mux/:id', muxCtr.getMuxById);

router.get('/monitoring/:ip_address', cardCtr.getAllCard);

router.get('/card/voice/:ip_address', cardCtr.getDetailVoiceCard);

router.get('/card/data/:ip_address', cardCtr.getDetailDataCard);

router.get('/card/mainlink/:ip_address', cardCtr.getMainLinkCard);

router.get('/alarm/:ip_address', almCtr.getAlarm);

router.get('/time/:ip_address',cardCtr.getDateTime);

router.get('/delete/buffer/:ip_address',almCtr.deleteBufferAlarm);

router.get('/alarm', function (req, res) {
    res.render('alarm', { title: 'Alarm' });
});
router.get('/all/alarm', almCtr.getAllAlarm);
module.exports = router;
