/* Script to support single page app for cricket leagues
 * Author: HartCode programmer
 * Date: 08/28/2019
 */
"Use Strict";
/* window onload/ready function to load page with categories and assign event for other service functions. 
 * @param: None 
 * Calls: loadCategories(), showHome() and showServices() 
 */
$(function() {

    let errorMsgIdField = $("#errorMsgId");

    //Show Home as default by setting $ hide/show 
    getHomeSection();
    showHome();

    // Event handler for leagues from navbar
    $("#leaguesAnchor").on("click", function() {
        getleagueSection();
        showLeagues();
    })

    // Event handler for leagues button from Home page section
    $("#leaguesBtn").on("click", function() {
        getleagueSection();
        showLeagues();
    })

    // Event handler for Home from navbar
    $("#homeAnchor").on("click", function() {
        showHome();
        getHomeSection();
    })

    // Event handler for sitelogo from navbar
    $("#logoAnchor").on("click", function() {
        showHome();
        getHomeSection();
    })
})

/* function is to show the respective home sections view upon clicking on Home from the navigation bar 
 * @param: None
 * Calls: None
 * Called by: Window onload
 */
function showHome() {
    $("#home").attr("class", "active");
    $("#leagues").attr("class", "inactive");
    $("#errorMsgId").empty();
}

/* function is to show the respective services information sections view upon clicking on Leagues from the navigation bar 
 * @param:  None
 * Calls: None
 * Called by Window onload
 */
function showLeagues() {
    //Set attribute of home section and leagues section
    $("#home").attr("class", "inactive");
    $("#leagues").attr("class", "active");
    $("#selectLeagueList").addClass("autofocus");
}

/* function is to get the home section DOM content by dynamically populating them 
 * @param: None
 * Calls: getLeagues(), getQuoteTag()
 * Called by: window onload
 */
function getHomeSection() {
    $("#contentDiv").empty();
    $("#contentDiv")
        .attr("class", "container justified-content-center")
        // Home Section
        .append($("<section/>")
            .attr("class", "row")
            .attr("id", "homeSection")
            //Reader Board Div
            .append($("<div/>")
                .attr("id", "readerBoard")
                .attr("class", "col-md-3")
                .append($("<h3/>")
                    .attr("class", "center")
                    .text("Welcome to world's second most followed sport!!"))
                .append($("<p/>")
                    .html("See the hot trend & Top Team from ongoing leagues")
                    .attr("class", "text-align-center fonthandler"))
                .append($("<table/>")
                    .attr("class", "table container table-responsive table-striped")
                    .append($("<thead/>")
                        .append($("<tr/>")
                            .attr("class", "bg-info font-weight-light text-white")
                            .append($("<th/>")
                                .html("League"))
                            .append($("<th/>")
                                .html("Top Team"))))
                    .append($("<tbody/>")
                        .attr("id", "rankingTbody"))
                )
            )
            //League List Div
            .append($("<div/>")
                .attr("class", "col-md-6")
                .attr("id", "leagueListDiv")
                .append($("<h3/>")
                    .attr("class", "font-weight-bold font-italic")
                    .html("List of Ongoing Leagues"))
                .append($("<ul/>")
                    .attr("id", "leagueListUl")
                    .attr("class", "list-unstyled list-inline"))
            )
            // Quotes and video Div
            .append($("<div/>")
                .attr("class", "col-md-3")
                // Video Div
                .append($("<div/>")
                    .attr("class", "row")
                    .append($("<h3/>")
                        .attr("class", "center font-italic")
                        .text("Cricket Quick Intro"))
                    // Embed iframe for cricket intro video and set allow full screen
                    .append($("<iframe/>")
                        .attr("class", "imageWidth")
                        .attr("src", "https://www.youtube.com/embed/Kwu1yIC-ssg")
                        .attr("allow", "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture")
                        .attr("allowfullscreen", "allowfullscreen")))
                //Quotes Div
                .append($("<div/>")
                    .attr("class", "row")
                    .attr("id", "quotesDiv")
                    .append($("<h3/>")
                        .html("Quotes by Great Cricketers"))
                    .append($("<blockquote/>")
                        .attr("class", "font-italic")
                        .append($("<p/>")
                            .attr("id", "quoteTag")
                            // .attr("class", "blockquote")
                        )
                        .append($("<footer>")
                            .attr("class", "text-info")
                            .attr("id", "quoteAuthor"))
                    ))
            )
        );

    // Get the list of leagues from server and populate the list items dynamically
    getLeagues();

    // Get quote tags from server and populate blockquote
    getQuoteTag();
}

/* function is to get league data from server and call loadLeague to dynamically populate the DOM 
 * @param: None
 * Calls: loadleagues()
 * Called by: getHomeSection()
 */
function getLeagues() {
    // Store the JSON data in javaScript objects (Pull categories for the offered Ayurvedic services).  
    $.getJSON("/api/leagues/", function(data) {
            leagues = data;
        })
        .done(function() {
            // upon successful AJAX call perform the below
            // Store leagues in local storage to access for generating league section
            localStorage.setItem("leaguesLocal", JSON.stringify(leagues));
            loadleagues(leagues);
        })
        .fail(function() {
            // upon failure response, send message to user
            errorMsg = "Failure to get leagues list, please refresh the page"
            $("#errorMsgId").html(errorMsg);
            $("#errorMsgId").addClass("badInput");
        });
}

/* function is to get league data from server and call loadLeague to dynamically populate the DOM 
 * @param: leagues (JSON object) - list of leagues retrieved from server
 * Calls: None
 * Called by:getLeagues()
 */
function loadleagues(leagues) {
    //Run through each leagues entry and populate 
    $.each(leagues, function(key, value) {
        $("#leagueListUl").append($("<li/>")
            .attr("class", "list-inline-item")
            .append($("<a/>")
                .attr("href", "#")
                .attr("class", "non-underline-link")
                // Image tag to show the league logo
                .append($("<img/>")
                    .attr("src", value.Img)
                    .attr("alt", value.Code)
                    .attr("class", "hideimage"))
                .append($("<br/>"))
                .append($("<span/>")
                    .attr("class", "text-secondary text-center")
                    .text(value.Name))
                .on("click", function(e) {
                    // prevent all default action and do as we direct
                    e.preventDefault();
                    showLeagues();
                    getleagueSection(value.Code);
                    // Remove the fixed bottom class, as data is loaded and it needs to be responsive now
                    $("#footerDiv").removeClass("fixed-bottom");
                })));
    });
    // Get and Show Top teams under Reader Board
    getRankings(leagues);
}

/* function is to get quote tag from server and populate the value dynamically  
 * @param: None
 * Calls: None
 * Called by: getHomeSection
 */
function getQuoteTag() {
    $.getJSON("/api/quotes/", function(data) {
            quotes = data;
        })
        .done(function() {
            // upon successful AJAX call perform the below
            loadQuotes(quotes);
            // $("#categoryContainer").hide();
        })
        .fail(function() {
            // upon failure response, send message to user
            errorMsg = "Failure to get Quote Tags, please wait for few seconds"
            $("#errorMsgId").html(errorMsg);
            $("#errorMsgId").addClass("badInput");
        });
}

/* function is to load quote tag from JSON every x seconds and populate the blockquote section dynamically  
 * @param: quotes - quote tag json received from server
 * Calls: None
 * Called by: getQuoteTag
 */
function loadQuotes(quotes) {
    let i = 0;
    let maxQuotes = quotes.length;
    //Usage of timer for displaying quote by serving it from server
    // setInterval(function() {
    //     $("#quoteTag").attr("class", "blockquote");
    //     $("#quoteTag").html(quotes[i].quotes);
    //     $("#quoteAuthor").html(quotes[i].author);
    //     i++;
    //     //Reset it to beginning of quotes, if it reaches max
    //     if (i == maxQuotes) {
    //         i = 0;
    //     }
    // }, 10000);
}

/* function is to get Team Rankings from teams data to display readerboard 
 * @param: leagues (Javascript objects) - List of leagues
 * Calls: loadRankingItem()
 * Called by: loadleagues()
 */
function getRankings(leagues) {
    let rankingArray = [];
    $.each(leagues, function(key, value) {
        // Get all teams under league to find out the topmost team based on points
        $.getJSON(`/api/teams/byleague/${value.Code}`, function(data) {
                teams = data;
            })
            .done(function() {
                // upon successful AJAX call perform the below
                // Sort team based on points
                teams.sort(function(sortPoints1, sortPoints2) {
                    return (sortPoints2.TeamPoints - sortPoints1.TeamPoints);
                });
                rankingArray[rankingArray.length] = teams[0];
                // Dynamically populate the ranking table based on the item
                loadRankingItem(teams[0]);
            })
            .fail(function() {
                // upon failure response, send message to user
                errorMsg = "Failure to get data for showing topmost team under league, please refresh the page"
                $("#errorMsgId").html(errorMsg);
                $("#errorMsgId").addClass("badInput");
            });
    });
}

