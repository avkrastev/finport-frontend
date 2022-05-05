const express = require('express');
const { check } = require('express-validator');
const { signup, login } = require('../controllers/user');

const router = express.Router();

router.post('/signup', 
    [
        check('name').not().isEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({ min: 8 })
    ],
    (req, res, next) => {
        signup(req, res, next);
    }
)

router.post('/login', 
    (req, res, next) => {
        login(req, res, next);
    }
)

module.exports = router;