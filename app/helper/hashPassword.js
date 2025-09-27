const bcrypt = require('bcryptjs')

const HashPassword = async (password) => {
    try {
        const salt = bcrypt.genSaltSync(10)
        const hasspass = await bcrypt.hash(password, salt)
        return hasspass;
    } catch (error) {
        console.log(error.message);

    }
}

module.exports = HashPassword