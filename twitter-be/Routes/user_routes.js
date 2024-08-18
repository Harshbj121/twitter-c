const app = require("express");
const router = app.Router();
const { Register, Login } = require("../Controllers/AuthControllers");
const UserModel = require("../Models/user_models");

// to register new user
router.post("/register", Register);

// to login 
router.post("/login", Login);



// to update user profile info
router.put('/profile/:id', async (req, res) => {
    const { fullname, dob, location, profileImg } = req.body;
    const userId = req.params.id;
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {
            fullname,
            dob,
            location,
            profileImg
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log(updatedUser)
        return res.status(200).json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});


module.exports = router;
