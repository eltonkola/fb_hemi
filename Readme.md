#Data
The bible sqlite is from this repo:
https://github.com/godlytalias/Bible-Database/blob/master/English/holybible.db

with Gnu license.


# queries

1. Count nr of books - book_number
SELECT COUNT(*) as sa from books;

- how many books does the bible have?
- how big is the bible?

2. Get a verse by id - read_verse
select bible.verse as text, books.book_name as book, bible.Chapter as chapter, BIBLE.Versecount as verse from bible INNER JOIN books on bible.Book == books.book_id WHERE bible.Chapter == 1 and bible.Versecount == 1 and books.book_id == 10;
- look for Genesis 1:10
- read Deuteronomy 1:10
- read 2 Kings 1:10
- read second Kings 1:10

2. Search by term - search_query
select bible.verse as text, books.book_name as book, bible.Chapter as chapter, BIBLE.Versecount as verse from bible INNER JOIN books on bible.Book == books.book_id WHERE bible.verse like "%kill%";
- what does the bible say about love
- does the bible condamn gay people?
- search bible for war
- what dos the bible say about abortion?