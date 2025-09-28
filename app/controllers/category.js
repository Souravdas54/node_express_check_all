const Category = require('../model/category')

class AllCategory {

    async category(req, res) {
        try {
            const categories = await Category.find({ status: 'active' })

            const userId = req.user ? req.user.userId : null;

            res.render('category', {
                title: "Category Product",
                categories: categories,
                userId
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

            const newCategory = new Category({
                category_name,
                category_description,
                status: status || 'active',
                userId: req.user ? req.user.userId : null
            })

            await newCategory.save()

            req.flash('success', 'Category created successfully!');
            res.redirect('/category');

        } catch (error) {
            res.status(500).json({
                message: "internal server error",
            })
        }
    }

}

module.exports = new AllCategory()