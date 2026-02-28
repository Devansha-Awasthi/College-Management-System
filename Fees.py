import json

FILE = "data/fees.json"

def load_data():
    try:
        with open(FILE, "r") as f:
            return json.load(f)
    except:
        return []

def save_data(data):
    with open(FILE, "w") as f:
        json.dump(data, f, indent=4)

def add_fee():
    fees = load_data()
    sid = input("Enter Student ID: ")
    amount = float(input("Enter Fee Amount: "))
    status = input("Enter Status (Paid/Pending): ")
    fees.append({
        "StudentID": sid,
        "Amount": amount,
        "Status": status
    })
    save_data(fees)
    print("Fee Record Added")

def view_fees():
    fees = load_data()
    if not fees:
        print("No Fee Records Found")
        return
    for f in fees:
        print(f)

def pending_fees():
    fees = load_data()
    found = False
    for f in fees:
        if f["Status"].lower() == "pending":
            print(f)
            found = True
    if not found:
        print("No Pending Fees")

def fees_menu():
    while True:
        print("\n--- Fees & Reports ---")
        print("1. Add Fee Payment")
        print("2. View All Fees")
        print("3. View Pending Fees")
        print("4. Back")

        ch = int(input("Enter choice: "))

        if ch == 1:
            add_fee()
        elif ch == 2:
            view_fees()
        elif ch == 3:
            pending_fees()
        elif ch == 4:
            break
        else:
            print("Invalid Choice")