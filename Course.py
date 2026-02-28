import json

FILE = "data/courses.json"

def load_data():
    try:
        with open(FILE, "r") as f:
            return json.load(f)
    except:
        return []

def save_data(data):
    with open(FILE, "w") as f:
        json.dump(data, f, indent=4)

def add_course():
    courses = load_data()
    cid = input("Enter Course ID: ")
    cname = input("Enter Course Name: ")
    faculty = input("Assign Faculty Name: ")
    courses.append({
        "CourseID": cid,
        "CourseName": cname,
        "Faculty": faculty
    })
    save_data(courses)
    print("Course Added Successfully")

def view_courses():
    courses = load_data()
    if not courses:
        print("No Courses Found")
        return
    for c in courses:
        print(c)

def assign_faculty():
    courses = load_data()
    cid = input("Enter Course ID: ")
    for c in courses:
        if c["CourseID"] == cid:
            c["Faculty"] = input("Enter New Faculty Name: ")
            save_data(courses)
            print("Faculty Assigned Successfully")
            return
    print("Course Not Found")

def course_menu():
    while True:
        print("\n--- Course Management ---")
        print("1. Add Course")
        print("2. View Courses")
        print("3. Assign Faculty")
        print("4. Back")

        ch = int(input("Enter choice: "))

        if ch == 1:
            add_course()
        elif ch == 2:
            view_courses()
        elif ch == 3:
            assign_faculty()
        elif ch == 4:
            break
        else:
            print("Invalid Choice")