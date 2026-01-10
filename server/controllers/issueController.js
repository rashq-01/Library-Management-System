const book = require("../models/book");
const issuedBook = require("../models/issuedBook");


async function issueBook(req,res){
    try{
      const {rollNumber,ISBNNumber} = req.body;

      if(!rollNumber || !ISBNNumber){
          return res.status(400).json({
          success: false,
          message: "All fields are required",
          });
      }

      const BOOK = await book.findOne({ISBNNumber});

      if(!BOOK || (BOOK.totalCopies - BOOK.issuedCopies)==0){
        return res.status(404).json({
          success : false,
          message : "Book not available"
        });
      }

      const alreadyUser = await issuedBook.findOne({ISBNNumber,ISBNNumber,returnDate:null});

      if(alreadyUser){
        return res.status(409).json({
          success : false,
          message : "Book already issued to the user and not returned"
        });
      }
      const ISSUE_DAYS = 14;

      const issueDate = new Date();        // today
      const dueDate = new Date(issueDate); // copy date
      dueDate.setDate(dueDate.getDate() + ISSUE_DAYS);

      await issuedBook.create({
        rollNumber,
        ISBNNumber,
        bookId : BOOK._id,
        dueDate : dueDate
      })


      BOOK.issuedCopies +=1;
      await BOOK.save();

      return res.status(201).json({
        success : true,
        message : "Book issued Successfully."
      })
    }
    catch(err){
      console.error(err);
      return res.status(500).json({
        success : false,
        message : err.message
      });
    }

}


async function returnBook(req,res){
  try{
    const {ISBNNumber,rollNumber} = req.body;

    if(!ISBNNumber || !rollNumber){
      return res.status(400).json({
        success : false,
        message : "All fields required"
      });
    }

    const ISSUEDBOOk = await issueBook.findOne({ISBNNumber,rollNumber});

    if(!ISSUEDBOOk){
      return res.status(404).json({
        success : true,
        message : "Issued Book not found."
      });
    }
    if(!ISSUEDBOOk.returnDate){
      return res.status(409).json({
        success : false,
        message : "Book already returned"
      });
    }
    ISSUEDBOOk.returnDate = new Date();

    if(ISSUEDBOOk.returnDate > ISSUEDBOOk.dueDate){
      lateDays = ISSUEDBOOk.returnDate-ISSUEDBOOk.dueDate;
      lateDays = lateDays/(1000*60*60*24);
      ISSUEDBOOk.fine = lateDays * 30; //Fine Rs.30 per day
    }
    await ISSUEDBOOk.save();


    BOOK = await book.findOne({ISBNNumber});

    BOOK.issuedCopies = BOOK.issuedCopies - 1;

    await BOOK.save();

    return res.status(200).json({
      success : true,
      message : "Return Successful",
      fine : ISSUEDBOOk.fine
    });


  }
  catch(err){
    console.error(err);
    return res.status(500).json({
      success : false,
      message : err.message
    });
  }
  
}







module.exports = {issueBook};