const {ReviewModel, UserModel, CoworkingModel} = require('../db/sequelize');
const { Op, UniqueConstraintError, ValidationError } = require("sequelize");

exports.findAllReviews = (req, res) => {
    ReviewModel.findAll({
        include: [UserModel, CoworkingModel]
    })
    .then((el) => {
        const msg = `La liste des revews a bien été retournée.`
        res.json({ message: msg, data: el })
    })
    .catch(error => {console.error(`Erreur findAllReviews  ${error}`)})  
}

exports.createReview = (req, res) => {
    const newReview = req.body

    ReviewModel.create({
        content: newReview.content,
        rating: newReview.rating,
        isvalide: newReview.isvalide,

    })
    .then((el) => {
        const msg = `Un review a bien été ajouté.`
        res.json({ message: msg, data: newReview})
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

