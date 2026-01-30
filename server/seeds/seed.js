const mongoose = require("mongoose");
const User = require("../models/user.js");
const IssuedBook = require("../models/issuedBook.js");
const Book  = require("../models/book.js");

require("dotenv").config();

const MONGO_URI = process.env.DB_PATH;
console.log(MONGO_URI);

// random helpers
const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

const names = [
  "Aarav","Vivaan","Aditya","Arjun","Sai","Reyansh","Krishna","Ishaan","Rohan","Kabir",
  "Kunal","Manav","Yash","Dev","Harsh","Nikhil","Aman","Sahil","Varun","Rahul",
  "Aryan","Atharv","Shivam","Pranav","Omkar","Abhishek","Akash","Deepak","Ritesh","Mohit",
  "Siddharth","Tushar","Rajat","Ankit","Gaurav","Karthik","Rakesh","Vivek","Sandeep","Hemant",
  "Priya","Ananya","Diya","Sneha","Ishita","Meera","Aditi","Neha","Riya","Pooja",
  "Tanya","Simran","Lavanya","Naina","Kavya","Shruti","Anushka","Shreya","Payal","Muskan",
  "Sakshi","Khushi","Radhika","Divya","Preeti","Swati","Komal","Nidhi","Palak","Sana",
  "Alisha","Mansi","Jiya","Bhavya","Tanvi","Rekha","Vaishnavi","Charu","Ankita","Sonia",
  "Harini","Keerthi","Ayesha","Fatima","Zoya","Hina","Farah","Roshni","Madhuri","Sejal"
];


const surnames = [
  "Sharma","Verma","Patel","Singh","Rao","Kapoor","Gupta","Jain","Roy","Sen",
  "Malhotra","Khan","Mehta","Das","Iyer","Pillai","Nair","Kulkarni","Deshmukh","Joshi",
  "Bose","Chatterjee","Mukherjee","Sinha","Agarwal","Bansal","Choudhary","Yadav","Pandey","Thakur",
  "Shah","Trivedi","Mishra","Dubey","Saxena","Srivastava","Arora","Sethi","Bhatia","Kaur",
  "Gill","Sandhu","Shetty","Sheikh","Ansari","Qureshi","Naidu","Reddy","Gowda","Hegde",
  "Menon","Fernandes","D'Souza","Pinto","Mathew","Thomas","George","Paul","Joseph","Francis",
  "Prasad","Rawat","Biswas","Ghosh","Dutta","Chopra","Chauhan","Solanki","Parmar","Tiwari",
  "Vyas","Bhardwaj","Tyagi","Chandra","Kamble","Salunke","More","Jadhav","Sawant","Patil"
];


async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected for seeding 🌱");

    // OPTIONAL: clear old data
    await User.deleteMany({ role: "student" });
    await IssuedBook.deleteMany({});

    // -----------------------
    // USERS
    // -----------------------
    const users = [];

    for (let i = 1; i <= 30; i++) {
      users.push({
        fullName: `${random(names)} ${random(surnames)}`,
        rollNumber: `STU${String(i).padStart(3, "0")}`,
        email: `student${i}@lib.com`,
        password: "$2b$10$Tzls9.sgWLPWCgpsfYe5tef.mRnEwi6iJRvatY74zsnTRjmO8LJMu", // or bcrypt hash
        role: "student",
        isVerified: true
      });
    }

    const createdUsers = await User.insertMany(users);
    console.log("✅ Users seeded");

    // -----------------------
    // BOOKS
    // -----------------------
    const books = await Book.find();
    if (!books.length) throw new Error("No books found");

    // -----------------------
    // ISSUED BOOKS
    // -----------------------
    const issued = [];

    for (let i = 0; i < 30; i++) {
      const user = createdUsers[i];
      const book = random(books);

      const issueDate = new Date(Date.now() - (i + 1) * 86400000);
      const dueDate = new Date(issueDate.getTime() + 7 * 86400000);

      let returnDate = null;
      let fine = 0;

      // mix statuses
      if (i % 3 === 0) {
        returnDate = new Date(issueDate.getTime() + 3 * 86400000);
      } else if (i % 5 === 0) {
        fine = 50; // overdue
      }

      issued.push({
        title: book.title,
        rollNumber: user.rollNumber,
        ISBNNumber: book.ISBNNumber,
        bookId: book._id,
        issueDate,
        dueDate,
        returnDate,
        fine
      });
    }

    await IssuedBook.insertMany(issued);

    console.log("✅ IssuedBooks seeded");
    console.log("🎉 Done!");

    process.exit();

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
