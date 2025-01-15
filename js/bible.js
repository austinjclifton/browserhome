// /**
//  * Austin Clifton
//  * 
//  * JavaScript for the Bible Container
//  * Uses fetch() to retrieve API info
//  * courtesy of ajith-holy-bible.com (free)
//  * last updated in v1.1
//  */

// const books = [
//     'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', 
//     '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 
//     'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 
//     'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi', 'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', 
//     '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 
//     'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation'
// ];

// export async function fetchRandomVerse() {
//     let validVerse = false;
//     let verseData;
//     let book;
//     let chapter;
//     let verse;
//     let verseFrom;
//     let verseTo;
//     let checkstr = 'Wrong slect';

//     while (!validVerse) {
//         const randomBook = books[Math.floor(Math.random() * books.length)];
//         const randomChapter = Math.floor(Math.random() * 50) + 1; //assuming a maximum of 50 chapters per book
//         const randomVerseFrom = Math.floor(Math.random() * 20) + 1; //assuming a maximum of 30 verses per chapter
//         const randomVerseTo = randomVerseFrom + Math.floor(Math.random() * 7 + 8); //random number of verses to get

//         const options = {
//             method: 'GET',
//             url: 'https://ajith-holy-bible.p.rapidapi.com/GetVerses',
//             params: {
//                 Book: randomBook,
//                 chapter: randomChapter.toString(),
//                 VerseFrom: randomVerseFrom.toString(),
//                 VerseTo: randomVerseTo.toString()
//             },
//             headers: {
//                 'X-RapidAPI-Key': '70ffa70db7msh8f3593297ad93b6p1ed6ebjsn6ac1e517de26',
//                 'X-RapidAPI-Host': 'ajith-holy-bible.p.rapidapi.com'
//             }
//         };

//         try {
//             const response = await axios(options);
//             verseData = response.data;

//             verse = verseData.Output;
//             book = verseData.Book;
//             chapter =verseData.Chapter;
//             verse = verseData.Output;
//             verseFrom = verseData.VerseFrom;
//             verseTo = verseData.VerseTo;
//             let verseCheck = verse.substring(0,11);

//             if (verseCheck !== checkstr) {
//                 validVerse = true;
//                 const verseString = `${book} ${chapter}:${verseFrom}-${verseTo}\n${verse}  \n`;
                
//                 return verseString;
//             }
//         } 
//         catch (error) {
//             console.error('Error fetching verse:', error);
//         }
//     }
// }
