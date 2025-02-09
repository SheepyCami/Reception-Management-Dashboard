# WeDeliverTECH™ Reception Management Dashboard

## Overview

- This web application is designed for the fake company "WeDeliverTECH™ to manage staff out-of-office tracking and delivery monitoring efficiently.
- The dashboard enables receptionists to clock staff in and out, track expected return times,
  and receive alerts when someone is overdue.
- Additionally, it manages delivery drivers, their availability, and expected return times.

## Features

### **Staff Management**

- Track staff members who clock in/out of the office.
- Prompt for absence duration and calculate return time.
- Display a toast notification for overdue staff.

### **Delivery Tracking**

- Log delivery driver details, including vehicle type and return time.
- Display vehicle icons for quick identification.
- Notify the receptionist when a driver is overdue.
- Allow clearing completed deliveries with confirmation.

### **Additional Functionality**

- **Live Digital Clock:** Displays current date and time (updated every second).
- **User Experience Enhancements:** Button animations and UI improvements.
- **API Integration:** Fetch staff details from [RandomUser API](https://randomuser.me/).
- **OOP Design:** Implements object-oriented JavaScript principles.

## Tech Stack

- **Bootstrap** (UI framework)
- **JavaScript / jQuery** (for functionality)
- **OOP Concepts** (for structured code)

## Installation & Setup

You should have the following folders and files:

- Documentation folder
- Web Application folder
- and this README.md file

### Documentation Folder

Inside the Documentation folder, you will find "Jira.pdf", where the entire project is documented as well as a reflection report. Here, I will explain why certain choices were made for the application.

### Web Application Folder

Inside the Web Application folder, you should have:

- `Index.html`
- `jquery-3.7.0.js`
- `wdt_app.js`
- `wdt_styles.css`
- `Company logo.png`

## How to Run Your Application

1. Open the `Index.html` file inside the Web Application folder to run the website. If you are experiencing errors, make sure you have jQuery installed and Bootstrap:

   - Bootstrap version 5.3.3 was used in this project to handle all the bootstrap styling from: [Bootstrap 5.3.3](https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css)
   - jQuery version 3.7.0 was used for this project. You can download it from: [jQuery 3.7.0](https://code.jquery.com/jquery-3.7.0.js)
   - jQuery UI: Version 1.12.1 is used for enhanced UI components such as Autocomplete. Download it from [jQuery UI 1.12.1](https://code.jquery.com/ui/1.12.1/jquery-ui.js). Make sure the UI is after the jQuery 3.7.0 in the index.html file, as it depends on it to function.

2. The website is using icons from: [Bootstrap Icons 1.11.3](https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css)
3. As well as SWAL (Sweet Alerts) from: [SweetAlert2](https://cdn.jsdelivr.net/npm/sweetalert2@11)
4. All of the styling is inside a single CSS file: `wdt_styles.css`
5. Make sure all the files are placed correctly in their folders.

### Additional Tips

- Make sure you have a modern web browser such as Google Chrome.
- If you are still experiencing errors, make sure all the files are in their correct folders.
- If the website still won't work after following all these steps, contact me directly!
