
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var languageButtonsEl = document.querySelector("#language-buttons");

var getFeaturedRepos = function(language){
    //fetch repos needing js, are featured, & have help-wanted-issues
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                displayrepos(data.items, language);
            });
        } else {
            alert("Error: GitHub User Not Found");
        }
    })
}

var displayrepos = function(repos, searchterm){
    //check if api returned any repos
    if(repos.length === 0){
        repoContainerEl.textContent = "No repositories found."
        return;
    }
    //clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchterm;
    
    //loop over the repositoriess
    for(var i=0; i<repos.length; i++){
        //format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;
        
        //create a link for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName );

        //create a span element to hold repositry name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        //appent to container
        repoEl.appendChild(titleEl);

        //append container to dom
        repoContainerEl.appendChild(repoEl);

        //create status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        //check if current repo has issues or not
        if(repos[i].open_issues_count > 0){
            statusEl.innerHTML = 
            "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issues(s)";
        } else {
            statusEl.innerHTML = 
            "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        //append to container
        repoEl.appendChild(statusEl);
    }
}

var formSubmitHandler = function(event){
    event.preventDefault();

    //get value from form input
    var username = nameInputEl.value.trim();

    if(username){
        //send the username to be searched
        getUserRepos(username);
        //reset the form input box
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username")
    }
}

var getUserRepos = function(user){
    //format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos"

    //make a request to the url
    fetch(apiUrl).then(function(response){
        //if the HTTP request status cose is in the 2XX's...
        if(response.ok){
            //format the json string into an object
            response.json().then(function(data){
                //then send the repository data and the username to the displayRepos function
                displayrepos(data, user);
            });
        } else {
            alert("Error: GitHub User Not Found");
        }      
    })
    .catch(function(error){
        //notice this '.catch()' getting chained to the end of the '.then()'
        alert("Unable to connect to GitHub");
    });
};

var buttonClickHandler = function(event){
    var language = event.target.getAttribute("data-language");
    
    if(language){
        getFeaturedRepos(language);
        //clear old content
        repoContainerEl.textContent = "";
    }
}

languageButtonsEl.addEventListener("click", buttonClickHandler);

//if the submit button is clicked, run the function
userFormEl.addEventListener("submit", formSubmitHandler);
