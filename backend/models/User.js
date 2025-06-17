const bcrypt = require('bcrypt');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db.js');
const UserState = require('./UserState.js');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 8,
    },
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field : 'pw',
  },
  type: {
    type: DataTypes.ENUM('student','parent','admin'),
    allowNull: false,
    validate: {
      isIn: [['student','parent','admin']]
    }
  },
  state_code: {
    type: DataTypes.STRING(100),
    // reference는 아래 UserState.js에서 설정됨!
  },
  my_school: {
    type: DataTypes.STRING(100),
  },
  email_notification: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  agreements: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'User',
  timestamps: false,
  defaultScope: {
    attributes: { exclude: ['password'] }  // 기본적으로 password는 제외
  },
  scopes: {
    withPassword: {
      attributes: { include: ['password'] }
    }
  },
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password') && user.password) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    }
  }
});

User.belongsTo(UserState, {
  foreignKey: 'state_code',
  targetKey: 'state_code',
});


module.exports = User;
