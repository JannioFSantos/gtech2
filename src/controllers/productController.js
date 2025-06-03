const { Product, ProductImage, ProductOption, Category, ProductCategory } = require('../models');

// Criar novo produto
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, categories, images, options } = req.body;
        
        // Criar produto
        const product = await Product.create({ 
            name, 
            description, 
            price, 
            stock 
        });

        // Adicionar categorias
        if (categories && categories.length > 0) {
            await ProductCategory.bulkCreate(
                categories.map(catId => ({
                    productId: product.id,
                    categoryId: catId
                }))
            );
        }

        // Adicionar imagens
        if (images && images.length > 0) {
            await ProductImage.bulkCreate(
                images.map((img, index) => ({
                    imageUrl: img,
                    productId: product.id,
                    displayOrder: index
                }))
            );
        }

        // Adicionar opções
        if (options && options.length > 0) {
            await ProductOption.bulkCreate(
                options.map(opt => ({
                    name: opt.name,
                    value: opt.value,
                    productId: product.id
                }))
            );
        }

        // Retornar produto com relacionamentos
        const fullProduct = await Product.findByPk(product.id, {
            include: [
                { model: Category, through: { attributes: [] } },
                { model: ProductImage },
                { model: ProductOption }
            ]
        });

        res.status(201).json(fullProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Listar todos os produtos
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [
                { model: Category, through: { attributes: [] } },
                { model: ProductImage },
                { model: ProductOption }
            ]
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obter produto por ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [
                { model: Category, through: { attributes: [] } },
                { model: ProductImage },
                { model: ProductOption }
            ]
        });

        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Atualizar produto
exports.updateProduct = async (req, res) => {
    try {
        const { name, description, price, stock, categories, images, options } = req.body;
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        // Atualizar dados básicos
        await product.update({ name, description, price, stock });

        // Atualizar categorias
        if (categories) {
            await ProductCategory.destroy({ where: { productId: product.id } });
            await ProductCategory.bulkCreate(
                categories.map(catId => ({
                    productId: product.id,
                    categoryId: catId
                }))
            );
        }

        // Atualizar imagens
        if (images) {
            await ProductImage.destroy({ where: { productId: product.id } });
            await ProductImage.bulkCreate(
                images.map((img, index) => ({
                    imageUrl: img,
                    productId: product.id,
                    displayOrder: index
                }))
            );
        }

        // Atualizar opções
        if (options) {
            await ProductOption.destroy({ where: { productId: product.id } });
            await ProductOption.bulkCreate(
                options.map(opt => ({
                    name: opt.name,
                    value: opt.value,
                    productId: product.id
                }))
            );
        }

        // Retornar produto atualizado
        const updatedProduct = await Product.findByPk(product.id, {
            include: [
                { model: Category, through: { attributes: [] } },
                { model: ProductImage },
                { model: ProductOption }
            ]
        });

        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Excluir produto
exports.deleteProduct = async (req, res) => {
    try {
        const deleted = await Product.destroy({
            where: { id: req.params.id }
        });

        if (deleted) {
            return res.json({ message: 'Produto excluído com sucesso' });
        }

        throw new Error('Produto não encontrado');
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
