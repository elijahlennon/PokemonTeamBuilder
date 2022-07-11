let pokedex;

const fetchPokemon = () => {
    // Use the pokeapi to fetch an exhaustive list of all pokemon
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=2000&offset=0`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        }
    })
    .then(response => response.json()
        .then(result => {
            //Set pokedex to the results of the GET API request
            pokedex = result;
        }))
    .catch(error => {
        console.error('Issue fetching pokemon:', error);
    });
}

const fetchPokemonDetails = (event) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${event.target.id}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        }
    })
        .then(response => response.json()
            .then(result => {
                // Create modal & add contents
                const modal = document.createElement("div");
                modal.className = "modal";

                modal.innerHTML =
                    `
                        <div>Pokemon Name: ${result.name.replaceAll('-', ' ')}</div>
                        <div>Pokemon Type(s):
                    `;
                result.types.forEach(type => {
                    modal.innerHTML += `<div>${type.type.name}</div>`
                })

                modal.innerHTML += `</div><img alt="Image of Pokemon" src=${result.sprites.front_default}></img>`

                document.body.appendChild(modal);
            }))
        .catch(error => {
            console.error('Issue fetching pokemon details:', error);
        });
}

const searchPokemon = (event) => {
    // Locate input element & grab its value
    const searchTerm = event.target.value;
    // Filter through the pokedex results by the input value to return
    // an array of all applicable pokemon
    const searchResults = pokedex.results.filter(pokemon => pokemon.name.includes(searchTerm));

    let searchResultsElements = '';

    // Locate search results element & concatonate filtered results
    searchResults.forEach(result => {
        const prettifiedPokemonName = result.name.replaceAll('-', ' ')
        searchResultsElements += `<div id="${result.name}" onclick="fetchPokemonDetails(event)">${prettifiedPokemonName}</div>`
    })

    document.getElementById("searchResults").innerHTML = searchResultsElements;
}