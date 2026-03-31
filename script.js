/* ================= CONFIG ================= */

const API_URL = "https://student-backend-w3e9.onrender.com";

/* ================= LOGIN / REGISTER ================= */

function showLogin(){
document.getElementById("loginForm").style.display="block";
document.getElementById("registerForm").style.display="none";
}

function showRegister(){
document.getElementById("loginForm").style.display="none";
document.getElementById("registerForm").style.display="block";
}

function register(){

let username=document.getElementById("regUsername").value;
let password=document.getElementById("regPassword").value;

if(!username || !password){
alert("Fill all fields");
return;
}

localStorage.setItem("user",username);
localStorage.setItem("pass",password);

alert("Registration successful! Please login.");
showLogin();

}

function login(){

let username=document.getElementById("username").value;
let password=document.getElementById("password").value;

let savedUser=localStorage.getItem("user");
let savedPass=localStorage.getItem("pass");

if(username===savedUser && password===savedPass){
window.location.href="dashboard.html";
}else{
alert("Invalid login");
}

}



/* ================= STUDENTS (BACKEND API) ================= */

async function addStudent(){

let name = document.getElementById("name").value;
let email = document.getElementById("email").value;
let course = document.getElementById("course").value;

if(!name || !email || !course){
alert("Please fill all fields");
return;
}

let response = await fetch(`${API_URL}/students`,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
name:name,
email:email,
course:course
})
});

if(response.ok){
alert("Student added successfully");
loadStudents();
loadDashboard();
}else{
alert("Error adding student");
}

}



async function loadStudents(){

let table = document.getElementById("studentTable");
if(!table) return;

let response = await fetch(`${API_URL}/students`);

let students = await response.json();

table.innerHTML="";

students.forEach(function(s){

table.innerHTML += `
<tr>
<td>${s.id}</td>
<td>${s.name}</td>
<td>${s.email}</td>
<td>${s.course}</td>
<td>
<button class="delete-btn" onclick="deleteStudent(${s.id})">Delete</button>
</td>
</tr>
`;

});

}



async function deleteStudent(id){

if(!confirm("Are you sure you want to delete this student?")) return;

let response = await fetch(`${API_URL}/students/${id}`,{
method:"DELETE"
});

if(response.ok){
loadStudents();
loadDashboard();
}else{
alert("Error deleting student");
}

}



/* ================= ATTENDANCE ================= */

function markAttendance(){

let name = document.getElementById("attendanceName")?.value;
let date = document.getElementById("attendanceDate")?.value;
let status = document.getElementById("attendanceStatus")?.value;

if(!name || !date){
alert("Enter student name and date");
return;
}

let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

attendance.push({
name:name,
date:date,
status:status
});

localStorage.setItem("attendance",JSON.stringify(attendance));

displayAttendance();
loadDashboard();

}



function displayAttendance(){

let table = document.getElementById("attendanceTable");
if(!table) return;

let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

table.innerHTML="";

attendance.forEach(function(a,index){

table.innerHTML += `
<tr>
<td>${index+1}</td>
<td>${a.name}</td>
<td>${a.date}</td>
<td>${a.status}</td>
</tr>
`;

});

}



/* ================= MARKS ================= */

function addMarks(){

let name = document.getElementById("marksName")?.value;
let subject = document.getElementById("marksSubject")?.value;
let marks = document.getElementById("marksValue")?.value;
let date = document.getElementById("marksDate")?.value;

if(!name || !subject || !marks || !date){
alert("Fill all fields");
return;
}

let marksList = JSON.parse(localStorage.getItem("marks")) || [];

marksList.push({
name:name,
subject:subject,
marks:marks,
date:date
});

localStorage.setItem("marks",JSON.stringify(marksList));

displayMarks();
loadDashboard();

}



function displayMarks(){

let table = document.getElementById("marksTable");
if(!table) return;

let marksList = JSON.parse(localStorage.getItem("marks")) || [];

table.innerHTML="";

marksList.forEach(function(m,index){

table.innerHTML += `
<tr>
<td>${index+1}</td>
<td>${m.name}</td>
<td>${m.subject}</td>
<td>${m.marks}</td>
<td>${m.date}</td>
</tr>
`;

});

}



/* ================= REPORTS ================= */

