var keys = require("./keys");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
const request = require('request-promise');
const fs = require('fs');


var twitterKeys = keys.twitterKeys;
var spotifyKeys = keys.spotifyKeys;
var OMBDKey = keys.OMDBKey;

const args = process.argv;
var command = args[2];
var param = false;

if (args[3]) {
	var param = args[3];
}

function twitter() {
	var client = new Twitter(twitterKeys);
	var params = {screen_name: 'JublubLipsitz'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	    for (tweet in tweets){
	    	if (tweet < 20){
		    	console.log('created at: ' + tweets[tweet]['created_at'] + ' tweet: ' + tweets[tweet]['text']);
		    }
	    }
	  }
	});
}

function spotify(song_name) {
	var spotify = new Spotify(spotifyKeys);
	spotify.search({ type: 'track', query: song_name }, function(err, data) {
	  if (err) {
	    return console.log('Error occurred: ' + err);
	  }
	var song_data = (data['tracks']['items'][0]);
	var artist = song_data['artists'][0]['name']
	var url = song_data['href']
	var name = song_data['name']
	var album = song_data['album']['name']

	console.log('Artist: ' + artist + ' Song: ' + name + ' Album: ' + album + ' URL: ' + url);
	});
}

function omdb(movie_title){
	url = 'http://www.omdbapi.com/?apikey=40e9cece&t=' + movie_title

	const options = {
	  method: 'GET',
	  uri: url,
	  qs: {
	    limit: 10,
	    skip: 20,
	    sort: 'asc'
	  }
	}
	request(options).then(function (response) {
		response = JSON.parse(response)

    	title = response['Title']
    	year = response['Year']
    	imdb_rating = response['imdbRating']
    	country = response['Country']
    	language = response['Language']
    	plot = response['Plot']
    	actors = response['Actors']

    	console.log(
    		'Title: ' + title + 
    		' Year: ' + year + 
    		' IMDB Rating: ' + imdb_rating + 
    		' Country: ' + country +
    		' Language: ' + language + 
    		' Plot: ' + plot +
    		' Actors: ' + actors

    		)

 		})
  	.catch(function (err) {
  		console.log('FAILED')
  	})

}

if (command === 'do-what-it-says'){
	var content = fs.readFileSync('./random.txt', 'utf8').toString();
	command = content.split(',')[0];
	param = content.split(',')[1];
}

console.log(command)

if (command === 'my-tweets'){
	twitter();
}

if (command === 'spotify-this-song'){
	if (param) {
		var song = param;
	}
	else {
		var song = 'The Sign Ace of Base';
	}
	spotify(song);
}

if (command === 'movie-this'){
	if (param) {
		var movie = param;
	}
	else {
		var movie = 'Mr. Nobody'
	}
	omdb(movie);
}