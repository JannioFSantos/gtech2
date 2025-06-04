const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Gerar token JWT (Requisito 01 - Seção 05)
const generateToken = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos obrigatórios
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Buscar usuário
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Credenciais inválidas' });
    }

    // Verificar senha
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Credenciais inválidas' });
    }

    // Criar token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar token' });
  }
};

// Obter usuário por ID (Requisito 01)
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'firstname', 'surname', 'email']
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
};

// Cadastrar novo usuário (Requisito 02)
const createUser = async (req, res) => {
  try {
    const { firstname, surname, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'As senhas não coincidem' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const newUser = await User.create({
      firstname,
      surname,
      email,
      password // O hash é feito automaticamente pelo modelo
    });

    res.status(201).json({
      id: newUser.id,
      firstname: newUser.firstname,
      surname: newUser.surname,
      email: newUser.email
    });
  } catch (error) {
    res.status(400).json({ error: 'Dados inválidos' });
  }
};

// Atualizar usuário (Requisito 04)
const updateUser = async (req, res) => {
  try {
    const { firstname, surname, email } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    await user.update({ firstname, surname, email });
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: 'Dados inválidos' });
  }
};

// Deletar usuário (Requisito 05)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    await user.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
};

module.exports = {
  generateToken,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
