module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Review', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                max: 5,
                min: 1,
            }
        },
        isvalide: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },{
        tableName: 'review',
        timestamps: true,
        underscored: true
    })
}