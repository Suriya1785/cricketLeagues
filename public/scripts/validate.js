/* Script to validate the course form, builds error status and error message upon 
 * validation
 * Author: HartCode programmer
 * Date: 08/20/2019
 */
"Use Strict";

function validate(inputData) {
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

    if (resp.errorMsg.length > 0) {
        resp.status = true;
    }
    return resp;
}