/* function is to get Team Rankings from teams data to display readerboard 
 * @param: team (Javascript object) - Topmost team under particular league
 * Calls: None
 * Called by: getRankings
 */
function loadRankingItem(team) {
    //Ranking table for top team in each league
    $("#rankingTbody").append($("<tr/>")
        .append($("<td/>")
            .html(team.League))
        .append($("<td/>")
            .html(team.TeamName)));
}

/* function is to get league Section for display  
 * @param: leagueCode (string) - league code indicating league option
 * Calls: loadleaguesForLeagueSection()
 * Called by: getRegTeam(), submitRegForm(), loadTeamDetails(), getDelTeam(), 
 * getDelTeam(), window onload, loadleagues()
 */
function getleagueSection(leagueCode) {
    let leaguesLocalStorage = JSON.parse(localStorage.getItem("leaguesLocal"));

    if (leaguesLocalStorage == "") {
        errorMsg = "Failure to get leagues list from local storage, please refresh the page"
        $("#errorMsgId").html(errorMsg);
        $("#errorMsgId").addClass("badInput");
    } else {
        if (leagueCode == undefined) {
            // Store the JSON data in javaScript objects (Pull categories for the offered Ayurvedic services).  
            loadleaguesForLeagueSection(leagues, leagueCode);
        } else {
            // Selected particular league
            loadleaguesForLeagueSection(leagues, leagueCode);
        }
    }
}

/* function is to load leagues under league selection dropdown 
 * @param leagues (javastring object) - contains list of leagues 
 * @param leagueCode (string) - selected league code from home page
 * calls: getTeams(), getAddTeam()
 */
function loadleaguesForLeagueSection(leagues, leagueCode) {
    $("#contentDiv").empty();
    $("#footerDiv").addClass("fixed-bottom");
    $("#contentDiv").append($("<section>")
        .attr("id", "leagueSection")
        // User friendly message for league dropdown
        .append($("<h3/>")
            .html("Select the Leagues from the dropdown list:")
            .attr("class", "font-italic"))
        // League Dropdown Div and DDL
        .append($("<div>")
            .attr("class", "row")
            .append($("<label/>")
                .attr("class", "d-none d-md-inline")
                .attr("for", "selectLeagueList")
                .html("League Lists"))
            .append($("<select/>")
                .attr("id", "selectLeagueList")
                .attr("class", "d-none d-inline form-control col-md-3 ml-2")
                .on("change", function(e) {
                    // prevent all default action and do as we direct
                    e.preventDefault();
                    // Clear all prior error messages
                    $("#errorMsgId").empty();
                    // Remove the fixed bottom class, as data is loaded and it needs to be responsive now
                    $("#footerDiv").removeClass("fixed-bottom");
                    // clear the team table Div before populating data for respective option
                    $("#teamTableDiv").empty();
                    getTeams($("#selectLeagueList").val());
                    // Store in session storage for goback functionality from team details page
                    let leagueSelection = $("#selectLeagueList").val();
                    sessionStorage.setItem("leagueSelSession", leagueSelection);
                })
                //Add default option and view all option
                .append($("<option/>")
                    .val("")
                    .html("Select league from dropdown list"))
            ))
        // table to list the teams under selected league dropdown option
        .append($("<div/>")
            .append($("<div/>")
                .attr("id", "teamTableDiv")
                .attr("class", "col-auto ml-2")))
        // Add team button in league section
        .append($("<div/>")
            .attr("class", "col-md-2")
            .append($("<button/>")
                .attr("id", "regTeamBtn")
                .attr("class", "btn btn-info mt-2")
                .html("Register Team")
                .on("click", function(e) {
                    // prevent all default action and do as we direct
                    e.preventDefault();
                    // Clear the fixed bottom as register page will have data
                    $("#footerDiv").removeClass("fixed-bottom");
                    // Clear all prior error messages
                    $("#errorMsgId").empty();
                    // Usage of cache for retrieving JSON object (requires stringify and parse, as cache can have only string)
                    let leaguesLocalStorage = JSON.parse(localStorage.getItem("leaguesLocal"));
                    // Get Add team section template
                    getRegTeam(leaguesLocalStorage);
                })))
    );

    //Run through league and populate the dropdown
    $.each(leagues, function(key, value) {
        $("#selectLeagueList").append($("<option/>")
            .val(value.Code)
            .html(value.Name))
    });

    //Add viewAll option at the end after populating all dropdown
    $("#selectLeagueList").append($("<option/>")
        .val("all")
        .html("View All"));

    // Set selection dropdown to the selected league from home section, if chosen
    if (leagueCode != undefined) {
        $("#selectLeagueList").val(leagueCode);
        // Remove the footer to display at bottom always, as default selection is chosen from home section 
        $("#footerDiv").removeClass("fixed-bottom");
        getTeams(leagueCode);
    } else {
        $("#selectLeagueList").val("");
    }
}

/* function is to register a team from Leagues section  
 * @param: leagues (javaString object) - populate the league dropdown
 * Calls: SubmitRegForm(), getleagueSection(), getInputDiv()
 * called by: loadleaguesForLeagueSection()
 */
function getRegTeam(leaguesLocalStorage) {
    $("#contentDiv").empty();

    $("#contentDiv")
        .append($("<section/>")
            .attr("id", "regTeamSection")
            .append($("<h2/>")
                .attr("class", "font-italic")
                .html("Fill-in below to Register a Team"))
            .append($("<form/>")
                .attr("id", "newTeamForm")
                .attr("action", "#")
                .attr("target", "_self")
                .attr("method", "GET")
            )
        )
    let inputDiv = getInputDiv("teamname", "Team Name", "Enter Team Name", "text");
    $("#newTeamForm").append(inputDiv);
    $("#newTeamForm").append($("<div/>")
        .attr("class", "row offset-md-3 col-md-8 mt-1 form-inline")
        .append($("<label/>")
            .attr("class", "d-none d-md-inline col-md-3")
            .attr("for", "leaguecode")
            .html("League"))
        .append($("<select/>")
            .attr("id", "leaguecode")
            .attr("name", "leaguecode")
            .attr("class", "d-inline form-control col-md-6")
            .on("change", function(e) {
                // prevent all default action and do as we direct
                e.preventDefault();
                // Clear all prior error messages
                $("#errorMsgId").empty();
                let leagueCode = $("#leaguecode").val();
                setGender(leagueCode, leaguesLocalStorage);
            })
            //Add default option and view all option
            .append($("<option/>")
                .val("")
                .html("Select league from dropdown list"))
        ));
    //Run through league objects from local storage and populate the dropdown for registering team
    $.each(leaguesLocalStorage, function(key, value) {
        $("#leaguecode").append($("<option/>")
            .val(value.Code)
            .html(value.Name))
    });

    //Generate all inputDiv dynamically for registering a team
    inputDiv = getInputDiv("managername", "Manager Name", "Enter Manager Name", "text");
    $("#newTeamForm").append(inputDiv);
    inputDiv = getInputDiv("manageremail", "Manager Email", "Enter Manager Email", "email");
    $("#newTeamForm").append(inputDiv);
    inputDiv = getInputDiv("managerphone", "Manager Phone No", "Enter Manager Phone No", "text");
    $("#newTeamForm").append(inputDiv);
    inputDiv = getInputDiv("maxteammembers", "Maximum No of Team Members", "Enter Maximum No Of Team Members", "number");
    $("#newTeamForm").append(inputDiv);
    inputDiv = getInputDiv("minmemberage", "Minimum Member Age", "Enter Minimum Member Age", "number");
    $("#newTeamForm").append(inputDiv);
    inputDiv = getInputDiv("maxmemberage", "Maximum Member Age", "Enter Maximum Member Age", "number");
    $("#newTeamForm").append(inputDiv);

    //Image file inputDiv (In-progress)
    // $("#newTeamForm").append($("<div/>")
    //     .attr("class", "input-group row offset-md-3 col-md-6 mt-1 form-inline")
    //     .append($("<div/>")
    //         .attr("class", "input-group-prepend")
    //         .append($("<span/>")
    //             .attr("class", "input-group-text")
    //             .attr("id", "inputGroupFileAddon01")))
    //     .append($("<div/>")
    //         .attr("class", "custom-file")
    //         .append($("<input/>")
    //             .attr("type", "file")
    //             .attr("class", "custom-file-input")
    //             .attr("name", "teamimage")
    //             .attr("id", "teamimage")
    //             .attr("aria-describedby", "inputGroupFileAddon01"))
    //         .append($("<label/>")
    //             .attr("class", "custom-file-label")
    //             .attr("for", "inputGroupFile01")
    //             .attr("text", "Choose file"))))

    // Gender selection radio box
    $("#newTeamForm").append($("<div>")
        .attr("class", "row form-check form-check-inline col-md-6 ml-2 mt-1")
        .append($("<div/>")
            .attr("class", "offset-md-6"))
        .append($("<div/>")
            .attr("id", "maleDiv")
            .append($("<input/>")
                .attr("class", "form-check-input ml-4")
                .attr("name", "teamgender")
                .attr("id", "male")
                .val("Male")
                .attr("type", "radio")
                .attr("checked", true))
            .append($("<label/>")
                .attr("class", " form-check-label")
                .attr("for", "male")
                .html("Male")))
        .append($("<div/>")
            .attr("id", "femaleDiv")
            .append($("<input/>")
                .attr("class", "form-check-input ml-4")
                .attr("name", "teamgender")
                .attr("id", "female")
                .val("Female")
                .attr("type", "radio"))
            .append($("<label/>")
                .attr("class", "form-check-label")
                .attr("for", "female")
                .html("Female")))
        .append($("<div/>")
            .attr("id", "anyDiv")
            .append($("<input/>")
                .attr("class", "form-check-input ml-4")
                .attr("name", "teamgender")
                .attr("id", "any")
                .val("Any")
                .attr("type", "radio"))
            .append($("<label/>")
                .attr("class", "form-check-label")
                .attr("for", "any")
                .html("Any"))))

    // Submit the form to server & update the teams data
    $("#newTeamForm").append($("<div/>")
        .attr("class", "row offset-md-4 col-md-8")
        .append($("<div/>")
            .attr("class", "mt-3 col-md-2")
            .append($("<button/>")
                .attr("class", "btn btn-sm btn-block btn-primary btn-info")
                .attr("type", "button")
                .html("Submit")
                .on("click", function(e) {
                    e.preventDefault();
                    submitRegForm($("#leaguecode").val());
                })))
        // button to reset the registration form
        .append($("<div/>")
            .attr("class", "mt-3 col-md-2")
            .append($("<button/>")
                .attr("class", "btn btn-sm btn-block btn-primary btn-danger")
                .attr("type", "reset")
                .html("Reset")
            ))
        // button to go back to league page on cancel 
        .append($("<div/>")
            .attr("class", "mt-3 col-md-2")
            .append($("<button/>")
                .attr("class", "btn btn-sm btn-block btn-primary btn-info")
                .html("Cancel")
                .on("click", function(e) {
                    e.preventDefault();
                    let leagueSelection = sessionStorage.getItem("leagueSelSession");
                    getleagueSection(leagueSelection);
                }))))
}

