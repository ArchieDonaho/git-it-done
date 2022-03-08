var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

var getRepoName = function(){
    //get the query parameter
    var queryString = document.location.search;
    //obtain the end of the string
    var repoName = queryString.split("=")[1];

    //display the repo name in header if the value exist
    if(repoName){
        repoNameEl.textContent = repoName;
        //display the repo issues
        getReopIssues(repoName);
    } else {
        document.location.replace("./index.html");
    }
};

var getReopIssues = function(repo){
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    fetch(apiUrl).then(function(response){
        //request was successful (request status 2XX)
        if(response.ok){
            response.json().then(function(data){
                //pass response data to dom function
                displayIssues(data);

                //check if api has a link indicating there are more than 1 page of info
                if(response.headers.get("Link")){
                    displayWarning(repo);
                }
            });
        } else {
            document.location.replace("./index.html");
        }
    });
}

//after a successful http request, display the issues
var displayIssues = function(issues){
    if(issues.length === 0){
        issueContainerEl.textContent = "This repo has no open issues!"
        return;
    }
    for(var i=0; i<issues.length; i++){
        //create link element to take users to the issue on GitHub
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        //create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        //append to container
        issueEl.appendChild(titleEl);

        //create a type element
        var typeEl = document.createElement("span");

        //check if issues is an actual issue or a pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
          } else {
            typeEl.textContent = "(Issue)";
        }
        issueContainerEl.appendChild(issueEl);
            
        //append to container
        issueEl.appendChild(typeEl);
    };
};

var displayWarning = function(repo){
    //add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit: "

    var linkEl = document.createElement("a");
    linkEl.textContent = "See More Issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    //append to warning container
    limitWarningEl.appendChild(linkEl);
};

getRepoName();

