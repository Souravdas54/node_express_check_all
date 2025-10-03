const Product = require('../model/productModel')
const Category = require('../model/category');

const fs = require('fs')
const path = require('path')

const mongoose = require('mongoose')


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

        // Determine user role for template
        let userRole = null;
        let userData = null;

        if (req.session.user) {
            userData = req.session.user;
            userRole = 'user';
        } else if (req.session.admin) {
            userData = req.session.admin;
            userRole = 'admin';
        }


        // Render the product page 
        try {
            res.render('product-list', {
                title: "Product List",
                categories,
                products,
                user: req.user, // This comes from checkUserOrAdmin middleware
                userRole: req.user ? req.user.role : null
                // user: req.user || null,


            })

        } catch (error) {
            console.log(error);

        }
    }

    async product_edit(req, res) {
        const id = req.params.id;

        const products = await Product.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(id) }
            },
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

        if (products) {
            req.flash('success-msg', "Product get successfully")
        } else if (!product || product.length === 0) {
            req.flash('error-msg', "The requested product was not found.")
        }
        try {
            res.render('product-edit', {
                title: 'Edit product',
                user: req.user,
                products,

            })
        } catch (error) {
            console.error('Error fetching product:', error);
            req.flash('error_msg', 'Error loading product data');
            res.redirect('/products');
        }
    }

    async edit_product(req, res) {
        try {
            const id = req.params.id;

            const { product_name, price, color, description, quantity, brand, status } = req.body;

            // IMAGE FILE UPLOADS 
            const newImage = req.file ? req.file.path : null; // new image

            const existingProduct = await Product.findById(id)

            if (!existingProduct) {
                return res.status(statusCode.BAD_REQUEST).json({
                    success: false,
                    message: 'user image not found'
                });
            }

            const imagePath = existingProduct.image; // old image path


            if (imagePath && fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath)
            }


            const updateData = {
                product_name,
                price: parseFloat(price),
                color,
                description,
                quantity: parseInt(quantity),
                brand,
                status: status || 'active',
                updatedAt: new Date()
            }

            if (newImage) {
                updateData.image = newImage
            }

            const updateProducts = await Product.findByIdAndUpdate(id, updateData, { new: true })

            if (!updateProducts) {
                req.flash('error_msg', 'Product not found');
                return res.redirect('/products');
            }

            // console.log('Product saved successfully:', updateProducts);

            req.flash('success_msg', 'Product updated successfully!');

            res.redirect('/product/edit/' + id);

        } catch (error) {
            console.error('Error updating product:', error);
            req.flash('error_msg', 'Error updating product');
            res.redirect('/product/edit/' + req.params.id);
        }
    }

    async delete_product(req, res) {
        try {
            const productId = req.params.id;
            // console.log('product Id is - ', productId);


            if (!productId) {
                req.flash('error_msg', "Product ID is required")
                return res.render('/product')
            }

            const product = await Product.findById(productId);
            if (!product) {
                req.flash('error_msg', 'Product not found');
                return res.redirect('/product');
            }

            const oldImagePath = product.image;
            fs.unlink(oldImagePath, (err) => {
                if (err) {
                    console.error('Image not deleted', + err);
                } else {
                    console.error('Image deleted successfully');

                }
            })

            const deleteProduct = await Product.findByIdAndDelete(productId)

            if (!deleteProduct) {
                req.flash('error_msg', 'Product not found')
                return res.render('/product')
            }

            console.log('Product deleted successfully', deleteProduct._id);

            req.flash('success_msg', 'Product deleted successfully')
            return res.render('/product')

        } catch (error) {
            console.error('Error deleting product:', error);
            req.flash('error_msg', 'Error deleting product');
            res.redirect('/product');
        }
    }
}

module.exports = new AllProduct()