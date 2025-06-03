const sequelize = require('../server');
const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const ProductImage = require('./ProductImage');
const ProductOption = require('./ProductOption');
const ProductCategory = require('./ProductCategory');

// Associações
Product.hasMany(ProductImage, { foreignKey: 'productId' });
ProductImage.belongsTo(Product, { foreignKey: 'productId' });

Product.hasMany(ProductOption, { foreignKey: 'productId' });
ProductOption.belongsTo(Product, { foreignKey: 'productId' });

Product.belongsToMany(Category, { 
  through: ProductCategory,
  foreignKey: 'productId'
});
Category.belongsToMany(Product, {
  through: ProductCategory,
  foreignKey: 'categoryId'
});

module.exports = {
  sequelize,
  User,
  Category,
  Product,
  ProductImage,
  ProductOption,
  ProductCategory
};
