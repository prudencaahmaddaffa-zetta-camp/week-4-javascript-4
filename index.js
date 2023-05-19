const express = require('express');
const basicAuth = require('express-basic-auth');

const app = express();
app.use(express.json());

const allBoks = [
  {
    bookTitle: 'The Lord of the Rings',
    bookAuthor: 'J.R.R. Tolkien',
    bookPrice: 100,
    discountPercentage: 10,
    taxPercentage: 10,
    stockAmount: 100,
    purchasedAmount: 0,
    creditTerm: 0,
  },
  {
    bookTitle: 'The Hobbit',
    bookAuthor: 'J.R.R. Tolkien',
    bookPrice: 50,
    discountPercentage: 10,
    taxPercentage: 10,
    stockAmount: 100,
    purchasedAmount: 0,
    creditTerm: 0,
  },
  {
    bookTitle: "Harry Potter and the Philosopher's Stone",
    bookAuthor: 'J.K. Rowling',
    bookPrice: 25,
    discountPercentage: 10,
    taxPercentage: 10,
    stockAmount: 100,
    purchasedAmount: 0,
    creditTerm: 0,
  },
  {
    bookTitle: 'Harry Potter and the Chamber of Secrets',
    bookAuthor: 'J.K. Rowling',
    bookPrice: 25,
    discountPercentage: 10,
    taxPercentage: 10,
    stockAmount: 100,
    purchasedAmount: 0,
    creditTerm: 0,
  },
];

// index / return hello world
app.get('/', (req, res) => {
  res.status(200).send('Hello World');
});

app.get('/books', (req, res) => {
  res.status(200).json(allBoks);
});

// Define your book purchasing route with Basic Authentication
app.post(
  '/purchase/book',
  basicAuth({ users: { username: 'password' } }),
  (req, res) => {
    const {
      bookTitle,
      bookAuthor,
      bookPrice,
      discountPercentage,
      taxPercentage,
      stockAmount,
      purchasedAmount,
      creditTerm,
    } = req.body;

    // Calculations
    let remainingStock = stockAmount;
    let totalPrice = 0;

    const termPrices = Array.from({ length: creditTerm }, (_, index) => {
      if (remainingStock === 0 || index >= purchasedAmount) {
        return 0;
      }

      const discountAmount = bookPrice * (discountPercentage / 100);
      const priceAfterDiscount = bookPrice - discountAmount;
      const taxAmount = priceAfterDiscount * (taxPercentage / 100);
      const priceAfterTax = priceAfterDiscount + taxAmount;

      totalPrice += priceAfterTax;
      remainingStock--;

      return priceAfterTax;
    });

    // Prepare response
    const response = {
      bookTitle,
      bookAuthor,
      totalPrice,
      termPrices,
    };

    // Send response
    res.status(200).json(response);
  }
);

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
