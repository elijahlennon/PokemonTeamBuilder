// Information on Fetch: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
// Information on APIs: https://doc.oroinc.com/api/http-methods
// Information on JSON: https://www.json.org/json-en.html
// Information on DOM: https://www.w3.org/TR/WD-DOM/introduction.html

// Set pokedex outside of all methods so that it can be used globally
let pokedex;
let selectedPokemon;

// Team Members array
let teamMembers = [];

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
                selectedPokemon = {
                    name: result.name.replaceAll('-', ' '),
                    image: result.sprites.front_default,
                    height: result.height,
                    weight: result.weight,
                    types: [],
                    stats: [],
                    abilities: []
                };

                // Types
                result.types.forEach(type => {
                    selectedPokemon.types.push({
                        name: type.type.name,
                        color: determineTypeColor(type.type.name)
                    })
                })

                // Stats
                result.stats.forEach(stat => {
                    selectedPokemon.stats.push({
                        name: stat.stat.name.replaceAll("-", " "),
                        stat: stat.base_stat
                    })
                })

                // Abilities
                result.abilities.forEach(ability => {
                    ability = ability.ability.name.replaceAll("-", " ");
                    selectedPokemon.abilities.push(ability)
                })

                createModal();
            }))
        // If an error occurs during any of the initial fetch or .then() methods,
        // this acts as a catch all & will catch the error, logging it to the console
        .catch(error => {
            console.error('Issue fetching pokemon details:', error);
        });

}

// -- CREATE MODAL
const createModal = (event) => {
    let added = false;
    if (event) {
        added = true;
        selectedPokemon = teamMembers[event.currentTarget.id];
    }
    // Create a div and assign it to the variable "modal"
    const modal = document.createElement("div");
    // Add the id "modal" to the newly created div
    modal.id = "modal";
    // Add the class "modal" to the newly created div
    modal.className = "modal";

    // -- DIV HEADER
    // Add pokemon button and exit button 
    modal.innerHTML += `
       <div class='modal-header'>
            ${!added ? `<button onclick='addPokemon()'>Add Pokemon</button>` : `<button onclick='removePokemon(event)'>Remove Pokemon</button>`}
            <button onclick='closeModal()'>x</button>
        </div>
    `;

    // -- DIV BODY
    // Add image, height, and weight 
    let details = "";
    details += `<div class='left'>
                    <img alt="Image of Pokemon" src=${ selectedPokemon.image } />
                </div>`;
    details += "<div class='right'>"
    details += `<div>${ selectedPokemon.name }</div>`;
    details += `<div>Height: ${ selectedPokemon.height }</div>`;
    details += `<div>Weight: ${ selectedPokemon.weight }</div>`;
    // Add pokemon types and colors
    let types = "";
    selectedPokemon.types.forEach(type => {
        types += `<div class="capsule" style="background: ${ type.color }">${ type.name }</div>`;
    })

    details +=
        `<div class='types'>
            ${ types }
        </div>`
    details += "</div>"

    modal.innerHTML += `<div class='details'>${ details }</div>`;

    // Add pokemon stats
    let stats = "";
    selectedPokemon.stats.forEach(stat => {
        stats += `<div>${ stat.name }: ${ stat.stat }</div>`;
    })

    modal.innerHTML +=
        `<div class='stats'>
            ${ stats }
        </div>`

    // Add pokemon abilities
    let abilities = "";
    selectedPokemon.abilities.forEach(ability => {
        abilities += `<div class="capsule">${ ability }</div>`;
    })

    modal.innerHTML +=
        `<div class='abilities'>
            ${ abilities }
        </div>`
    // -- END DIV BODY

    // Add modal to the DOM
    document.body.appendChild(modal);
}

// -- CLOSE MODAL
const closeModal = () => {
    document.getElementById('modal').remove();
}

const addPokemon = () => {
    closeModal();
    let added = false;
    Array.from(document.getElementsByClassName("team-member")).forEach(member => {
        const content = member.innerHTML;
        if (content === "" && !added) {
            teamMembers.push(selectedPokemon)
            member.innerHTML = `<img src=${selectedPokemon.image} alt="Teammate Image"/>`;
            added = true;
        }
    })
}

const removePokemon = (event) => {
    closeModal();
    teamMembers.forEach((teamMember, index) => {
        if (teamMember === selectedPokemon) {
            document.getElementsByClassName("team-member")[index].innerHTML = '';
        }
    })
    teamMembers = teamMembers.filter((teamMember, index) => teamMember !== selectedPokemon);
}

const determineTypeColor = (name) => {
    switch (name) {
        case "electric":
            return "#f7e752";
        case "fire":
            return "#ff9441";
        case "water":
            return "#5a8ccd";
        case "grass":
            return "#a4d641";
        case "bug":
            return "#f6ee8b";
        case "poison":
            return "#eea5d5";
        case "flying":
            return "#ac7b5a";
        case "normal":
            return "#e6bd9c";
        case "fairy":
            return "#e67384";
        case "fighting":
            return "#bd314a";
        case "psychic":
            return "#6ab4e6";
        case "rock":
            return "#626a20";
        case "ground":
            return "#d5ac20";
        case "dark":
            return "#62637b";
        case "ice":
            return "#c5c6d6";
        case "dragon":
            return "#104a8b";
        case "ghost":
            return "#5a4b9c";
        case "steel":
            return "#ded5d5";
        default:
            return "white";
    }
}