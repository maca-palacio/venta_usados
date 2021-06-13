const { Model, DataTypes } = require('sequelize');
const sequelize = require('../index');

class Producto extends Model {}
Producto.init({
    //id: DataTypes.INTEGER,
    descripcion: DataTypes.STRING,
    valor: DataTypes.DOUBLE,
    categoria: DataTypes.STRING,
    estado: DataTypes.ENUM('DISPONIBLE','VENDIDO'),
    USUARIOS_id: DataTypes.INTEGER
}, 
{ 
    sequelize,
    modelName: "producto",
    tableName: "productos",
    timestamps: false
})

module.exports = Producto;