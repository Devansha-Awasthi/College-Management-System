// Data Storage using LocalStorage
const DATA_KEYS = {
    STUDENTS: 'cms_students',
    FACULTY: 'cms_faculty',
    COURSES: 'cms_courses',
    FEES: 'cms_fees'
};

const AUTH_KEYS = {
    USERS: 'cms_users',
    CURRENT: 'cms_current_user'
};

// Initialize localStorage if empty
function initializeData() {
    // If no data exists, populate with sensible sample data for first run
    if (!localStorage.getItem(DATA_KEYS.STUDENTS)) {
        const sampleStudents = [
            { ID: 'S1001', Name: 'Asha Patel', Course: 'BSc Computer Science', Email: 'asha.patel@example.com', Phone: '9876543210' },
            { ID: 'S1002', Name: 'Rohan Kumar', Course: 'BCom', Email: 'rohan.kumar@example.com', Phone: '9123456780' },
            { ID: 'S1003', Name: 'Maya Singh', Course: 'BSc Computer Science', Email: 'maya.singh@example.com', Phone: '9988776655' },
            { ID: 'S1004', Name: 'Vikram Rao', Course: 'BA Economics', Email: 'vikram.rao@example.com', Phone: '9012345678' }
        ];
        localStorage.setItem(DATA_KEYS.STUDENTS, JSON.stringify(sampleStudents));
    }

    if (!localStorage.getItem(DATA_KEYS.FACULTY)) {
        const sampleFaculty = [
            { ID: 'F2001', Name: 'Dr. Neeta Sharma', Department: 'Computer Science', Designation: 'Professor', Phone: '9445566770' },
            { ID: 'F2002', Name: 'Prof. Arjun Mehta', Department: 'Economics', Designation: 'Associate Professor', Phone: '9331122334' },
            { ID: 'F2003', Name: 'Ms. Priya Nair', Department: 'Commerce', Designation: 'Assistant Professor', Phone: '9223344556' }
        ];
        localStorage.setItem(DATA_KEYS.FACULTY, JSON.stringify(sampleFaculty));
    }

    if (!localStorage.getItem(DATA_KEYS.COURSES)) {
        const sampleCourses = [
            { CourseID: 'C3001', CourseName: 'BSc Computer Science', Faculty: 'Dr. Neeta Sharma' },
            { CourseID: 'C3002', CourseName: 'BCom', Faculty: 'Ms. Priya Nair' },
            { CourseID: 'C3003', CourseName: 'BA Economics', Faculty: 'Prof. Arjun Mehta' }
        ];
        localStorage.setItem(DATA_KEYS.COURSES, JSON.stringify(sampleCourses));
    }

    if (!localStorage.getItem(DATA_KEYS.FEES)) {
        const sampleFees = [
            { StudentID: 'S1001', Amount: 25000.00, Status: 'Paid' },
            { StudentID: 'S1002', Amount: 20000.00, Status: 'Pending' },
            { StudentID: 'S1003', Amount: 25000.00, Status: 'Paid' },
            { StudentID: 'S1004', Amount: 18000.00, Status: 'Pending' }
        ];
        localStorage.setItem(DATA_KEYS.FEES, JSON.stringify(sampleFees));
    }

    // Auth users: create a demo admin if none
    if (!localStorage.getItem(AUTH_KEYS.USERS)) {
        const sampleUsers = [ { email: 'admin@example.com', password: 'admin123' } ];
        localStorage.setItem(AUTH_KEYS.USERS, JSON.stringify(sampleUsers));
        // do not auto-login by default; keep CURRENT empty
        localStorage.removeItem(AUTH_KEYS.CURRENT);
    }
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
});

// Smooth scrolling function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        font-weight: 500;
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ========== STUDENT FUNCTIONS ==========

function addStudent(event) {
    event.preventDefault();
    
    const student = {
        ID: document.getElementById('studentId').value,
        Name: document.getElementById('studentName').value,
        Course: document.getElementById('studentCourse').value,
        Email: document.getElementById('studentEmail').value,
        Phone: document.getElementById('studentPhone').value
    };
    
    let students = JSON.parse(localStorage.getItem(DATA_KEYS.STUDENTS));
    students.push(student);
    localStorage.setItem(DATA_KEYS.STUDENTS, JSON.stringify(students));
    
    showNotification('Student added successfully!');
    event.target.reset();
    closeModal('addStudentModal');
    updateStats();
}

