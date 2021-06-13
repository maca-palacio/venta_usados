const { Model, DataTypes } = require('sequelize');
const sequelize = require('../index');

class Transaccion extends Model {}
Transaccion.init({
    //idTransaccion: DataTypes.INTEGER,
    fecha: DataTypes.DATE,
    cantidad: DataTypes.INTEGER,
    valor_total: DataTypes.DOUBLE,
    metodo_pago: DataTypes.ENUM('EFECTIVO','TC','TD'),
    PRODUCTOS_id: DataTypes.INTEGER
}, 
{ 
    sequelize,
    modelName: "transaccion",
    tableName: "transacciones",
    timestamps: false
})

module.exports = Transaccion;