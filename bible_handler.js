var sqlite3 = require("sqlite3").verbose();

function getVerse(book_name, chapter_id, verse_id) {
  console.log("getVerse book_name:" + book_name);
  console.log("getVerse chapter_id:" + chapter_id);
  console.log("getVerse verse_id:" + verse_id);
   
  return new Promise(function(resolve, reject) {
    let db = new sqlite3.Database("./.data/bible.db");
    let sql = "select bible.verse as text, books.book_name as book, bible.Chapter as chapter, BIBLE.Versecount as verse from bible INNER JOIN books on bible.Book == books.book_id WHERE bible.Chapter == " + chapter_id + " and bible.Versecount == "+ verse_id +" and books.book_name == '"+ book_name +"';";
    console.log("sql: "+ sql);
  
    db.get(sql, [], (err, row) => {
      if (err) {
        console.log("Error " + err);
        reject("Error connecting to db!");
      }
      console.log("Result "+ JSON.stringify(row));
      resolve(row.book + " " + row.chapter +":"+ row.verse +" - "+ row.text);
    });
    db.close();
  });
}

function doSearch(query){
  return new Promise(function(resolve, reject) {
    let db = new sqlite3.Database("./.data/bible.db");
    let sql = "select bible.verse as text, books.book_name as book, bible.Chapter as chapter, BIBLE.Versecount as verse from bible INNER JOIN books on bible.Book == books.book_id WHERE bible.verse like '%"+ query+ "%';";
    console.log("sql: "+ sql);
  
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.log("Error " + err);
        reject("Error connecting to db!");
      }
      //console.log("Results "+ JSON.stringify(rows));
      
      if(rows.length > 0){
        console.log("found results "+ rows.length); 
        var finalResposne = "We found " +  rows.length + " results for "+ query + " Here are the first ones: "
   
        //top rows
        rows.slice(0, 10).forEach((row) => {
            console.log("row "+ JSON.stringify(row));
            console.log("finalResposne "+ finalResposne);
            finalResposne = finalResposne + row.book + " " + row.chapter +":"+ row.verse +" - "+ row.text
        });
        
        //single random
        // var randomVerse = rows[Math.floor(Math.random() * rows.length)];
        // finalResposne += randomVerse.book + " " + randomVerse.chapter +":"+ randomVerse.verse +" - "+ randomVerse.text;

        console.log("finalResposne: "+ finalResposne);
     
        resolve(finalResposne);
        
      }else{
        console.log("Nothing found");
        resolve("Could not find anything for " + query + ", try something else.");
      }
      
    });
    db.close();
  });
}


function searchBible(data){
 const queries = data.entities['wit$search_query:search_query'];
  console.log("queries:" +  JSON.stringify(queries));
  if (queries == null || queries.length != 1) {
    return hint();
  }
  var query = queries[0].body;
  console.log("query:" + query);
  
  return doSearch(query);
}

function readVerse(data){
  console.log("readVerse");
  const names = data.entities['book_name:book_name'];
  console.log("names:" +  JSON.stringify(names));
  if (names == null || names.length != 1) {
    return hint();
  }
  var book_name = names[0].body;
  console.log("book_name:" + book_name);
  
  const numbers = data.entities['wit$number:number'];
  console.log("numbers:" +  JSON.stringify(numbers));
  
  if (numbers == null || numbers.length != 2) {
    return hint();
  }
  
  var chapter_id = numbers[0].value;
  var verse_id = numbers[1].value;
  
  return getVerse(book_name, chapter_id, verse_id)
}

function bookNumber(data){
  return new Promise(function(resolve, reject) {
    let db = new sqlite3.Database("./.data/bible.db");
    let sql = "SELECT COUNT(*) as sa from books;";
    db.get(sql, [], (err, row) => {
      if (err) {
        console.log("Error " + err);
        reject("Error connecting to db!");
      }
      console.log("Result " + row.sa);
      resolve("The bible has " + row.sa + " books!");
    });
    db.close();
  });
}


function bibleResponse(data) {
  console.log("data from wit:");
  console.log(JSON.stringify(data));

  const intent = data.intents.length > 0 && data.intents[0] || "__foo__";
  
  switch (intent.name) {
    case "book_number":
      return bookNumber(data);
    case "read_verse":
      return readVerse(data);
    case "search_verse":
      return searchBible(data)
  }
  
  return hint();
}

function hint(){
   return Promise.resolve("ask me something like 'look for Genesis 1:10' or 'how big is the bible?' and other bible related questions!");
}

exports.bibleResponse = bibleResponse;
