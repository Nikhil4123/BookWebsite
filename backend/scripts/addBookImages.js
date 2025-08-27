const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const conn = async () => {
  try {
    await mongoose.connect(`${process.env.URI}`);
    console.log("Connected to Database");
  } catch (error) {
    console.log(error);
  }
};

// Book model
const Book = require('../models/book');

// Curated list of high-quality book cover images
const bookCoverImages = [
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop'
];

// Function to get a random book cover image
function getRandomBookCover() {
  return bookCoverImages[Math.floor(Math.random() * bookCoverImages.length)];
}

// Main function to update book images
async function updateBookImages() {
  try {
    await conn();
    
    // Get all books with placeholder images
    const books = await Book.find({
      url: { $regex: /via\.placeholder\.com/ }
    }).limit(1000); // Process more books
    
    console.log(`Found ${books.length} books with placeholder images`);
    
    let updated = 0;
    
    for (const book of books) {
      try {
        // Get a random book cover image
        const imageUrl = getRandomBookCover();
        
        // Update the book with the new image URL
        await Book.findByIdAndUpdate(book._id, { url: imageUrl });
        console.log(`✅ Updated: ${book.title} with image`);
        updated++;
        
        // Add a small delay to avoid overwhelming the database
        if (updated % 50 === 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
      } catch (error) {
        console.log(`Error updating ${book.title}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Update complete!`);
    console.log(`✅ Updated: ${updated} books`);
    
  } catch (error) {
    console.error('Error in updateBookImages:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the script
updateBookImages();