/* function is to create input tag and div based on passed parm 
 * @param: name (string) - name attribute for input tag  
 * @param: text (string) - html attribute for input tag  
 * @param: placeHolder (string) - placeholder attribute for input tag
 * @param: inputType (string) - input tag type data for input tag
 * Calls: None
 * called by: getRegTeam()
 */
function getInputDiv(name, text, placeHolder, inputType) {
    let inputDiv = $("<div>")
        .attr("class", "row offset-md-3 col-md-8 mt-1 form-inline")
        .append($("<label/>")
            .attr("class", "d-none d-md-inline col-md-3")
            .attr("for", name)
            .html(text))
        .append($("<input/>")
            .attr("class", "d-inline form-control col-md-6")
            .attr("name", name)
            .attr("id", name)
            .attr("placeholder", placeHolder)
            .attr("required", true)
            .attr("type", inputType))
    return inputDiv;
}


/* function is to hide and show the gender option based on the league selection 
 * @param: leagueCode (string) - selected league from registering a team section
 * @param: leaguesLocalStorage(javastring object) - leagues object to match and find the supported gender
 * Calls: None()
 * Called by:
 */
function setGender(leagueCode, leaguesLocalStorage) {
    let leagueGender;

    //Get gender based on matching league & Usage of for to loop through an array of objects
    for (let i = 0; i < leaguesLocalStorage.length; i++) {
        if (leagueCode == leaguesLocalStorage[i].Code) {
            leagueGender = leaguesLocalStorage[i].Gender;
        }
    }

    //Hide or show the respective gender div and set checked parm through usage of switch
    switch (leagueGender) {
        case "Male":
            $("input[name=teamgender]:checked").prop("checked", false);
            $("#male").prop("checked", true);
            $("#maleDiv").show();
            $("#femaleDiv").hide();
            $("#anyDiv").hide();
            break;
        case "Female":
            $("input[name=teamgender]:checked").prop("checked", false);
            $("#female").prop("checked", true);
            $("#femaleDiv").show();
            $("#maleDiv").hide();
            $("#anyDiv").hide();
            break;
        case "Any":
            $("input[name=teamgender]:checked").prop("checked", false);
            $("#any").prop("checked", true);
            $("#anyDiv").show();
            $("#maleDiv").hide();
            $("#femaleDiv").hide();
            break;
            // dropdown is not selected or back to choose dropdown option
        default:
            $("input[name=teamgender]:checked").prop("checked", false);
            $("#male").prop("checked", true);
            $("#anyDiv").show();
            $("#maleDiv").show();
            $("#femaleDiv").show();
            break;
    }
}

/* function is to send the user entered registration form for new Team to server
 * @param: None
 * Calls: getleagueSection()
 */
function submitRegForm(leagueCode) {
    // following did not follow camelCase, as name attribute expected 
    let errorMsg;
    // validate user input before posting to server
    let isDataValid = validateForm();
    if (isDataValid) {
        // AJAX call to send the form data to server upon serialization 
        $.post("/api/teams", $("#newTeamForm").serialize(),
                function(data) {
                    // upon successful addition of team, take back to added league and show the added team along with others in the league
                    errorMsg = "Team has been successfully added";
                    $("#errorMsgId").html(errorMsg);
                    // If team is added from select dropdown list option, then route back to viewall option to view added team
                    if (leagueCode == "") {
                        leagueCode = "all";
                    }
                    getleagueSection(leagueCode);
                })
            .fail(function() {
                errorMsg = "Failure to get server data, please retry"
                $("#errorMsgId").html(errorMsg);
                $("#errorMsgId").addClass("badInput");
            });
        return false;
    }

}

/* function is to build javascript object and call common validate function
 *  and read the error status and build error message appropriately
 * @param: None
 * Calls: validate()
 */
function validateForm() {
    let temp = "";
    let inputData = {
        teamname: "",
        leaguecode: "",
        managername: "",
        managerphone: "",
        manageremail: "",
        maxteammembers: "",
        minmemberage: "",
        maxmemberage: "",
        teamgender: ""
    };
    inputData.teamname = $("#teamname").val();
    inputData.leaguecode = $("#leaguecode").val();
    inputData.managername = $("#managername").val();
    inputData.managerphone = $("#managerphone").val();
    inputData.manageremail = $("#manageremail").val();
    inputData.maxteammembers = $("#maxteammembers").val();
    inputData.minmemberage = $("#minmemberage").val();
    inputData.maxmemberage = $("#maxmemberage").val();
    inputData.teamgender = $("input[name=teamgender]:checked").val();
    // Send input form data and create javascript object
    let resp = validate(inputData);

    if (resp.status == true) {
        // Run through error message array and build message and update the ta
        $.each(resp.errorMsg, function(key, value) {
            temp = temp + "</br>" + value;
        })
        $("#errorMsgId").html(temp);
        $("#errorMsgId").addClass("badInput");
        return false;
    } else {
        return true;
    }
}

/* function is to decide and call the appropriate get Teams option  
 * @param: leagueCode (String) - selected league from the dropdown
 * Calls: getAllTeams() & getTeamsPerLeague()
 * called by: loadleaguesForLeagueSection()
 */
function getTeams(leagueCode) {
    switch (leagueCode) {
        case "":
            //set the footer at the end of the page, as there is no data other than dropdown
            $("#footerDiv").addClass("fixed-bottom");
            errorMsg = "Please choose valid dropdown option from the given list";
            $("#errorMsgId").html(errorMsg);
            $("#errorMsgId").addClass("badInput");
            break;
        case "all":
            getAllTeams();
            break;
        default:
            getTeamsPerLeague(leagueCode);
            break;
    }
}

/* function is to pull the list of all teams from all leagues for view all option
 * @param None 
 * calls: loadTeams()
 * called by: getTeams()
 */
function getAllTeams() {
    // AJAX call to get all Teams from all leagues
    $.getJSON("/api/teams", function(data) {
            teams = data;
        })
        .done(function() {
            // upon successful AJAX call perform the below
            loadTeams(teams);
        })
        .fail(function() {
            // upon failure response, send message to user
            errorMsg = "Failure to get all teams for view all option, please retry"
            $("#errorMsgId").html(errorMsg);
            $("#errorMsgId").addClass("badInput");
        });
}

/* function is to pull the list of teams for selected league from the dropdown 
 * @param leagueCode (string) - contains selected league 
 * calls: loadTeams()
 * called by: getTeams()
 */
function getTeamsPerLeague(leagueCode) {

    //AJAX call to get all teams under a league
    $.getJSON(`/api/teams/byleague/${leagueCode}`, function(data) {
            teams = data;
        })
        .done(function() {
            // upon successful AJAX call perform the below
            loadTeams(teams);
        })
        .fail(function() {
            // upon failure response, send message to user
            errorMsg = "Failure to get all teams under selected league, please retry"
            $("#errorMsgId").html(errorMsg);
            $("#errorMsgId").addClass("badInput");
        });
}

