const RoleModel = require('../Models/Role');

const createRole = async (req, res) => {
    try {
        const { role_name } = req.body;
        const role = await RoleModel.findOne({ role_name })

        if (role) {
            return res.status(409).json({ message: "role with this name already exists", success: false });
        }
        const roleModel = new RoleModel({
            role_name: role_name,
        })

        await roleModel.save();
        res.status(201).json({
            message: "Role Created Succesufully"
        })


    } catch (error) {
        console.error('Role Creation Error ', error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}

const updateRole = async (req, res) => {
    try {
        const { role_id, role_name } = req.body;

        const role = await RoleModel.findByIdAndUpdate(role_id,{ role_name: role_name }, {
            new: true,
            runValidators: true,
            upsert: false
        });

        if (!role) {
            res.status(409).json({ message: "this role doesnt exists", success: false });
        }

        res.status(200).json({ success: true, message: "Task Completed" });
    } catch (error) {
        console.error("Role Error ", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}

const deleteRole = async (req, res) => {
    try {
        const { role_id } = req.body;

        const role = await RoleModel.findOneAndDelete({ _id: role_id });

        if (!role) {
            res.status(500).json({ message: "something went wrong ", success: false });
        } else {
            res.status(200).json({ message: "Task Completed", success: true });
        }

    } catch (error) {
        console.error("Role Error ", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}

const getRoles = async (req, res) => {
    try {
        const roles = await RoleModel.find();

        if (!roles) {
            res.status(409).json({ message: "cannot get the roles", success: false })
        }
        res.status(200).json({ roles, success: true });
    } catch (error) {
        console.error("Role Error ", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}

module.exports = {
    createRole,
    updateRole,
    getRoles,
    deleteRole
}