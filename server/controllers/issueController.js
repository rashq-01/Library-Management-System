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

      const alreadyUser = await issuedBook.findOne({ISBNNumber,rollNumber,returnDate:null});

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

    const ISSUEDBOOk = await issuedBook.findOne({ISBNNumber,rollNumber, returnDate:null});

    if(!ISSUEDBOOk){
      return res.status(404).json({
        success : false,
        message : "Issued Book not found."
      });
    }
    const BOOK = await book.findOne({ISBNNumber});

    if(BOOK.issuedCopies>0){
      BOOK.issuedCopies -= 1;
    }else{
      return res.status(404).json({
        success : false,
        message : "Book is not available"
      });
    }
    ISSUEDBOOk.returnDate = new Date();
    ISSUEDBOOk.fine = 0;
    if(ISSUEDBOOk.returnDate > ISSUEDBOOk.dueDate){
      let lateDays = ISSUEDBOOk.returnDate-ISSUEDBOOk.dueDate;
      lateDays = Math.ceil(lateDays/(1000*60*60*24));
      ISSUEDBOOk.fine = lateDays * 30; //Fine Rs.30 per day
    }
    await ISSUEDBOOk.save();



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



async function getMyIssuedBooks(req,res){
  try{
    const rollNumber = req.body.rollNumber;
    
    const ISSUEDBOOKs = await issuedBook.find({rollNumber,returnDate : null});

    return res.status(200).json({
      success : true,
      message : "Issued Book loaded.",
      totalIssuedBooks : ISSUEDBOOKs.length,
      ISSUEDBOOKs : ISSUEDBOOKs
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





module.exports = {issueBook,returnBook,getMyIssuedBooks};