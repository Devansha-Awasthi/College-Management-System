import json
import os

FILE = "data/alumni.json"

def load_data():
    try:
        with open(FILE, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        return []

def is_unique_aid(alumni, aid):
    return all(a["ID"] != aid for a in alumni)

def add_alumni():
    alumni = load_data()
    aid = input("Enter Alumni ID: ").strip()
    if not is_unique_aid(alumni, aid):
        print("Alumni ID already exists! Try again.")
        return

    name = input("Enter Name: ").strip()
    grad_year = input("Enter Graduation Year: ").strip()
    degree = input("Enter Degree: ").strip()
    email = input("Enter Email: ").strip()
    employer = input("Enter Current Employer: ").strip()
    location = input("Enter Location: ").strip()

    alumni.append({
        "ID": aid,
        "Name": name,
        "GraduationYear": grad_year,
        "Degree": degree,
        "Email": email,
        "Employer": employer,
        "Location": location
    })
    save_data(alumni)
    print("Alumni Added Successfully")

def view_alumni():
    alumni = load_data()
    if not alumni:
        print("No alumni records found.")
        return

    print("\n--- Alumni List ---")
    for i, a in enumerate(alumni, start=1):
        print(f"{i}. ID: {a['ID']} | Name: {a['Name']} | Grad: {a.get('GraduationYear','N/A')} | Degree: {a.get('Degree','N/A')} | Employer: {a.get('Employer','N/A')} | Location: {a.get('Location','N/A')}")

def search_alumni():
    alumni = load_data()
    if not alumni:
        print("No alumni records found.")
        return

    aid = input("Enter Alumni ID to Search: ").strip()
    for a in alumni:
        if a["ID"] == aid:
            print("\nAlumni Found:")
            print(f"ID: {a['ID']}")
            print(f"Name: {a['Name']}")
            print(f"Graduation Year: {a.get('GraduationYear','N/A')}")
            print(f"Degree: {a.get('Degree','N/A')}")
            print(f"Email: {a.get('Email','N/A')}")
            print(f"Employer: {a.get('Employer','N/A')}")
            print(f"Location: {a.get('Location','N/A')}")
            return

    print("Alumni not found.")

def update_alumni():
    alumni = load_data()
    if not alumni:
        print("No alumni records found.")
        return

    aid = input("Enter Alumni ID to Update: ").strip()
    for a in alumni:
        if a["ID"] == aid:
            print("\nLeave blank to keep old value.")
            new_name = input(f"Enter New Name ({a['Name']}): ").strip()
            new_grad = input(f"Enter New Graduation Year ({a.get('GraduationYear','N/A')}): ").strip()
            new_degree = input(f"Enter New Degree ({a.get('Degree','N/A')}): ").strip()
            new_email = input(f"Enter New Email ({a.get('Email','N/A')}): ").strip()
            new_employer = input(f"Enter New Employer ({a.get('Employer','N/A')}): ").strip()
            new_location = input(f"Enter New Location ({a.get('Location','N/A')}): ").strip()

            if new_name: a['Name'] = new_name
            if new_grad: a['GraduationYear'] = new_grad
            if new_degree: a['Degree'] = new_degree
            if new_email: a['Email'] = new_email
            if new_employer: a['Employer'] = new_employer
            if new_location: a['Location'] = new_location

            save_data(alumni)
            print("Alumni Updated Successfully")
            return

    print("Alumni not found.")

def delete_alumni():
    alumni = load_data()
    if not alumni:
        print("No alumni records found.")
        return

    aid = input("Enter Alumni ID to Delete: ").strip()
    for i, a in enumerate(alumni):
        if a["ID"] == aid:
            alumni.pop(i)
            save_data(alumni)
            print("Alumni Deleted Successfully")
            return

    print("Alumni not found.")

def alumni_menu():
    while True:
        print("\n--- Alumni Section ---")
        print("1. Add Alumni")
        print("2. View Alumni")
        print("3. Search Alumni")
        print("4. Update Alumni")
        print("5. Delete Alumni")
        print("6. Back")

        try:
            ch = int(input("Enter choice: "))
        except ValueError:
            print("Invalid input. Enter a number.")
            continue

        if ch == 1:
            add_alumni()
        elif ch == 2:
            view_alumni()
        elif ch == 3:
            search_alumni()
        elif ch == 4:
            update_alumni()
        elif ch == 5:
            delete_alumni()
        elif ch == 6:
            break
        else:
            print("Invalid choice")

if __name__ == "__main__":
    alumni_menu()
