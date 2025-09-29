const Category = require('../model/category')

class AllCategory {

    async category(req, res) {
        try {
            const categories = await Category.find({ status: 'active' })

            const userId = req.user ? req.user.userId : null;

            res.render('category', {
                title: "Category Product",
                categories: categories,
                userId,
                user:req.user
            })
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }

    async create_category(req, res) {
        // console.log("BODY:", req.body);
        // console.log("USER:", req.user);

        try {
            const { category_name, category_description, status } = req.body;

            // const userId = req.user ? req.user._id : null;

            // ✅ আগে চেক করো exists কিনা
            // const existingCategory = await Category.findOne({ category_name: category_name.trim() });

            // if (existingCategory) {
            //     req.flash('error', 'Category name already exists!');
            //     return res.redirect('/category');
            // }

            const newCategory = new Category({
                category_name,
                category_description,
                status: status || 'active',
                userId: req.user ? req.user._id : null
            })

            await newCategory.save()

           req.flash('success_msg', 'Category created successfully!');

            res.redirect('/category');

        } catch (error) {
            console.log("❌ Error in create_category:", error);

            // ✅ Handle duplicate category_name
            if (error.code === 11000) {
                req.flash('error_msg', 'Category name already exists!');
                return res.redirect('/category');
            }

            req.flash('error_msg', 'Internal server error!');
            res.redirect('/category');

            // res.status(500).json({
            //     message: "internal server error",
            // })
        }
    }

}

module.exports = new AllCategory()