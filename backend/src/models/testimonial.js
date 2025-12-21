import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Testimonial = sequelize.define('Testimonial', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    quote: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    avatar_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    }
}, {
    tableName: 'Testimonials',
    timestamps: true,
});

export default Testimonial;
