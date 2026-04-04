import json
from faculty import faculty_menu
from Course import course_menu
from Student import student_menu
from Fees import fees_menu
from Alumni import alumni_menu

FILE = "data/students.json"

def load_data():
    try:
        with open(FILE, "r") as f:
            return json.load(f)
    except:
        return []

def save_data(data):
    with open(FILE, "w") as f:
        json.dump(data, f, indent=4)

def add_student():
    students = load_data()
    sid = input("Enter Student ID: ")
    name = input("Enter Name: ")
    course = input("Enter Course: ")
    students.append({"ID": sid, "Name": name, "Course": course})
    save_data(students)
    print("Student Added Successfully")

def view_students():
    students = load_data()
    for s in students:
        print(s)


if __name__ == "__main__":
    while True:
        print("\n===== COLLEGE MANAGEMENT SYSTEM =====")
        print("1. Student Management")
        print("2. Faculty Management")
        print("3. Course Management")
        print("4. Fees & Reports")
        print("5. Alumni Section")
        print("6. Exit")

        choice = int(input("Enter your choice: "))

        if choice == 1:
            student_menu()
        elif choice == 2:
            faculty_menu()
        elif choice == 3:
            course_menu()
        elif choice == 4:
            fees_menu()
        elif choice == 5:
            alumni_menu()
        elif choice == 6:
            print("Thank You!")
            break
        else:
            print("Invalid choice")
