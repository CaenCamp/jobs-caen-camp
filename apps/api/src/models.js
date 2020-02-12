const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    id: Number,
    title: String,
    author: String,
});

module.export = mongoose.model('job', jobSchema);
