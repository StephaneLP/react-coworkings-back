const bcrypt = require("bcrypt")
const {UserModel} = require('../db/sequelize');
const { Op, UniqueConstraintError, ValidationError } = require("sequelize")
const jwt = require("jsonwebtoken")
const privateKey = require("../auth/privateKey")

exports.login = (req, res) => {
    const user = req.body.username
    const pwd = req.body.password

    if(!user || !pwd) {
        const msg = "Veuillez renseigner un login et un mot de passe !"
        return res.status(400).json({message: msg})
    }

    UserModel.findOne({
        where: {username: user}
    })
    .then((el) => {
        if(!el) {
            const msg = "L'utilisateur n'existe pas !"
            return res.status(400).json({message: msg})
        }

        bcrypt.compare(pwd,el.password)
            .then(isValid => {
                if(!isValid) {
                    const msg = "Le mot de passe est erroné !"
                    return res.status(400).json({message: msg})
                }

                // Json Web Token
                const token = jwt.sign({
                    data: el.id,
                    username: el.username,
                }, privateKey, { expiresIn: "1h"})

                const msg = "L'utilisateur a été connecté avec succès"
                el.password = "hidden"
                return res.json({msg, el, token})
            })
    })
    .catch((error) => {
        const msg = "L'utilisateur n'a pas pu se connecter"
        res.json({ message: msg, Erreur: error})
    })
}

exports.protect = (req, res, next) => {
    const authorizationHreader = req.headers.authorization

    if(!authorizationHreader) {
        const msg = "Un jeton est nécessaire pour acceder à la ressource"
        return res.status(403).json({message: msg})
    }
    
    try {
        const token = authorizationHreader.split(' ')[1]
        const decoded = jwt.verify(token, privateKey)
        req.userId = decoded.data
    }
    catch(error) {
        const msg = "Le jeton n'est pas valide"
        return res.status(403).json({message: msg, data: error})
    }

    return next()
}

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        UserModel.findByPk(req.userId)
            .then(user => {
                if(!user || !roles.every((el) => user.roles.includes(el))) {
                    const msg = "Droits insuffisants"
                    return res.status(403).json({message: msg})
                }
                return next()
            })
            .catch(error => {
                const msg = "Erreur lors de l'autorisation"
                res.status(500).json({message: msg, data: error})
            })
    }
}

exports.signup = (req, res) => {
    const newUser = req.body;

    bcrypt.hash(newUser.password,10)
        .then((hash) => {
            UserModel.create({
                username: newUser.username,
                password: hash,
                roles: ["user"]
            })
            .then((el) => {
                const msg = `Un user a bien été ajouté.`
                el.password = "hidden"
                res.json({ message: msg, data: el})
            })
            .catch(error => {
                if(error instanceof UniqueConstraintError || error instanceof ValidationError){
                    return res.status(400).json({ message: error.message, data: error })    
                }
                else {
                    const msg = "test"
                    return res.status(500).json({ message: error.message, data: error })    
                }
            })
        })
        .catch((error) => console.log(error))

}