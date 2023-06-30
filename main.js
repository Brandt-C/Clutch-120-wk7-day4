// set up a function to get our token!

const getAuth = async () => {
    const clientID = '????';
    const clientSecret = '????';
    const response = await fetch('https://accounts.spotify.com/api/token',
    {
        method : 'POST',
        headers :{
            'Authorization' : `Basic ${btoa(clientID + ':' + clientSecret)}`,
            'Content-Type' : 'application/x-www-form-urlencoded'
        },
        body : 'grant_type=client_credentials'
    });
    const token = await response.json();
    // console.log(token);
    return token
}

// time to make a function for the api call!
const getSong = async (songname, artist, token) => {
        // const token = await getAuth();
        let response = await fetch(`https://api.spotify.com/v1/search?type=track&q=track:${songname}+artist:${artist}`,{
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization': `Bearer ${token.access_token}`
            }
        });
        // console.log(response);
        let data = await response.json();
        // console.log(data.tracks.items[0]);
        return data.tracks.items[0]
}

// let's set up the page!

let music = [{id:0, track: 'Electric Worry', artist: 'Clutch'},
{id:1, track: 'Piano Man', artist: 'billy'},
{id:2, track: 'machine', artist: 'born of osiris'},
{id:3, track: 'attention', artist: 'Charlie puth'},
{id:4, track: 'suncity', artist: 'khalid'},
{id:5, track: 'single ladies', artist: 'beyonce'},
{id:6, track: 'show me the meaning', artist: 'backstreet boys'},
{id:7, track: 'ghost of tom joad', artist: 'rage against the machine'},
{id:8, track: 'something', artist: 'drake'}];

let playing;
let stopbtn = document.getElementById('stopbtn');
let headertitle = document.getElementById('headertitle');  //TODO

// set up the loading process / api calls
const setupTrackList = async () => {
    const token = await getAuth();
    // once we have our token we need to loop through our music arr
    for (let i =0;i<music.length;i++){
        let data = await getSong(music[i].track, music[i].artist, token);
        // console.log(data);
        music[i]['preview_url'] = new Audio(data.preview_url);
        music[i]['album_cover'] = data.album.images[0].url;

        let img = document.getElementById(`${i}`);
        img.src = music[i]['album_cover'];
        img.hidden = false;
    }
console.log(music);
}
setupTrackList();


// click event for play btns
let clickEvent = (id) => {
    console.log(id);
    let track = music[id.slice(-1)];
    console.log(track);

    // we're gonna have some conditionals here!
    if (playing && !playing.preview_url.paused) { //if there's a song playing and it's not paused
        // is this the same song as currently playing
        if (playing == track) {
            // that means we're done here for this part of the function, return
            pauseTrack();
            return
        }
        else {
            // this means we need to pause THAT song and play THIS song
            playing.preview_url.pause();
            let playingbtn = document.getElementById(`playbtn${playing.id}`);
            playingbtn.innerHTML = 'Play';
            playingbtn.className = 'btn btn-success';

        }

    }
    track.preview_url.play();
    playing = track;
    let playingbtn = document.getElementById(`playbtn${playing.id}`);
    playingbtn.innerHTML = 'Pause track';
    playingbtn.className = 'btn btn-secondary';
    headertitle.innerHTML = `${playing.songname} | ${playing.artist}`;

}

let pauseTrack = () => {
    console.log('PAUSING. . . ');
    playing.preview_url.pause();
    let playingbtn = document.getElementById(`playbtn${playing.id}`);
    playingbtn.innerHTML = 'Play';
    playingbtn.className = 'btn btn-success';
}