/* function is to create list of team under  details under selected Service  
 * @param teams (javastring object) - contains list of teams received from server through AJAX call  
 * calls: getTeamDetails()
 * called by: getAllTeams(), getTeamsPerLeague() and getTeams()
 */
function loadTeams(teams) {
    //Create the team table with table head and table body
    // table = $("#teamsList");
    createTable();
    createTableHead();
    // Run through the teams under the league to create the table rows under tablebody
    $.each(teams, function(key, value) {
        $("#teamListTbody").append($("<tr/>")
            .append($("<td/>")
                .html(value.TeamName))
            .append($("<td/>")
                .html(value.ManagerName))
            .append($("<td/>")
                .html(value.TeamPoints))
            // create button and wire-in an event to provide more details on the team
            .append($("<td/>")
                .append($("<a/>")
                    .attr("class", "btn")
                    .attr("href", "#")
                    .append($("<i/>")
                        .attr("class", "fa fa-info-circle text-info"))
                    // .text("View Details")
                    .on("click", function(e) {
                        e.preventDefault();
                        // Store in session storage for goback functionality from team details page
                        let leagueSelection = $("#selectLeagueList").val();
                        sessionStorage.setItem("leagueSelSession", leagueSelection);
                        // clear any informational message
                        $("#errorMsgId").empty();
                        getTeamDetail(value.TeamId);
                    })))
            // .append($("<td/>")
            //     .append($("<a/>")
            //         .attr("class", "btn-sm")
            //         .attr("href", "#")
            //         // .text("Info")
            //         .append($("<i/>")
            //             .attr("class", "fa fa-pencil text-info"))
            //         .on("click", function(e) {
            //             e.preventDefault();
            //         })))
            // .append($("<td/>")
            //     .append($("<a/>")
            //         .attr("class", "btn-sm")
            //         .attr("href", "#")
            //         .append($("<i/>")
            //             .attr("class", "fa fa-trash text-danger"))
            //         // .text("Delete")
            //         .on("click", function(e) {
            //             e.preventDefault();
            //         })))
        )
    })
}

/* function is to create a table for table ID - teamslist
 * @param None
 * calls: None
 */
function createTable() {
    $("#teamTableDiv").append($("<table>")
        .attr("class", "table container table-responsive table-striped mt-3 ml-5")
        .attr("id", "teamList")
        .append($("<thead/>")
            .attr("id", "teamListThead"))
        .append($("<tbody/>")
            .attr("id", "teamListTbody")))
}

/* function is to create a tablehead for teamslist table
 * @param none
 * calls: None
 */
function createTableHead() {
    $("#teamListThead")
        .append($("<tr/>")
            .attr("class", "bg-info font-weight-light text-white")
            .append($("<th/>")
                .html("Team Name"))
            .append($("<th/>")
                .html("Manager"))
            .append($("<th/>")
                .html("Points"))
            .append($("<th/>")
                .html("More Info"))
            // Show edit and delete action on team upon showing team details
            // .append($("<th/>")
            //     .html("Edit"))
            // .append($("<th/>")
            //     .html("Delete"))
        )
}

/* function is to get Team details from server for selected team 
 * @param: TeamId (number) - selected TeamId from leagues section
 * Calls: loadTeamDetails()
 */
function getTeamDetail(TeamId) {

    // Pull team details under a teamId
    $.getJSON(`/api/teams/${TeamId}`, function(data) {
            team = data;
        })
        .done(function() {
            // upon successful AJAX call perform the below
            loadTeamDetails(team);
        })
        .fail(function() {
            // upon failure response, send message to user
            errorMsg = "Failure to get data for team details, please retry"
            $("#errorMsgId").html(errorMsg);
            $("#errorMsgId").addClass("badInput");
        });

}

/* function is to generate DOM for received Team details from server 
 * @param: team (javastring object) - team details for selected TeamId
 * Calls: getEditTeam(), getDelTeam()
 * Called by:getTeamDetail
 */
function loadTeamDetails(team) {
    $("#contentDiv").empty();

    $("#contentDiv").attr("class", "container justified-content-center")
        // Team Details Section
        .append($("<section/>")
            .attr("id", "teamSection")
            .append($("<h2/>")
                .attr("class", "text-center font-italic")
                .html(team.TeamName))
            .append($("<div/>")
                .attr("class", "row")
                //bootstrap 4 card to display Team Manager information
                .append($("<div/>")
                    .attr("id", "managerCard")
                    .attr("class", "col-md-4")
                    .append(($("<div/>")
                        .attr("class", "card box-shadow cardStyle border-info")
                        .append($("<div/>")
                            .attr("class", "card-header text-center")
                            .append($("<h3/>")
                                .html("Team Manager")))
                        .append($("<div/>")
                            .attr("class", "card-body text-center")
                            .append($("<ul/>")
                                .attr("class", "list-unstyled mt-3 mb-4")
                                .append($("<li/>")
                                    .html(team.ManagerName))
                                .append($("<li/>")
                                    .html(team.ManagerEmail))
                                .append($("<li/>")
                                    .html(team.ManagerPhone))))))
                )
                //Team logo
                .append($("<div/>")
                    .attr("class", "col-md-3 text-center")
                    .append($("<img/>")
                        .attr("class", "img-responsive")
                        .attr("src", team.TeamLogo)
                        .attr("alt", team.TeamId))
                )
                //bootstrap 4 card to display Team details
                .append($("<div/>")
                    .attr("id", "teamCard")
                    .attr("class", "col-md-5")
                    .append(($("<div/>")
                        .attr("class", "card mb-4 box-shadow cardStyle border-info")
                        .append($("<div/>")
                            .attr("class", "card-header text-center")
                            .append($("<h3/>")
                                .html("Team Details")))
                        .append($("<div/>")
                            .attr("class", "card-body text-center")
                            .append($("<ul/>")
                                .attr("class", "list-unstyled")
                                .append($("<li/>")
                                    .html(`League : ${team.League}`))
                                .append($("<li/>")
                                    .html(`Max Team Members : ${team.MaxTeamMembers}`))
                                .append($("<li/>")
                                    .html(`Minimum Age :${team.MinMemberAge}`))
                                .append($("<li/>")
                                    .html(`Maximum Age :${team.MaxMemberAge}`))
                                .append($("<li/>")
                                    .html(`Team Gender :${team.TeamGender}`))
                                .append($("<li/>")
                                    .html(`Team Points :${team.TeamPoints}`))
                            ))))
                )
            )
            // Button to edit team details
            .append($("<div/>")
                .attr("class", "row justify-content-center")
                .append($("<div/>")
                    .attr("class", "mt-3 col-md-2")
                    .append($("<button/>")
                        .attr("class", "btn btn-sm btn-block btn-primary btn-info")
                        .html("Edit Team")
                        .on("click", function(e) {
                            e.preventDefault();
                            getEditTeam(team.TeamId);
                        })))
                // button to delete a team
                .append($("<div/>")
                    .attr("class", "mt-3 col-md-2")
                    .append($("<button/>")
                        .attr("class", "btn btn-sm btn-block btn-primary btn-danger")
                        .attr("data-toggle", "modal")
                        .attr("data-target", "#unRegisterDiv")
                        .html("Delete Team")
                        .on("click", function(e) {
                            // e.preventDefault();
                            //Get up to date team details from server which would help to mark the record for edit in the future 
                            //to avoid any update from other user
                            getDelTeam(team.TeamId);
                        })
                    ))
                // button to go back to league section 
                .append($("<div/>")
                    .attr("class", "mt-3 col-md-2")
                    .append($("<button/>")
                        .attr("class", "btn btn-sm btn-block btn-primary btn-info")
                        .html("Go Back")
                        .on("click", function(e) {
                            e.preventDefault();
                            //Clear the Informational message
                            $("#errorMsgId").empty();
                            let leagueSelection = sessionStorage.getItem("leagueSelSession");
                            getleagueSection(leagueSelection);
                        })))
                // button to register Team Member 
                .append($("<div/>")
                    .attr("class", "mt-3 col-md-2")
                    .append($("<button/>")
                        .attr("class", "btn btn-sm btn-block btn-primary btn-info")
                        .html("Register Member")
                        .on("click", function(e) {
                            e.preventDefault();
                            //Clear the Informational message
                            $("#errorMsgId").empty();
                            getRegTeamMemb(team);
                        })))
            )

        )
        // Team member div to support responsive design
        .append($("<div/>")
            .append($("<h3/>")
                .html("Members")
                .attr("class", "mt-3 font-italic text-center"))
            .append($("<div/>")
                .attr("id", "teamMemberSection")
                .attr("class", "d-flex justify-content-center")
                .append($("<div/>")
                    .attr("id", "teamMemberDiv"))
            )
        );

    // Load Team member section
    loadTeamMember(team);
}

/* function is to generate DOM for team member for selected team 
 * @param: team (javastring object) - team details for selected TeamId
 * Calls: None
 */
