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

    // Event handler for Services from navbar
    $("#leaguesAnchor").on("click", function() {
        getleagueSection();
    })

    // Event handler for Services button from Home page section
    $("#leaguesBtn").on("click", function() {
        getleagueSection();
    })

    // Event handler for Home from navbar
    $("#homeAnchor").on("click", function() {
        getHomeSection();
    })

    // Event handler for sitelogo from navbar
    $("#logoAnchor").on("click", function() {
        getHomeSection();
    })
})

/* function is to get the home section DOM content by dynamically populating them 
 * @param: None
 * Calls: None
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
                        .attr("allowfullscreen", "true")))
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
 */
function getLeagues() {
    // Store the JSON data in javaScript objects (Pull categories for the offered Ayurvedic services).  
    $.getJSON("/api/leagues/", function(data) {
            leagues = data;
        })
        .done(function() {
            // upon successful AJAX call perform the below
            // Store leagues in local storage to access for generating league section
            localStorage.setItem("leaguesLocal", leagues);
            loadleagues(leagues);
            // $("#categoryContainer").hide();
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
                    getleagueSection(value.Code);
                    console.log("onclick worked");
                    // Remove the fixed bottom class, as data is loaded and it needs to be responsive now
                    $("#footerDiv").addClass("fixed-bottom");
                    // Identify all previous active items and set their background as "Not selected" and set bg-info for selected one
                    // $("a").removeClass("bg-info");
                    // $(this).addClass("bg-info");
                    // $("#servicesList").empty();
                    // $("#categoryName").text(value.Category);
                    // getServices(value.Value);
                })));
    });
    // Get and Show Top teams under Reader Board
    getRankings(leagues);
}

/* function is to get quote tag from server and populate the value dynamically  
 * @param: None
 * Calls: None
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
 */
function loadQuotes(quotes) {
    let i = 0;
    let maxQuotes = quotes.length;
    // setInterval(function() {
    //     $("#quoteTag").attr("class", "blockquote");
    //     $("#quoteTag").html(quotes[i].quotes);
    //     $("#quoteAuthor").html(quotes[i].author);
    //     i++;
    //     //Reset it to beginning of quotes, if it reaches max
    //     if (i == maxQuotes) {
    //         i = 0;
    //     }
    // }, 80000);
}

/* function is to get Team Rankings from teams data to display readerboard 
 * @param: leagues (Javascript objects) - List of leagues
 * Calls: loadRankingItem()
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
 */
function loadRankingItem(team) {
    $("#rankingTbody").append($("<tr/>")
        .append($("<td/>")
            .html(team.League))
        .append($("<td/>")
            .html(team.TeamName)));
    // $("#rankingUl").append($("<li/>")
    //     .attr("class", "list-inline-item")
    //     .append($("<a/>")
    //         .attr("href", "#")
    //         .attr("class", "non-underline-link")
    //         .append($("<br/>"))
    //         .append($("<span/>")
    //             .attr("class", "text-secondary text-center")
    //             .text(`${team.League} <\n> ${team.TeamName}`))
    //         .on("click", function(e) {
    //             // prevent all default action and do as we direct
    //             e.preventDefault();
    //             console.log("onclick worked");
    //         })));
}

function getleagueSection(leagueCode) {
    let leaguesLocalStorage = localStorage.getItem("leaguesLocal");

    if (leaguesLocalStorage == "") {
        errorMsg = "Failure to get leagues list from local storage, please refresh the page"
        $("#errorMsgId").html(errorMsg);
        $("#errorMsgId").addClass("badInput");
    } else {
        if (leagueCode == undefined) {
            console.log("default");
            // Store the JSON data in javaScript objects (Pull categories for the offered Ayurvedic services).  
            loadleaguesForLeagueSection(leagues, leagueCode);
        } else {
            console.log("selected particular league code")
        }
    }
}

