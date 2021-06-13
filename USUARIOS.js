const { Model, DataTypes } = require('sequelize');
const sequelize = require('');

class USUARIOS extends Model {}
USUARIOS.init({
    id: DataTypes.INTEGER,
    nombre: DataTypes.STRING,
    correo: DataTypes.STRING,
    password: DataTypes.STRING
}, 
{ 
    sequelize,
    modelName: "modelUsuario" 
})

module.exports = USUARIOS;