function loadStudents() {
    const students = JSON.parse(localStorage.getItem(DATA_KEYS.STUDENTS));
    const listDiv = document.getElementById('studentsList');
    
    if (students.length === 0) {
        listDiv.innerHTML = '<div class="no-data">No students found</div>';
        return;
    }
    
    listDiv.innerHTML = students.map(s => `
        <div class="record-item">
            <strong>ID:</strong> ${s.ID}<br>
            <strong>Name:</strong> ${s.Name}<br>
            <strong>Course:</strong> ${s.Course}<br>
            <strong>Email:</strong> ${s.Email}<br>
            <strong>Phone:</strong> ${s.Phone}
        </div>
    `).join('');
}

function searchStudent(event) {
    event.preventDefault();
    const searchId = document.getElementById('searchStudentId').value;
    const students = JSON.parse(localStorage.getItem(DATA_KEYS.STUDENTS));
    const student = students.find(s => s.ID === searchId);
    
    const resultDiv = document.getElementById('searchStudentResult');
    if (student) {
        resultDiv.innerHTML = `
            <div class="record-item">
                <strong>ID:</strong> ${student.ID}<br>
                <strong>Name:</strong> ${student.Name}<br>
                <strong>Course:</strong> ${student.Course}<br>
                <strong>Email:</strong> ${student.Email}<br>
                <strong>Phone:</strong> ${student.Phone}
            </div>
        `;
    } else {
        resultDiv.innerHTML = '<div class="search-result empty">Student not found</div>';
    }
}

function updateStudent(event) {
    event.preventDefault();
    
    const id = document.getElementById('updateStudentId').value;
    const students = JSON.parse(localStorage.getItem(DATA_KEYS.STUDENTS));
    const student = students.find(s => s.ID === id);
    
    if (!student) {
        showNotification('Student not found!', 'error');
        return;
    }
    
    if (document.getElementById('updateStudentName').value) student.Name = document.getElementById('updateStudentName').value;
    if (document.getElementById('updateStudentCourse').value) student.Course = document.getElementById('updateStudentCourse').value;
    if (document.getElementById('updateStudentEmail').value) student.Email = document.getElementById('updateStudentEmail').value;
    if (document.getElementById('updateStudentPhone').value) student.Phone = document.getElementById('updateStudentPhone').value;
    
    localStorage.setItem(DATA_KEYS.STUDENTS, JSON.stringify(students));
    showNotification('Student updated successfully!');
    event.target.reset();
    closeModal('updateStudentModal');
    updateStats();
}

// ========== FACULTY FUNCTIONS ==========

function addFaculty(event) {
    event.preventDefault();
    
    const faculty = {
        ID: document.getElementById('facultyId').value,
        Name: document.getElementById('facultyName').value,
        Department: document.getElementById('facultyDept').value,
        Designation: document.getElementById('facultyDesig').value,
        Phone: document.getElementById('facultyPhone').value
    };
    
    let faculties = JSON.parse(localStorage.getItem(DATA_KEYS.FACULTY));
    faculties.push(faculty);
    localStorage.setItem(DATA_KEYS.FACULTY, JSON.stringify(faculties));
    
    showNotification('Faculty added successfully!');
    event.target.reset();
    closeModal('addFacultyModal');
    updateStats();
}

function loadFaculty() {
    const faculties = JSON.parse(localStorage.getItem(DATA_KEYS.FACULTY));
    const listDiv = document.getElementById('facultyList');
    
    if (faculties.length === 0) {
        listDiv.innerHTML = '<div class="no-data">No faculty found</div>';
        return;
    }
    
    listDiv.innerHTML = faculties.map(f => `
        <div class="record-item">
            <strong>ID:</strong> ${f.ID}<br>
            <strong>Name:</strong> ${f.Name}<br>
            <strong>Department:</strong> ${f.Department}<br>
            <strong>Designation:</strong> ${f.Designation}<br>
            <strong>Phone:</strong> ${f.Phone}
        </div>
    `).join('');
}

function searchFaculty(event) {
    event.preventDefault();
    const searchId = document.getElementById('searchFacultyId').value;
    const faculties = JSON.parse(localStorage.getItem(DATA_KEYS.FACULTY));
    const faculty = faculties.find(f => f.ID === searchId);
    
    const resultDiv = document.getElementById('searchFacultyResult');
    if (faculty) {
        resultDiv.innerHTML = `
            <div class="record-item">
                <strong>ID:</strong> ${faculty.ID}<br>
                <strong>Name:</strong> ${faculty.Name}<br>
                <strong>Department:</strong> ${faculty.Department}<br>
                <strong>Designation:</strong> ${faculty.Designation}<br>
                <strong>Phone:</strong> ${faculty.Phone}
            </div>
        `;
    } else {
        resultDiv.innerHTML = '<div class="search-result empty">Faculty not found</div>';
    }
}

