//API info
const client_id = 'INSERT CLIENT ID';
const client_secret = 'INSERT CLIENT SECRET';
const api_token_url = 'https://accounts.spotify.com/api/token';
const playlist_ulr = 'https://api.spotify.com/v1/playlists/'

//exapmle of playlists. you can provide your own if you want.
const playlistIDs = [
'0RCNxflJNClLX9ge3I1jzC',
'7DNPpE2g0V8rXqbieGN3fZ',
'55NickCumlx9dlMyfPxwPC',
'37i9dQZF1DZ06evO1U3NAY',
'37i9dQZF1DZ06evO1C7dIs',
'37i9dQZF1DZ06evO1Hycua',
'37i9dQZF1DZ06evO3K2zsY',
'37i9dQZF1DZ06evO4i9JF6',
'37i9dQZF1DZ06evO3hJmi5'
]

//HTML content
const selector = document.getElementById('playList_selector')
const container = document.getElementById('container')

//generates token
async function fecthAPI(){
  const result = await fetch(api_token_url,{
    method: 'POST',
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
    },
    body: 'grant_type=client_credentials'
  });
  const data = await result.json()
  return data.access_token; 
}

//gets all the playlists and create list
async function getPlaylists(){
  const token = await fecthAPI();
  for ( object of playlistIDs){
    const playlist_data = await fetch (playlist_ulr+object,{
      method: 'GET',
      headers:{
        'Authorization':  'Bearer ' + token
      }
    });
    const playlistinfo = await playlist_data.json()
    const playlist = document.createElement('option')
    playlist.value = object;
    playlist.text = playlistinfo.name;
    selector.appendChild(playlist)
  }
  var v = selector.value
  generatelist(v)
  selector.addEventListener('change', function(){
    var v = selector.value
    generatelist(v)
  })
}
getPlaylists()

//code for creating list
async function generatelist(v){
  container.innerHTML = ``
  const token = await fecthAPI();
  const displayinfo = await fetch (playlist_ulr+v,{
  method: 'GET',
  headers:{
    'Authorization':  'Bearer ' + token
  }
  });
  const finalInfo = await displayinfo.json()
  const info = document.createElement('div')
  info.innerHTML = `
  <h2>${finalInfo.name}</h2>
  <img src=${finalInfo.images[0].url} class="playlistIMG">
  <h5>${finalInfo.description}</h5>
  `
  container.append(info)
  for (object of finalInfo.tracks.items){
      const preview = document.createElement('div')
      preview.classList.add('display')
      preview.innerHTML = `
        <img src=${object.track.album.images[2].url}>
        <audio controls class="audio">
          <source src="${object.track.preview_url}" type="audio/mpeg">
        </audio>
        <h5 class="trackinfo">Title: ${object.track.name}</h5>
        <h5 class="trackinfo">Artists: ${object.track.artists.map((info) => `${info.name}, `).join('').slice(0, -2)}</h5>
        <h5 class="trackinfo">Album: ${object.track.album.name}</h5>
      `
      container.appendChild(preview)
  }
  var sounds  = document.querySelectorAll(".audio")
  sounds.forEach(sound => sound.addEventListener('play',function(){
    audioFunction(sounds, sound)
  }))
}

//code to make sure only one audio track can run at a time.
function audioFunction(sounds, currentSound){
  sounds.forEach(sound=> {
    /*checks if curent 'sound' that is trying to play is 
    not the same as the currentsound as we dont want to pause the audio that just started playing*/
    if(sound !== currentSound){
        sound.pause();
      }
    }
  )
}