const request = require('async-request')
const prompt = require('prompt')

var pattern = /<a href="(.*)" target="_blank"><b>(.*)<\/b><\/a>  by <b>(.*)<\/b><br>/g
var lpattern = /Sorry about that. -->([\s\S]*)<!-- MxM banner -->/g

async function Request(song) {
        try {
                let page = 1
                var url = 'http://search.azlyrics.com/search.php?q=' + song + '&w=songs&p=' + page
                var html = await request(url)
                return html.body
        }
        catch (e) {
                console.log(e)
                process.exit(1)
        }
}

async function GetLyric(url) {
        try {
                var html = await request(url)
                var raw = lpattern.exec(html.body)
                var res = raw[1].replace(/\<br\>/g," ");
                res = res.replace(/<i\>(.*)<\/i\>/g, "");
                res = res.replace(/(?=)(\&quot\;)/g, "\"");
                res = res.replace(/\<\/div\>/g, "");
                return res
        }
        catch (e) {
                console.log(e)
                process.exit(1)
        }
}

async function GetSongList(song) {
        try {
                var html = await Request(song)
                var songs = []
                var song
                while (song = pattern.exec(html))
                        songs.push({url : song[1], name : song[2], singer : song[3]})
                console.log(songs[0].name + ' - ' + songs[0].singer)
                var result = await GetLyric(songs[0].url)
                console.log(result)
        }
        catch (e) {
                console.log(e)
                process.exit(1)
        }
}

function clear() {
        console.log('\033[2J')
}

var song

prompt.start()

prompt.get(['song'], (err, result) => {
        GetSongList(result.song)
})