function updateFaculty(event) {
    event.preventDefault();
    
    const id = document.getElementById('updateFacultyId').value;
    const faculties = JSON.parse(localStorage.getItem(DATA_KEYS.FACULTY));
    const faculty = faculties.find(f => f.ID === id);
    
    if (!faculty) {
        showNotification('Faculty not found!', 'error');
        return;
    }
    
    if (document.getElementById('updateFacultyName').value) faculty.Name = document.getElementById('updateFacultyName').value;
    if (document.getElementById('updateFacultyDept').value) faculty.Department = document.getElementById('updateFacultyDept').value;
    if (document.getElementById('updateFacultyDesig').value) faculty.Designation = document.getElementById('updateFacultyDesig').value;
    if (document.getElementById('updateFacultyPhone').value) faculty.Phone = document.getElementById('updateFacultyPhone').value;
    
    localStorage.setItem(DATA_KEYS.FACULTY, JSON.stringify(faculties));
    showNotification('Faculty updated successfully!');
    event.target.reset();
    closeModal('updateFacultyModal');
    updateStats();
}

// ========== COURSE FUNCTIONS ==========

function addCourse(event) {
    event.preventDefault();
    
    const course = {
        CourseID: document.getElementById('courseId').value,
        CourseName: document.getElementById('courseName').value,
        Faculty: document.getElementById('courseFaculty').value
    };
    
    let courses = JSON.parse(localStorage.getItem(DATA_KEYS.COURSES));
    courses.push(course);
    localStorage.setItem(DATA_KEYS.COURSES, JSON.stringify(courses));
    
    showNotification('Course added successfully!');
    event.target.reset();
    closeModal('addCourseModal');
    updateStats();
}

function loadCourses() {
    const courses = JSON.parse(localStorage.getItem(DATA_KEYS.COURSES));
    const listDiv = document.getElementById('coursesList');
    const detailsDiv = document.getElementById('courseDetails');
    
    if (courses.length === 0) {
        const noData = '<div class="no-data">No courses found</div>';
        if (listDiv) listDiv.innerHTML = noData;
        if (detailsDiv) detailsDiv.innerHTML = noData;
        return;
    }
    
    const html = courses.map(c => `
        <div class="record-item">
            <strong>Course ID:</strong> ${c.CourseID}<br>
            <strong>Course Name:</strong> ${c.CourseName}<br>
            <strong>Faculty:</strong> ${c.Faculty}
        </div>
    `).join('');
    
    if (listDiv) listDiv.innerHTML = html;
    if (detailsDiv) detailsDiv.innerHTML = html;
}

function assignFaculty(event) {
    event.preventDefault();
    
    const courseId = document.getElementById('assignCourseId').value;
    const courses = JSON.parse(localStorage.getItem(DATA_KEYS.COURSES));
    const course = courses.find(c => c.CourseID === courseId);
    
    if (!course) {
        showNotification('Course not found!', 'error');
        return;
    }
    
    course.Faculty = document.getElementById('assignFacultyName').value;
    localStorage.setItem(DATA_KEYS.COURSES, JSON.stringify(courses));
    
    showNotification('Faculty assigned successfully!');
    event.target.reset();
    closeModal('assignFacultyModal');
    updateStats();
}

// ========== FEES FUNCTIONS ==========

function addFee(event) {
    event.preventDefault();
    
    const fee = {
        StudentID: document.getElementById('feeStudentId').value,
        Amount: parseFloat(document.getElementById('feeAmount').value),
        Status: document.getElementById('feeStatus').value
    };
    
    let fees = JSON.parse(localStorage.getItem(DATA_KEYS.FEES));
    fees.push(fee);
    localStorage.setItem(DATA_KEYS.FEES, JSON.stringify(fees));
    
    showNotification('Fee record added successfully!');
    event.target.reset();
    closeModal('addFeeModal');
    updateStats();
}

function loadFees() {
    const fees = JSON.parse(localStorage.getItem(DATA_KEYS.FEES));
    const listDiv = document.getElementById('feesList');
    
    if (fees.length === 0) {
        listDiv.innerHTML = '<div class="no-data">No fee records found</div>';
        return;
    }
    
    listDiv.innerHTML = fees.map(f => `
        <div class="record-item">
            <strong>Student ID:</strong> ${f.StudentID}<br>
            <strong>Amount:</strong> ₹${f.Amount.toFixed(2)}<br>
            <strong>Status:</strong> <span style="color: ${f.Status === 'Paid' ? '#10b981' : '#f59e0b'}">${f.Status}</span>
        </div>
    `).join('');
}

