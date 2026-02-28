import json
import os

FILE = "data/faculty.json"

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

def is_unique_fid(faculty, fid):
    return all(f["ID"] != fid for f in faculty)

def add_faculty():
    faculty = load_data()
    fid = input("Enter Faculty ID: ").strip()

    if not is_unique_fid(faculty, fid):
        print("Faculty ID already exists! Try again.")
        return

    name = input("Enter Name: ").strip()
    department = input("Enter Department: ").strip()
    designation = input("Enter Designation: ").strip()
    phone = input("Enter Phone: ").strip()

    faculty.append({
        "ID": fid,
        "Name": name,
        "Department": department,
        "Designation": designation,
        "Phone": phone
    })

    save_data(faculty)
    print("Faculty Added Successfully")

def view_faculty():
    faculty = load_data()
    if not faculty:
        print("No faculty found.")
        return

    print("\n--- Faculty List ---")
    for i, f in enumerate(faculty, start=1):
        print(f"{i}. ID: {f['ID']} | Name: {f['Name']} | Dept: {f['Department']} | "
              f"Desig: {f['Designation']} | Phone: {f['Phone']}")

def search_faculty():
    faculty = load_data()
    if not faculty:
        print("No faculty found.")
        return

    fid = input("Enter Faculty ID to Search: ").strip()
    for f in faculty:
        if f["ID"] == fid:
            print("\nFaculty Found:")
            print(f"ID: {f['ID']}")
            print(f"Name: {f['Name']}")
            print(f"Department: {f['Department']}")
            print(f"Designation: {f['Designation']}")
            print(f"Phone: {f['Phone']}")
            return

    print("Faculty not found.")

def update_faculty():
    faculty = load_data()
    if not faculty:
        print("No faculty found.")
        return

    fid = input("Enter Faculty ID to Update: ").strip()
    for f in faculty:
        if f["ID"] == fid:
            print("\nLeave blank to keep old value.")
            new_name = input(f"Enter New Name ({f['Name']}): ").strip()
            new_dept = input(f"Enter New Department ({f['Department']}): ").strip()
            new_desig = input(f"Enter New Designation ({f['Designation']}): ").strip()
            new_phone = input(f"Enter New Phone ({f['Phone']}): ").strip()

            if new_name: f["Name"] = new_name
            if new_dept: f["Department"] = new_dept
            if new_desig: f["Designation"] = new_desig
            if new_phone: f["Phone"] = new_phone

            save_data(faculty)
            print("Faculty Updated Successfully")
            return

    print("Faculty not found.")

def delete_faculty():
    faculty = load_data()
    if not faculty:
        print("No faculty found.")
        return

    fid = input("Enter Faculty ID to Delete: ").strip()
    for i, f in enumerate(faculty):
        if f["ID"] == fid:
            faculty.pop(i)
            save_data(faculty)
            print("Faculty Deleted Successfully")
            return

    print("Faculty not found.")

def faculty_menu():
    while True:
        print("\n--- Faculty Management ---")
        print("1. Add Faculty")
        print("2. View Faculty")
        print("3. Search Faculty")
        print("4. Update Faculty")
        print("5. Delete Faculty")
        print("6. Salary report")
        print("7. Back")

        try:
            ch = int(input("Enter choice: "))
        except ValueError:
            print("Invalid input. Enter a number.")
            continue

        if ch == 1:
            add_faculty()
        elif ch == 2:
            view_faculty()
        elif ch == 3:
            search_faculty()
        elif ch == 4:
            update_faculty()
        elif ch == 5:
            delete_faculty()
        elif ch == 6:
            break
        else:
            print("Invalid choice")


if __name__ == "__main__":
    faculty_menu()
