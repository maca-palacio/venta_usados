const { Model, DataTypes } = require('sequelize');
const sequelize = require('../index');

class Transaccion extends Model {}
Transaccion.init({
    /*idTransaccion:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey:true
    },*/
    fecha: DataTypes.DATE,
    cantidad: DataTypes.INTEGER,
    valor_total: DataTypes.DOUBLE,
    metodo_pago: DataTypes.ENUM('EFECTIVO','TC','TD'),
    comprador:DataTypes.STRING,
    PRODUCTOS_idPRODUCTOS: DataTypes.INTEGER
}, 
{ 
    sequelize,
    modelName: "transaccion",
    tableName: "transacciones",
    timestamps: false
})

module.exports = Transaccion;