function loadPendingFees() {
    const fees = JSON.parse(localStorage.getItem(DATA_KEYS.FEES));
    const pendingFees = fees.filter(f => f.Status.toLowerCase() === 'pending');
    const listDiv = document.getElementById('pendingFeesList');
    
    if (pendingFees.length === 0) {
        listDiv.innerHTML = '<div class="no-data">No pending fees</div>';
        return;
    }
    
    listDiv.innerHTML = pendingFees.map(f => `
        <div class="record-item">
            <strong>Student ID:</strong> ${f.StudentID}<br>
            <strong>Amount:</strong> ₹${f.Amount.toFixed(2)}<br>
            <strong>Status:</strong> <span style="color: #f59e0b">${f.Status}</span>
        </div>
    `).join('');
}

function generateReports() {
    const fees = JSON.parse(localStorage.getItem(DATA_KEYS.FEES));
    const reportsDiv = document.getElementById('feeReports');
    
    if (fees.length === 0) {
        reportsDiv.innerHTML = '<div class="no-data">No fee data available</div>';
        return;
    }
    
    const totalFees = fees.reduce((sum, f) => sum + f.Amount, 0);
    const paidAmount = fees.filter(f => f.Status === 'Paid').reduce((sum, f) => sum + f.Amount, 0);
    const pendingAmount = fees.filter(f => f.Status === 'Pending').reduce((sum, f) => sum + f.Amount, 0);
    const paidCount = fees.filter(f => f.Status === 'Paid').length;
    const pendingCount = fees.filter(f => f.Status === 'Pending').length;
    
    reportsDiv.innerHTML = `
        <div class="record-item">
            <strong>📊 Fee Report Summary</strong><br><br>
            <strong>Total Fees:</strong> ₹${totalFees.toFixed(2)}<br>
            <strong>Paid Amount:</strong> ₹${paidAmount.toFixed(2)} (${paidCount} records)<br>
            <strong>Pending Amount:</strong> ₹${pendingAmount.toFixed(2)} (${pendingCount} records)<br>
            <strong>Collection Rate:</strong> ${((paidAmount / totalFees) * 100).toFixed(2)}%
        </div>
    `;
}

// ========== STATISTICS ==========

function updateStats() {
    const students = JSON.parse(localStorage.getItem(DATA_KEYS.STUDENTS));
    const faculties = JSON.parse(localStorage.getItem(DATA_KEYS.FACULTY));
    const courses = JSON.parse(localStorage.getItem(DATA_KEYS.COURSES));
    const fees = JSON.parse(localStorage.getItem(DATA_KEYS.FEES));
    
    document.getElementById('totalStudents').textContent = students.length;
    document.getElementById('totalFaculty').textContent = faculties.length;
    document.getElementById('totalCourses').textContent = courses.length;
    
    const totalFeeAmount = fees.reduce((sum, f) => sum + f.Amount, 0);
    document.getElementById('totalFees').textContent = '₹' + totalFeeAmount.toFixed(0);
    // refresh charts when stats update
    try { renderCharts(); } catch (e) { /* charts may not be initialized yet */ }
}

// ------------------ Charts ------------------
let _charts = {};
function renderCharts() {
    const students = JSON.parse(localStorage.getItem(DATA_KEYS.STUDENTS)) || [];
    const courses = JSON.parse(localStorage.getItem(DATA_KEYS.COURSES)) || [];
    const fees = JSON.parse(localStorage.getItem(DATA_KEYS.FEES)) || [];

    // Students by Course
    const byCourse = {};
    students.forEach(s => { const key = s.Course || 'Unassigned'; byCourse[key] = (byCourse[key]||0) + 1; });
    // include courses with 0 students for context
    courses.forEach(c => { if (!byCourse[c.CourseName]) byCourse[c.CourseName] = byCourse[c.CourseName] || 0; });
    const courseLabels = Object.keys(byCourse);
    const courseData = courseLabels.map(l => byCourse[l]);

    const studentsCtx = document.getElementById('studentsByCourseChart');
    if (studentsCtx) {
        if (_charts.studentsByCourse) { _charts.studentsByCourse.data.labels = courseLabels; _charts.studentsByCourse.data.datasets[0].data = courseData; _charts.studentsByCourse.update(); }
        else {
            _charts.studentsByCourse = new Chart(studentsCtx, {
                type: 'bar',
                data: { labels: courseLabels, datasets: [{ label: 'Students', data: courseData, backgroundColor: courseLabels.map((_,i)=>`hsl(${(i*45)%360} 70% 55%)`) }] },
                options: { responsive:true, maintainAspectRatio:false, scales:{ y:{ beginAtZero:true } }, plugins:{ legend:{ display:false } } }
            });
        }
    }

    // Fees Status (Paid vs Pending)
    const paidCount = fees.filter(f => String(f.Status).toLowerCase() === 'paid').length;
    const pendingCount = fees.filter(f => String(f.Status).toLowerCase() === 'pending').length;
    const feesCtx = document.getElementById('feesStatusChart');
    if (feesCtx) {
        if (_charts.feesStatus) { _charts.feesStatus.data.datasets[0].data = [paidCount, pendingCount]; _charts.feesStatus.update(); }
        else {
            _charts.feesStatus = new Chart(feesCtx, {
                type: 'doughnut',
                data: { labels:['Paid','Pending'], datasets:[{ data:[paidCount,pendingCount], backgroundColor:["#10b981","#f59e0b"] }] },
                options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom' } } }
            });
        }
    }
}