function searchStudent(){

let name = document.getElementById("searchStudent")?.value;
let table = document.getElementById("reportTable");
let avgBox = document.getElementById("averageMarks");

if(!table) return;

let marksList = JSON.parse(localStorage.getItem("marks")) || [];

table.innerHTML="";

let total = 0;
let count = 0;

marksList.forEach(function(m,index){

if(m.name.toLowerCase().includes(name.toLowerCase())){

table.innerHTML += `
<tr>
<td>${index+1}</td>
<td>${m.name}</td>
<td>${m.subject}</td>
<td>${m.marks}</td>
<td>${m.date}</td>
</tr>
`;

total += Number(m.marks);
count++;

}

});

if(count>0){
avgBox.innerText = "Average Marks: " + (total/count).toFixed(2);
}else{
avgBox.innerText = "No student found";
}

}



/* ================= DASHBOARD ================= */

async function loadDashboard(){

let totalStudents=document.getElementById("totalStudents");
let totalAttendance=document.getElementById("totalAttendance");
let averageMarks=document.getElementById("averageMarks");

try {

/* fetch students from backend */
let response = await fetch(`${API_URL}/students`);
let students = await response.json();

if(totalStudents) totalStudents.innerText = students.length;

} catch(e) {

/* Render free tier may be sleeping - show loading and retry */
console.warn("Backend may be waking up, retrying in 5s...");
if(totalStudents) totalStudents.innerText = "...";
setTimeout(loadDashboard, 5000);
return;

}

/* attendance */
let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

/* marks */
let marks = JSON.parse(localStorage.getItem("marks")) || [];

if(totalAttendance) totalAttendance.innerText = attendance.length;

let total=0;

marks.forEach(m=>{
total+=parseInt(m.marks);
});

let avg = marks.length ? (total/marks.length).toFixed(1) : 0;

if(averageMarks) averageMarks.innerText = avg;

}



/* ================= AI PREDICTOR ================= */

function predictPerformance(){

let name = document.getElementById("aiName").value;
let marks = document.getElementById("aiMarks").value;
let attendance = document.getElementById("aiAttendance").value;

let result = "";

if(marks >= 80 && attendance >= 80){
result = "Excellent Performance 🎉";
}
else if(marks >= 60 && attendance >= 70){
result = "Average Performance 👍";
}
else{
result = "Needs Improvement ⚠️";
}

document.getElementById("aiResult").innerText =
"AI Prediction for "+name+" : "+result;

}



/* ================= AUTO LOAD ================= */

window.onload=function(){

loadStudents();        // ✅ Fixed: was wrongly called displayStudents()
displayAttendance();
displayMarks();
loadDashboard();
loadStudentAnalytics();

}

function downloadReport(){

let searchName = document.getElementById("searchStudent").value.toLowerCase();

let marksList = JSON.parse(localStorage.getItem("marks")) || [];

let csv = "ID,Name,Subject,Marks,Date\n";

let count = 1;

marksList.forEach(function(m){

if(m.name.toLowerCase().includes(searchName)){

csv += count + "," + m.name + "," + m.subject + "," + m.marks + "," + m.date + "\n";

count++;

}

});

let blob = new Blob([csv], {type:"text/csv"});

let link = document.createElement("a");

link.href = URL.createObjectURL(blob);

link.download = "student_report.csv";

link.click();

}


function loadStudentAnalytics(){

let marksList = JSON.parse(localStorage.getItem("marks")) || [];

if(marksList.length === 0) return;

/* GROUP MARKS BY STUDENT */

let studentMarks = {};

marksList.forEach(m => {

if(!studentMarks[m.name]){
studentMarks[m.name] = [];
}

studentMarks[m.name].push(parseInt(m.marks));

});

/* CALCULATE AVERAGE */

let averages = [];

for(let student in studentMarks){

let total = studentMarks[student].reduce((a,b)=>a+b,0);

let avg = total / studentMarks[student].length;

averages.push({
name:student,
avg:avg
});

}

/* SORT BY MARKS */

averages.sort((a,b)=>b.avg-a.avg);

/* TOP STUDENT */

let top = averages[0];

document.getElementById("topStudent").innerText =
top.name + " (" + top.avg.toFixed(1) + ")";

/* WEAK STUDENT */

let weak = averages[averages.length-1];

document.getElementById("weakStudent").innerText =
weak.name + " (" + weak.avg.toFixed(1) + ")";

/* RANK TABLE */

let table = document.getElementById("rankTable");

table.innerHTML="";

averages.forEach((s,index)=>{

table.innerHTML += `
<tr>
<td>${index+1}</td>
<td>${s.name}</td>
<td>${s.avg.toFixed(1)}</td>
</tr>
`;

});

}