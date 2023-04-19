const bcrypt = require("bcrypt")
const {Sequelize, DataTypes} = require('sequelize')
const mockCoworkings = require('../db/mock-coworkings')

const sequelize = new Sequelize('lapiscine_coworking', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb',
    logging: false,
})

const CoworkingModel = require('../models/coworkingModel')(sequelize, DataTypes)
const UserModel = require('../models/usersModel')(sequelize, DataTypes)
const ReviewModel = require('../models/reviewModel')(sequelize, DataTypes)

UserModel.hasMany(ReviewModel, {
  foreignKey: {allowNull: false}
})
ReviewModel.belongsTo(UserModel);

CoworkingModel.hasMany(ReviewModel, {
    foreignKey: {allowNull: false}
})
ReviewModel.belongsTo(CoworkingModel);

const initDb = () => {
    sequelize.sync({ force: true })
        .then(() => {
            mockCoworkings.forEach((el) => {
                CoworkingModel.create({
                    name: el.name,
                    price: el.price,
                    address: el.address,
                    picture: el.picture,
                    superficy: el.superficy,
                    capacity: el.capacity,
                })
            })

            bcrypt.hash("mdp",10)
                .then((hash) => {
                    UserModel.create({
                        username: "Steph",
                        password: hash,
                        roles: ["admin"]
                    })
            })
            .catch((error) => console.log(error))
            
            bcrypt.hash("mdp",10)
                .then((hash) => {
                    UserModel.create({
                        username: "Geof",
                        password: hash,
                        roles: ["user"]
                    }).then((userCreated) => {
                        ReviewModel.create({
                            content: "Ceci est un autre avis... il faut bien écrire un peu !",
                            rating: 3,
                            isvalide: 1,
                            UserId: userCreated.id,
                            CoworkingId: userCreated.id,
                        })
                        ReviewModel.create({
                            content: "Ceci est encore un autre avis... pff il faut bien tester ce programme !",
                            rating: 5,
                            isvalide: 1,
                            UserId: userCreated.id,
                            CoworkingId: userCreated.id,
                        })
                    })
            })
            .catch((error) => console.log(error))
        })
        .catch(error => {console.error(`Erreur iniDb  ${error}`)})    
}

sequelize.authenticate()
    .then(() => console.log("La connexion à la BDD a bien été établie"))
    .catch(error => console.error(`Impossible de se connecter à la BDD ${error}`))

module.exports = { sequelize, CoworkingModel, UserModel, ReviewModel, initDb }