/* function is to load leagues under league selection dropdown 
 * @param leagues (javastring object) - contains list of leagues 
 * @param leagueCode (string) - selected league code from home page
 * calls: getTeams() 
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
                .attr("class", "d-none d-md-inline mr-1")
                .attr("for", "selectLeagueList")
                .html("League Lists"))
            .append($("<select/>")
                .attr("id", "selectLeagueList")
                .attr("class", "d-none d-inline form-control col-md-3")
                .on("change", function(e) {
                    // prevent all default action and do as we direct
                    e.preventDefault();
                    // Remove the fixed bottom class, as data is loaded and it needs to be responsive now
                    $("#footerDiv").removeClass("fixed-bottom");
                    // Clear the team list before populating the data upon selection 
                    $("#teamsList").empty();
                    getTeams($("#selectLeagueList").val());
                })
                //Add default option and view all option
                .append($("<option/>")
                    .val("")
                    .html("Select league from dropdown list"))
                .append($("<option/>")
                    .val("all")
                    .html("View All"))
            ))
    );

    //Run through league and populate the dropdown
    $.each(leagues, function(key, value) {
        $("#selectLeagueList").append($("<option/>")
            .val(value.Code)
            .html(value.Name))
    });

    // Set selection dropdown to the selected league from home section, if chosen
    if (leagueCode == undefined) {


    } else {

    }
}

/* function is to decide and call the appropriate get Teams option  
 * @param: leagueCode (String) - selected league from the dropdown
 * Calls: loadTeams()
 */
