const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const ProductImage = require('./ProductImage');
const ProductOption = require('./ProductOption');
const ProductCategory = require('./ProductCategory');

// Associações
Product.hasMany(ProductImage, { foreignKey: 'product_id' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id' });

Product.hasMany(ProductOption, { foreignKey: 'product_id' });
ProductOption.belongsTo(Product, { foreignKey: 'product_id' });

Product.belongsToMany(Category, { 
  through: ProductCategory,
  foreignKey: 'product_id'
});
Category.belongsToMany(Product, {
  through: ProductCategory,
  foreignKey: 'category_id'
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
