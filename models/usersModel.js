const userRoles = ["user","admin","superadmin"]

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Le username est déjà pris"
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,

      },
      roles: {
        type: DataTypes.STRING,
        defaultValue: "user",
        allowNull: false,
        set(roles) {
          this.setDataValue("roles",roles.join())
        },
        get()  {
          return this.getDataValue("roles").split(",")
        },
        validate: {
          areRolesValid(roles) {
            if(!roles) {
              throw new Error("Un utilisateur doit avoir un rôle")
            }
            roles.split(",").forEach(role => {
              if(!userRoles.includes(role)) {
                throw new Error(`Les rôles d'un utilisateur doivent appartenir à la liste ${userRoles}`)
              }
              })
            }
          }
        }
    }, {
      tableName: 'user',
      timestamps: true,
      underscored: true
    })
  }