function getTeams(leagueCode) {
    switch (leagueCode) {
        case "":
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
 * calls: None
 */
function loadTeams(teams) {
    $("#teamsList").empty();
    table = $("#teamsList");
    createTable(table);
    $.each(teams, function(key, value) {
        $("#teamListTbody").append($("<tr/>")
            .append($("<td/>")
                .html(value.TeamName))
            .append($("<td/>")
                .html(value.TeamGender))
            .append($("<td/>")
                .html(value.League))
            .append($("<td/>")
                .append($("<a/>")
                    .attr("class", "btn-sm btn-info")
                    .attr("href", "#")
                    .text("View Details")
                    .on("click", function(e) {
                        e.preventDefault();
                    })))
            .append($("<td/>")
                .append($("<a/>")
                    .attr("class", "btn-sm btn-info")
                    .attr("href", "#")
                    .text("Info")
                    .on("click", function(e) {
                        e.preventDefault();
                    })))
            .append($("<td/>")
                .append($("<a/>")
                    .attr("class", "btn-sm btn-info")
                    .attr("href", "#")
                    .text("Delete")
                    .on("click", function(e) {
                        e.preventDefault();
                    })))
        )
    })
}

/* function is to create a table for table ID - teamslist
 * @param table (Table reference) - Table with list of teams
 * calls: None
 */
function createTable(table) {
    $("#leagueSection").append($("<div/>")
        .append($("<div/>")
            .attr("class", "col-auto")
            .append($("<table>")
                .attr("class", "table container table-responsive table-striped mt-3 ml-5")
                .attr("id", "teamList")
                .append($("<thead/>")
                    .attr("id", "teamListThead"))
                .append($("<tbody/>")
                    .attr("id", "teamListTbody")))))
}

/* function is to show the respective home sections view upon clicking on Home from the navigation bar 
 * @param: None"
 * Calls: None
 */
function showHome() {
    // Show Home section to hold the logo and brief note
    $("#homeSection").show();
    $("#headerDiv").show();
    $("#home").attr("class", "active");
    // Hide the Services information section
    $("#featureContainer").hide();
    $("#services").attr("class", "inactive");
    // Remove the footer to display at bottom always, as home page has content
    $("#footerDiv").removeClass("fixed-bottom");
}

/* function is to show the respective services information sections view upon clicking on Services from the navigation bar 
 * @param:  None
 * Calls: None
 */
function showServices() {
    // Hide Home section to hold the logo, brief note and enable the view categories button
    $("#homeSection").hide();
    $("#home").attr("class", "inactive");
    $("#headerDiv").hide();

    // Show the view categories section
    $("#services").attr("class", "active");
    $("#categoryContainer").show();
    $("#featureContainer").show();
    $("a").removeClass("bg-info");

    //Add fixed-bottom to show the footer at the bottom during service section launch
    $("#footerDiv").addClass("fixed-bottom");

    // Hide Services information and service card details
    $("#servicesDiv").hide();
    $("#serviceCard").hide();
}


/* function is to list of services under selected category
 * @param category (javastring object) - contains selected category
 * calls: loadServices() 
 */
function getServices(category) {
    //Hides the Service card during category selection
    $("#serviceCard").hide();
    $.getJSON("/api/services/bycategory/" + category, function(data) {
            services = data;
        })
        .done(function() {
            // upon successful AJAX call perform the below
            loadServices(services);
        })
        .fail(function() {
            // upon failure response, send message to user
            errorMsg = "Failure to get all services under selected category, please retry"
            $("#errorMsgId").html(errorMsg);
            $("#errorMsgId").addClass("badInput");
        });
}

/* function is to service details under selected Service  
 * @param services (javastring object) - contains selected Service object
 * calls: None
 */
function loadServices(services) {
    $.each(services, function(key, value) {
            $("#servicesList").append($("<li/>")
                .text(value.ServiceName)
                .attr("class", "list-group-item list-group-item-action border-info")
                .on("click", function(e) {
                    e.preventDefault();
                    let b = $("#servicesList li");
                    // Remove all active items and set active attribute for the selected list item
                    $("#servicesList li").removeClass("active bg-info");
                    $(this).addClass("active bg-info");
                    getService(value.ServiceID);
                    $("#serviceCard").show();
                }))
        })
        // Shows the service card div to show the details of the selected service
    $("#servicesDiv").show();
}

/* function is to get Selected Service details from server by making Ajax call 
 * @param service (javastring object) - contains selected service object
 * calls: loadService()
 */
function getService(service) {
    $.getJSON("/api/services/" + service, function(data) {
            serviceItem = data;
        })
        .done(function() {
            // upon successful AJAX call perform the below
            loadService(serviceItem);
        })
        .fail(function() {
            // upon failure response, send message to user
            errorMsg = "Failure to get service item details under selected service, please retry"
            $("#errorMsgId").html(errorMsg);
            $("#errorMsgId").addClass("badInput");
        });
}

/* function is to update service card from the server returned service object 
 * @param serviceItem (javastring object) - contains selected service object details
 * calls: None
 */
function loadService(serviceItem) {

    //Dynamically create the div and its child for service card & Clear them before populating new item
    $("#serviceCard").empty();
    // Create card div, header, image and body & assign ID for futher reference
    $("#serviceCard")
        .append(($("<div/>")
            .attr("class", "card mb-4 box-shadow cardStyle border-info")
            .append($("<div/>")
                .attr("class", "card-header text-center")
                .attr("id", "cardHead")
                .append($("<h3/>")
                    .attr("id", "serviceName")
                    .text("&nbsp;")))
            .append($("<img/>")
                .attr("class", "card-img-top cardImgStyle text-left")
                .attr("id", "cardImg"))
            .append($("<div/>")
                .attr("class", "card-body")
                .attr("id", "cardBody"))));
    $("#cardBody")
        .append($("<h4/>")
            .attr("id", "servicePrice")
            .attr("class", "card-title pricing-card-title"))
        .append($("<ul/>")
            .attr("class", "list-unstyled mt-3 mb-4")
            .attr("id", "cardUl"))
        .append($("<span/>")
            .attr("class", "heading")
            .text("User Rating"))
        .append($("<p/>")
            .attr("id", "userRating"));

    $("#cardUl").append($("<li/>")
            .attr("id", "serviceDescription")
            .text("&nbsp;"))
        .append($("<li/>")
            .attr("id", "serviceDuration")
            .text("&nbsp;"));

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