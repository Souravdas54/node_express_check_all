const Product = require('../model/productModel')
const Category = require('../model/category');
const { object } = require('joi');


class AllProduct {

    async product(req, res) {
        console.log(req.body);

        const categories = await Category.find({ status: 'active' })
        // const products = await Product.aggregate([
        //     {
        //         $lookup: {
        //             from: 'categories',
        //             localField: 'category_id',
        //             foreignField: '_id',
        //             as: 'category'
        //         }
        //     },
        //     {
        //         $unwind: {
        //             path: '$category',
        //             preserveNullAndEmptyArrays: true
        //         }
        //     },
        //     {
        //         $project: {
        //             product_name: 1,
        //             image: 1,
        //             price: 1,
        //             color: 1,
        //             description: 1,
        //             quantity: 1,
        //             brand: 1,
        //             status: 1,
        //             category: 1
        //         }
        //     }
        // ])

        const { category_id, sort } = req.query;

        let pipeline = [
            { $lookup: { from: 'categories', localField: 'category_id', foreignField: '_id', as: 'category' } },
            { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } }
        ];

        // Filter 
        let match = {}
        if (category_id) {
            const mongoose = require('mongoose');
            match['category._id'] = mongoose.Types.ObjectId(category_id);
            // match['category.category_name'] = category;
        }

        if (Object.keys(match).length > 0) { pipeline.push({ $match: match }) }

        pipeline.push({
            $project: {
                product_name: 1,
                image: 1,
                price: 1,
                color: 1,
                description: 1,
                quantity: 1,
                brand: 1,
                status: 1,
                category_name: '$category.category_name',
                category_id: '$category._id',
                createdAt: 1
            }
        })

        //  Sort 
        let sortStage = {}
        switch (sort) {
            case 'newest':
                sortStage.createdAt = -1; // newest first
                break;
            case 'lowtohigh':
                sortStage.price = 1;
                break;
            case 'hightolow':
                sortStage.price = -1;
                break;
            case 'atoz':
                sortStage.product_name = 1;
                break;
            default:
                sortStage.createdAt = -1;
        }

        pipeline.push({ $sort: sortStage });
        // Run aggregate
        const products = await Product.aggregate(pipeline);

        // Render the product page 
        try {
            res.render('product', {
                title: "Product",
                categories,
                products,
                user: req.user,
                filter: req.query



            })

        } catch (error) {
            console.log(error);

        }
    }

    async create_product(req, res) {

        console.log('Request Body:', req.body);
        // console.log('Request File:', req.file);

        try {
            const { product_name, category_id, price, color, description, quantity, brand, status } = req.body;

            if (!product_name || !category_id || !price || !color || !description || !quantity) {
                req.flash('error_msg', 'Please fill all required fields');
                return res.redirect('/product');
            }

            if (!req.file) {
                req.flash('error_msg', 'Image is required');
                return res.redirect('/product');
            }

            const imagePath = req.file ? req.file.path.replace(/\\/g, '/') : null;

            const colorsArray = color.split(',').map(c => c.trim()).filter(c => c);

            const createProducts = new Product({
                product_name,
                category_id,
                price: parseFloat(price),
                color: colorsArray,
                description,
                quantity,
                brand,
                image: imagePath,
                status: status || 'active',
                createdBy: req.user ? req.user._id : null
            })
            console.log(createProducts);

            const savedProduct = await createProducts.save()

            req.flash('success_msg', 'Product created successfully!');

            console.log('Product saved successfully:', savedProduct);

            return res.redirect('/product');

            // res.status(201).json({
            //     message: "Create product successfully",
            //     data: savedProduct
            // })
        } catch (error) {
            res.status(500).json({
                message: "Internal server error",

            })
        }
    }

    async product_list(req, res) {

        const categories = await Category.find({ status: 'active' })
        const products = await Product.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category_id',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $unwind: {
                    path: '$category',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    product_name: 1,
                    image: 1,
                    price: 1,
                    color: 1,
                    description: 1,
                    quantity: 1,
                    brand: 1,
                    status: 1,
                    category: 1
                }
            }
        ])

        // Render the product page 
        try {
            res.render('product-list', {
                title: "Product List",
                categories,
                products,
                user: req.user,
                // user: req.user || null,


            })

        } catch (error) {
            console.log(error);

        }
    }
}

module.exports = new AllProduct()