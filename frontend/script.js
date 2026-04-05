// API Base URL
const API_URL = '';

// Global instances to prevent memory leaks and "ghost" charts
let studentsChartInstance = null;
let feesChartInstance = null;

// Helper to show notifications
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        background-color: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white; padding: 1rem 2rem; border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 2000; animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => { notification.remove(); }, 3000);
}

// Modal Controls
function openModal(modalId) { document.getElementById(modalId).classList.add('active'); }
function closeModal(modalId) { document.getElementById(modalId).classList.remove('active'); }

// ========== STUDENT FUNCTIONS ==========

async function addStudent(event) {
    event.preventDefault();
    
    const studentData = {
        id: document.getElementById('studentId').value,
        name: document.getElementById('studentName').value,
        course: document.getElementById('studentCourse').value,
        email: document.getElementById('studentEmail').value,
        phone: document.getElementById('studentPhone').value
    };

    try {
        const response = await fetch(`${API_URL}/api/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData)
        });

        if (response.ok) {
            showNotification('Student added successfully!');
            event.target.reset();
            closeModal('addStudentModal');
            // Refresh data
            await loadStudents(); 
            await updateStats();
        }
    } catch (error) {
        showNotification('Server connection failed', 'error');
    }
}

async function loadStudents() {
    const listDiv = document.getElementById('studentsList');
    if (!listDiv) return;

    try {
        const response = await fetch(`${API_URL}/api/students`);
        const students = await response.json();

        if (!students || students.length === 0) {
            listDiv.innerHTML = '<div class="no-data">No students in database</div>';
            return;
        }

        listDiv.innerHTML = students.map(s => `
            <div class="record-item">
                <strong>ID:</strong> ${s.ID}<br>
                <strong>Name:</strong> ${s.Name}<br>
                <strong>Course:</strong> ${s.Course}
            </div>
        `).join('');
    } catch (error) {
        listDiv.innerHTML = '<div class="no-data">Error loading data</div>';
    }
}

// ========== STATS & CHARTS ==========

async function updateStats() {
    try {
        const response = await fetch(`${API_URL}/api/students`);
        const students = await response.json();
        
        const totalElem = document.getElementById('totalStudents');
        if (totalElem) totalElem.textContent = students.length;
        
        // Initial render
        renderCharts(students);
    } catch (e) {
        console.error("Stats update failed:", e);
    }
}

function renderCharts(students) {
    const sCanvas = document.getElementById('studentsByCourseChart');
    const fCanvas = document.getElementById('feesStatusChart');
    
    if (!sCanvas || !fCanvas) return;

    const studentsCtx = sCanvas.getContext('2d');
    const feesCtx = fCanvas.getContext('2d');

    // 1. Process Data
    const courseCounts = {};
    students.forEach(s => { 
        const cName = s.Course || 'Unknown';
        courseCounts[cName] = (courseCounts[cName] || 0) + 1; 
    });

    // 2. Destroy existing charts to kill the resize loop
    if (studentsChartInstance) studentsChartInstance.destroy();
    if (feesChartInstance) feesChartInstance.destroy();

    // 3. Chart Config shared options
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false, // Forces chart to respect the div height
        animation: { duration: 500 },
        plugins: {
            legend: { position: 'bottom' }
        }
    };

    // 4. Create Students Chart
    studentsChartInstance = new Chart(studentsCtx, {
        type: 'bar',
        data: {
            labels: Object.keys(courseCounts),
            datasets: [{
                label: 'Students',
                data: Object.values(courseCounts),
                backgroundColor: '#3b82f6',
                borderRadius: 5
            }]
        },
        options: {
            ...commonOptions,
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
        }
    });

    // 5. Create Fees Chart
    feesChartInstance = new Chart(feesCtx, {
        type: 'doughnut',
        data: {
            labels: ['Paid', 'Pending'],
            datasets: [{
                data: [5, 2], // Dummy data for visual
                backgroundColor: ['#10b981', '#f59e0b']
            }]
        },
        options: commonOptions
    });
}

// Initialize on Load
window.addEventListener('load', () => {
    loadStudents();
    updateStats();
    
    // Add custom handler to stop "The Blink" on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (studentsChartInstance) studentsChartInstance.resize();
            if (feesChartInstance) feesChartInstance.resize();
        }, 250);
    });
});