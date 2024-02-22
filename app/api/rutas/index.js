var router = require('express').Router();

const xbee = require('./xbee');

/*rutas de la api*/
router.use('/xbee', xbee);

module.exports = router;