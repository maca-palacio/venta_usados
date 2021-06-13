const { Model, DataTypes } = require('sequelize');
const sequelize = require('../index');

class Usuario extends Model {}
Usuario.init({
    //id: DataTypes.INTEGER,
    nombre: DataTypes.STRING,
    correo: DataTypes.STRING,
    password: DataTypes.STRING
}, 
{ 
    sequelize,
    modelName: "usuario",
    tableName: "usuarios",
    timestamps: false
})

module.exports = Usuario;
