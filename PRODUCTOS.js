const { Model, DataTypes } = require('sequelize');
const sequelize = require('');

class PRODUCTOS extends Model {}
PRODUCTOS.init({
    id: DataTypes.INTEGER,
    descripcion: DataTypes.STRING,
    valor: DataTypes.DOUBLE,
    categoria: DataTypes.STRING,
    estado: DataTypes.ENUM,
    USUARIOS_id: DataTypes.INTEGER
}, 
{ 
    sequelize,
    modelName: "modelProducto" 
})

module.exports = PRODUCTOS;