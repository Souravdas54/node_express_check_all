const Product = require('../model/productModel')
const Category = require('../model/category')


class AllProduct {

    async product(req, res) {
        const categories = await Category.find({ status: 'active' })
        const products = await Product.aggregate([
            {
                $match: { category: 'category_id' }
            }
        ])
        try {
            res.render('product', {
                title: "Product",
                categories,
                products
            })
        } catch (error) {
            console.log(error);

        }
    }

    async create_product(req, res) {

        console.log('Request Body:', req.body);
        // console.log('Request File:', req.file);

// Product not created ////???????

        try {
            const { product_name, category_id, price, color, description, quantity, brand, createdBy } = req.body;

            if (!product_name || !category_id || !price || !color || !description || !quantity || !brand || !createdBy) {

                console.log("fill all fields");

                return res.status(400).json({
                    message: "Please fill all required fields",
                    missing_fields: {
                        product_name: !product_name,
                        category_id: !category_id,
                        price: !price,
                        color: !color,
                        description: !description,
                        quantity: !quantity
                    }
                });

            }

            if (!req.file) {
                return res.status(400).json({ message: "Image is required" })
            }

            const imagePath = req.file ? req.file.path.replace(/\\/g, '/') : null;

            const createProducts = new Product({
                product_name,
                category_id,
                price, color,
                description,
                quantity,
                brand,
                image: imagePath,
                createdBy: req.user ? req.user._id : null
            })
            console.log(createProducts);

            const savedProduct = await createProducts.save()

            req.flash('success_msg', 'Product created successfully!');

            console.log('Product saved successfully:', savedProduct);

            res.status(201).json({
                message: "Create product successfully",
                data: savedProduct
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal server error",

            })
        }
    }
}

module.exports = new AllProduct()