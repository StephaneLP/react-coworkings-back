const bcrypt = require("bcrypt")
const {UserModel} = require('../db/sequelize');
const { Op, UniqueConstraintError, ValidationError } = require("sequelize");

exports.createUser = (req, res) => {
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
                res.json({ message: msg, data: newUser})
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

exports.findAllUsers = (req, res) => {
    const search = req.query.search || ""

console.log("hello")

    UserModel.findAll({
        where: {username: {[Op.like]: `%${search}%`}},
        })
        .then((el) => {
            const msg = `La liste des users a bien été retournée.`
            res.json({ message: msg, data: el })
        })
        .catch(error => {console.error(`Erreur findAllCoworkings  ${error}`)})  
}

exports.findUserByPk = (req, res) => {
    const id = req.params.id
    const msg = `Le user n°${id} a bien été retourné.`

    UserModel.findByPk(id)
        .then((el) => {
            res.json(el != null ? { data: el } : "Le user n'existe pas")
        })
        .catch(() => res.json("Erreur findCoworkingByPk"))
}

exports.updateUser = (req, res) => {
    const id = req.params.id

    UserModel.update(req.body,{
        where: {id: id}
    })
    .then((el) => {
        const msg = `Le user n°${id} a bien été modifié.`
        res.json({ message: msg, data: el })
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
}

exports.deleteUser = (req, res) => {
    const id = req.params.id

    return UserModel.destroy({
        where: {id: id}
    })
    .then((el) => {
        const msg = `Le user n°${id} a bien été supprimé.`
        res.json({ message: msg, data: el })
    })
}
