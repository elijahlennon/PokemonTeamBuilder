// Information on Fetch: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
// Information on APIs: https://doc.oroinc.com/api/http-methods
// Information on JSON: https://www.json.org/json-en.html
// Information on DOM: https://www.w3.org/TR/WD-DOM/introduction.html

// Set pokedex outside of all methods so that it can be used globally
let pokedex;

// -- ON LOAD
// This happens upon body load (Reference line 9 in _Layout.cshtml)
const fetchPokemon = () => {
    // Use the PokeAPI to fetch an exhaustive list of all pokemon
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=2000&offset=0`)
        // Then, upon a successful fetch, convert the response to JSON
        .then(response => response.json()
            // Take converted results & set pokedex to that value
            .then(result => {
                pokedex = result;
            }))
        // If an error occurs during any of the initial fetch or .then() methods,
        // this acts as a catch all & will catch the error, logging it to the console
        .catch(error => {
            console.error('Issue fetching pokemon:', error);
        });
}

// -- ON USER INPUT
// This happens upon user input (Reference line 16 in Index.cshtml)
const searchPokemon = (event) => {
    const searchTerm = event.target.value;
    // Filter through the pokedex results by the input value to return
    // an array of all applicable pokemon
    const searchResults = pokedex.results.filter(pokemon => pokemon.name.includes(searchTerm));

    // Reset the search result elements every time user input changes
    let searchResultsElements = '';
    // Locate search results element & concatonate filtered results
    searchResults.forEach(result => {
        const prettifiedPokemonName = result.name.replaceAll('-', ' ')
        searchResultsElements += `<div id="${result.name}" onclick="fetchPokemonDetails(event)">${prettifiedPokemonName}</div>`
    })

    document.getElementById("searchResults").innerHTML = searchResultsElements;
}

// -- ON SEARCH RESULT CLICK
// This happens upon a user clicking a search result (Reference line 39 above)
const fetchPokemonDetails = (event) => {
    // Use the PokeAPI to fetch details on the selected pokemon
    fetch(`https://pokeapi.co/api/v2/pokemon/${event.target.id}`)
        // Then, upon a successful fetch, convert the response to JSON
        .then(response => response.json()
            // Take converted results & pass them to the createModal method
            .then(result => {
                createModal(result)
            }))
        // If an error occurs during any of the initial fetch or .then() methods,
        // this acts as a catch all & will catch the error, logging it to the console
        .catch(error => {
            console.error('Issue fetching pokemon details:', error);
        });

}

// -- CREATE MODAL
const createModal = (data) => {
    // Create a div and assign it to the variable "modal"
    const modal = document.createElement("div");
    // Add the id "modal" to the newly created div
    modal.id = "modal";
    // Add the class "modal" to the newly created div
    modal.className = "modal";

    // -- DIV HEADER
    // add pokemon button and exit button 
    modal.innerHTML += `
        <div class='modal-header'>
            <button onclick='addPokemon()'>Add Pokemon</button>
            <button onclick='closeModal()'>x</button>
        </div>
    `;

    // -- DIV BODY
    //Add image, height, and weight 
    let details = "";
    details += `<div class='left'>
                    <img alt="Image of Pokemon" src=${data.sprites.front_default} />
                </div>`;
    details += "<div class='right'>"
    details += `<div>${data.name.replaceAll('-', ' ')}</div>`;
    details += `<div>Height: ${data.height}</div>`;
    details += `<div>Weight: ${data.weight}</div>`;
    // Add pokemon types and colors
    let types = "";
    data.types.forEach(type => {
        const name = type.type.name;
        let color = "";
        switch (name) {
            case "electric":
                color = "#f7e752";
                break;
            case "fire":
                color = "#ff9441";
                break;
            case "water":
                color = "#5a8ccd";
                break;
            case "grass":
                color = "#a4d641";
                break;
            case "bug":
                color = "#f6ee8b";
                break;
            case "poison":
                color = "#eea5d5";
                break;
            case "flying":
                color = "#ac7b5a";
                break;
            case "normal":
                color = "#e6bd9c";
                break;
            case "fairy":
                color = "#e67384";
                break;
            case "fighting":
                color = "#bd314a";
                break;
            case "psychic":
                color = "#6ab4e6";
                break;
            case "rock":
                color = "#626a20";
                break;
            case "ground":
                color = "#d5ac20";
                break;
            case "dark":
                color = "#62637b";
                break;
            case "ice":
                color = "#c5c6d6";
                break;
            case "dragon":
                color = "#104a8b";
                break;
            case "ghost":
                color = "#5a4b9c";
                break;
            case "steel":
                color = "#ded5d5";
                break;
            default:
                color: "white";
        }

        types += `<div class="capsule" style="background: ${color}">${name}</div>`;
    })
    details +=
        `<div class='types'>
            ${types}
        </div>`
    details += "</div>"

    modal.innerHTML += `<div class='details'>${ details }</div>`;

    // Add pokemon stats
    let stats = "";
    data.stats.forEach(stat => {
        stats += `<div>${stat.stat.name.replaceAll("-", " ")}: ${stat.base_stat}</div>`;
    })

    modal.innerHTML +=
        `<div class='stats'>
            ${ stats }
        </div>`

    // Add pokemon abilities
    let abilities = "";
    data.abilities.forEach(ability => {
        abilities += `<div class="capsule">${ability.ability.name.replaceAll("-", " ")}</div>`;
    })

    modal.innerHTML +=
        `<div class='abilities'>
            ${ abilities }
        </div>`
    // -- END DIV BODY

    // Add modal to the DOM
    document.body.appendChild(modal);
}

const closeModal = () => {
    document.getElementById('modal').remove();
}
const addPokemon = () => {
    document.getElementById('addpokemon');
}