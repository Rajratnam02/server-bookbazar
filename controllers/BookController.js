import bookmodel from "../models/bookmodel.js";
import categorymodel from "../models/categorymodel.js";

export const CreateBooks = async (req,res)=>{
    try {
        const {title,author,description,price,image,category,discount,isbn} = req.body;
        const existing =await bookmodel.findOne({isbn});
        if(existing){
            return res.status(400).json({message:"Book already exists"});
        }
        const categorycheck = await categorymodel.findOne({ name: category.trim().toLowerCase() });
        if (!categorycheck) {
            return res.status(402).json({
                message: "Category Doesnot exist",
            });
        }
        const CreatedBook = await bookmodel.create({
            title,
            author,
            description,
            price,
            image,
            category:categorycheck._id,
            discount,
            isbn,
            finalPrice:Number((price-(discount*price)/100).toFixed(2)),
        });
        categorycheck.books.push(CreatedBook._id);
        await categorycheck.save();
            res.status(201).json({message:"Book created successfully",data:CreatedBook});           
    }
    catch (error){
        res.status(500).json({message:"Error creating book",error});
    }
}

export const UpdateBook = async (req,res)=>{
    try{
        const id = req.params.id;
        const {title,author,description,price,image,category,discount,isbn} = req.body;
        const existing = await bookmodel.findById(id);
        if(!existing){
            return res.status(404).json({message:"Book not found"});
        };
        if(isbn)
        {
            const checkIsbn = await bookmodel.findOne({isbn});
        if(checkIsbn && checkIsbn._id.toString() !== id){
            return res.status(400).json({message:"Book with this isbn already exists"});
        }
            existing.isbn=isbn;
        }
        if(title) existing.title = title;
        if(author) existing.author = author;
        if(description) existing.description = description;
        if(price!=null) existing.price = price;
        if (image) existing.image = image;
        
        if (category) {
            let checkCategory = await categorymodel.findOne({ name: category.trim().toLowerCase() });
            if (!checkCategory) {
                return res.status(400).json({
                    message: "Category Doesnot exist",
                });
            }
            let oldCategoryID = existing.category;
            let oldCategory = await categorymodel.findById(oldCategoryID);
            
            oldCategory.books.pull(existing._id);
            existing.category = checkCategory._id;
            checkCategory.books.push(existing._id);

            await oldCategory.save();
            await checkCategory.save();
        }
        if(discount!=null) existing.discount = discount;
        existing.finalPrice = Number((existing.price-(existing.price*existing.discount)/100).toFixed(2));
        const UpdatedBook = await existing.save();
        res.status(200).json({message:"Book updated successfully",data:UpdatedBook});
    }
    catch (error){
        res.status(500).json({message:"Error updating book",error:error.message});
    }
}

export const DeleteBook = async (req,res)=>{
    try{
        const id = req.params.id;
        const category = await categorymodel.findOne({ books: id });
        category.books.pull(id);
        await category.save();
        await bookmodel.findByIdAndDelete(id.toString());
        res.status(200).json({message:"Book deleted successfully"});
    }
    catch (error){
            res.status(500).json({message:"Error deleting book",error:error.message});
    }
}

export const GetAllBooks = async (req,res)=>{
    try{
        const books = await bookmodel.find({});
        res.status(200).json({message:"Books fetched successfully",data:books});
    }
    catch (error){
        res.status(500).json({message:"Error fetching books",error:error.message});
    }
}

export const GetBookById = async (req,res)=>{
    try{
        const id = req.params.id;
        const book = await bookmodel.findById(id.toString());
        if(!book){
            return res.status(404).json({message:"Book not found"});
        };
        res.status(200).json({message:"Book fetched successfully",data:book});
    }
    catch (error){
        res.status(500).json({message:"Error fetching book",error:error.message});
    };
}

export const GetBooksByCategory = async (req,res)=>{
    try{
        const categoryID = req.params.id;

        const category = await categorymodel.findById(categoryID);
        if (!category) {
            return res.status(404).json({message:"Category not found"});
        }
        const books = await category.populate("books");
        res.status(200).json({message:"Books fetched successfully",data:books,category});
    }
    catch (error){
        res.status(500).json({message:"Error fetching books by category",error:error.message});
    }
}

