/* Script to validate the team form, team member form and builds error status and error message upon 
 * validation
 * Author: HartCode programmer
 * Date: 09/02/2019
 */
"Use Strict";

/*Function is to validate the team member form before submitting to server
 * @param inputData (javastring object) - contains the member data form
 * calls: None
 * called by:validateMembForm
 */
function validateMemb(inputData, team) {
    let resp = {
        status: "",
        errorMsg: []
    };
    resp.status = false;
    // validate Member 
    // trim() - takes off trailing and leading spaces

    if (inputData.membername.trim() == "") {
        resp.errorMsg[resp.errorMsg.length] = "Please enter Member Name";
    }

    if (inputData.contactname.trim() == "") {
        resp.errorMsg[resp.errorMsg.length] = "Please enter Contact Name";
    }

    //format ddd-ddd-dddd
    let phoneReg = /^\d{3}\-\d{3}\-\d{4}$/;
    if (phoneReg.test(inputData.phone) == false) {
        resp.errorMsg[resp.errorMsg.length] = "Phone number must be XXX-XXX-XXXX format";
    }
    // email format validation
    if ((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(inputData.email)) == false) {
        resp.errorMsg[resp.errorMsg.length] = "Please enter valid email";
    }

    //Gender validation
    if (inputData.gender != undefined) {
        if ((inputData.gender.trim() == "") || (inputData.gender != team.TeamGender)) {
            if (team.TeamGender != "Any") {
                resp.errorMsg[resp.errorMsg.length] = `Allowed Team Gender is ${team.TeamGender} `;
            }
        }
    } else {
        resp.errorMsg[resp.errorMsg.length] = "Select Gender";
    }

    // Reg expression to validate for 2 digits and business rule for min member age 
    let memReg = /^\d{2}$/;
    if ((memReg.test(inputData.age) == false) || (inputData.age < team.MinMemberAge)) {
        resp.errorMsg[resp.errorMsg.length] = `Entered age is less than team age, please enter age equal or older than ${team.MinMemberAge}`;
    }

    if ((memReg.test(inputData.age) == false) || (inputData.age > team.MaxMemberAge)) {
        resp.errorMsg[resp.errorMsg.length] = `Entered age is older than team age, please enter age equal or less than ${team.MaxMemberAge}`;
    }

    if (resp.errorMsg.length > 0) {
        resp.status = true;
    }
    return resp;
}

/*Function is to validate the team form before submitting to server
 * @param inputData (javastring object) - contains the team data form
 * calls: None
 * called by:validateForm
 */
function validate(inputData, team) {
    let resp = {
        status: "",
        errorMsg: []
    };
    resp.status = false;
    // validate team 
    // trim() - takes off trailing and leading spaces
    if (inputData.teamname.trim() == "") {
        resp.errorMsg[resp.errorMsg.length] = "Please enter Team Name";
    }
    if (inputData.leaguecode.trim() == "") {
        resp.errorMsg[resp.errorMsg.length] = "Please Select League";
    }
    if (inputData.managername.trim() == "") {
        resp.errorMsg[resp.errorMsg.length] = "Please enter Manager Name";
    }

    //format ddd-ddd-dddd
    let phoneReg = /^\d{3}\-\d{3}\-\d{4}$/;
    if (phoneReg.test(inputData.managerphone) == false) {
        resp.errorMsg[resp.errorMsg.length] = "Phone number must be XXX-XXX-XXXX format";
    }
    // email format validation
    if ((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(inputData.manageremail)) == false) {
        resp.errorMsg[resp.errorMsg.length] = "Please enter valid email";
    }

    //Gender validation
    if (inputData.teamgender.trim() == "") {
        resp.errorMsg[resp.errorMsg.length] = "Please select Team Gender";
    }

    // Reg expression to validate for 2 digits and business rule for max team members
    let numReg = /^\d{2}$/;
    if ((numReg.test(inputData.maxteammembers) == false) || (inputData.maxteammembers > 15) ||
        (inputData.maxteammembers < 11)) {
        resp.errorMsg[resp.errorMsg.length] = "Valid Team members are from 11 through 15";
    }
    // Reg expression to validate for 2 digits and business rule for min member age 
    let memReg = /^\d{2}$/;
    if ((memReg.test(inputData.minmemberage) == false) || (inputData.minmemberage < 17)) {
        resp.errorMsg[resp.errorMsg.length] = "Minimum allowed age is 17 or older and less than 40";
    }
    // Reg expression to validate for 2 digits and business rule for max member age 
    if ((memReg.test(inputData.maxmemberage) == false) || (inputData.minmemberage > 40)) {
        resp.errorMsg[resp.errorMsg.length] = "Maximum allowed age is not older than 40";
    }

    //Team image validation
    if (inputData.teamlogo.trim() == "") {
        resp.errorMsg[resp.errorMsg.length] = "Please select Team Logo";
    }

    //Team age validation against existing member
    if (team != undefined) {
        if (team.Members.length > 0) {
            let minAge = getMinAgeOfMember(team);
            let maxAge = getMaxAgeOfMember(team);

            if (Number(inputData.minmemberage) > minAge) {
                resp.errorMsg[resp.errorMsg.length] = `Age limit is lower than already enrolled minimum member ${minAge}`;
            }
            if (Number(inputData.maxmemberage) < maxAge) {
                resp.errorMsg[resp.errorMsg.length] = `Age limit is higher than already enrolled member age ${maxAge}`;
            }
        }
    }

    // Validate and populate error message
    if (resp.errorMsg.length > 0) {
        resp.status = true;
    }
    return resp;
}

// ------ Membership change conflict helpers ------------------
/*function is to calculate the minimum age of existing members
 * @param team (javastring object) - contains team data
 * calls: None
 * called by: validate()
 */
function getMinAgeOfMember(team) {
    let minAge = 100000;
    for (let i = 0; i < team.Members.length; i++) {
        if (Number(team.Members[i].Age) < minAge) {
            minAge = Number(team.Members[i].Age);
        }
    }
    return minAge;
}

/*function is to calculate the maximum age of existing members
 * @param team (javastring object) - contains team data
 * calls: None
 * called by: validate()
 */
function getMaxAgeOfMember(team) {
    let maxAge = -1;
    for (let i = 0; i < team.Members.length; i++) {
        if (Number(team.Members[i].Age) > maxAge) {
            maxAge = Number(team.Members[i].Age);
        }
    }
    return maxAge;
}