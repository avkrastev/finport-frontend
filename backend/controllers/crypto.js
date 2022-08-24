const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const Crypto = require('../models/crypto');
const User = require('../models/user');
const mongoose = require('mongoose');

const getCrypto = async (req, res, next) => {
    let cryptos;

    try {
        cryptos = await Crypto.find();
    } catch (err) {
        const error = new HttpError('Something went wrong!', 500);
        return next(error);
    }

    if (!cryptos) {
        const error = new HttpError('Could not find any cryptos!', 404);
        return next(error);
    }

    res.json({ cryptos });
}

const getCryptoById  = async (req, res, next) => {
    let crypto;
    try {
        crypto = await Crypto.findById(req.params.cid);
    } catch (err) {
        const error = new HttpError('Something went wrong!', 500);
        return next(error);
    }

    if (!crypto) {
        const error = new HttpError('Could not find any cryptos!', 404);
        return next(error);
    }

    res.json({ crypto: crypto.toObject({getters: true}) });
}

const addCrypto = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Error!', 422));
    }

    const { name, sign, icon, amount } = req.body;

    const creator = req.userData.userId;

    const addCryptoAsset = new Crypto({
        name,
        sign,
        icon, 
        amount,
        creator
    });

    let user;

    try {
        user = await User.findById(creator);
    } catch(err) {
        const error = new HttpError('Adding new crypto asset failed, try again.', 500);
        return next(error);
    }

    if (!user) {
        const error = new HttpError('Could not find user with provided id.', 404);
        return next(error);
    }
    
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await addCryptoAsset.save({ session: sess });
        user.assets.push(addCryptoAsset);
        await user.save({ session: sess });
        sess.commitTransaction();
    } catch (err) {
        const error = new HttpError('Adding new crypto asset failed, try again.', 500);
        return next(error);
    }

    res.status(201).json({ crypto: addCryptoAsset });
}

const updateCrypto = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Error!', 422));
    }

    const {name, sign, icon, amount} = req.body;
    
    let crypto;
    try {
        crypto = await Crypto.findById(req.params.cid);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find crypto by ID.', 500);
        return next(error);
    }

    if (crypto.creator.toString() !== req.userData.userId) {
        const error = new HttpError('You are not allowed to modify this asset.', 401);
        return next(error);
    }

    if (name) crypto.name = name;
    if (sign) crypto.sign = sign;
    if (icon) crypto.icon = icon;
    if (amount) crypto.amount = amount;

    try {
        await crypto.save();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update crypto.', 500);
        return next(error);
    }

    res.status(200).json({ crypto: crypto.toObject({getter: true}) });
}

const deleteCrypto = async (req, res, next) => {
    let crypto;
    try {
        crypto = await Crypto.findById(req.params.cid).populate('creator');
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find crypto by ID.', 500);
        return next(error);
    }

    if (!crypto) {
        const error = new HttpError('Could not find crypto for this ID.', 404);
        return next(error);
    }

    if (crypto.creator.id !== req.userData.userId) {
        const error = new HttpError('You are not allowed to delete this asset.', 401);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await crypto.remove({ session: sess });
        crypto.creator.assets.pull(crypto);
        await crypto.creator.save({ session: sess });
        sess.commitTransaction();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete crypto.', 500);
        return next(error);
    }

    res.status(200).json({ message: 'Deleted crypto' });
}

exports.getCrypto = getCrypto;
exports.getCryptoById = getCryptoById;
exports.addCrypto = addCrypto;
exports.updateCrypto = updateCrypto;
exports.deleteCrypto = deleteCrypto;


