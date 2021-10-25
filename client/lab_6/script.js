/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */
async function windowActions() {
  const endpoint = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json';

  const request = await fetch(endpoint);
  const arrayName = await request.json();

  function findMatches(wordToMatch, arrayName) {
    return arrayName.filter((arr) => {
      const regex = new RegExp(wordToMatch, 'gi');
      return arr.name.match(regex);
    });
  }
  function displayMatches(event) {
    const matchArray = findMatches(event.target.value, arrayName);
    const html = matchArray.map((arr) => {
      const regex = new RegExp(event.target.value, 'gi');
      const restName = arr.name.replace(regex, `<span class="hl">${event.target.value}</span>`);
      return `
        <li>
          <div class="name">${restName}</div>
          <div class="cat">${arr.category}</div>
          <div class="addy">${arr.address_line_1}</div>
          <div class="city">${arr.city}</div> 
          <div class="zipcode">${arr.zip}</div>
        </li>
      `;
    }).join('');
    suggestions.innerHTML = html;
  }

  const searchInput = document.querySelector('.search');
  const suggestions = document.querySelector('.suggestions');

  searchInput.addEventListener('change', displayMatches);
  searchInput.addEventListener('keyup', (evt) => { displayMatches(evt); });
}
window.onload = windowActions;