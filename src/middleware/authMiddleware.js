const jwt = require('jsonwebtoken');
const { TokenExpiredError } = require('jsonwebtoken');
require('dotenv').config();
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
    // Obter token do header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        console.warn('Tentativa de acesso sem token', { ip: req.ip, path: req.path });
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {
        // Verificar token assíncronamente
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET, {
                issuer: 'loja-online-api',
                audience: 'web-client'
            }, (err, decoded) => {
                if (err) return reject(err);
                resolve(decoded);
            });
        });

        // Verificar se usuário ainda existe
        const user = await User.findByPk(decoded.id);
        if (!user) {
            console.warn('Token válido para usuário inexistente', { userId: decoded.id });
            return res.status(401).json({ error: 'Acesso não autorizado' });
        }

        // Adicionar dados do usuário à requisição
        req.user = {
            id: user.id,
            email: user.email,
            // Podemos adicionar roles/permissões aqui no futuro
        };

        next();
    } catch (error) {
        console.error('Erro na autenticação:', error.message);
        
        if (error instanceof TokenExpiredError) {
            return res.status(401).json({ 
                error: 'Token expirado',
                code: 'TOKEN_EXPIRED'
            });
        }

        res.status(401).json({ 
            error: 'Token inválido',
            code: 'INVALID_TOKEN'
        });
    }
};

// Middleware para verificar roles (exemplo para implementação futura)
authMiddleware.checkRole = (role) => {
    return (req, res, next) => {
        // Implementação futura para verificar roles
        next();
    };
};

module.exports = authMiddleware;
