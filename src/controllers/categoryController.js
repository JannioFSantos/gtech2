const Category = require('../models/Category');

// Requisito 01 - Buscar categorias com filtros
exports.searchCategories = async (req, res) => {
    try {
        const { limit = 12, page = 1, fields, use_in_menu } = req.query;
        
        const options = {
            attributes: fields ? fields.split(',') : ['id', 'name', 'slug', 'use_in_menu'],
            where: {}
        };

        if (use_in_menu) {
            options.where.use_in_menu = use_in_menu === 'true';
        }

        if (limit !== '-1') {
            options.limit = parseInt(limit);
            options.offset = (parseInt(page) - 1) * parseInt(limit);
        }

        const { count, rows } = await Category.findAndCountAll(options);

        res.status(200).json({
            data: rows,
            total: count,
            limit: limit === '-1' ? count : parseInt(limit),
            page: parseInt(page)
        });
    } catch (error) {
        res.status(400).json({ error: 'Parâmetros de busca inválidos' });
    }
};

// Requisito 02 - Obter categoria por ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id, {
            attributes: ['id', 'name', 'slug', 'use_in_menu']
        });

        if (!category) {
            return res.status(404).json({ error: 'Categoria não encontrada' });
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar categoria' });
    }
};

// Requisito 03 - Criar categoria
exports.createCategory = async (req, res) => {
    try {
        const { name, slug, use_in_menu } = req.body;
        const category = await Category.create({ name, slug, use_in_menu });
        
        res.status(201).json({
            id: category.id,
            name: category.name,
            slug: category.slug,
            use_in_menu: category.use_in_menu
        });
    } catch (error) {
        res.status(400).json({ error: 'Dados inválidos' });
    }
};

// Requisito 04 - Atualizar categoria
exports.updateCategory = async (req, res) => {
    try {
        const { name, slug, use_in_menu } = req.body;
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({ error: 'Categoria não encontrada' });
        }

        await category.update({ name, slug, use_in_menu });
        res.status(204).end();
    } catch (error) {
        res.status(400).json({ error: 'Dados inválidos' });
    }
};

// Requisito 05 - Excluir categoria
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({ error: 'Categoria não encontrada' });
        }

        await category.destroy();
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir categoria' });
    }
};
