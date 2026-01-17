const user = require("../models/user.js");
const issuedBook = require("../models/issuedBook.js");
const books = require("../models/book.js")

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
    let ISSUEDBOOKs = await issuedBook.find({
      rollNumber: User.rollNumber,
      returnDate: null,
    });

    const totalIssuedBooks = ISSUEDBOOKs.length;
    const nearestDueBook = await issuedBook
      .findOne({
        rollNumber: User.rollNumber,
        returnDate: null,
        dueDate: { $gte: new Date() },
      })
      .sort({ dueDate: 1 });

    const today = new Date();

    const fineResult = await issuedBook.aggregate([
      {
        $match: {
          rollNumber: User.rollNumber,
          returnDate: null,
        },
      },
      {
        $addFields: {
          lateDays: {
            $cond: [
              { $lt: ["$dueDate", today] },
              {
                $ceil: {
                  $divide: [
                    { $subtract: [today, "$dueDate"] },
                    1000 * 60 * 60 * 24,
                  ],
                },
              },
              0,
            ],
          },
        },
      },
      {
        $addFields: {
          calculatedFine: {
            $multiply: ["$lateDays", 5], // ₹5 per day
          },
        },
      },
      {
        $group: {
          _id: null,
          totalFine: { $sum: "$calculatedFine" },
        },
      },
    ]);

    const totalFinePending =
      fineResult.length > 0 ? fineResult[0].totalFine : 0;
    const totalAvailableBooks = await books.countDocuments({
      $expr: { $gt: ["$totalCopies", "$issuedCopies"] },
    });
    return res.status(200).json({
      success: true,
      user: User,
      totalIssuedBooks: totalIssuedBooks,
      nearestDueBook: nearestDueBook,
      totalFinePending: totalFinePending,
      totalAvailableBooks: totalAvailableBooks,
      ISSUEDBOOKs : ISSUEDBOOKs,
      message: "Data retrieve successful",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function getAdminProfile(req, res) {
  try {
    const userId = req.user._id;
    const User =  await user.findById(userId);
    if (!User) {
      return res.status(404).json({
        success: false,
        message: "User not Found",
      });
    }
    const totalIssuedBooks = await issuedBook.countDocuments({
      returnDate : null
    })
    const totalBooks = await books.countDocuments();
    const lateReturns = await issuedBook.countDocuments({
      returnDate : null,
      dueDate : {$lt : new Date()}
    });
    const totalStudents = await user.countDocuments({
      role : "student"
    });


    return res.status(200).json({
      success: true,
      User : User,
      totalIssuedBooks: totalIssuedBooks,
      totalBooks: totalBooks,
      totalStudents : totalStudents,
      lateReturns : lateReturns,
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

module.exports = { getMyProfile, getAllUser, updateProfile, getAdminProfile};