// ensure charts resize nicely: set a min-height on canvases
window.addEventListener('load', function() {
    const s = document.getElementById('studentsByCourseChart'); if (s) { s.style.minHeight = '220px'; }
    const f = document.getElementById('feesStatusChart'); if (f) { f.style.minHeight = '220px'; }
});

// Initialize on page load
window.addEventListener('load', function() {
    initializeData();
    updateStats();
    updateAuthUI();
});

// Lightweight tilt effect for cards (mouse move -> 3D tilt)
function addTiltEffect(selector, maxTilt = 12) {
    const nodes = document.querySelectorAll(selector);
    nodes.forEach(node => {
        let bounds;
        node.addEventListener('mouseenter', () => { bounds = node.getBoundingClientRect(); node.style.transition = 'transform 0.18s ease'; });
        node.addEventListener('mousemove', (e) => {
            const x = e.clientX - bounds.left;
            const y = e.clientY - bounds.top;
            const px = (x / bounds.width) - 0.5;
            const py = (y / bounds.height) - 0.5;
            const rotY = (px * maxTilt).toFixed(2);
            const rotX = (-py * maxTilt).toFixed(2);
            node.style.transform = `translateZ(8px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
        });
        node.addEventListener('mouseleave', () => { node.style.transform = ''; node.style.transition = 'transform 0.4s cubic-bezier(.2,.8,.2,1)'; });
    });
}

window.addEventListener('load', function() {
    // Apply tilt to module and stat cards where pointer is available
    if (window.matchMedia('(pointer:fine)').matches) {
        addTiltEffect('.module-card', 10);
        addTiltEffect('.stat-card', 8);
    }
});

// ========== AUTHENTICATION ==========

function signup(event) {
    event.preventDefault();
    const email = document.getElementById('signupEmail').value.trim().toLowerCase();
    const pwd = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirmPassword').value;

    if (pwd !== confirm) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    const users = JSON.parse(localStorage.getItem(AUTH_KEYS.USERS));
    if (users.find(u => u.email === email)) {
        showNotification('User already exists', 'error');
        return;
    }

    users.push({ email, password: pwd });
    localStorage.setItem(AUTH_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(AUTH_KEYS.CURRENT, JSON.stringify({ email }));
    showNotification('Account created — logged in');
    closeModal('signupModal');
    updateAuthUI();
}

function login(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const pwd = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem(AUTH_KEYS.USERS));
    const user = users.find(u => u.email === email && u.password === pwd);
    if (!user) {
        showNotification('Invalid credentials', 'error');
        return;
    }

    localStorage.setItem(AUTH_KEYS.CURRENT, JSON.stringify({ email }));
    showNotification('Logged in successfully');
    closeModal('loginModal');
    updateAuthUI();
}

function logout() {
    localStorage.removeItem(AUTH_KEYS.CURRENT);
    showNotification('Logged out');
    updateAuthUI();
}

function updateAuthUI() {
    const authArea = document.getElementById('authArea');
    const current = JSON.parse(localStorage.getItem(AUTH_KEYS.CURRENT));
    if (!authArea) return;

    if (current && current.email) {
        authArea.innerHTML = `<span style="color:white">Welcome, ${current.email}</span> | <a href="#" class="nav-link" onclick="logout()">Logout</a>`;
    } else {
        authArea.innerHTML = `<a href="#" class="nav-link" id="loginLink" onclick="openModal('loginModal')">Log In</a> | <a href="#" class="nav-link" id="signupLink" onclick="openModal('signupModal')">Sign Up</a>`;
    }
}

console.log('College Management System Frontend with Data Storage Loaded Successfully!');