function loadTeamMember(team) {
    createTeamMemberTable();
    createTableMemberHead();
    // Run through the teams under the league to create the table rows under tablebody
    $.each(team.Members, function(key, value) {
        $("#teamMembListTbody").append($("<tr/>")
            .append($("<td/>")
                .html(value.MemberName))
            .append($("<td/>")
                .html(value.Email))
            .append($("<td/>")
                .html(value.Phone))
            // create button and wire-in an event to provide more details on the team
            .append($("<td/>")
                .append($("<a/>")
                    .attr("class", "btn-sm")
                    .attr("href", "#")
                    .append($("<i/>")
                        .attr("class", "fa fa-info-circle text-info"))
                    .on("click", function(e) {
                        e.preventDefault();
                        //clear prior informtional message
                        $("#errorMsgId").empty();
                        getTeamMembDetails(value.MemberId, team);
                    })))
            // Give the option of delete and edit upon showing the member info page
            //override if edit, delete and info on team members tab
            // .append($("<td/>")
            //     .append($("<a/>")
            //         .attr("class", "btn-sm")
            //         .attr("href", "#")
            //         .append($("<i/>")
            //             .attr("class", "fa fa-pencil text-info"))
            //         .on("click", function(e) {
            //             e.preventDefault();
            //             getTeamMembEdit(value.MemberId);
            //         })))
            // .append($("<td/>")
            //     .append($("<a/>")
            //         .attr("class", "btn-sm")
            //         .attr("href", "#")
            //         .append($("<i/>")
            //             .attr("class", "fa fa-trash text-danger"))
            //         // .text("Delete")
            //         .on("click", function(e) {
            //             e.preventDefault();
            //             getTeamMembDelete(value.MemberId);
            //         })))
        )
    })
}

/* function is to create a table for Team Member
 * @param None
 * calls: None
 */
function createTeamMemberTable() {
    $("#teamMemberDiv").append($("<table>")
        .attr("class", "table container table-responsive table-striped mt-3 ml-3 mr-3")
        .attr("id", "teamList")
        .append($("<thead/>")
            .attr("id", "teamMembListThead"))
        .append($("<tbody/>")
            .attr("id", "teamMembListTbody")))
}

/* function is to create a tableHead for Team Member
 * @param None
 * calls: None
 */
function createTableMemberHead() {
    $("#teamMembListThead")
        .append($("<tr/>")
            .attr("class", "bg-info font-weight-light text-white")
            .append($("<th/>")
                .html("Member Name"))
            .append($("<th/>")
                .html("Email"))
            .append($("<th/>")
                .html("Phone"))
            .append($("<th/>")
                //override if design is supported to have all edit , delete and info on team details page
                // .attr("colspan", "3")
                .attr("class", "text-center")
                .html("Actions"))
        )
}

/* function is to get Team details from server for selected team 
 * @param: TeamId (number) - TeamId pulled from edit details section
 * Calls: loadEditTeamDetails()
 * Called by: loadTeamDetails()
 */
function getEditTeam(TeamId) {
    // Pull team details under a teamId
    $.getJSON(`/api/teams/${TeamId}`, function(data) {
            team = data;
        })
        .done(function() {
            // upon successful AJAX call perform the below
            //Populate DOM with values and set attribute accordingly
            loadEditTeamDetails(team);
        })
        .fail(function() {
            // upon failure response, send message to user
            errorMsg = "Failure to get data for team details, please retry"
            $("#errorMsgId").html(errorMsg);
            $("#errorMsgId").addClass("badInput");
        });
}

/* function is to create edit section template and load it with values  
 * @param team - team details of the selected edit by user  
 * calls: None
 * Called By: getEditTeam()
 */
function loadEditTeamDetails(team) {
    //Get league details from local storage to use it to populate dropdown
    //Usage of cache for retrieving JSON object (requires stringify and parse, as cache can have only string)
    let leaguesLocalStorage = JSON.parse(localStorage.getItem("leaguesLocal"));

    //clear the content div before creating team template
    $("#contentDiv").empty();

    $("#contentDiv")
        .append($("<section/>")
            .attr("id", "editTeamSection")
            .append($("<h2/>")
                .attr("class", "font-italic")
                .html("Please find the below team details to make allowed changes"))
            .append($("<form/>")
                .attr("id", "editTeamForm")
                .attr("action", "#")
                .attr("target", "_self")
                .attr("method", "GET")
            )
        )
    let inputDiv = getInputDiv("teamid", "Team Id", "", "text");
    $("#editTeamForm").append(inputDiv);
    inputDiv = getInputDiv("teamname", "Team Name", "Enter Team Name", "text");
    $("#editTeamForm").append(inputDiv);
    $("#editTeamForm").append($("<div/>")
        .attr("class", "row offset-md-3 col-md-8 mt-1 form-inline")
        .append($("<label/>")
            .attr("class", "d-none d-md-inline col-md-3")
            .attr("for", "leaguecode")
            .html("League"))
        .append($("<select/>")
            .attr("id", "leaguecode")
            .attr("name", "leaguecode")
            .attr("class", "d-inline form-control col-md-6")
            //Add default option and view all option
            .append($("<option/>")
                .val("")
                .html("Select league from dropdown list"))
        ));
    //Run through league objects from local storage and populate the dropdown for registering team
    $.each(leaguesLocalStorage, function(key, value) {
        $("#leaguecode").append($("<option/>")
            .val(value.Code)
            .html(value.Name))
    });

    //Generate all inputDiv dynamically for editing a team
    inputDiv = getInputDiv("managername", "Manager Name", "Enter Manager Name", "text");
    $("#editTeamForm").append(inputDiv);
    inputDiv = getInputDiv("manageremail", "Manager Email", "Enter Manager Email", "email");
    $("#editTeamForm").append(inputDiv);
    inputDiv = getInputDiv("managerphone", "Manager Phone No", "Enter Manager Phone No", "text");
    $("#editTeamForm").append(inputDiv);
    inputDiv = getInputDiv("maxteammembers", "Maximum No of Team Members", "Enter Maximum No Of Team Members", "number");
    $("#editTeamForm").append(inputDiv);
    inputDiv = getInputDiv("minmemberage", "Minimum Member Age", "Enter Minimum Member Age", "number");
    $("#editTeamForm").append(inputDiv);
    inputDiv = getInputDiv("maxmemberage", "Maximum Member Age", "Enter Maximum Member Age", "number");
    $("#editTeamForm").append(inputDiv);
    // Gender selection radio box
    $("#editTeamForm").append($("<div>")
        .attr("class", "row form-check form-check-inline col-md-8 ml-2 mt-1")
        .append($("<div/>")
            .attr("class", "offset-md-6"))
        .append($("<div/>")
            .attr("id", "maleDiv")
            .append($("<input/>")
                .attr("class", "form-check-input ml-4")
                .attr("name", "teamgender")
                .attr("id", "male")
                .val("Male")
                .attr("type", "radio"))
            .append($("<label/>")
                .attr("class", " form-check-label")
                .attr("for", "male")
                .html("Male")))
        .append($("<div/>")
            .attr("id", "femaleDiv")
            .append($("<input/>")
                .attr("class", "form-check-input ml-4")
                .attr("name", "teamgender")
                .attr("id", "female")
                .val("Female")
                .attr("type", "radio"))
            .append($("<label/>")
                .attr("class", "form-check-label")
                .attr("for", "female")
                .html("Female")))
        .append($("<div/>")
            .attr("id", "anyDiv")
            .append($("<input/>")
                .attr("class", "form-check-input ml-4")
                .attr("name", "teamgender")
                .attr("id", "any")
                .val("Any")
                .attr("type", "radio"))
            .append($("<label/>")
                .attr("class", "form-check-label")
                .attr("for", "any")
                .html("Any"))))

    // Submit the form to server & update the teams data
    $("#editTeamForm").append($("<div/>")
            .attr("class", "row offset-md-4 col-md-8")
            .append($("<div/>")
                .attr("class", "mt-3 col-md-2")
                .append($("<button/>")
                    .attr("class", "btn btn-sm btn-block btn-primary btn-info")
                    .attr("type", "button")
                    .html("Submit")
                    .on("click", function(e) {
                        e.preventDefault();
                        // clear any informational message
                        $("#errorMsgId").empty();
                        submitEditForm(team.TeamId);
                    })))
            // button to reset the registration form
            .append($("<div/>")
                .attr("class", "mt-3 col-md-2")
                .append($("<button/>")
                    .attr("class", "btn btn-sm btn-block btn-primary btn-danger")
                    .attr("type", "reset")
                    .html("Reset")
                    .on("click", function(e) {
                        e.preventDefault();
                        // clear any informational message
                        $("#errorMsgId").empty();
                        // Populate the details from team received from server during edit details generation
                        loadEditTeamDetails(team, leaguesLocalStorage);
                    })
                ))
            // button to go back to team details section on cancel 
            .append($("<div/>")
                .attr("class", "mt-3 col-md-2")
                .append($("<button/>")
                    .attr("class", "btn btn-sm btn-block btn-primary btn-info")
                    .html("Cancel")
                    .on("click", function(e) {
                        e.preventDefault();
                        // clear any informational message
                        $("#errorMsgId").empty();
                        // Go back and display the team details section
                        getTeamDetail(team.TeamId);
                    }))))
        //load team item values
    loadTeamItem(team, leaguesLocalStorage);
}

