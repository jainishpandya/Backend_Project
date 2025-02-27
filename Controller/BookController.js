const bcrypt = require('bcryptjs');
const BookModel = require('../Models/Book');

const multer = require('multer');
const upload = multer({ dest: 'Uploads' })

const addBook = async (req, res) => {
    try {

        const book_title = req.body.bookTitle;
        const author_id = req.body.authorId;
        const category_id = req.body.categoryId
        const club_id = req.body.clubId;
        const book_summary = req.body.bookSummary
        const book_cover_url = req.body.bookCoverUrl;
        const owner_id = req.body.ownerId;
        const rating = 0;
        const genre = req.body.genre
        const bookModel = new BookModel({ book_title, author_id, category_id, club_id, book_summary, book_cover_url, owner_id, rating, genre });
        await bookModel.save();
        res.status(201).json({
            message: "Book Listing Successful",
            success: true
        })
    } catch (error) {
        console.error('book Error: ', error);
        res.status(500).json({ message: 'server error' })
    }
}

const listBook = async (req, res) => {
    try {
        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || "";
        let sort = req.query.sort || "rating";
        let genre = req.query.genre || "All";

        const genreOptions = [
            "Action",
            "Romance",
            "Fantasy",
            "Drama",
            "Crime",
            "Adventure",
            "Thriller",
            "Sci-fi",
            "Music",
            "Family",
            "Fiction"
        ];

        genre === "All"
            ? (genre = [...genreOptions])
            : (genre = req.query.genre.split(",")) ;
            req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);


            let sortBy = {};
            if(sort[1]) {
                sortBy[sort[0] = sort[1]];
            } else {
                sortBy[sort[0]] = "asc";
            }

            console.log(genre);
            
            const books = await BookModel.find({book_title: {$regex: search, $options: "i"}})
                .where("genre").in([...genre])
                .sort(sortBy)
                .skip(page * limit)
                .limit(limit);

            console.log(books);
            
                const total = await BookModel.countDocuments({
                    genre:{$in: [...genre]},
                    book_title: {$regex: search, $options: "i"}
                });

                const response = {
                    error: false,
                    total,
                    page: page + 1,
                    limit,
                    genres: genreOptions,
                    books
                }

                res.status(200).json(response);
    } catch (error) {
        console.error('book Error: ', error);
        res.status(500).json({ message: 'server error' })
    }
}


module.exports = {
    addBook,
    listBook
}
