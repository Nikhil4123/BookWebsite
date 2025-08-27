const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

// Import models
const User = require("../models/user");
const Blog = require("../models/blog");
const { Post } = require("../models/post");
const Book = require("../models/book");
const Listing = require("../models/listing");

const populateDummyData = async () => {
  try {
    await mongoose.connect(process.env.URI);
    console.log("Connected to Database");

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await User.deleteMany({});
    // await Blog.deleteMany({});
    // await Post.deleteMany({});
    // await Book.deleteMany({});
    // await Listing.deleteMany({});

    // Create dummy users
    const dummyUsers = [
      {
        username: "bookworm_sarah",
        email: "sarah@example.com",
        password: await bcrypt.hash("password123", 5),
        address: "123 Literary Lane, Booktown, BT 12345",
        bio: "Avid reader and book reviewer. Love exploring new genres and sharing my thoughts with fellow book lovers.",
        favoriteGenres: ["Fiction", "Mystery", "Romance"],
        studyInterests: ["Literature", "Creative Writing"],
        readingStatus: "currently_reading",
        privacy: "public",
        role: "user"
      },
      {
        username: "mystery_mike",
        email: "mike@example.com",
        password: await bcrypt.hash("password123", 5),
        address: "456 Detective Drive, Mystery City, MC 67890",
        bio: "Mystery and thriller enthusiast. Always on the lookout for the next page-turner.",
        favoriteGenres: ["Mystery", "Thriller", "Crime"],
        studyInterests: ["Criminal Justice", "Psychology"],
        readingStatus: "completed",
        privacy: "public",
        role: "user"
      },
      {
        username: "scifi_sam",
        email: "sam@example.com",
        password: await bcrypt.hash("password123", 5),
        address: "789 Future Street, Sci-Fi City, SF 11111",
        bio: "Science fiction lover and tech enthusiast. Exploring the boundaries of imagination.",
        favoriteGenres: ["Science Fiction", "Fantasy", "Dystopian"],
        studyInterests: ["Computer Science", "Physics"],
        readingStatus: "plan_to_read",
        privacy: "public",
        role: "user"
      },
      {
        username: "romance_rachel",
        email: "rachel@example.com",
        password: await bcrypt.hash("password123", 5),
        address: "321 Love Lane, Romance Town, RT 22222",
        bio: "Hopeless romantic and romance novel collector. Believe in the power of love stories.",
        favoriteGenres: ["Romance", "Contemporary Fiction", "Historical Fiction"],
        studyInterests: ["English Literature", "Women's Studies"],
        readingStatus: "currently_reading",
        privacy: "public",
        role: "user"
      },
      {
        username: "admin_user",
        email: "admin@bookwebsite.com",
        password: await bcrypt.hash("admin123", 5),
        address: "Admin Address",
        bio: "Website administrator and book enthusiast.",
        favoriteGenres: ["All Genres"],
        studyInterests: ["Library Science"],
        readingStatus: "completed",
        privacy: "public",
        role: "admin"
      }
    ];

    // Insert users and get their IDs
    const createdUsers = [];
    for (const userData of dummyUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        createdUsers.push(user);
        console.log(`Created user: ${user.username}`);
      } else {
        createdUsers.push(existingUser);
        console.log(`User already exists: ${existingUser.username}`);
      }
    }

    // Create dummy books
    const dummyBooks = [
      {
        title: "The Midnight Library",
        author: "Matt Haig",
        desc: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
        language: "English",
        price: 24.99,
        url: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1602190253i/52578297.jpg",
        addedBy: createdUsers[0]._id,
        status: "active"
      },
      {
        title: "Atomic Habits",
        author: "James Clear",
        desc: "No matter your goals, Atomic Habits offers a proven framework for improving every day. Learn how to make time for new habits, overcome lack of motivation, and get back on track when you fall off course.",
        language: "English",
        price: 29.99,
        url: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655988385i/40121378.jpg",
        addedBy: createdUsers[1]._id,
        status: "active"
      },
      {
        title: "Project Hail Mary",
        author: "Andy Weir",
        desc: "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the Earth itself will perish.",
        language: "English",
        price: 34.99,
        url: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1597695864i/54493401.jpg",
        addedBy: createdUsers[2]._id,
        status: "active"
      },
      {
        title: "The Seven Husbands of Evelyn Hugo",
        author: "Taylor Jenkins Reid",
        desc: "Aging and reclusive Hollywood movie icon Evelyn Hugo is finally ready to tell the truth about her glamorous and scandalous life.",
        language: "English",
        price: 26.99,
        url: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1674739973i/32620332.jpg",
        addedBy: createdUsers[3]._id,
        status: "active"
      },
      {
        title: "Verity",
        author: "Colleen Hoover",
        desc: "Lowen Ashleigh is a struggling writer on the brink of financial ruin when she accepts the job offer of a lifetime.",
        language: "English",
        price: 22.99,
        url: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1634158558i/59344312.jpg",
        addedBy: createdUsers[0]._id,
        status: "active"
      },
      {
        title: "Lessons in Chemistry",
        author: "Bonnie Garmus",
        desc: "Set in 1960s California, this blockbuster debut is the hilarious, idiosyncratic and uplifting story of a female scientist whose career is constantly derailed by the idea that a woman's place is in the home.",
        language: "English",
        price: 28.99,
        url: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1644158558i/58065033.jpg",
        addedBy: createdUsers[1]._id,
        status: "active"
      }
    ];

    // Insert books and get their IDs
    const createdBooks = [];
    for (const bookData of dummyBooks) {
      const existingBook = await Book.findOne({ title: bookData.title, author: bookData.author });
      if (!existingBook) {
        const book = new Book(bookData);
        await book.save();
        createdBooks.push(book);
        console.log(`Created book: ${book.title}`);
      } else {
        createdBooks.push(existingBook);
        console.log(`Book already exists: ${existingBook.title}`);
      }
    }

    // Create dummy blogs
    const dummyBlogs = [
      {
        title: "The Art of Reading: How to Build a Sustainable Reading Habit",
        body: `Reading is not just a hobby; it's a way of life. In today's fast-paced world, finding time to read can be challenging, but the benefits are immeasurable. Here are some proven strategies to build a sustainable reading habit:

1. **Start Small**: Begin with just 10-15 minutes a day. Consistency is more important than quantity.

2. **Create a Reading Environment**: Designate a comfortable space for reading, free from distractions.

3. **Set Realistic Goals**: Instead of aiming to read 100 books a year, start with 12 or 24.

4. **Track Your Progress**: Use apps or journals to monitor your reading journey.

5. **Join a Book Club**: Community engagement can motivate you to read more consistently.

Remember, the goal isn't to read fast, but to read well and enjoy the process.`,
        author: createdUsers[0]._id, // bookworm_sarah
        tags: ["Reading Habits", "Self-Improvement", "Books"]
      },
      {
        title: "Mystery Novels That Will Keep You Guessing Until the Last Page",
        body: `As a dedicated mystery reader, I've discovered that the best mystery novels are those that challenge your assumptions and keep you engaged throughout the entire journey. Here are some of my top recommendations:

**The Silent Patient by Alex Michaelides**
This psychological thriller will make you question everything you think you know about the characters.

**Gone Girl by Gillian Flynn**
A masterclass in unreliable narration that will keep you guessing about the truth.

**The Girl with the Dragon Tattoo by Stieg Larsson**
A complex mystery that combines social commentary with a gripping plot.

**Big Little Lies by Liane Moriarty**
While not a traditional mystery, this book keeps you guessing about what really happened.

The key to a great mystery is not just the twist at the end, but the journey that leads you there.`,
        author: createdUsers[1]._id, // mystery_mike
        tags: ["Mystery", "Thriller", "Book Recommendations"]
      },
      {
        title: "Science Fiction: Exploring the Boundaries of Human Imagination",
        body: `Science fiction has always been more than just spaceships and aliens. It's a genre that explores the deepest questions about humanity, technology, and our place in the universe.

**The Power of Speculation**
Sci-fi allows us to imagine different futures and question our current path. Books like "1984" and "Brave New World" serve as warnings, while "Star Trek" offers hope for a better future.

**Technology and Humanity**
Modern sci-fi often explores the relationship between humans and technology. Will AI enhance or replace us? How will virtual reality change our perception of reality?

**Environmental Themes**
Climate fiction (cli-fi) is becoming increasingly important as we face environmental challenges.

The best science fiction doesn't just entertain; it makes us think about who we are and who we might become.`,
        author: createdUsers[2]._id, // scifi_sam
        tags: ["Science Fiction", "Technology", "Philosophy"]
      },
      {
        title: "Why Romance Novels Matter: Breaking Down the Stigma",
        body: `Romance novels are often dismissed as "fluff" or "not real literature," but this couldn't be further from the truth. Romance novels have been empowering readers for decades.

**Representation Matters**
Romance novels often feature strong female protagonists who take control of their own destinies. They show women as complex, capable individuals with agency.

**Emotional Intelligence**
Reading romance helps develop empathy and emotional intelligence. Understanding different perspectives and emotions is crucial in today's world.

**Escapism and Hope**
In difficult times, romance novels provide hope and remind us that love and happiness are possible.

**Diverse Voices**
The romance genre has become increasingly diverse, representing different cultures, orientations, and experiences.

Romance novels deserve respect for their ability to connect with readers on a deeply emotional level.`,
        author: createdUsers[3]._id, // romance_rachel
        tags: ["Romance", "Feminism", "Literature"]
      }
    ];

    // Insert blogs
    for (const blogData of dummyBlogs) {
      const existingBlog = await Blog.findOne({ title: blogData.title });
      if (!existingBlog) {
        const blog = new Blog(blogData);
        await blog.save();
        console.log(`Created blog: ${blog.title}`);
      } else {
        console.log(`Blog already exists: ${blogData.title}`);
      }
    }

    // Create dummy social posts
    const dummyPosts = [
      {
        text: "Just finished 'The Midnight Library' by Matt Haig. What a beautiful exploration of life's infinite possibilities! The concept of the library between life and death is so thought-provoking. Highly recommend for anyone questioning their life choices. #BookReview #TheMidnightLibrary #MattHaig",
        author: createdUsers[0]._id,
        images: ["https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1602190253i/52578297.jpg"],
        tags: ["BookReview", "TheMidnightLibrary", "MattHaig"],
        visibility: "public"
      },
      {
        text: "Currently reading 'Project Hail Mary' and I can't put it down! Andy Weir has done it again with this incredible sci-fi adventure. The friendship between Grace and Rocky is unexpectedly touching. Anyone else reading this? #CurrentlyReading #ProjectHailMary #AndyWeir #SciFi",
        author: createdUsers[2]._id,
        tags: ["CurrentlyReading", "ProjectHailMary", "AndyWeir", "SciFi"],
        visibility: "public"
      },
      {
        text: "Book club meeting tonight! We're discussing 'Lessons in Chemistry' by Bonnie Garmus. Elizabeth Zott is such an inspiring character - a woman ahead of her time. Can't wait to hear everyone's thoughts! #BookClub #LessonsInChemistry #WomenInScience",
        author: createdUsers[3]._id,
        tags: ["BookClub", "LessonsInChemistry", "WomenInScience"],
        visibility: "public"
      },
      {
        text: "Just discovered this amazing independent bookstore downtown! They have the most incredible collection of mystery novels. Picked up three new books that I can't wait to dive into. Support your local bookstores! 📚 #LocalBookstore #MysteryBooks #BookShopping",
        author: createdUsers[1]._id,
        tags: ["LocalBookstore", "MysteryBooks", "BookShopping"],
        visibility: "public"
      },
      {
        text: "Reading challenge update: 15 books down, 35 to go! This year I'm focusing on diverse authors and genres I don't usually read. It's been eye-opening so far. What's your reading goal for this year? #ReadingChallenge #DiverseBooks #BookGoals",
        author: createdUsers[0]._id,
        tags: ["ReadingChallenge", "DiverseBooks", "BookGoals"],
        visibility: "public"
      },
      {
        text: "The way this book describes the future of AI and human interaction is mind-blowing. It's not just about technology, but about what makes us human. Sometimes the best sci-fi is the most philosophical. #ScienceFiction #AI #Philosophy #BookThoughts",
        author: createdUsers[2]._id,
        tags: ["ScienceFiction", "AI", "Philosophy", "BookThoughts"],
        visibility: "public"
      }
    ];

    // Insert social posts
    for (const postData of dummyPosts) {
      const existingPost = await Post.findOne({ 
        content: postData.content,
        author: postData.author 
      });
      if (!existingPost) {
        const post = new Post(postData);
        await post.save();
        console.log(`Created post by ${createdUsers.find(u => u._id.equals(postData.author))?.username}`);
      } else {
        console.log(`Post already exists`);
      }
    }

    // Create dummy market listings
    const dummyListings = [
      {
        seller: createdUsers[0]._id,
        bookRef: createdBooks[0]._id,
        type: "old_book_own",
        condition: "like_new",
        price: 15.99,
        notes: "Read once, in perfect condition. Beautiful story that I'm happy to pass on to another reader.",
        location: "Booktown, BT",
        status: "active"
      },
      {
        seller: createdUsers[1]._id,
        bookRef: createdBooks[2]._id,
        type: "new_book",
        condition: "new",
        price: 29.99,
        notes: "Brand new copy, never opened. Bought as a gift but recipient already had it.",
        location: "Mystery City, MC",
        status: "active"
      },
      {
        seller: createdUsers[2]._id,
        bookRef: createdBooks[1]._id,
        type: "old_book_own",
        condition: "good",
        price: 12.99,
        notes: "Well-loved copy with some highlighting. Great book for personal development.",
        location: "Sci-Fi City, SF",
        status: "active"
      },
      {
        seller: createdUsers[3]._id,
        bookRef: createdBooks[3]._id,
        type: "old_book_other",
        condition: "good",
        price: 18.99,
        notes: "Found this at a garage sale, in excellent condition. Historical fiction at its best.",
        location: "Romance Town, RT",
        status: "active"
      }
    ];

    // Insert market listings
    for (const listingData of dummyListings) {
      const existingListing = await Listing.findOne({
        seller: listingData.seller,
        bookRef: listingData.bookRef
      });
      if (!existingListing) {
        const listing = new Listing(listingData);
        await listing.save();
        console.log(`Created listing for ${createdBooks.find(b => b._id.equals(listingData.bookRef))?.title}`);
      } else {
        console.log(`Listing already exists`);
      }
    }

    console.log("✅ Dummy data population completed successfully!");
    console.log(`Created ${createdUsers.length} users`);
    console.log(`Created ${createdBooks.length} books`);
    console.log(`Created ${dummyBlogs.length} blogs`);
    console.log(`Created ${dummyPosts.length} social posts`);
    console.log(`Created ${dummyListings.length} market listings`);

  } catch (error) {
    console.error("Error populating dummy data:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from Database");
  }
};

populateDummyData();
