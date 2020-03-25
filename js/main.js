//General Functions
function getData(dataJSON,fname,callback) {
    var xmlhttp;
    if (window.XMLHttpRequest){
        xmlhttp=new XMLHttpRequest();
    }else{
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState==4 && xmlhttp.status==200){
            callback(xmlhttp.responseText);
        }
    }

    xmlhttp.open("POST",fname,true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send("data="+dataJSON);
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function logout() {
    document.cookie="quizyUserRole=-1";
    $.ajax({
        url: "indexBody.html", 
        context: document.body,
        success: function(response) {
            $("#indexBody").html(response);
        }
    });
}

function dash() {
    if(getCookie("quizyUserRole")=="0"){
        $.ajax({
            url: "dashboard.html", 
            context: document.body,
            success: function(response) {
                $("#mainBody").html(response);
                admin();
            }
        });
    }else if (getCookie("quizyUserRole")=="1"){
        $.ajax({
            url: "dashboardStudent.html",
            context: document.body,
            success: function(response) {
                $("#mainBody").html(response);
                student();
            }
        });
    }
}

function admin() {
    $.ajax({
        url: "questionBank.html", 
        context: document.body,
        success: function(response) {
            $("#subBody").html(response);
            document.getElementById("welcStr").innerHTML = "Welcome "+getCookie("quizyUser");
            questionUpdate('populateQus(this)');
        }
    });
}

function student() {
    document.getElementById("welcStr").innerHTML = "Welcome "+getCookie("quizyUser");
    examTaker();
}

function closeAlert(){
    document.getElementById("alertmsg").innerHTML = "";
}

//Login Page
(function ($) {
    "use strict";

    $('.input100').each(function(){
        $(this).on('blur', function(){
            if($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        })    
    })
  
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(){
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }

        if(check){
            var ucid = (document.getElementById('ucid').value);
            var pass = (document.getElementById('pass').value);
            var cred = '{ "ucid":"'+ucid+'" , "pass":"'+pass+'" }';
            var credJSON = JSON.stringify(cred);

            getData(credJSON,"php/login.php",function(resJSON){
                var response = JSON.parse(resJSON);
                if(response.res == "failed"){
                    document.getElementById("responseAuth").innerHTML = "Authentication Failed";
                }else{
                    document.cookie="quizyUserRole="+response.role;
                    document.cookie="quizyUser="+response.name;
                    document.cookie="quizyUserID="+response.user;
                    dash();
                }
            });
        }
        return false;
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }
    
    var showPass = 0;
    $('.btn-show-pass').on('click', function(){
        if(showPass == 0) {
            $(this).next('input').attr('type','text');
            $(this).find('i').removeClass('zmdi-eye');
            $(this).find('i').addClass('zmdi-eye-off');
            showPass = 1;
        }
        else {
            $(this).next('input').attr('type','password');
            $(this).find('i').addClass('zmdi-eye');
            $(this).find('i').removeClass('zmdi-eye-off');
            showPass = 0;
        }
        
    });

})(jQuery);

//QuestionBank
function add() {
    var tBody = document.getElementById("testCaseTable").innerHTML;
    tBody += '<tr><td><input class="testCase" style="float:left;width:100%;" placeholder="input"></td><td><input class="testCase" style="float:left;width:100%;" placeholder="output"></td></tr>';
    document.getElementById("testCaseTable").innerHTML = tBody;  
}

function save() {
    var id = document.getElementById("questionIn").dataset.id;
    var question = document.getElementById("questionIn").value;
    var type = document.getElementById("typeIn").value;
    var diff = document.getElementById("diffIn").value;
    var fName = document.getElementById("fName").value;
    var arr = document.getElementsByClassName("testCase");
    var testCases = "";
    for(var i = 0; i < arr.length; i++){
        if(i % 2 != 0){
            testCases += arr[i].value.replace(/'/g,"''") + ";";
        }else{
            testCases += arr[i].value.replace(/'/g,"''") + ":";
        }
    }testCases = testCases.substring(0,testCases.length-1);
    var constraintArr = document.getElementsByClassName("constraintsS");
    var constraint = "";
    for(var c = 0; c < constraintArr.length; c++){
        if(constraintArr[c].checked){
            constraint += constraintArr[c].dataset.type+";";
        }
    }

    var data = '{ "id":"'+id+'" , "question":"'+question+'" , "type":"'+type+'" , "diff":"'+diff+'" , "fName":"'+fName+'" , "testCases":"'+encodeURIComponent(testCases)+'", "constrain":"'+constraint.substring(0,constraint.length-1)+'"}';
    var dataJSON = JSON.stringify(data);
    getData(dataJSON,"php/addQuestion.php",function(resJSON){
        var response = JSON.parse(resJSON);
        if(response.res == "success"){
            $('#alertmsg').html('<div id="alerts"><span id="closebtn" onclick="closeAlert()">&times;</span>Successfully saved the question!</div>');
            questionUpdate('populateQus(this)');
        }else{
            console.log(resJSON);
        }
    });
}

var responseQuestion;

function questionUpdate(destinationFunc) {
    var dataJSON = JSON.stringify('qus');
    getData(dataJSON,"php/questions.php",function(resJSON){
        var tBody = "<tr><th>Question</th><th>Type</th><th>Difficulty</th></tr>";
        var response = JSON.parse(resJSON);
        responseQuestion = response;
        for(var i = 1; i < Object.keys(response).length; i++){
            tBody += '<tr class="quesRow" onclick="'+destinationFunc+'" data-id='+response[i].id+'><td>'+response[i].question+'</td><td>'+response[i].type+'</td><td>'+response[i].diff+'</td></tr>';
            var dnExists = true;
            $('#type > option').each(function() {
                if(this.value.localeCompare(response[i].type) == 0){
                    dnExists = false;
                }
            });
            if(dnExists){
                document.getElementById("type").innerHTML += '<option value="'+response[i].type+'">'+response[i].type+'</option>';
            }
        }
        document.getElementById("questionB").innerHTML = tBody;
    });
}

function populateQus(e) {
    document.getElementById("questionIn").dataset.id = e.dataset.id;
    document.getElementById("questionIn").value = responseQuestion[e.dataset.id].question;
    document.getElementById("typeIn").value = responseQuestion[e.dataset.id].type;
    document.getElementById("diffIn").value = responseQuestion[e.dataset.id].diff;
    document.getElementById("fName").value = responseQuestion[e.dataset.id].fName;
    var constraintArr = document.getElementsByClassName("constraintsS");
    for(var c = 0; c < constraintArr.length; c++){
        if(responseQuestion[e.dataset.id].constrain != null){
            if(responseQuestion[e.dataset.id].constrain.split(";").includes(constraintArr[c].dataset.type)){
                $(constraintArr[c])[0].checked = true;
            }else{
                $(constraintArr[c])[0].checked = false;
            }
        }else{
            $(constraintArr[c])[0].checked = false;
        }
    }
    var tBody = "<tr><th>Input</th><th>Output</th></tr>";
    var testCases = responseQuestion[e.dataset.id].testCases.split(";");
    testCases.forEach(function(testCase) {
        testCase = testCase.split(":");
        tBody += '<tr><td><input class="testCase" style="float:left;width:100%;" value="'+testCase[0]+'"></td><td><input class="testCase" style="float:left;width:100%;" value="'+testCase[1]+'"></td></tr>';
    });
    document.getElementById("testCaseTable").innerHTML = tBody;
}

function filter(e){
    var arr = document.getElementsByClassName("quesRow");
    for(var i = 0; i < arr.length; i++){
        if(responseQuestion[arr[i].dataset.id][e.id] != e.value){
            arr[i].style.display = "none";
        }else{
            arr[i].style.display = "";
        }
    }
}

function filterKey(e) {
  var td, i, txtValue;
  var filter = e.value.toUpperCase();
  var table = document.getElementById("questionB");
  var tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }       
  }
}

//Desing Exam
function designExam() {
    $.ajax({
        url: "design.html", 
        context: document.body,
        success: function(response) {
            $("#subBody").html(response);
            questionUpdate('populateExam(this)');
            loadExam();
        }
    });

}

function populateExam(e) {
    var tBody = document.getElementById("questionExam").innerHTML;
    tBody += '<tr class="quesExam" data-id='+e.dataset.id+'><td onclick="this.parentElement.remove()"><input type="image" src="images/icons/delete.png" height="10" width="10"></td><td>'+responseQuestion[e.dataset.id].question+'</td><td>'+responseQuestion[e.dataset.id].type+'</td><td><input class="pointsQues" style="float:left;width:100%;" placeholder="Points"></td></tr>';
    document.getElementById("questionExam").innerHTML = tBody;
}

var responseExams;
function loadExam() {
    var dataJSON = JSON.stringify('exm');
    getData(dataJSON,"php/exams.php",function(resJSON){
        var response = JSON.parse(resJSON);
        responseExams = response;
        for(var i = 1; i < Object.keys(response).length; i++){
            var dnExists = true;
            $('#examEx > option').each(function() {
                if(this.value.localeCompare(response[i].name) == 0){
                    dnExists = false;
                }
            });
            if(dnExists){
                document.getElementById("examEx").innerHTML += '<option value="'+response[i].name+'">'+response[i].name+'</option>';
            }
        }
    });
}

function popuExam(e) {
    document.getElementById("questionExam").innerHTML = '<tr><th colspan="2">Question</th><th>Type</th><th>Points</th></tr>';
    for(var i = 1; i < Object.keys(responseExams).length; i++){
        if(e.value.localeCompare(responseExams[i].name) == 0){
            document.getElementById("nameExam").dataset.id = responseExams[i].id;
            document.getElementById("nameExam").value = e.value;
            var ques = responseExams[i].ques.split(";");
            for(var c = 0; c < ques.length; c++){
                var arr = document.getElementsByClassName("quesRow");
                var quePoi = ques[c].split(":");
                for(var ii = 0; ii < arr.length; ii++){
                    if(arr[ii].dataset.id.localeCompare(quePoi[0]) == 0){
                        populateExam(arr[ii]);
                    }
                }
            }
            for(var c = 0; c < ques.length; c++){
                var quePoi = ques[c].split(":");
                document.getElementsByClassName("pointsQues")[c].value = quePoi[1];
            }
        }
    }
}

function saveExam(){
    var name = document.getElementById("nameExam").value;
    var id = document.getElementById("nameExam").dataset.id;
    var arr = document.getElementsByClassName("quesExam");
    var arrPoints = document.getElementsByClassName("pointsQues");
    var ques = "";
    for(var i = 0; i < arr.length; i++){
        ques += arr[i].dataset.id + ':' + arrPoints[i].value + ';';
    }ques = ques.substring(0,ques.length-1);
    var data = '{"id":"'+id+'" , "name":"'+name+'" , "ques":"'+ques+'" , "status":"0"}';
    var dataJSON = JSON.stringify(data);
    getData(dataJSON,"php/addExam.php",function(resJSON){
        $('#alertmsg').html('<div id="alerts"><span id="closebtn" onclick="closeAlert()">&times;</span>Successfully created an Exam!</div>');
        console.log(resJSON);
        loadExam();
    });
}

//Manage Exams  --  add submissions look up
function manageExams() {
    $.ajax({
        url: "exams.html", 
        context: document.body,
        success: function(response) {
            $("#subBody").html(response);
            releaseManagement();
            examSubPopu();
        }
    });
}

var examDataRelease;
function releaseManagement() {
    var dataJSON = JSON.stringify('exm');
    getData(dataJSON,"php/exams.php",function(resJSON){
        var response = JSON.parse(resJSON);
        examDataRelease = response;
        var table = "<tr><th>Exam</th><th>Status</th></tr>";
        for(var i = 1; i < Object.keys(response).length; i++){
            table+= '<tr><td>'+response[i].name+'</td><td><label class="switch"><input class="statusExam" type="checkbox" ';
            if(response[i].status.localeCompare("1") == 0){
                table+='checked'
            }
            table+='><span class="slider round"></span></label><br><br>';
        }
        document.getElementById("examRelease").innerHTML = table;
    });
}

function saveRelease() {
    var arr = document.getElementsByClassName("statusExam");
    var status;
    for(var i = 0; i < arr.length; i++){
        if(arr[i].checked){
            status = "1";
        }else{status = "0";}
        var data = '{"id":"'+examDataRelease[i+1].id+'" , "name":"'+examDataRelease[i+1].name+'" , "ques":"'+examDataRelease[i+1].ques+'" , "status":"'+status+'"}';
        var dataJSON = JSON.stringify(data);
        getData(dataJSON,"php/addExam.php",function(resJSON){
            console.log(resJSON);
            $('#alertmsg').html('<div id="alerts"><span id="closebtn" onclick="closeAlert()">&times;</span>Successfully released the exams to students!</div>');
        });
    }
}

var submissionDataGlo;
function examSubPopu(){
    getSubmissionData(function(response){
        submissionDataGlo = response;
        var examSubtBody = "<tr><th>Student</th><th>Exam</th>";
        for(var key in response){
            if(response[key].released.localeCompare("1") != 0){
                examSubtBody += "<tr onclick='examReleasePopu(this)' data-studentid ="+response[key].studentId+" data-examid ="+response[key].examId+"><td>"+response[key].studentId +"</td><td>"+response[key].examId+"</td></tr>";
            }
        }
        examSubtBody += "</tr>";
        document.getElementById("examSubmission").innerHTML = examSubtBody;
    });
}

function examReleasePopu(e) {
    var subExamTable = "<tbody>"
    var sID = "";
    for(var key in submissionDataGlo){
        if(submissionDataGlo[key].studentId.localeCompare(e.dataset.studentid) == 0 && submissionDataGlo[key].examId.localeCompare(e.dataset.examid) == 0){
            subExamTable += "<tr><th colspan = 100><p>"+e.dataset.studentid+": "+e.dataset.examid+"</p></th></tr>";
            var ques = submissionDataGlo[key].ques.split(";");
            var ans = submissionDataGlo[key].ans.split(";");
            var point = submissionDataGlo[key].point.split(";");
            var testRes = submissionDataGlo[key].testRes.split(";");
            var comments = submissionDataGlo[key].comments.split(";");
            var ttPoints = 0;
            for(var i = 0; i < ques.length; i++){
                for(var q = 1; q < Object.keys(responseQuestion).length; q++){
                    if(responseQuestion[q].id.localeCompare(ques[i].split(":")[0]) == 0){
                        subExamTable +=  "<tr><td colspan = 100><p style='text-align: left; font-size: 12px; font-family: Courier;'>"+responseQuestion[q].question+"</p></td></tr>";
                        subExamTable +=  "<tr><td colspan = 100><p style='text-align: left; font-size: 12px; font-family: Courier; white-space: pre;'>"+ans[i]+"</p></td></tr>";
                        subExamTable +=  "<tr>";
                        for(var t = 0; t < testRes[i].split(":").length; t++){
                            if(comments[i].split(",")[t].localeCompare("pass") == 0){
                                subExamTable += "<td style = 'width: "+100/(testRes[i].split(":").length*2)+"%; background-color: #ABEE97'>"+responseQuestion[q].testCases.split(";")[t].split(":")[1]+"</td><td style = 'width: "+100/(testRes[i].split(":").length*2)+"%;background-color: #ABEE97'>"+testRes[i].split(":")[t]+"</td>";
                            }else{
                                subExamTable += "<td style = 'width: "+100/(testRes[i].split(":").length*2)+"%; background-color: #F5B7B1'>"+responseQuestion[q].testCases.split(";")[t].split(":")[1]+"</td><td style = 'width: "+100/(testRes[i].split(":").length*2)+"%;background-color: #F5B7B1'>"+testRes[i].split(":")[t]+"</td>";
                            }
                        }
                        subExamTable += "<tr><td colspan = 100><textarea style='float: left; width: 100%; height: 187px; font-family: Courier;' class = 'commentArea'>Comments:\n";
                        var totalPoints = 0;
                        for(var p = 0; p < point[i].split(":").length; p++){
                            if(parseInt(point[i].split(":")[p]) >= 0){
                                subExamTable += "Test Case "+(p+1)+": ";
                            }
                            subExamTable += comments[i].split(",")[p]+" Points: "+point[i].split(":")[p]+"\n";
                            totalPoints += parseInt(point[i].split(":")[p])
                        }
                        subExamTable += "Total Points: "+totalPoints+"</textarea></td></tr>";
                        ttPoints += totalPoints;
                    }
                }
            }
            sID = submissionDataGlo[key].id;
        }
    }
    subExamTable += "<td colspan = 100><textarea style='float: left; font-family: Courier;'>Final Score: "+ttPoints+"</textarea></td></tbody><button style = 'float: left !important;' onclick='releaseGrades(this)' data-subid = "+sID+" class='buttBottom'>Release</button>";
    document.getElementById("subExam").innerHTML = subExamTable;
}

function releaseGrades(e){
    var comments = "";
    var commentArr = document.getElementsByClassName("commentArea");
    for(var i = 0; i < commentArr.length; i++){
        var comment = commentArr[i].value.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t").replace(/'/g,"''");
        comments += encodeURIComponent(comment)+";";
    }
    var dataJSON = JSON.stringify('{"id":"'+e.dataset.subid+'" , "comments":"'+comments.substring(0,comments.length-1)+'" , "released":"1"}');
    getData(dataJSON,"php/saveExam.php",function(resJSON){
        $('#alertmsg').html('<div id="alerts"><span id="closebtn" onclick="closeAlert()">&times;</span>Successfully released the score!</div>');
        examSubPopu();
    });
}

//Student
function examTaker() {
    $.ajax({
        url: "examTaker.html", 
        context: document.body,
        success: function(response) {
            $("#subBody").html(response);
            getExamData(function(ret) {
                populateExamTaker();
            });
        }
    });
}

var examDataStudent; var questionDataStudent;
function getExamData(callback) {
    var dataJSON = JSON.stringify('exm');
    getData(dataJSON,"php/exams.php",function(resJSON){
        var response = JSON.parse(resJSON);
        examDataStudent = response;
        getData(dataJSON,"php/questions.php",function(resiJSON){
            var responsei = JSON.parse(resiJSON);
            questionDataStudent = responsei;
            callback("done");
        });
    });    
}

function populateExamTaker() {
    getSubmissionData(function(response){
        var tBody = "<tr>";
        for(var i = 1; i < Object.keys(examDataStudent).length; i++){
            if(examDataStudent[i].status.localeCompare('1') == 0){
                var exists = false;var nReleased = true;
                for(var key in response){
                    if(response[key].examId.localeCompare(examDataStudent[i].name) == 0 && response[key].studentId.toLowerCase().localeCompare(getCookie("quizyUserID").toLowerCase()) == 0){exists = true;
                    if(response[key].released.localeCompare("1") == 0){nReleased = false;}}
                }
                if(nReleased){
                    if(exists){
                        tBody += "<td style='background-color:#F5B7B1;'><button class='examsAvail' data-examid = "+examDataStudent[i].name+" data-quespoi = "+examDataStudent[i].ques+">"+examDataStudent[i].name+"</button></td>";
                    }else{
                        tBody += "<td><button class='examsAvail' data-examid = "+examDataStudent[i].name+" data-quespoi = "+examDataStudent[i].ques+" onclick='populateExamData(this)'>"+examDataStudent[i].name+"</button></td>";
                    }
                }
        }
        }tBody += "</tr>";
        document.getElementById("availExam").innerHTML = tBody;
    });
}

function getSubmissionData(callback){
    var dataJSON = JSON.stringify('exm');
    getData(dataJSON,"php/subExam.php",function(resJSON){
        var response = JSON.parse(resJSON);
        delete response['res']
        callback(response);
    });
}

var examId=""; var pointsGlo = ""; var quespoiGlo;
function populateExamData(e) {
    examId = e.dataset.examid;
    quespoiGlo = e.dataset.quespoi;

    var exam="<tr><th>"+e.innerHTML+"</th></tr>";
    var quespoi = e.dataset.quespoi.split(";");
    for(var ii = 0; ii < quespoi.length; ii++){
        var ques = quespoi[ii].split(":");
        for(var i = 1; i < Object.keys(questionDataStudent).length; i++){
            if(questionDataStudent[i].id.localeCompare(ques[0]) == 0){
                pointsGlo += ques[1]+";";
                exam += "<tr><td><p style='text-align: left; font-family: Courier;'>"+questionDataStudent[i].question+"</p><p style='text-align: left; font-family: Courier !important;'>Points: "+ques[1]+"</p></td></tr>";
                exam += "<tr><td><textarea style='float: left; width: 100%; height: 187px; font-family: Courier;' class = 'answerExam' data-quesid="+questionDataStudent[i].id+" placeholder='Enter your answer'></textarea></td></tr>";
            }
        }
    }exam += "<button onclick='submitExam()' class='buttBottom'>Submit</button>";
    document.getElementById("examData").innerHTML = exam;
}


async function submitExam() {
    var ques = quespoiGlo;
    var ans="";var point="";var testRes="";var comments="";
    var ansArr = document.getElementsByClassName("answerExam");
    for(var i = 0; i < ansArr.length; i++)
    {
        var ansLo = ansArr[i].value;
        for(var q = 1; q < Object.keys(questionDataStudent).length; q++){
            if(questionDataStudent[q].id.localeCompare(ansArr[i].dataset.quesid) == 0){
                var pointPerQues = parseInt(parseInt(pointsGlo.split(";")[i])/questionDataStudent[q].testCases.split(";").length);
                let promise = new Promise((resolve, reject) => {
                    testCode(questionDataStudent[q].fName,ansLo,questionDataStudent[q].testCases,pointPerQues,questionDataStudent[q].constrain).then(quesResult => {
                        resolve(quesResult);
                    });
                });

                let quesResult = await promise;
                testRes += quesResult[0]+";"
                point += quesResult[1]+";"
                comments += quesResult[2]+";"
                var ansL = ansLo.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t").replace(/'/g,"''");
                ansL = encodeURIComponent(ansL);
                ans += ansL +";";
            }
        }
    }
    ans = ans.substring(0,ans.length-1);
    point = point.substring(0,point.length-1);
    testRes = testRes.substring(0,testRes.length-1);
    comments = comments.substring(0,comments.length-1);
    var data = '{"id":"-1", "studentId":"'+getCookie("quizyUserID")+'" , "examId":"'+examId+'" , "ques":"'+ques+'" , "ans":"'+ans+'" , "point":"'+point+'" , "testRes":"'+testRes+'" , "comments":"'+comments+'" , "released":"0"}';
    console.log(data);
    var dataJSON = JSON.stringify(data);
    getData(dataJSON,"php/saveExam.php",function(resJSON){
        $('#alertmsg').html('<div id="alerts"><span id="closebtn" onclick="closeAlert()">&times;</span>Successfully submitted the exam!</div>');
    });
}

async function testCode(fName, ans, testCases, pointPerQues,constrain) {
    var testResExam=""; var pointExam=""; var commentsExam="";
    var testCases = testCases.split(";");
    var wrongFname = false;
    if(ans.split(" ")[1].split("(")[0].localeCompare(fName) != 0){
        var n = ans.indexOf(ans.split(" ")[1].split("(")[0]);
        ans = ans.substring(0,n)+fName+ans.substring(n+ans.split(" ")[1].split("(")[0].length,ans.length)
        wrongFname = true;
    }
    var constrainStr = "";
    var dnConstrain = false;
    if(constrain != null && constrain.localeCompare("") != 0){
        var constrainL = constrain.split(";");
        for(var c = 0; c < constrainL.length; c++){
            if(ans.indexOf(constrainL[c]) == -1){
                dnConstrain = true;
                constrainStr += constrainL[c] + " constraint was not implemented;";
            }
        }constrainStr = constrainStr.substring(0,constrainStr.length-1);
    }

    for(var i = 0; i < testCases.length; i++){
        var testCase = testCases[i].split(":");
        var ansL = ans + "\nprint("+fName+"("+testCase[0]+"))";
        ansL = ansL.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
        ansL = encodeURIComponent(ansL);
        var data = '{"ans":"'+ansL+'"}';
        var dataJSON = JSON.stringify(data);
        
        let promise = new Promise((resolve, reject) => {
            getData(dataJSON,"php/grader.php",function(resJSON){
                resolve(resJSON);
            });
        });

        let resJSON = await promise;
        var response = JSON.parse(resJSON);

        if(response.res == null){
            commentsExam += response.error[response.error.length-1].replace(/'/g,"''")+",";
            pointExam += "0"+":";
            testResExam += "null"+":";
        }else if (response.res.replace(/\n/g, '').localeCompare(testCase[1].replace(/'/g,"")) == 0){
            pointExam += String(pointPerQues)+":";
            testResExam += response.res.replace(/\n/g, '')+":";
            commentsExam += "pass"+",";
        }else{
            pointExam += "0"+":";
            testResExam += response.res.replace(/\n/g, '')+":";
            commentsExam += "failed"+",";            
        }
    }
    if(wrongFname){
        pointExam += "-"+String(pointPerQues)+":";
        commentsExam += "Error: Wrong Function Name"+",";
    }
    if(dnConstrain){
        for(var i = 0; i < constrainStr.split(";").length; i++){
            pointExam += "-"+String(pointPerQues)+":";
            commentsExam += constrainStr.split(";")[i]+",";
    }
    }
    return [testResExam.substring(0,testResExam.length-1), pointExam.substring(0,pointExam.length-1), commentsExam.substring(0,commentsExam.length-1)];
}

//Check Grades
function checkGrades() {
    $.ajax({
        url: "grades.html", 
        context: document.body,
        success: function(response) {
            $("#subBody").html(response);
            getExamData(function(ret) {
                populateGrades();
            });
        }
    });
}
var submissionStudentDataGlo;
function populateGrades() {
    getSubmissionData(function(response){
        submissionStudentDataGlo = response;
        var tbody = "<tbody><tr>";
        for(var key in response){
            if(response[key].released.localeCompare("1") == 0){
                tbody += "<td><button class='examsAvail' data-sid="+response[key].id+" onclick = 'populateGradesDetail(this)'>"+response[key].examId+"</button></td>";
            }
        }
        tbody += "</tr></tbody>"
        document.getElementById("examsAvail").innerHTML = tbody;
    });
}

function populateGradesDetail(e) {
    var subExamTable = "<tbody>"
    for(var key in submissionStudentDataGlo){
        if(submissionStudentDataGlo[key].id.localeCompare(e.dataset.sid) == 0){
            var ques = submissionStudentDataGlo[key].ques.split(";");
            var ans = submissionStudentDataGlo[key].ans.split(";");
            var point = submissionStudentDataGlo[key].point.split(";");
            var testRes = submissionStudentDataGlo[key].testRes.split(";");
            var comments = submissionStudentDataGlo[key].comments.split(";");
            console.log(comments);
            for(var i = 0; i < ques.length; i++){
                for(var q = 1; q < Object.keys(questionDataStudent).length; q++){
                    if(questionDataStudent[q].id.localeCompare(ques[i].split(":")[0]) == 0){
                        subExamTable +=  "<tr><td colspan = 100><p style='text-align: left; font-size: 12px; font-family: Courier;'>"+questionDataStudent[q].question+"</p></td></tr>";
                        subExamTable +=  "<tr><td colspan = 100><p style='text-align: left; font-size: 12px; font-family: Courier; white-space: pre;'>"+ans[i]+"</p></td></tr>";
                        subExamTable +=  "<tr>";
                        for(var t = 0; t < testRes[i].split(":").length; t++){
                            if(point[i].split(":")[t].localeCompare("0") == 0){
                                subExamTable += "<td style = 'width: "+100/(testRes[i].split(":").length*2)+"%; background-color: #F5B7B1'>"+questionDataStudent[q].testCases.split(";")[t].split(":")[1]+"</td><td style = 'width: "+100/(testRes[i].split(":").length*2)+"%;background-color: #F5B7B1'>"+testRes[i].split(":")[t]+"</td>";
                            }else{
                                subExamTable += "<td style = 'width: "+100/(testRes[i].split(":").length*2)+"%; background-color: #ABEE97'>"+questionDataStudent[q].testCases.split(";")[t].split(":")[1]+"</td><td style = 'width: "+100/(testRes[i].split(":").length*2)+"%;background-color: #ABEE97'>"+testRes[i].split(":")[t]+"</td>";
                            }
                        }
                        subExamTable += "<tr><td colspan = 100><p style='white-space: pre; text-align: left; font-size: 12px; font-family: Courier;'>";
                        subExamTable += comments[i];
                        subExamTable += "</p></td></tr>";
                    }
                }
            }
        }
    }
    document.getElementById("examGrades").innerHTML = subExamTable + "</tbody>";
}

//Default 
dash();