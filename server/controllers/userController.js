const user = require("../models/user.js");

async function getMyProfile(req, res) {
  try {
    const userId = req.user._id;

    const User = await user.findById(userId).select("-password");

    if (!User) {
      return res.status(404).json({
        success: false,
        message: "User not Found",
      });
    }

    return res.status(200).json({
      success: true,
      user: User,
      message: "Data retrieve successful",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function getAllUser(req, res) {
  try {
    if (req.user.role != "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }


    const Users = await user.find().select("-password");

    return res.status(200).json({
      success: true,
      Users: Users,
      message: "All users fetched successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function updateProfile(req, res) {
  try {
    const userId = req.user._id;
    const { fullName, rollNumber, email } = req.body;

    const updatedUser = await user
      .findByIdAndUpdate(
        userId,
        {
          fullName,
          email,
          rollNumber,
        },
        {
          new: true,
          runValidators: true,
        }
      )
      .select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      updatedUser: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = { getMyProfile, getAllUser, updateProfile };
