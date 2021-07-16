var BASE_API_URL = `https://cataas.com/api/cats`;
var CAT_IMG_URL = `https://cataas.com/cat/`;
var globalCatData = null;

window.onload = getCatData();
async function getCatData(tag = "") {
    try {
        // Fetch data from API
        if (tag === "") {
            if (globalCatData === null) {
                var data = await fetch(BASE_API_URL);
                var response = await data.json();
                globalCatData = response;
            } else {
                var response = globalCatData;
                console.log("Reffering the cache instead of API call");
            }
        } else {
            var data = await fetch(`${BASE_API_URL}?tags=${tag}`);
            var response = await data.json();
        }
        // console.log(response);

        var container = document.getElementById("content");
        container.innerHTML = "";

        response.forEach((element) => {
            // console.log(element.id, element.tags);
            var colDiv = document.createElement("div");
            colDiv.classList.add("col-lg-4");
            colDiv.classList.add("py-2");
            container.appendChild(colDiv);

            //Card Div and tooltip
            var cardDiv = document.createElement("div");
            cardDiv.classList.add("card-inner");
            cardDiv.id = element.id;
            cardDiv.setAttribute("data-toggle", "tooltip");
            cardDiv.setAttribute("data-placement", "top");
            cardDiv.setAttribute(
                "title",
                `Tags : ${element.tags} , Created at: ${element.created_at}`
            );
            cardDiv.setAttribute("data-bs-toggle", "modal");
            cardDiv.setAttribute("data-bs-target", "#staticBackdrop");
            cardDiv.setAttribute("onclick", `viewCat(this.id)`);
            colDiv.appendChild(cardDiv);

            // Image tag
            var catImage = document.createElement("img");
            catImage.src = `${CAT_IMG_URL}${element.id}`;
            catImage.alt = `${element.id}  ${element.created_at}`;
            catImage.classList.add("img-fluid");
            catImage.classList.add("align-self-center");
            cardDiv.appendChild(catImage);
        });
    } catch (error) {
        console.log("Error while fetching API" + error);
    }
}

function searchCat() {
    var searchText = document.getElementById("searchText");
    console.log(searchText.value);
    getCatData(searchText.value);
}

async function viewCat(id = null) {
    try {
        if (globalCatData === null) {
            var data = await fetch(BASE_API_URL);
            var response = await data.json();
            globalCatData = response;
        } else {
            var response = await globalCatData;
            console.log("Reffering the cache instead of API call");
        }
        // console.log(response, id);
        var element;
        if (id !== null) {
            for (i = 0; i < response.length; i++) {
                if (response[i].id === id) {
                    element = response[i];
                    break;
                }
            }
        } else {
            var randomNo = Math.floor(Math.random() * response.length);
            element = response[randomNo];
        }

        document.getElementById("modalBody").innerHTML = "";

        var catImage = document.createElement("img");
        catImage.src = `${CAT_IMG_URL}${element.id}`;
        catImage.alt = `${element.id}  ${element.created_at}`;
        catImage.classList.add("img-fluid");
        catImage.classList.add("align-self-center");
        document.getElementById("modalBody").append(catImage);

        var hr = document.createElement("hr");
        document.getElementById("modalBody").append(hr);

        var ul = document.createElement("ul");
        document.getElementById("modalBody").append(ul);

        var li = document.createElement("li");
        ul.appendChild(li);
        li.innerText = `Image URL : ${CAT_IMG_URL}${element.id}`;

        let tag = "No Tag assigned";
        if (element.tags.length !== 0) {
            tag = element.tags.join();
            console.log(tag);
        }
        var li = document.createElement("li");
        ul.appendChild(li);
        li.innerText = `Tags : ${tag}`;
    } catch (error) {
        console.log("Error while fetching API" + error);
    }
}
