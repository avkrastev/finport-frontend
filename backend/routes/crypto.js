const express = require('express');
const { getCrypto, getCryptoById, addCrypto, updateCrypto, deleteCrypto } = require('../controllers/crypto');
const checkAuth = require('../middleware/auth');

const router = express.Router();

router.use(checkAuth);

router.get('/', (req, res, next) => {
    getCrypto(req, res, next);
})

router.get('/:cid', (req, res, next) => {
    getCryptoById(req, res, next);
})

router.post('/', (req, res, next) => {
    addCrypto(req, res, next);
})

router.patch('/:cid', (req, res, next) => {
    updateCrypto(req, res, next);
})

router.delete('/:cid', (req, res, next) => {
    deleteCrypto(req, res, next);
})

module.exports = router;