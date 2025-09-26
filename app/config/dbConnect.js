const mongoose = require('mongoose')

const MongodbConnect = async () => {

    const DbConnect = mongoose.connect(process.env.MONGODB_CONNECT_URL)

    if (DbConnect) {

        console.log('MongoDB connect successfully ✔');

    } else {
        console.log('Please check your internet connection');

    }
}
module.exports = MongodbConnect