/* function is to load team details into created team template for presenting edit section  
 * @param team (javascript object) - team details of the selected edit by user 
 * @param leaguesLocalStorage (javascript object) - locally stored all leagues
 * calls: None
 * Called By: loadEditTeamDetails()
 */
function loadTeamItem(team, leaguesLocalStorage) {
    $("#teamid").val(team.TeamId);
    $("#teamid").parent().hide();
    $("#teamname").val(team.TeamName);
    $("#leaguecode").val(team.League);
    $("#managername").val(team.ManagerName);
    $("#managerphone").val(team.ManagerPhone);
    $("#manageremail").val(team.ManagerEmail);
    $("#maxteammembers").val(team.MaxTeamMembers);
    $("#minmemberage").val(team.MinMemberAge);
    $("#maxmemberage").val(team.MaxMemberAge);
    $("input[name=teamgender]:checked").val(team.TeamGender);

    //Set attribute
    $("#teamid").attr("readonly", true);
    //Fix this
    $("#leaguecode").attr("readonly", true);
    let leagueCode = $("#leaguecode").val();
    setGender(leagueCode, leaguesLocalStorage);
}

/* function is to load team details into created team template for presenting edit section  
 * @param TeamId (number) - teamId of edited team details (used to take back to edit page)  
 * calls: getTeamDetail()
 * Called By: loadEditTeamDetails()
 */
function submitEditForm(TeamId) {
    let errorMsg;
    // validate user input before posting to server
    let isDataValid = validateForm();
    if (isDataValid) {
        $.ajax({
            url: '/api/teams',
            type: "PUT",
            data: $("#editTeamForm").serialize()
                // contentType: 'application/json'
        }).done(function() {
            getTeamDetail(team.TeamId);
        }).fail(function() {
            errorMsg = "Failure to get server data during team edit submission, please retry"
            $("errorMsgId").html(errorMsg);
            $("errorMsgId").addClass("badInput");
        })
    }
}

/* function is to get delete confirmation modal before performing deleting the team operation.  
 * @param TeamId (number) - teamId of team to be deleted
 * calls: getTeamDetail()
 * Called By: loadEditTeamDetails()
 */
function getDelTeam(TeamId) {

    //Clear modal upon each execution
    $("#unRegisterDiv").remove();
    let modalDiv = getModalTemplate("unRegisterDivLabel", "unRegisterDiv", "unRegModalBody", "unRegModalFooter");
    $("#contentDiv").append(modalDiv);

    //Modal event handler assignment
    //Modal event to show during focus
    $('#unRegisterDiv').on('shown.bs.modal', function() {
        $("#unRegisterDiv").modal(focus);
    });

    //Modal event handler during modal closure to show the league page with selected option
    $('#unRegisterDiv').on('hidden.bs.modal', function(e) {
        //"Success" status indicates that team has been deleted and good to shift the focus
        if ($("#errorMsgId").html() == "Success") {
            let leagueSelection = sessionStorage.getItem("leagueSelSession");
            getleagueSection(leagueSelection);
            //Clear the empty and set successful message
            $("#errorMsgId").empty();
            errorMsg = "Team has been successfully deleted";
            $("#errorMsgId").html(errorMsg);
            $("#errorMsgId").removeClass("badInput");
            setTimeout("$('#leagues').focus();", 200);
        }
    });

    //Set title for modal
    $("#unRegisterDivLabel").text("Team UnRegistration");
    //Set modal body content for generated modal template
    $("#unRegModalBody").append($("<p/>")
            .html("Please confirm to delete the team"))
        //button to perform operation
    $("#unRegModalFooter")
        //cancel button will take back to details page through modal setup
        .append($("<button/>")
            .attr("class", "btn btn-secondary")
            .attr("data-dismiss", "modal")
            .html("Cancel"))
        //confirm button to submit the delete team to server
        .append($("<button/>")
            .attr("class", "btn btn-primary")
            .attr("data-dismiss", "modal")
            .html("Confirm")
            .on("click", function(e) {
                e.preventDefault();
                subDelTeam(TeamId);
            }))
}

/* function is to generate the modal template.  
 * @param label (string) - set as modal label
 * @param id (string) - set as modal id
 * @param modalBodyId (string) - set as modal-body id for further adding content 
 * @param modalFooterId (string) - set as modal-footer id for further adding content 
 * calls: None
 * Called By: getDelTeam()
 */
function getModalTemplate(label, id, modalBodyId, modalFooterId) {

    let modalDiv = $("<div/>")
        .attr("class", "modal fade modal-lg")
        .attr("tabindex", "-1")
        .attr("role", "dialog")
        .attr("aria-labelledby", label)
        .attr("id", id)
        .attr("aria-hidden", true)
        .append($("<div/>")
            .attr("class", "modal-dialog modalSize")
            .attr("role", "document")
            .append($("<div/>")
                .attr("class", "modal-content")
                .append($("<div/>")
                    .attr("class", "modal-header")
                    .append($("<h5/>")
                        .attr("id", label)
                        .attr("class", "modal-title"))
                    .append($("<button/>")
                        .attr("class", "close")
                        .attr("data-dismiss", "modal")
                        .attr("aria-label", "close")
                        .append($("<span/>")
                            .attr("aria-hidden", true)
                            .html("&times;"))))
                .append($("<div/>")
                    .attr("class", "modal-body")
                    .attr("id", modalBodyId))
                .append($("<div/>")
                    .attr("class", "modal-footer")
                    .attr("id", modalFooterId))));
    return modalDiv;
}

/* function is to submit teamId to be deleted to server and go back to leagues section
 * @param TeamId (Number) - contains selected TeamId to delete team
 * calls: None
 * called by: getDelTeam()
 */
function subDelTeam(TeamId) {
    $.ajax({
        url: `/api/teams/${TeamId}`,
        type: "DELETE",
        // data: $("#editTeamForm").serialize()
        // contentType: 'application/json'
    }).done(function() {
        //Set informational delete status to change the focus to league page upon modal closure
        $("#errorMsgId").empty();
        $("#errorMsgId").html("Success");
    }).fail(function() {
        errorMsg = "Failure to get server data during team edit submission, please retry"
        $("errorMsgId").html(errorMsg);
        $("errorMsgId").addClass("badInput");
    })
}

/* function is to get Register team member section 
 * @param MemberId (Number) - contains selected TeamId to delete team
 * @param team (javastring object) - contains team with member details to be displayed 
 * calls:  
 * called by:
 */
function getRegTeamMemb(team) {
    $("#contentDiv").empty();
    $("#contentDiv")
        .append($("<section/>")
            .attr("id", "membSection")
            .append($("<h2/>")
                .attr("class", "font-italic")
                .html("Fill-in below to Register a Member"))
            .append($("<form/>")
                .attr("id", "newMembForm")
                .attr("action", "#")
                .attr("target", "_self")
                .attr("method", "GET")
            )
        )
        //display the team name to user as reference during addition of member
    let inputDiv = getInputDiv("teamname", "Team Name", "", "text");
    $("#newMembForm").append(inputDiv);
    $("#teamname").val(team.TeamName);
    $("#teamname").attr("readonly", true);
    //Generate all inputDiv dynamically for registering a team
    inputDiv = getInputDiv("membername", "Member Name", "Enter Member Name", "text");
    $("#newMembForm").append(inputDiv);
    inputDiv = getInputDiv("email", "Member Email", "Enter Member Email", "email");
    $("#newMembForm").append(inputDiv);
    inputDiv = getInputDiv("phone", "Member Phone No", "Enter Member Phone No", "text");
    $("#newMembForm").append(inputDiv);
    inputDiv = getInputDiv("contactname", "Contact Name", "Enter Contact Name", "text");
    $("#newMembForm").append(inputDiv);
    inputDiv = getInputDiv("age", "Age", "Enter Member Age", "number");
    $("#newMembForm").append(inputDiv);
    // Gender selection radio box
    $("#newMembForm").append($("<div>")
        .attr("class", "row form-check form-check-inline col-md-8 ml-2 mt-1")
        .append($("<div/>")
            .attr("class", "offset-md-6"))
        .append($("<div/>")
            .attr("id", "maleDiv")
            .append($("<input/>")
                .attr("class", "form-check-input ml-4")
                .attr("name", "gender")
                .attr("id", "male")
                .val("Male")
                .attr("type", "radio")
                .attr("checked", true))
            .append($("<label/>")
                .attr("class", " form-check-label")
                .attr("for", "male")
                .html("Male")))
        .append($("<div/>")
            .attr("id", "femaleDiv")
            .append($("<input/>")
                .attr("class", "form-check-input ml-4")
                .attr("name", "gender")
                .attr("id", "female")
                .val("Female")
                .attr("type", "radio"))
            .append($("<label/>")
                .attr("class", "form-check-label")
                .attr("for", "female")
                .html("Female"))))

    // Submit the form to server & update the member
    $("#newMembForm").append($("<div/>")
        .attr("class", "row offset-md-4 col-md-8")
        .append($("<div/>")
            .attr("class", "mt-3 col-md-2")
            .append($("<button/>")
                .attr("class", "btn btn-sm btn-block btn-primary btn-info")
                .attr("type", "button")
                .html("Submit")
                .on("click", function(e) {
                    e.preventDefault();
                    // clear any informational message
                    $("#errorMsgId").empty();
                    submitRegMembForm(team);
                })))
        // button to reset the member registration form
        .append($("<div/>")
            .attr("class", "mt-3 col-md-2")
            .append($("<button/>")
                .attr("class", "btn btn-sm btn-block btn-primary btn-danger")
                .attr("type", "reset")
                .html("Reset")
                .on("click", function(e) {
                    e.preventDefault();
                    // clear any informational message
                    $("#errorMsgId").empty();
                    resetRegMembForm();
                })
            ))
        // button to go back to team details page on cancel 
        .append($("<div/>")
            .attr("class", "mt-3 col-md-2")
            .append($("<button/>")
                .attr("class", "btn btn-sm btn-block btn-primary btn-info")
                .html("Cancel")
                .on("click", function(e) {
                    e.preventDefault();
                    // clear any informational message
                    $("#errorMsgId").empty();
                    getTeamDetail(team.TeamId);
                }))))
}

