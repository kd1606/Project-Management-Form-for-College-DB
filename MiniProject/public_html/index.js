/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

var connToken = '90931278|-31949327656058299|90961012';
var jpdbIRL = "/api/irl";
var jpdbIML = '/api/iml';
var DBName = 'College-DB';
var RelationName = "Pro-table";
var jpdbBaseUrl = "http://api.login2explore.com:5577";


$('#proId').focus();

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno', lvData.rec_no);
}

function getProIdAsJsonObj() {
    var proId = $('#proId').val();
    var jsonStr = {
        id: proId
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#proName').val(record.name);
    $('#assignTo').val(record.assignTo);
    $('#assignDate').val(record.assignDate);
    $('#dL').val(record.dL);
}

function resetForm() {
    $("#proId").val('');
    $("#proName").val('');
    $("#assignTo").val('');
    $("#assignDate").val('');
    $("#dL").val('');
    $("#proId").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#proId").focus();
}

function validateData() {
    var proId, proName, assignTo, assignDate, dL;
    proId = $("#proId").val();
    proName = $("#proName").val();
    assignTo = $("#assignTo").val();
    assignDate = $("#assignDate").val();
    dL = $("#dL").val();

    if (proId === "") {
        alert("Project ID is missing");
        $("#proId").focus();
        return "";
    }
    if (proName === "") {
        alert("Project Name is missing");
        $("#proName").focus();
        return "";
    }
    if (assignTo === "") {
        alert("Assign To is missing");
        $("#assignTo").focus();
        return "";
    }
    if (assignDate === "") {
        alert("Assignment Date is missing");
        $("#assignDate").focus();
        return "";
    }
    if (dL === "") {
        alert("Deadline is missing");
        $("#dL").focus();
        return "";
    }

    var jsonStrObj = {
        id: proId,
        name: proName,
        assignTo: assignTo,
        assignDate: assignDate,
        dL: dL
    };
    return JSON.stringify(jsonStrObj);
}

function getPro() {
    var proIdJsonObj = getProIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, DBName, RelationName, proIdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseUrl, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if (resJsonObj.status === 400) {
        $("#save").prop('disable', false);
        $("#reset").prop('disable', false);
        $("#proName").focus();

    } else if (resJsonObj.status === 200) {
        $("#proId").prop('disable', true);
        fillData(resJsonObj);
        
        $("#change").prop('disable', false);
        $("#reset").prop('disable', false);
        $("#proName").focus();
    }
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") {
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, DBName, RelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseUrl, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#proId").focus();
}

function changeData() {
    $('#change').prop('disable', true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, DBName, RelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseUrl, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $("#proId").focus();
}

