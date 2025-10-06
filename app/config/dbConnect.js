const mongoose = require('mongoose')

const MongodbConnect = async () => {

    try {
        await mongoose.connect(process.env.MONGODB_CONNECT_URL)

        console.log('MongoDB connect successfully ✔');

    } catch (error) {

        console.error('Please check your internet connection.');

    }
}

module.exports = MongodbConnect;