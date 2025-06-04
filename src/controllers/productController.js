const { Product, ProductImage, ProductOption, Category, ProductCategory } = require('../models');

// Requisito 01 - Buscar produtos com filtros
exports.searchProducts = async (req, res) => {
    try {
        const { limit = 12, page = 1, fields, match, category_ids, price_range, option } = req.query;
        
        const options = {
            attributes: fields ? fields.split(',') : ['id', 'name', 'slug', 'price', 'price_with_discount'],
            where: {},
            include: [
                { 
                    model: ProductImage,
                    attributes: ['id', 'path'],
                    where: { enabled: true }
                },
                {
                    model: ProductOption,
                    attributes: ['id', 'title', 'type', 'values']
                }
            ]
        };

        // Filtro por termo de busca
        if (match) {
            options.where[Op.or] = [
                { name: { [Op.like]: `%${match}%` } },
                { description: { [Op.like]: `%${match}%` } }
            ];
        }

        // Filtro por categorias
        if (category_ids) {
            options.include.push({
                model: Category,
                where: { id: category_ids.split(',') },
                through: { attributes: [] }
            });
        }

        // Filtro por faixa de preço
        if (price_range) {
            const [min, max] = price_range.split('-').map(Number);
            options.where.price = { [Op.between]: [min, max] };
        }

        // Filtro por opções
        if (option) {
            for (const [optionId, values] of Object.entries(option)) {
                options.include.push({
                    model: ProductOption,
                    where: { 
                        id: optionId,
                        values: { [Op.overlap]: values.split(',') }
                    }
                });
            }
        }

        if (limit !== '-1') {
            options.limit = parseInt(limit);
            options.offset = (parseInt(page) - 1) * parseInt(limit);
        }

        const { count, rows } = await Product.findAndCountAll(options);

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

// Requisito 02 - Obter produto por ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [
                { 
                    model: Category,
                    through: { attributes: [] },
                    attributes: ['id']
                },
                {
                    model: ProductImage,
                    where: { enabled: true },
                    attributes: ['id', 'path'],
                    required: false
                },
                {
                    model: ProductOption,
                    attributes: ['id', 'title', 'shape', 'radius', 'type', 'values']
                }
            ]
        });

        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        // Formatar resposta conforme especificado
        const response = {
            id: product.id,
            enabled: product.enabled,
            name: product.name,
            slug: product.slug,
            stock: product.stock,
            description: product.description,
            price: product.price,
            price_with_discount: product.price_with_discount,
            category_ids: product.Categories.map(c => c.id),
            images: product.ProductImages,
            options: product.ProductOptions
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar produto' });
    }
};

// Requisito 03 - Criar produto
exports.createProduct = async (req, res) => {
    try {
        const { 
            enabled,
            name,
            slug,
            stock,
            description,
            price,
            price_with_discount,
            category_ids,
            images,
            options
        } = req.body;

        // Criar produto
        const product = await Product.create({
            enabled,
            name,
            slug,
            stock,
            description,
            price,
            price_with_discount
        });

        // Adicionar categorias
        if (category_ids && category_ids.length > 0) {
            await ProductCategory.bulkCreate(
                category_ids.map(catId => ({
                    product_id: product.id,
                    category_id: catId
                }))
            );
        }

        // Adicionar imagens
        if (images && images.length > 0) {
            await ProductImage.bulkCreate(
                images.map(img => ({
                    product_id: product.id,
                    path: img.path,
                    enabled: img.enabled !== false
                }))
            );
        }

        // Adicionar opções
        if (options && options.length > 0) {
            await ProductOption.bulkCreate(
                options.map(opt => ({
                    product_id: product.id,
                    title: opt.title,
                    shape: opt.shape || 'square',
                    radius: opt.radius || 0,
                    type: opt.type || 'text',
                    values: opt.values
                }))
            );
        }

        res.status(201).json({
            id: product.id,
            name: product.name,
            slug: product.slug
        });
    } catch (error) {
        res.status(400).json({ error: 'Dados inválidos' });
    }
};

// Requisito 04 - Atualizar produto
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        const { 
            enabled,
            name,
            slug,
            stock,
            description,
            price,
            price_with_discount,
            category_ids,
            images,
            options
        } = req.body;

        await product.update({
            enabled,
            name,
            slug,
            stock,
            description,
            price,
            price_with_discount
        });

        // Atualizar categorias
        if (category_ids) {
            await ProductCategory.destroy({ where: { product_id: product.id } });
            await ProductCategory.bulkCreate(
                category_ids.map(catId => ({
                    product_id: product.id,
                    category_id: catId
                }))
            );
        }

        // Atualizar imagens
        if (images) {
            await ProductImage.destroy({ where: { product_id: product.id } });
            await ProductImage.bulkCreate(
                images.map(img => ({
                    product_id: product.id,
                    path: img.path,
                    enabled: img.enabled !== false
                }))
            );
        }

        // Atualizar opções
        if (options) {
            await ProductOption.destroy({ where: { product_id: product.id } });
            await ProductOption.bulkCreate(
                options.map(opt => ({
                    product_id: product.id,
                    title: opt.title,
                    shape: opt.shape || 'square',
                    radius: opt.radius || 0,
                    type: opt.type || 'text',
                    values: opt.values
                }))
            );
        }

        res.status(204).end();
    } catch (error) {
        res.status(400).json({ error: 'Dados inválidos' });
    }
};

// Requisito 05 - Excluir produto
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        await product.destroy();
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir produto' });
    }
};
