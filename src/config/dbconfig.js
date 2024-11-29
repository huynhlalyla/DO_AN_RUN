const mongoose = require('mongoose');

async function connect() {
    try {
        const databaseUrl = 'mongodb+srv://ptthuynhcntt2211017:WdS95PxlQnbvrFlj@doan01.nstcg.mongodb.net/DoAn01-Database?retryWrites=true&w=majority&appName=DoAn01'
        await mongoose.connect(databaseUrl);
        console.log('Connected!');
    } catch (error) {
        console.log(`Lỗi: ${error}`);
    }
}

module.exports = { connect };