function submitRegMembForm(team) {
    // Above did not follow camelCase, as keeping it in sync with server naming standard
    let errorMsg;
    // validate user input before posting to server
    let isDataValid = validateMembForm(team);
    if (isDataValid) {
        // AJAX call to send the form data to server upon serialization 
        $.post(`/api/teams/${team.TeamId}/members`, $("#newMembForm").serialize(),
                function(data) {
                    // upon successful addition of team, take back to added league and show the added team along with others in the league
                    errorMsg = "Member has been successfully added";
                    $("#errorMsgId").html(errorMsg);
                    $("#errorMsgId").removeClass("badInput");
                    getTeamDetail(team.TeamId);
                })
            .fail(function() {
                errorMsg = "Failure to add member, please retry"
                $("#errorMsgId").html(errorMsg);
                $("#errorMsgId").addClass("badInput");
            });
        return false;
    }
}

/* function is to build javascript object and call common validate Member function
 *  and read the error status and build error message appropriately
 * @param: None
 * Calls: validateMemb()
 */
function validateMembForm(team) {
    let temp = "";
    let inputData = {
        membername: "",
        email: "",
        contactname: "",
        age: "",
        gender: "",
        phone: ""
    };
    inputData.membername = $("#membername").val();
    inputData.email = $("#email").val();
    inputData.contactname = $("#contactname").val();
    inputData.age = $("#age").val();
    inputData.phone = $("#phone").val();
    inputData.gender = $("input[name=gender]:checked").val();
    // Send input form data and create javascript object
    let resp = validateMemb(inputData, team);

    if (resp.status == true) {
        // Run through error message array and build message and update the ta
        $.each(resp.errorMsg, function(key, value) {
            temp = temp + "</br>" + value;
        })
        $("#errorMsgId").html(temp);
        $("#errorMsgId").addClass("badInput");
        return false;
    } else {
        return true;
    }
}

/* function is to reset register member without resetting the team name
 * @param: None
 * calls: None
 * called by: getRegTeamMemb()
 */

function resetRegMembForm() {
    $("#membername").val("");
    $("#email").val("");
    $("#contactname").val("");
    $("#age").val("");
    $("#phone").val("");
    //Reset Gender Status
    $("input[name=gender]:checked").val("Male");
    $("input[name=teamgender]:checked").prop("checked", false);
    $("#male").prop("checked", true);
}

/* function is to populate team member profile template and set event  
 * handlers for various action such as edit, delete, cancel, reset and Goback
 * @param MemberId (Number) - User selected team member's ID 
 * @param team (Number) - User selected member's team details  
 * calls: getEditMemb(), delMemb(), getTeamMembDetails(), loadMemb(), getTeamDetail() 
 * Called By: getTeamMembDetails()
 */
function getTeamMembDetails(MemberId, team) {

    $("#contentDiv").empty();
    $("#contentDiv")
        .append($("<section/>")
            .attr("id", "membSection")
            .append($("<h2/>")
                .attr("class", "font-italic")
                .html("Member Profile"))
            .append($("<form/>")
                .attr("id", "editMembForm")
                .attr("action", "#")
                .attr("target", "_self")
                .attr("method", "GET")
            )
        )
        //display the team name to user as reference during addition of member
    let inputDiv = getInputDiv("teamname", "Team Name", "", "text");
    $("#editMembForm").append(inputDiv);
    $("#teamname").val(team.TeamName);
    $("#teamname").attr("readonly", true);
    //Generate all inputDiv dynamically for registering a team
    inputDiv = getInputDiv("memberid", "Member Id", "", "Number");
    $("#editMembForm").append(inputDiv);
    $("#memberid").attr("readonly", true);
    inputDiv = getInputDiv("membername", "Member Name", "Enter Member Name", "text");
    $("#editMembForm").append(inputDiv);
    inputDiv = getInputDiv("email", "Member Email", "Enter Member Email", "email");
    $("#editMembForm").append(inputDiv);
    inputDiv = getInputDiv("phone", "Member Phone No", "Enter Member Phone No", "text");
    $("#editMembForm").append(inputDiv);
    inputDiv = getInputDiv("contactname", "Contact Name", "Enter Contact Name", "text");
    $("#editMembForm").append(inputDiv);
    inputDiv = getInputDiv("age", "Age", "Enter Member Age", "number");
    $("#editMembForm").append(inputDiv);
    // Gender selection radio box
    $("#editMembForm").append($("<div>")
            .attr("class", "row form-check form-check-inline col-md-8 ml-2 mt-1")
            .append($("<div/>")
                .attr("class", "offset-md-6"))
            .append($("<div/>")
                .attr("id", "maleDiv")
                .append($("<input/>")
                    .attr("class", "form-check-input ml-4")
                    .attr("name", "gender")
                    .attr("id", "male")
                    .val("Male")
                    .attr("type", "radio")
                    .attr("checked", true))
                .append($("<label/>")
                    .attr("class", " form-check-label")
                    .attr("for", "male")
                    .html("Male")))
            .append($("<div/>")
                .attr("id", "femaleDiv")
                .append($("<input/>")
                    .attr("class", "form-check-input ml-4")
                    .attr("name", "gender")
                    .attr("id", "female")
                    .val("Female")
                    .attr("type", "radio"))
                .append($("<label/>")
                    .attr("class", "form-check-label")
                    .attr("for", "female")
                    .html("Female"))))
        // Button for action on members 
    $("#editMembForm").append($("<div/>")
        .attr("class", "row offset-md-4 col-md-8")
        .attr("id", "dispMembDiv")
        .append($("<div/>")
            .attr("class", "mt-3 col-md-2")
            .append($("<button/>")
                .attr("class", "btn btn-sm btn-block btn-primary btn-info")
                .attr("type", "button")
                .html("Edit")
                .on("click", function(e) {
                    e.preventDefault();
                    //Clear prior informational message
                    $("#errorMsgId").empty();
                    getEditMemb(MemberId, team);
                })))
        // button to reset the member registration form
        .append($("<div/>")
            .attr("class", "mt-3 col-md-2")
            .append($("<button/>")
                .attr("class", "btn btn-sm btn-block btn-primary btn-danger")
                .attr("data-toggle", "modal")
                .attr("data-target", "#unRegisterMemberDiv")
                .attr("type", "button")
                .html("Delete")
                .on("click", function(e) {
                    e.preventDefault();
                    //Clear prior informational message
                    $("#errorMsgId").empty();
                    delMemb(MemberId, team);
                })
            ))
        // button to go back to team details page on cancel 
        .append($("<div/>")
            .attr("class", "mt-3 col-md-2")
            .append($("<button/>")
                .attr("class", "btn btn-sm btn-block btn-primary btn-info")
                .html("Go back")
                .on("click", function(e) {
                    e.preventDefault();
                    // clear any informational message
                    $("#errorMsgId").empty();
                    getTeamDetail(team.TeamId);
                }))))

    $("#editMembForm").append($("<div/>")
            .attr("class", "row offset-md-4 col-md-8")
            .attr("id", "editMembDiv")
            .append($("<div/>")
                .attr("class", "mt-3 col-md-2")
                .append($("<button/>")
                    .attr("class", "btn btn-sm btn-block btn-primary btn-info")
                    .attr("type", "button")
                    .html("Save")
                    .on("click", function(e) {
                        //Clear prior informational message
                        $("#errorMsgId").empty();
                        e.preventDefault();
                        subEditMembForm(MemberId, team);
                    })))
            // button to reset the member registration form
            .append($("<div/>")
                .attr("class", "mt-3 col-md-2")
                .append($("<button/>")
                    .attr("class", "btn btn-sm btn-block btn-primary btn-danger")
                    .attr("type", "button")
                    .html("Reset")
                    .on("click", function(e) {
                        //Clear prior informational message
                        $("#errorMsgId").empty();
                        e.preventDefault();
                        loadMemb(member);
                    })
                ))
            // button to go back to team details page on cancel 
            .append($("<div/>")
                .attr("class", "mt-3 col-md-2")
                .append($("<button/>")
                    .attr("class", "btn btn-sm btn-block btn-primary btn-info")
                    .html("Cancel")
                    .on("click", function(e) {
                        e.preventDefault();
                        // clear any informational message
                        $("#errorMsgId").empty();
                        getTeamMembDetails(MemberId, team);
                    }))))
        //Get member details from server to populate values for above team member template
    getMember(MemberId, team.TeamId);
}

