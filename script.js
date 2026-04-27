const BASE_URL = "http://localhost:3000";

/* ================= LOGIN ================= */
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const role = document.querySelector('input[name="role"]:checked').value;

  fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, role })
  })
  .then(res => res.json())
  .then(data => {
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);

      if (data.role === "admin") location = "admin.html";
      if (data.role === "teacher") location = "teacher.html";
      if (data.role === "student") location = "student.html";
    } else {
      document.getElementById("error").innerText = data.msg;
    }
  });
}

/* ================= LOGOUT ================= */
function logout() {
  localStorage.clear();
  location = "index.html";
}

/* ================= ADMIN ================= */
function addTeacher(){
  fetch(`${BASE_URL}/api/admin/add-teacher`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      username: document.getElementById("t_username").value,
      password: document.getElementById("t_password").value,
      name: document.getElementById("t_name").value,
      department: document.getElementById("t_dept").value
    })
  })
  .then(res=>res.json())
  .then(data=>alert(data.msg))
  .catch(()=>alert("Error"));
}

function addSubject(){
  fetch("http://localhost:3000/api/admin/add-subject",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      subject_name: document.getElementById("sub_name").value,
      section: document.getElementById("sub_section").value
    })
  })
  .then(res=>res.json())
  .then(data=>{
    alert("Subject Added ✅\nSubject ID: " + data.subject_id);
  });
}

function generateToken(){
  const subjectId = document.getElementById("token_subject_id").value;

  if(!subjectId){
    alert("Enter Subject ID first!");
    return;
  }

  fetch("http://localhost:3000/api/admin/generate-token",{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      subject_id: subjectId
    })
  })
  .then(res=>res.json())
  .then(data=>{
    if(data.token){
      alert("Token: " + data.token);
    } else {
      alert("Error generating token");
    }
  });
}

/* ================= STUDENT ================= */
function loadStudentDashboard() {
  const username = localStorage.getItem("username");

  fetch(`${BASE_URL}/api/student/attendance/${username}`)
    .then(res => res.json())
    .then(data => {
      let present=0, absent=0;
      const table = document.getElementById("attendanceTable");
      table.innerHTML="";

      data.forEach(item=>{
        if(item.status==="Present") present++;
        else absent++;

        table.innerHTML += `
        <tr>
          <td>${item.date}</td>
          <td>${item.subject_name}</td>
          <td>${item.status}</td>
        </tr>`;
      });

      let total = present+absent;
      let percent = total ? ((present/total)*100).toFixed(1) : 0;

      document.getElementById("attendancePercent").innerText = percent+"%";
      document.getElementById("presentCount").innerText = present;
      document.getElementById("absentCount").innerText = absent;
    });
}

/* ================= TEACHER ================= */
let tokenVerified = false;
let verifiedSubjectId = null;

function verifyToken() {
  const token = document.getElementById("token").value.trim();

  fetch(`${BASE_URL}/api/teacher/verify-token`, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({token})
  })
  .then(res=>res.json())
  .then(data=>{
    if(data.valid){
      alert("Token Verified ✅");
      tokenVerified = true;
      verifiedSubjectId = data.subject_id;

      // auto fill subject
      document.getElementById("subjectId").value = verifiedSubjectId;

    } else {
      alert("Invalid Token ❌");
    }
  });
}

function loadStudents() {
  const subjectId = verifiedSubjectId;

  fetch(`${BASE_URL}/api/teacher/students/${subjectId}`)
    .then(res => res.json())
    .then(data => {

      const container = document.getElementById("studentList");
      container.innerHTML="";

      data.forEach(s=>{
        container.innerHTML += `
        <div class="student-row">
          ${s.name}
          <button onclick="markAttendance(${s.id},'Present')">✔</button>
          <button onclick="markAttendance(${s.id},'Absent')">✖</button>
        </div>`;
      });
    });
}
function addStudent(){
  fetch("http://localhost:3000/api/admin/add-student",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      username: document.getElementById("s_username").value,
      password: document.getElementById("s_password").value,
      name: document.getElementById("s_name").value,
      erp: document.getElementById("s_erp").value,
      section: document.getElementById("s_section").value
    })
  })
  .then(res=>res.json())
  .then(data=>alert(data.msg))
}

function markAttendance(id,status){

  if(!tokenVerified){
    alert("Verify token first!");
    return;
  }

  fetch(`${BASE_URL}/api/teacher/mark-attendance`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      student_id:id,
      subject_id: verifiedSubjectId,
      status
    })
  })
  .then(res=>res.json())
  .then(data=>alert(data.msg))
  .catch(()=>alert("Error"));
}

/* ================= PASSWORD ================= */
function togglePassword() {
  const pass = document.getElementById("password");
  pass.type = pass.type === "password" ? "text" : "password";
}