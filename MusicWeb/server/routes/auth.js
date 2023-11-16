const router = require("express").Router();
const admin = require("../config/firebase.config");
const user = require("../models/users")
router.get("/login", async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(500).send({ message: "Token không hợp lệ" });
    }
    const token = req.headers.authorization.split(" ")[1];
    try {
        const decodeValue = await admin.auth().verifyIdToken(token);
        if (!decodeValue) {
            return res.status(500).json({ message: "Không có quyền truy cập" })
        } else {
            //Kiểm tra người dùng có tồn tại hay không
            const userExists = await user.findOne({ "user_id": decodeValue.user_id })
            if (!userExists) {
                newUserData(decodeValue, req, res)
            } else {
                updateNewUserData(decodeValue, req, res)
            }
        }
    } catch (error) {
        return res.status(505).json({ message: error })
    }
})
const newUserData = async (decodeValue, req, res) => {
    const newUser = new user({
        name: decodeValue.name,
        email: decodeValue.email,
        imageURL: decodeValue.picture,
        user_id: decodeValue.user_id,
        email_verified: decodeValue.email_verified,
        role: "Member",
        auth_time: decodeValue.auth_time
    })
    try {
        const saveUser = await newUser.save();
        res.status(200).send({ user: saveUser })
    } catch (error) {
        res.status(400).send({ success: false, msg: error })
    }
}
const updateNewUserData = async (decodeValue, req, res) => {
    const filter = { user_id: decodeValue.user_id };
    const options = {
        upsert: true,
        new: true
    };
    try {
        const result = await user.findOneAndUpdate(
            filter,
            { auth_time: decodeValue.auth_time },
            options
        );
        res.status(200).send({ user: result })
    } catch (error) {
        res.status(400).send({ success: false, msg: error })
    }
}
router.get("/getUsers", async (req, res) => {
    try {
        const cursor = await user.find().sort({ createdAt: 1 });
        return res.status(200).send({ success: true, data: cursor });
    } catch (error) {
        return res.status(400).send({ success: false, msg: "Không tìm thấy dữ liệu" });
    }
})
router.put("/updateRole/:userId", async (req, res) => {
    const filter = { _id: req.params.userId };
    const role = req.body.data.role;
    try {
        const result = await user.findOneAndUpdate(filter, {
            role: role,
        });
        return res.status(200).send({ user: result });
    } catch (error) {
        return res.status(400).send({ success: false, msg: error });
    }
});
router.delete("/deleteUser/:userId", async (req, res) => {
    const filter = { _id: req.params.userId };
    const result = await user.deleteOne(filter);
    if (result.deletedCount === 1) {
        res.status(200).send({ success: true, msg: "Đã xóa thành công" })
    } else {
        res.status(500).send({ success: false, msg: "Không tìm thấy dữ liệu" })
    }
});

module.exports = router;