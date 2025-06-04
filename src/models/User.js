const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'O primeiro nome é obrigatório'
      },
      len: {
        args: [2, 50],
        msg: 'O primeiro nome deve ter entre 2 e 50 caracteres'
      }
    }
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'O sobrenome é obrigatório'
      },
      len: {
        args: [2, 100],
        msg: 'O sobrenome deve ter entre 2 e 100 caracteres'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Este email já está cadastrado'
    },
    validate: {
      isEmail: {
        msg: 'Por favor, forneça um email válido'
      },
      notEmpty: {
        msg: 'O email é obrigatório'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'A senha é obrigatória'
      },
      len: {
        args: [6, 100],
        msg: 'A senha deve ter no mínimo 6 caracteres'
      }
    },
    set(value) {
      const hash = bcrypt.hashSync(value, 10);
      this.setDataValue('password', hash);
    }
  }
}, {
  tableName: 'users',
  timestamps: true,
  defaultScope: {
    attributes: {
      exclude: ['password']
    }
  }
});

module.exports = User;