/* function is to get member details from server based on teamid and memberid from team details section
 * @param MemberId (Number) - User selected team member's ID 
 * @param TeamId (Number) - Team ID of user selected member 
 * calls: None
 * Called By: getTeamMembDetails()
 */
function getMember(MemberId, TeamId) {
    // Pull team details under a teamId
    $.getJSON(`/api/teams/${TeamId}/members/${MemberId}`, function(data) {
            member = data;
        })
        .done(function() {
            // upon successful AJAX call perform the below
            //Populate DOM with values and set attribute accordingly
            loadMemb(member);
            setDispMembAttr();
        })
        .fail(function() {
            // upon failure response, send message to user
            errorMsg = "Failure to get data for Member details, please retry"
            $("#errorMsgId").html(errorMsg);
            $("#errorMsgId").addClass("badInput");
        });
}

/* function is to populate the member details for edit/display and reset action from member profile section  
 * @param member (javastring object) - Contains the member selected by User
 * calls: None
 * Called By: getTeamMembDetails()
 */
function loadMemb(member) {
    $("#memberid").val(member.MemberId);
    $("#memberid").parent().hide();
    $("#membername").val(member.MemberName);
    $("#email").val(member.Email);
    $("#contactname").val(member.ContactName);
    $("#age").val(member.Age);
    $("#phone").val(member.Phone);
    $("input[name=gender]:checked").val(member.Gender);
}

/* function is to set attributes for display team member section  
 * @param None 
 * calls: None
 * Called By: getMember()
 */
function setDispMembAttr() {
    //Protect the member details during display
    $("#membername").attr("readonly", true);
    $("#email").attr("readonly", true);
    $("#contactname").attr("readonly", true);
    $("#age").attr("readonly", true);
    $("#phone").attr("readonly", true);

    //Show and Hide the gender as per selected team gender value (Not allowed to edit)
    if ($("input[name=gender]:checked").val() == "Male") {
        $("#femaleDiv").hide();
        $("#maleDiv").show();
    } else {
        $("#femaleDiv").show();
        $("#maleDiv").hide();
    }
    $("#dispMembDiv").show();
    $("#editMembDiv").hide();

}

/* function is to show edit team member fields and set attributes for them 
 * @param None 
 * calls: None
 * Called By: getTeamMembDetails()
 */
function getEditMemb(MemberId, team) {
    setEditMembAttr();
    $("#editMembDiv").show();
    $("#dispMembDiv").hide();
}

/* function is to set attributes for Edit member section  
 * @param None 
 * calls: None
 * Called By: getEditMemb()
 */
function setEditMembAttr() {
    $("#membername").attr("readonly", false);
    $("#email").attr("readonly", false);
    $("#contactname").attr("readonly", false);
    $("#age").attr("readonly", false);
    $("#phone").attr("readonly", false);
}

/* function is to submit changed member details and bring back to member details section
 * @param MemberId (number) - memberID of edited member details  
 * @param team (javastring object) - populate the team details of member in the member details page
 * calls: getTeamMembDetails()
 * Called By: getTeamMembDetails()
 */
function subEditMembForm(MemberId, team) {
    let errorMsg;
    // validate user input before posting to server
    let isDataValid = validateMembForm(team);
    if (isDataValid) {
        $.ajax({
            url: `/api/teams/${team.TeamId}/members`,
            type: "PUT",
            data: $("#editMembForm").serialize()
        }).done(function() {
            // clear any informational message
            $("#errorMsgId").empty();
            errorMsg = "Member has been updated";
            $("#errorMsgId").removeClass("badInput");
            getTeamMembDetails(MemberId, team);
        }).fail(function() {
            errorMsg = "Failure to submit changed member data, please retry"
            $("#errorMsgId").html(errorMsg);
            $("#errorMsgId").addClass("badInput");
        })
    }
}

/* function is to delete team member 
 * @param MemberId (number) - memberID of edited member details  
 * @param team (javastring object) - populate the team details of member in the member details page
 * calls: subDelMemb()
 * Called By: getTeamMembDetails()
 */
function delMemb(MemberId, team) {

    //Initialize modal before populating new one
    $("#unRegisterMemberDiv").remove();
    let modalDiv = getModalTemplate("unRegisterMemberDivLabel", "unRegisterMemberDiv", "unRegMemberModalBody", "unRegMemberModalFooter");
    $("#contentDiv").append(modalDiv);

    //Modal event handler assignments
    //Modal event to show during focus
    $('#unRegisterMemberDiv').on('shown.bs.modal', function() {
        $("#unRegisterMemberDiv").modal(focus);
    });

    //Modal event handler during modal closure to show the league page with selected option
    $('#unRegisterMemberDiv').on('hidden.bs.modal', function(e) {
        //"Success" status indicates that team has been deleted and good to shift the focus
        if ($("#errorMsgId").html() == "Success") {
            getTeamDetail(team.TeamId);
            errorMsg = "Member has been successfully deleted";
            $("#errorMsgId").html(errorMsg);
            $("#errorMsgId").removeClass("badInput");
            setTimeout("$('#contentDiv').focus();", 200);
        }
    });

    //Set title for modal
    $("#unRegisterMemberDivLabel").text("Team Member UnRegistration");
    //Set modal body content for generated modal template
    $("#unRegMemberModalBody").append($("<p/>")
            .html("Delete the Member"))
        //button to perform operation
    $("#unRegMemberModalFooter")
        //cancel button will take back to details page through modal setup
        .append($("<button/>")
            .attr("class", "btn btn-secondary")
            .attr("data-dismiss", "modal")
            .html("Cancel"))
        //confirm button to submit the delete team to server
        .append($("<button/>")
            .attr("class", "btn btn-primary btn-danger")
            .attr("data-dismiss", "modal")
            .html("Confirm")
            .on("click", function(e) {
                e.preventDefault();
                subDelMemb(MemberId, team);
            }))
}

/* function is to delete team member by sending data to server and set information message
 * @param MemberId (number) - memberID of edited member details  
 * @param team (javastring object) - populate the team details of member in the member details page
 * calls: getTeamDetail()
 * Called By: delMemb()
 */
function subDelMemb(MemberId, team) {
    $.ajax({
        url: `/api/teams/${team.TeamId}/members/${MemberId}`,
        type: "DELETE",
        // contentType: 'application/json'
    }).done(function() {
        //Clear prior informational message and set Success status to shift focus
        $("#errorMsgId").empty();
        $("#errorMsgId").html("Success");
    }).fail(function() {
        errorMsg = "Failure to delete team member due to issue, please retry"
        $("#errorMsgId").html(errorMsg);
        $("#errorMsgId").addClass("badInput");
    })
}

///////////////////////////////////////////////////

/* function is to update service card from the server returned service object 
 * @param serviceItem (javastring object) - contains selected service object details
 * calls: None
 */
/*
    //first 3 characters of serviceID will match the image name to populate the images
    let imgName = serviceItem.ServiceID.substr(0, 3) + ".jpg";
    $("#cardImg").attr("src", "images/" + imgName);
    //service ID has been set as alt text for any future enhancments
    $("#cardImg").attr("alt", serviceItem.ServiceID);
    $("#cardImg").attr("class", "hideimage");
    //Populate the below details for user information
    $("#serviceName").html(serviceItem.ServiceName);
    $("#serviceDescription").html(serviceItem.Description);
    $("#servicePrice").html("$" + serviceItem.Price);
    $("#serviceDuration").html(serviceItem.Minutes + "\t" + "Mins");

    //Set user rating based on 1st number of price. Will be enhanced to get user input and update database.
    let userRatingNum = Number(serviceItem.Price.substr(0, 1));
    let userRating = 0;
    // clear the user rating upon each service item selection
    $("#userRating").empty();
    for (i = 0; i <= userRatingNum; i++) {
        $("#userRating").append($("<span/>")
            .attr("class", "fa fa-star text-warning checked"));
        userRating = i + 1;
        if (i >= 4) {
            break;
        }
    }
    while (userRating < 5) {
        $("#userRating").append($("<span/>")
            .attr("class", "fa fa-star"));
        userRating++;
    }
    //Show the service card upon successful loading of service info
    $("#serviceCard").show();
}
*/