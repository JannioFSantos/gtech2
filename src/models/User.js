const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');
const { isStrongPassword } = require('validator');

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
        args: [8, 100],
        msg: 'A senha deve ter no mínimo 8 caracteres'
      },
      isStrongPassword: {
        msg: 'A senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais'
      }
    },
    set(value) {
      const start = Date.now();
      const hash = bcrypt.hashSync(value, 12); // Aumentado o salt rounds
      const end = Date.now();
      if (end - start < 200) { // Tempo mínimo para dificultar timing attacks
        const waitTime = 200 - (end - start);
        setTimeout(() => {
          this.setDataValue('password', hash);
        }, waitTime);
      } else {
        this.setDataValue('password', hash);
      }
    }
  }
}, {
  tableName: 'users',
  timestamps: true,
  indexes: [
    {
      fields: ['email'],
      unique: true
    }
  ],
  defaultScope: {
    attributes: {
      exclude: ['password']
    }
  },
  scopes: {
    withPassword: {
      attributes: { include: ['password'] }
    }
  }
});

// Método para comparar senha
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Hook para garantir consistência antes de atualizar
User.beforeUpdate(async (user) => {
  if (user.changed('email')) {
    const exists = await User.findOne({ where: { email: user.email } });
    if (exists && exists.id !== user.id) {
      throw new Error('Email já está em uso por outro usuário');
    }
  }
});

module.exports = User;