export const books = [
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description:
      "A gripping tale of coming-of-age in a South poisoned by prejudice, viewed through the eyes of a young girl as her father risks everything to defend a black man.",
    price: 799,
    image: "https://m.media-amazon.com/images/I/81aY1lxk+QL._SL1500_.jpg",
    category: "Young Adult",
    discount: 10,
    isbn: "978-0061120084",
  },
  {
    title: "1984",
    author: "George Orwell",
    description:
      "A dystopian novel set in a world of perpetual war, omnipresent government surveillance, and public manipulation.",
    price: 650,
    image: "https://m.media-amazon.com/images/I/71rpa1-hmyL._SL1500_.jpg",
    category: "Science Fiction",
    discount: 15,
    isbn: "978-0451524935",
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description:
      "The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan on Long Island during the Roaring Twenties.",
    price: 599,
    image: "https://m.media-amazon.com/images/I/81QuEGw8VPL._SL1500_.jpg",
    category: "Young Adult",
    discount: 5,
    isbn: "978-0743273565",
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    description:
      "A fantasy novel following the quest of home-loving Bilbo Baggins to win a share of the treasure guarded by Smaug the dragon.",
    price: 899,
    image: "https://m.media-amazon.com/images/I/91b0C2YNSrL._SL1500_.jpg",
    category: "Fantasy",
    discount: 20,
    isbn: "978-0345339683",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description:
      "A romantic novel of manners following Elizabeth Bennet as she learns about the repercussions of hasty judgments and superficial goodness.",
    price: 750,
    image: "https://m.media-amazon.com/images/I/819HSIKiWbL._SL1500_.jpg",
    category: "Romance",
    discount: 10,
    isbn: "978-0141439518",
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    description:
      "The novel details two days in the life of 16-year-old Holden Caulfield after he has been expelled from prep school.",
    price: 700,
    image: "https://m.media-amazon.com/images/I/8125BDk3l-L._SL1500_.jpg",
    category: "Young Adult",
    discount: 8,
    isbn: "978-0316769488",
  },
  {
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    description:
      "The sequel to The Hobbit, this high-fantasy novel follows the epic quest to destroy the One Ring and defeat the Dark Lord Sauron.",
    price: 2499,
    image: "https://m.media-amazon.com/images/I/81V4-tq4L3L._SL1500_.jpg",
    category: "Fantasy",
    discount: 15,
    isbn: "978-0618640157",
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    description:
      "Explores the history of humankind, from the Stone Age to the present day, focusing on major revolutions.",
    price: 999,
    image: "https://m.media-amazon.com/images/I/713jIoMO3UL._SL1500_.jpg",
    category: "History",
    discount: 25,
    isbn: "978-0062316097",
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    description:
      "A novel that tells the story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure.",
    price: 499,
    image: "https://m.media-amazon.com/images/I/61HAFb16zIL._SL1200_.jpg",
    category: "Self-Help",
    discount: 12,
    isbn: "978-0061122415",
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    description:
      "Set in the distant future, it tells the story of young Paul Atreides, whose family accepts the stewardship of the desert planet Arrakis.",
    price: 1100,
    image: "https://m.media-amazon.com/images/I/81dI1h22pnL._SL1500_.jpg",
    category: "Science Fiction",
    discount: 10,
    isbn: "978-0441013593",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    description:
      "An easy and proven way to build good habits and break bad ones by making small, incremental changes.",
    price: 850,
    image: "https://m.media-amazon.com/images/I/81bGKUa1e0L._SL1500_.jpg",
    category: "Self-Help",
    discount: 20,
    isbn: "978-0735211292",
  },
  {
    title: "The Shining",
    author: "Stephen King",
    description:
      "A writer and recovering alcoholic accepts a caretaker position at the isolated Overlook Hotel, where supernatural forces converge.",
    price: 950,
    image: "https://m.media-amazon.com/images/I/81c+k+Q3iCL._SL1500_.jpg",
    category: "Thriller",
    discount: 15,
    isbn: "978-0385121675",
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    description:
      "A Handbook of Agile Software Craftsmanship. Learn to write clean, maintainable code that won't bring a development organization to its knees.",
    price: 2500,
    image: "https://m.media-amazon.com/images/I/51E2055ZGUL._SL1000_.jpg",
    category: "Education",
    discount: 10,
    isbn: "978-0132350884",
  },
  {
    title: "Brave New World",
    author: "Aldous Huxley",
    description:
      "A dystopian novel presenting a futuristic world in which society is controlled through conditioning and technology.",
    price: 720,
    image: "https://m.media-amazon.com/images/I/81-y4Ok2kSL._SL1500_.jpg",
    category: "Science Fiction",
    discount: 5,
    isbn: "978-0060850524",
  },
  {
    title: "The Hitchhiker's Guide to the Galaxy",
    author: "Douglas Adams",
    description:
      "The comedic adventures of Arthur Dent, who is plucked off Earth moments before it is demolished for a galactic freeway.",
    price: 680,
    image: "https://m.media-amazon.com/images/I/81cM5+hT70L._SL1500_.jpg",
    category: "Science Fiction",
    discount: 18,
    isbn: "978-0345391803",
  },
  {
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    description:
      "A dystopian novel presenting a future American society where books are outlawed and 'firemen' burn any that are found.",
    price: 710,
    image: "https://m.media-amazon.com/images/I/71OFqSRFDgL._SL1500_.jpg",
    category: "Science Fiction",
    discount: 10,
    isbn: "978-1451673319",
  },
  {
    title: "Steve Jobs",
    author: "Walter Isaacson",
    description:
      "The exclusive biography of Steve Jobs, based on more than forty interviews with Jobs and over a hundred others.",
    price: 1200,
    image: "https://m.media-amazon.com/images/I/81V4RjJ9V2L._SL1500_.jpg",
    category: "Biography",
    discount: 22,
    isbn: "978-1451648539",
  },
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    description:
      "A tour of the mind explaining the two systems that drive how we think: System 1 (fast, intuitive) and System 2 (slow, logical).",
    price: 950,
    image: "https://m.media-amazon.com/images/I/71p0+3a2NGL._SL1500_.jpg",
    category: "Psychology",
    discount: 15,
    isbn: "978-0374533337",
  },
  {
    title: "The Lean Startup",
    author: "Eric Ries",
    description:
      "How entrepreneurs use continuous innovation to create radically successful businesses, based on the principles of lean manufacturing.",
    price: 1150,
    image: "https://m.media-amazon.com/images/I/81-QB7nDh4L._SL1500_.jpg",
    category: "Business",
    discount: 20,
    isbn: "978-0307887894",
  },
  {
    title: "The Pragmatic Programmer",
    author: "David Thomas, Andrew Hunt",
    description:
      "Examines the core of what it means to be a modern programmer, with topics from personal responsibility to architectural techniques.",
    price: 2800,
    image: "https://m.media-amazon.com/images/I/71f743sOPoL._SL1500_.jpg",
    category: "Education",
    discount: 5,
    isbn: "978-0135957059",
  },
  {
    title: "A Game of Thrones",
    author: "George R.R. Martin",
    description:
      "The first book in A Song of Ice and Fire, a series of fantasy novels about the noble houses of Westeros vying for the Iron Throne.",
    price: 1300,
    image: "https://m.media-amazon.com/images/I/81V-25d2aIL._SL1500_.jpg",
    category: "Fantasy",
    discount: 10,
    isbn: "978-0553381689",
  },
  {
    title: "The Silent Patient",
    author: "Alex Michaelides",
    description:
      "A shocking psychological thriller of a woman’s act of violence against her husband—and the therapist obsessed with uncovering her motive.",
    price: 800,
    image: "https://m.media-amazon.com/images/I/81LOiS-a6GL._SL1500_.jpg",
    category: "Mystery",
    discount: 25,
    isbn: "978-1250301697",
  },
  {
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    description:
      "A haunting novel that’s a coming-of-age story, a murder mystery, and a celebration of nature in the marshes of North Carolina.",
    price: 900,
    image: "https://m.media-amazon.com/images/I/81A-+hI+jOL._SL1500_.jpg",
    category: "Mystery",
    discount: 15,
    isbn: "978-0735219090",
  },
  {
    title: "Gone Girl",
    author: "Gillian Flynn",
    description:
      "On their fifth wedding anniversary, a woman disappears, leaving her husband as the primary suspect in this gripping psychological thriller.",
    price: 780,
    image: "https://m.media-amazon.com/images/I/71F600A3zEL._SL1500_.jpg",
    category: "Thriller",
    discount: 10,
    isbn: "978-0307588371",
  },
  {
    title: "The Girl with the Dragon Tattoo",
    author: "Stieg Larsson",
    description:
      "A journalist and a young computer hacker team up to investigate a 40-year-old disappearance from a wealthy dynasty.",
    price: 850,
    image: "https://m.media-amazon.com/images/I/81QyERd-AlL._SL1500_.jpg",
    category: "Thriller",
    discount: 5,
    isbn: "978-0307949486",
  },
  {
    title: "It",
    author: "Stephen King",
    description:
      "A group of bullied kids band together when a monster, taking the appearance of a clown, begins hunting children in Derry, Maine.",
    price: 1100,
    image: "https://m.media-amazon.com/images/I/71lZkY-ub7L._SL1500_.jpg",
    category: "Thriller",
    discount: 20,
    isbn: "978-1501142970",
  },
  {
    title: "The Martian",
    author: "Andy Weir",
    description:
      "After a fierce storm, astronaut Mark Watney is presumed dead and left behind by his crew on Mars. But Watney has survived.",
    price: 820,
    image: "https://m.media-amazon.com/images/I/919-2hQ3GzL._SL1500_.jpg",
    category: "Science Fiction",
    discount: 12,
    isbn: "978-0804139021",
  },
  {
    title: "Educated: A Memoir",
    author: "Tara Westover",
    description:
      "An unforgettable memoir about a young girl who, kept out of school, leaves her survivalist family to earn a PhD from Cambridge University.",
    price: 990,
    image: "https://m.media-amazon.com/images/I/81x40cWdJDL._SL1500_.jpg",
    category: "Biography",
    discount: 10,
    isbn: "978-0399590504",
  },
  {
    title: "Becoming",
    author: "Michelle Obama",
    description:
      "A deeply personal account of the life of the former First Lady of the United States, from her childhood in Chicago to her years in the White House.",
    price: 1400,
    image: "https://m.media-amazon.com/images/I/810s8oGZ3-L._SL1500_.jpg",
    category: "Biography",
    discount: 18,
    isbn: "978-1524763138",
  },
  {
    title: "The Subtle Art of Not Giving a F*ck",
    author: "Mark Manson",
    description:
      "A counterintuitive approach to living a good life, arguing that we should embrace our fears, faults, and uncertainties.",
    price: 750,
    image: "https://m.media-amazon.com/images/I/71t4GuxLCuL._SL1500_.jpg",
    category: "Self-Help",
    discount: 25,
    isbn: "978-0062457714",
  },
  {
    title: "The Fault in Our Stars",
    author: "John Green",
    description:
      "A heartbreakingly beautiful story about two teenagers who meet and fall in love at a cancer support group.",
    price: 690,
    image: "https://m.media-amazon.com/images/I/81yAo5ElQlL._SL1500_.jpg",
    category: "Romance",
    discount: 15,
    isbn: "978-0142424179",
  },
  {
    title: "The Hunger Games",
    author: "Suzanne Collins",
    description:
      "In the nation of Panem, Katniss Everdeen volunteers to take her younger sister's place in a televised fight to the death.",
    price: 850,
    image: "https://m.media-amazon.com/images/I/71un2hI4GgL._SL1500_.jpg",
    category: "Young Adult",
    discount: 10,
    isbn: "978-0439023528",
  },
  {
    title: "Meditations",
    author: "Marcus Aurelius",
    description:
      "A series of personal writings by the Roman Emperor, recording his private notes on Stoic philosophy.",
    price: 760,
    image: "https://m.media-amazon.com/images/I/81z4u364sLL._SL1500_.jpg",
    category: "Philosophy",
    discount: 5,
    isbn: "978-0140449334",
  },
  {
    title: "The Picture of Dorian Gray",
    author: "Oscar Wilde",
    description:
      "The story of a fashionable young man who sells his soul for eternal youth and beauty, leading to a life of debauchery.",
    price: 720,
    image: "https://m.media-amazon.com/images/I/81h2iAlm3pL._SL1500_.jpg",
    category: "Philosophy",
    discount: 10,
    isbn: "978-0486278070",
  },
  {
    title: "War and Peace",
    author: "Leo Tolstoy",
    description:
      "Chronicles the French invasion of Russia and the impact of the Napoleonic era on Tsarist society through five Russian aristocratic families.",
    price: 1500,
    image: "https://m.media-amazon.com/images/I/81xTjY+pSBL._SL1500_.jpg",
    category: "History",
    discount: 20,
    isbn: "978-1420959639",
  },
  {
    title: "Frankenstein",
    author: "Mary Shelley",
    description:
      "The story of Victor Frankenstein, a young scientist who creates a sapient creature in an unorthodox scientific experiment.",
    price: 650,
    image: "https://m.media-amazon.com/images/I/81R9gS5UieL._SL1500_.jpg",
    category: "Thriller",
    discount: 12,
    isbn: "978-0486282114",
  },
  {
    title: "The Handmaid's Tale",
    author: "Margaret Atwood",
    description:
      "Set in a near-future New England, in a totalitarian state which has overthrown the United States government.",
    price: 880,
    image: "https://m.media-amazon.com/images/I/81QDCr1LPPL._SL1500_.jpg",
    category: "Science Fiction",
    discount: 15,
    isbn: "978-0385490818",
  },
  {
    title: "Steal Like an Artist",
    author: "Austin Kleon",
    description:
      "A guide to unlocking your creativity in the digital age, showing how to remix and re-imagine to discover your own path.",
    price: 680,
    image: "https://m.media-amazon.com/images/I/71+vj2iV58L._SL1500_.jpg",
    category: "Art & Design",
    discount: 10,
    isbn: "978-0761169253",
  },
  {
    title: "Zero to One",
    author: "Peter Thiel",
    description:
      "Notes on Startups, or How to Build the Future. The great secret of our time is that there are still uncharted frontiers to explore.",
    price: 900,
    image: "https://m.media-amazon.com/images/I/71m-MxdJ2mL._SL1500_.jpg",
    category: "Business",
    discount: 20,
    isbn: "978-0804139298",
  },
  {
    title: "Salt, Fat, Acid, Heat",
    author: "Samin Nosrat",
    description:
      "Mastering the Elements of Good Cooking. A visionary new master class in cooking that distills decades of professional experience into just four simple elements.",
    price: 1800,
    image: "https://m.media-amazon.com/images/I/9119pL340aL._SL1500_.jpg",
    category: "Cooking",
    discount: 10,
    isbn: "978-1476753836",
  },
  {
    title: "Where the Wild Things Are",
    author: "Maurice Sendak",
    description:
      "A classic children's picture book about a boy named Max who sails away to an island inhabited by Wild Things.",
    price: 600,
    image: "https://m.media-amazon.com/images/I/91t9x6TDKsL._SL1500_.jpg",
    category: "Children's Books",
    discount: 10,
    isbn: "978-0060254926",
  },
  {
    title: "The Four Agreements",
    author: "Don Miguel Ruiz",
    description:
      "A Toltec Wisdom Book that reveals the source of self-limiting beliefs that rob us of joy and create needless suffering.",
    price: 550,
    image: "https://m.media-amazon.com/images/I/71aG0m862oL._SL1500_.jpg",
    category: "Self-Help",
    discount: 18,
    isbn: "978-1878424310",
  },
  {
    title: "The Da Vinci Code",
    author: "Dan Brown",
    description:
      "A mystery thriller following symbologist Robert Langdon as he uncovers a conspiracy protected by a secret society.",
    price: 890,
    image: "https://m.media-amazon.com/images/I/815mI2gCjOL._SL1500_.jpg",
    category: "Mystery",
    discount: 15,
    isbn: "978-0307474278",
  },
  {
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    description:
      "What the Rich Teach Their Kids About Money That the Poor and Middle Class Do Not!",
    price: 500,
    image: "https://m.media-amazon.com/images/I/81bsw6fnUiL._SL1500_.jpg",
    category: "Business",
    discount: 20,
    isbn: "978-1612680194",
  },
  {
    title: "The Body Keeps the Score",
    author: "Bessel van der Kolk",
    description:
      "Brain, Mind, and Body in the Healing of Trauma. Explores how trauma reshapes both body and brain, compromising sufferers' capacities.",
    price: 1100,
    image: "https://m.media-amazon.com/images/I/71-iN5i3A3L._SL1500_.jpg",
    category: "Health & Fitness",
    discount: 15,
    isbn: "978-0143127741",
  },
  {
    title: "Into the Wild",
    author: "Jon Krakauer",
    description:
      "The true story of Christopher McCandless, a young man who hitchhiked to Alaska and walked alone into the wilderness to live off the land.",
    price: 850,
    image: "https://m.media-amazon.com/images/I/81GZso2BlJL._SL1500_.jpg",
    category: "Travel",
    discount: 10,
    isbn: "978-0385486804",
  },
  {
    title: "Watchmen",
    author: "Alan Moore",
    description:
      "A seminal graphic novel that deconstructs the superhero genre, set in an alternate history where superheroes changed the world.",
    price: 1450,
    image: "https://m.media-amazon.com/images/I/91s9-38m2RL._SL1500_.jpg",
    category: "Comics",
    discount: 10,
    isbn: "978-0930289232",
  },
  {
    title: "The Name of the Wind",
    author: "Patrick Rothfuss",
    description:
      "The riveting first-person narrative of a young man who grows to be the most notorious magician his world has ever seen.",
    price: 980,
    image: "https://m.media-amazon.com/images/I/91bIsR92CPL._SL1500_.jpg",
    category: "Fantasy",
    discount: 10,
    isbn: "978-0756404741",
  },
  {
    title: "The Sun and Her Flowers",
    author: "Rupi Kaur",
    description:
      "A collection of poetry about grief, self-abandonment, honoring one's roots, love, and empowering oneself.",
    price: 750,
    image: "https://m.media-amazon.com/images/I/61I29L33oJL._SL1500_.jpg",
    category: "Poetry",
    discount: 12,
    isbn: "978-1449486792",
  },
  {
    title: "Guns, Germs, and Steel",
    author: "Jared Diamond",
    description:
      "A Pulitzer Prize-winning book that argues that geographical and environmental factors shaped the modern world.",
    price: 1100,
    image: "https://m.media-amazon.com/images/I/81s326e5r7L._SL1500_.jpg",
    category: "History",
    discount: 20,
    isbn: "978-0393317558",
  },
];

export const bookSeeder = async (req, res) => {
  try {
    let created = [];
    let skipped = [];

    for (const book of books) {
      const existing = await bookmodel.findOne({ isbn: book.isbn });
      if (existing) {
        skipped.push(book.isbn);
        continue;
      }

      const category = await categorymodel.findOne({
        name: book.category.trim().toLowerCase(),
      });
      if (!category) {
        return res
          .status(404)
          .json({ message: `Category '${book.category}' not found` });
      }

      const finalPrice = Number(
        (book.price - (book.discount * book.price) / 100).toFixed(2)
      );

      const createdBook = await bookmodel.create({
        title: book.title,
        author: book.author,
        description: book.description,
        price: book.price,
        image: book.image,
        category: category._id,
        discount: book.discount,
        isbn: book.isbn,
        finalPrice,
      });

      category.books.push(createdBook._id);
      await category.save();

      created.push(createdBook.title);
    }

    res
      .status(201)
      .json({ message: "Books seeded successfully", created, skipped });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error seeding books", error: error.message });
  }
};


