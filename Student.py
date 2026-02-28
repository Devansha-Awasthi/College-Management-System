import json
import os

FILE = "data/students.json"

def load_data():
    try:
        with open(FILE, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        return []

def save_data(data):
    os.makedirs(os.path.dirname(FILE), exist_ok=True)
    with open(FILE, "w") as f:
        json.dump(data, f, indent=4)

def is_unique_sid(students, sid):
    return all(s["ID"] != sid for s in students)

def add_student():
    students = load_data()
    sid = input("Enter Student ID: ").strip()
    
    if not is_unique_sid(students, sid):
        print("Student ID already exists! Try again.")
        return
    
    name = input("Enter Student Name: ").strip()
    course = input("Enter Course: ").strip()
    email = input("Enter Email: ").strip()
    phone = input("Enter Phone: ").strip()
    
    students.append({
        "ID": sid,
        "Name": name,
        "Course": course,
        "Email": email,
        "Phone": phone
    })
    save_data(students)
    print("Student Added Successfully")

def view_students():
    students = load_data()
    if not students:
        print("No students found.")
        return
    
    print("\n--- Student List ---")
    for i, s in enumerate(students, start=1):
        email = s.get('Email', 'N/A')
        phone = s.get('Phone', 'N/A')
        print(f"{i}. ID: {s['ID']} | Name: {s['Name']} | Course: {s['Course']} | Email: {email} | Phone: {phone}")

def search_student():
    students = load_data()
    if not students:
        print("No students found.")
        return
    
    sid = input("Enter Student ID to Search: ").strip()
    for s in students:
        if s["ID"] == sid:
            print("\nStudent Found:")
            print(f"ID: {s['ID']}")
            print(f"Name: {s['Name']}")
            print(f"Course: {s['Course']}")
            print(f"Email: {s.get('Email', 'N/A')}")
            print(f"Phone: {s.get('Phone', 'N/A')}")
            return
    
    print("Student not found.")

def update_student():
    students = load_data()
    if not students:
        print("No students found.")
        return
    
    sid = input("Enter Student ID to Update: ").strip()
    for s in students:
        if s["ID"] == sid:
            print("\nLeave blank to keep old value.")
            new_name = input(f"Enter New Name ({s['Name']}): ").strip()
            new_course = input(f"Enter New Course ({s['Course']}): ").strip()
            new_email = input(f"Enter New Email ({s.get('Email', 'N/A')}): ").strip()
            new_phone = input(f"Enter New Phone ({s.get('Phone', 'N/A')}): ").strip()
            
            if new_name: s["Name"] = new_name
            if new_course: s["Course"] = new_course
            if new_email: s["Email"] = new_email
            if new_phone: s["Phone"] = new_phone
            
            save_data(students)
            print("Student Updated Successfully")
            return
    
    print("Student not found.")

def delete_student():
    students = load_data()
    if not students:
        print("No students found.")
        return
    
    sid = input("Enter Student ID to Delete: ").strip()
    for i, s in enumerate(students):
        if s["ID"] == sid:
            students.pop(i)
            save_data(students)
            print("Student Deleted Successfully")
            return
    
    print("Student not found.")

def student_menu():
    while True:
        print("\n--- Student Management ---")
        print("1. Add Student")
        print("2. View Students")
        print("3. Search Student")
        print("4. Update Student")
        print("5. Delete Student")
        print("6. Back")

        try:
            ch = int(input("Enter choice: "))
        except ValueError:
            print("Invalid input. Enter a number.")
            continue

        if ch == 1:
            add_student()
        elif ch == 2:
            view_students()
        elif ch == 3:
            search_student()
        elif ch == 4:
            update_student()
        elif ch == 5:
            delete_student()
        elif ch == 6:
            break
        else:
            print("Invalid choice")

if __name__ == "__main__":
    student_menu()
