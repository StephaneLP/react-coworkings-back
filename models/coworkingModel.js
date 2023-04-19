// module.exports = (sequelize, DataTypes) => {

const Coworking = (sequelize, DataTypes) => {
    return sequelize.define('Coworking', {
        // Model attributes are defined here
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: {msg: "Le nom est déjà pris !"},
          validate: {
            notEmpty :{msg: "Le champ nom ne peut pas être vide !"}
          },
        },
        picture: {
            type: DataTypes.STRING,
        },
        superficy: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate : {
              isNumeric: {msg: "La superficie doit être numérique !"}
            },
        },
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate : {
              isNumeric: {msg: "La superficie doit être numérique !"}
            },
        },
        price: {
            type: DataTypes.JSON,
            allowNull: false,
            validate: {
              isPriceValide(value) {
                if(value.hour === null && value.day === null && value.month === null) {
                  throw new Error("Au moins un prix doit être renseigné !")
                }
              }
            }
        },
        address: {
            type: DataTypes.JSON,
        }
      }, {
        tableName: 'coworking',
        timestamps: true,
        underscored: true
      })
}

module.exports = Coworking