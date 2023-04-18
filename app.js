const form = document.querySelector('form');
const searchInput = document.querySelector('#search');
const resultsDiv = document.querySelector('#results');
const playerDiv = document.querySelector('#player');

form.addEventListener('submit', function(event) {
  event.preventDefault();
  const searchTerm = searchInput.value;
  search(searchTerm);
});

async function search(term) {
  resultsDiv.innerHTML = '';
  const response = await fetch(`https://api2.trizy.co/api/yt/search?query=${term}`); // FETCH DATA FROM API URL
  const data = await response.json(); // CONVERT RESPONSE DATA INTO JSON
  const results = data.result;
  if (results.length === 0) {
    resultsDiv.innerHTML = '<p>No results</p>';
  } else {
    results.forEach(result => {
      const resultDiv = document.createElement('div');
      resultDiv.classList.add('result');
      resultDiv.innerHTML = `
        <img src="${result.image}" alt="${result.title}">
        <h2>${result.title}</h2>
        <p>${result.description}</p>
        <p>Views: ${result.views}</p>
      `;
      resultDiv.addEventListener('click', function() {
        playVideo(result.videoId);
      }); // ADD CLICK HANDLER TO PLAY VIDEO
      resultsDiv.appendChild(resultDiv);
    });
  }
}

function playVideo(videoId) {
  playerDiv.innerHTML = '<iframe id="player-frame" data-src="https://www.youtube.com/embed/' + videoId + '?autoplay=1" class="lazyload" frameborder="0" allowfullscreen></iframe>';
}