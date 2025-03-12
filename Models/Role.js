const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose)


const RoleSchema = new Schema ({
    role_name: {
        type: String,
        require: true
    },
}, { timestamps: true});

RoleSchema.plugin(AutoIncrement, {
    inc_field: 'role_uniqueId',
    id: 'role_uniqueId_seq',
    start_seq: 5001,
})

const RoleModel = mongoose.model('role', RoleSchema);
module.exports = RoleModel
