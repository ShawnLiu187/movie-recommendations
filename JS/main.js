/*************
                      SAMPLE URLS
                      
                      1. To get the config data like image base urls
                      https://api.themoviedb.org/3/configuration?api_key=<APIKEY>
                      
                      2. To fetch a list of movies based on a keyword
                      https://api.themoviedb.org/3/search/movie?api_key=<APIKEY>&query=<keyword>
                      
                      3. To fetch more details about a movie
                      https://api.themoviedb.org/3/movie/<movie-id>?api_key=<APIKEY>
                      *************/
 //https://api.themoviedb.org/3/movie/{movie_id}/recommendations?api_key=<<api_key>>
 //https://api.themoviedb.org/3/movie/<movie-id>?api_key=<APIKEY>
 //const APIKEY is inside key.js

const app = {


baseURL : 'https://api.themoviedb.org/3/',
configData : null,
baseImageURL : null,
path : null,
imgSize : null,
movieID : null,
movieID2 : null,



init : function () {
     let btn1 = document.querySelector("#search-button");
     btn1.addEventListener("click", app.runSearch);
     document.getElementById('rcmbtn').addEventListener('click', app.getRecomm);

     document.addEventListener('keypress', function (ev) {
         let char = ev.char || ev.charCode || ev.which;
         if (char == 10 || char == 13) {
             btn1.dispatchEvent(new MouseEvent('click'));
         }
     });

     let btnReturn = document.querySelector("#return-button");
     btnReturn.addEventListener("click", app.returnToHome);
     document.addEventListener('keydown', function (ev) {
         let char2 = ev.char || ev.charCode || ev.which;
         console.log('keypress');
         if (char2 == 27) {
             btnReturn.dispatchEvent(new MouseEvent('click'));
         }
     });

     app.getConfig();
 },

getConfig : function () {
     let configURL = "".concat(app.baseURL, 'configuration?api_key=', APIKEY);
     console.log("test getConfig: ", configURL);

     fetch(configURL)
         .then(result => result.json())
         .then((data) => {
         console.log(data);
             app.baseImageURL = data.images.secure_base_url;
             console.log(app.baseImageURL);
        app.imgSize = data.images.poster_sizes[2];
         console.log(app.imgSize);
         })
         .catch(err => alert(err))
 },


returnToHome : function () {
     console.log("btnReturn is working");
     document.querySelector("#search-results").classList.remove("active");
     document.querySelector("#recommend-results").classList.remove("active");
     document.querySelector(".search").classList.add("home");
     document.querySelector(".icon").classList.add("home2");
     document.getElementById("search-input").value = null;
 },

getRecomm : function () {
     document.querySelector(".loading").classList.remove("not");
     let url3 = "".concat(app.baseURL, 'movie/', app.movieID2, '/recommendations?api_key=', APIKEY);
     console.log(url3);
     fetch(url3)
         .then(result =>
             result.json())
         .then((data) => {
             console.log(data);
             document.querySelector("#search-results").classList.add("active");
             document.querySelector("#recommend-results").classList.remove("active");
             app.displayResults(data);
         })
         .catch(err => alert(err))
 },

getDetails : function (ev) {
     document.querySelector(".loading").classList.remove("not");
     console.log(ev.currentTarget);
     console.log(ev.currentTarget.getAttribute("data-movie"));
     //movieID2 = ev.currentTarget.parentNode.childNodes[3].innerHTML;
     app.movieID2 = ev.currentTarget.getAttribute("data-movie");
     let url2 = "".concat(app.baseURL, 'movie/', app.movieID2, '?api_key=', APIKEY);

     console.log(url2);
     fetch(url2)
         .then(result =>
             result.json()
         )
         .then((data) => {
             console.log(data);

             document.querySelector("#search-results").classList.remove("active");
             document.querySelector("#recommend-results").classList.add("active");

             document.querySelector("#details-title").innerHTML = data.tagline;
             document.querySelector("#overview").innerHTML = data.overview;
             document.querySelector("#voteAverage").innerHTML = "Vote Average: " + data.vote_average;
             document.querySelector("#voteCount").innerHTML = "Vote Count: " + data.vote_count;

             document.querySelector(".loading").classList.add("not");


         })
         .catch(err => alert(err))
 },




runSearch : function () {
     let keyWord = document.getElementById("search-input").value;
     console.log("Test: ", keyWord);
     if (keyWord == "") {
         alert("Please input at least one keyword to search!");
     } else {
         document.querySelector(".loading").classList.remove("not");

         console.log("Searching for this: ", keyWord);

         document.querySelector(".search").classList.remove("home");
         document.querySelector(".icon").classList.remove("home2");
         document.querySelector("#search-results").classList.add("active");
         document.querySelector("#recommend-results").classList.remove("active");



         let url = ''.concat(app.baseURL, 'search/movie?api_key=', APIKEY, '&query=', keyWord);
         fetch(url)
             .then(result =>
                 result.json()
             )

             .then((data) => {
                 console.log(data);
                 app.displayResults(data);

             })
             .catch(err => alert(err))
     }
 },

displayResults : function (data) {



     while (document.querySelector(".content").hasChildNodes()) {
         document.querySelector(".content").removeChild(document.querySelector(".content").firstChild);
     }


     document.querySelector('.num').innerHTML = "You have " + data.results.length + " results";


     let df = document.createDocumentFragment();

     const useTemplate = function () {
         return 'content' in document.createElement('template');
     }

     if (useTemplate()) {
         console.log('template is working');

         let temp = document.getElementById('myTemplate');
         let content = temp.content;

         console.log(content);


         data.results.forEach(function (item, index) {
             //let unit = document.createElement("div");
             let unit = content.cloneNode(true);

             //unit.className = "movie";

             //let unitImage = document.createElement("img");
             let unitImage = unit.querySelector('img');
             let unitImageURL = ''.concat(app.baseImageURL, app.imgSize, item.poster_path);
             //             unitImage.className = "poster";
             //             unitImage.setAttribute("alt", "poster");
             unitImage.setAttribute("src", unitImageURL);
             unitImage.setAttribute("data-movie", item.id);
             unitImage.addEventListener("click", app.getDetails);

             //             let h2 = document.createElement("h2");
             let h2 = unit.querySelector('h2');
             //             h2.className = "movie-title";
             h2.innerHTML = item.title;
             h2.setAttribute("data-movie", item.id);
             h2.addEventListener("click", app.getDetails);

             //             let p1 = document.createElement("p");
             let p1 = unit.querySelector('p');
             //             p1.className = "movie-desc";
             movieID = item.id;
             p1.innerHTML = item.overview;


             //             let h4 = document.createElement("h4");
             //             let h4 = unit.querySelector('h4');
             //             h4.className = "item.title";
             //             h4.innerHTML = movieID;


             //             unit.appendChild(unitImage);
             //             unit.appendChild(h2);
             //             unit.appendChild(p1);
             //             unit.appendChild(h4);

             df.appendChild(unit);

         })
     } else {
         console.log('content is not working')
     }

     document.querySelector('.content').appendChild(df);

     document.querySelector(".loading").classList.add("not");
 }
 }
 
 document.addEventListener('DOMContentLoaded', app.init);
 /*******************************
 SAMPLE SEARCH RESULTS DATA
 { "vote_count": 2762, 
     "id": 578, 
     "video": false, 
     "vote_average": 7.5, 
     "title": "Jaws", 
     "popularity": 16.273358, 
     "poster_path": "/l1yltvzILaZcx2jYvc5sEMkM7Eh.jpg", 
     "original_language": "en", 
     "original_title": "Jaws", 
     "genre_ids": [ 27, 53, 12 ], 
     "backdrop_path": "/slkPgAt1IQgxZXNrazEcOzhAK8f.jpg", 
     "adult": false, 
     "overview": "An insatiable great white shark terrorizes the townspeople of Amity Island, The police chief, an oceanographer and a grizzled shark hunter seek to destroy the bloodthirsty beast.", 
     "release_date": "1975-06-18" 
 }
 *******************************/

