const Category = require('../models/Category');

// Criar nova categoria
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = await Category.create({ name, description });
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Listar todas as categorias
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obter categoria por ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Categoria não encontrada' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Atualizar categoria
exports.updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const [updated] = await Category.update({ name, description }, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedCategory = await Category.findByPk(req.params.id);
            return res.json(updatedCategory);
        }
        throw new Error('Categoria não encontrada');
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Excluir categoria
exports.deleteCategory = async (req, res) => {
    try {
        const deleted = await Category.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            return res.json({ message: 'Categoria excluída com sucesso' });
        }
        throw new Error('Categoria não encontrada');
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
