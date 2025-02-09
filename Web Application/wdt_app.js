//Parent class:
class Employee {
  constructor(name, surname) {
    this.name = name;
    this.surname = surname;
  }
}

// Child classes under Parent: StaffMember and DeliveryDriver:
class StaffMember extends Employee {
  constructor(name, surname, picture, email) {
    super(name, surname);
    this.picture = picture;
    this.email = email;
    this.status = "in";
    this.outtime = "";
    this.duration = "";
    this.expectedReturnTime = "";
  }
  // Staff Is Late:
  staffMemberisLate() {
    const currentTime = new Date();
    const expectedReturn = new Date(this.expectedReturnTime);
    return currentTime > expectedReturn;
  }
}

// Child class number 2, Delivery Driver:
class DeliveryDriver extends Employee {
  constructor(name, surname, vehicle, telephone) {
    super(name, surname);
    this.vehicle = vehicle;
    this.telephone = telephone;
    this.deliverAddress = "";
    this.returnTime = "";
  }

  // Delivery Driver Is Late:

  deliveryDriverIsLate() {
    const currentTime = new Date();
    if (this.returnTime) {
      const [returnHours, returnMinutes] = this.returnTime
        .split(":")
        .map(Number);
      const currentSeconds =
        currentTime.getHours() * 3600 +
        currentTime.getMinutes() * 60 +
        currentTime.getSeconds();
      const returnSeconds = returnHours * 3600 + returnMinutes * 60;

      return currentSeconds > returnSeconds;
    }
    return false;
  }

  getFormattedReturnTime() {
    const [hours, minutes] = this.returnTime.split(":");
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  }

  showLateNotification() {
    const toastHtml = `
        <div class="toast bg-danger" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false" style="min-width: 400px;">
            <div class="toast-header">
                <strong class="me-auto" style="color: red;">Delivery Driver Delay Alert!</strong>
                <i class="bi bi-bell-fill"></i>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                <strong>Name:</strong> ${this.name} ${
      this.surname
    } is delayed<br>
                <strong>Address:</strong> ${this.deliverAddress}<br>
                <strong>Telephone:</strong> ${this.telephone}<br>
                <strong>Estimated return time:</strong> ${this.getFormattedReturnTime()}<br>
            </div>
        </div>
    `;

    $("#toastContainer").append(toastHtml);
    $(".toast").last().toast("show");
  }
}

function checkDeliveryDriversLate() {
  deliveryDrivers.forEach((driver) => {
    if (driver.deliveryDriverIsLate() && !driver.alertShown) {
      driver.showLateNotification();
      driver.alertShown = true;
    }
  });
}
// Check if the driver is late every 1 minute.
setInterval(checkDeliveryDriversLate, 1000);

// Global Array:
const staffMembers = [];
const deliveryDrivers = [];

//API Calls:
function staffUserGet() {
  $.ajax({
    url: "https://randomuser.me/api/?results=5",
    dataType: "json",
    success: function (response) {
      const staffMembers = response.results.map((user) =>
        createEmployeeMember(user)
      );
      setupAutocomplete(staffMembers);
    },
    error: function () {
      console.error("Failed to fetch data from API.");
    },
  });
}

function createEmployeeMember(user) {
  const staffMember = new StaffMember(
    user.name.first,
    user.name.last,
    user.picture.large,
    user.email
  );
  staffMembers.push(staffMember);
  insertStaffMemberIntoTable(staffMember);
  return staffMember; // Return the new staff member
}

$(document).ready(function () {
  //API call to populate the table
  staffUserGet();

  $("#staffTableBody").on("click", "tr", function () {
    $("#staffTableBody tr").removeClass("selected");
    $(this).addClass("selected");

    //This will confirm that the selection works by showing selected employee in the console, please press f12 to see the console. (Because of an issues with the CSS, the table row sadly does not turn green when selected)
    console.log("Selected employee: ", $(this).find("td:nth-child(2)").text());
  });
  setInterval(checkForDelays, 1000);
});

function insertStaffMemberIntoTable(staffMember) {
  const $staffTableBody = $("#staffTableBody");

  const $newRow = $("<tr>").on("click", function () {
    $("tr").removeClass("selected");
    $(this).addClass("selected");
  });
  $newRow.append(
    $("<td>").append(
      $("<img>", {
        src: staffMember.picture,
        alt: `${staffMember.name} ${staffMember.surname}`,
        width: 50,
      })
    )
  );
  $newRow.append($("<td>").text(staffMember.name));
  $newRow.append($("<td>").text(staffMember.surname));
  $newRow.append($("<td>").text(staffMember.email));
  $newRow.append($("<td>").text(staffMember.status));
  $newRow.append($("<td>").text(staffMember.outtime || ""));
  $newRow.append($("<td>").text(staffMember.duration || ""));
  $newRow.append($("<td>").text(staffMember.expectedReturnTime || ""));

  $staffTableBody.append($newRow);
}

// Digital Clock function

class DateTimeUtility {
  // Retrieve the current date in a readable format
  static getCurrentDate() {
    const date = new Date();
    return `${date.getDate()} ${date.toLocaleString("default", {
      month: "long",
    })} ${date.getFullYear()}`;
  }

  // Retrieve the current time in HH:MM:SS format
  static getCurrentTime() {
    const date = new Date();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  // Display the current date and time in the specified jQuery selector
  static displayDateTime(selector) {
    const dateString = this.getCurrentDate();
    const timeString = this.getCurrentTime();
    $(selector).text(`DATE ${dateString} TIME ${timeString}`);
  }
}

function updateDigitalClock() {
  DateTimeUtility.displayDateTime("#timeDate");
}

// Update the clock every second
setInterval(updateDigitalClock, 1000);

//StaffOut Function

function staffOut() {
  const $selectedRow = $("tr.selected");
  if ($selectedRow.length === 0) {
    Swal.fire({
      title: "Warning",
      text: "Please Select a staff member first.",
      icon: "warning",
      confirmButtonText: "Close",
    });
    return;
  }
  const name = $selectedRow.find("td:nth-child(2)").text();
  const surname = $selectedRow.find("td:nth-child(3)").text();

  $("#durationModalLabel").text(
    `Enter out time for ${name} ${surname} in minutes:`
  );
  $("#durationModal").modal("show");
}

// StaffIn Function:
function staffIn() {
  const $selectedRow = $("#staffTableBody tr.selected");
  if ($selectedRow.length === 0) {
    Swal.fire({
      title: "Warning!",
      text: "Please select a staff member",
      icon: "warning",
      confirmButtonText: "Close",
    });
    return;
  }
  const selectedRowIndex = $selectedRow.index();
  const staffMember = staffMembers[selectedRowIndex];

  if (staffMember && staffMember.status === "out") {
    staffMember.status = "in";
    staffMember.outtime = "";
    staffMember.duration = "";
    staffMember.expectedReturnTime = "";

    // Update the table visually
    $selectedRow.find("td:nth-child(5)").text("in");
    $selectedRow.find("td:nth-child(6)").text("");
    $selectedRow.find("td:nth-child(7)").text("");
    $selectedRow.find("td:nth-child(8)").text("");

    // Show success message
    Swal.fire({
      title: "Success!",
      text: "Staff member is back in office!",
      icon: "success",
      confirmButtonText: "OK",
    });
  } else {
    Swal.fire({
      icon: "warning",
      title: "Warning",
      text: "The selected staff member is not out of office",
      confirmButtonText: "Close",
    });
  }

  $("tr.selected").removeClass("selected");
}

//staffMember is late,

function staffMemberIsLate(staffMember, index) {
  if (staffMember.alertShown) {
    return;
  }

  const totalMinutes = parseInt(staffMember.duration);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const toastHtml = `
  <div class="toast bg-danger" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false" style="min-width: 400px;">
      <div class="toast-header">
      <strong class="me-auto" style="color: red;">Staff Delay Alert!</strong>
      <i class="bi bi-bell-fill" "></i>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
          <img src="${staffMember.picture}" alt="${staffMember.name} ${staffMember.surname}" width="50" class="rounded me-2">
          <strong>${staffMember.name} ${staffMember.surname}</strong> is delayed.
          <div><strong>Time out-of-office:</strong> ${hours} hr : ${minutes} min</div>
      </div>
  </div>
`;

  $("#toastContainer").append(toastHtml);
  $(".toast").last().toast("show");
  staffMember.alertShown = true;
}

//check for delays function:

function checkForDelays() {
  const currentTime = new Date();

  staffMembers.forEach((staffMember, index) => {
    if (staffMember.status === "out" && staffMember.expectedReturnTime) {
      if (staffMember.staffMemberisLate()) {
        staffMemberIsLate(staffMember, index);
      }
    }
  });
}

//Submit Duration Function

function submitDuration() {
  const durationInput = $("#durationInput").val();
  const duration = parseInt(durationInput, 10);

  if (!isNaN(duration) && duration >= 0) {
    const $selectedRow = $("tr.selected");
    if ($selectedRow.length === 0) {
      showSelectMemberToast("Please select a staff member first.");
      return;
    }

    const selectedRowIndex = $selectedRow.index();
    const staffMember = staffMembers[selectedRowIndex];

    if (!staffMember) {
      console.log("Error: Staff member not found in array.");
      return;
    }

    staffMember.status = "out";
    staffMember.outtime = DateTimeUtility.getCurrentTime();
    staffMember.duration = duration;
    const expectedReturnTime = new Date();
    expectedReturnTime.setMinutes(expectedReturnTime.getMinutes() + duration);

    staffMember.expectedReturnTime = expectedReturnTime.toISOString();

    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    const durationFormatted = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;

    $selectedRow.find("td:nth-child(5)").text(staffMember.status);
    $selectedRow.find("td:nth-child(6)").text(staffMember.outtime);
    $selectedRow.find("td:nth-child(7)").text(durationFormatted);
    $selectedRow
      .find("td:nth-child(8)")
      .text(expectedReturnTime.toLocaleTimeString());

    $("#durationModal").modal("hide");
    $("#durationInput").val("");
  } else {
    showSelectMemberToast(
      "Invalid input. Please enter a non-negative whole number."
    );
  }
}

//addDelivery function:

function addDelivery() {
  const vehicle = $("#vehicleType").val();
  const name = $("#entryName").val().trim();
  const surname = $("#entrySurname").val().trim();
  const telephone = $("#entryTelephone").val().trim();
  const address = $("#entryAddress").val().trim();
  const returnTime = $("#entryReturnTime").val();

  // Validate the delivery input fields first
  const errors = validateDelivery();
  if (errors.length > 0) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: `Please fill in, or correct wrong data:\n${errors.join("\n")}`,
      confirmButtonText: "OK",
    });
    return;
  }

  // Check for duplicates
  if (isDuplicate(name, surname)) {
    // Using Swal to handle duplicate warning with a confirmation dialog
    Swal.fire({
      icon: "warning",
      title: "Duplicate warning!",
      text: "A driver with the same name and surname already exists. Do you want to continue?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, add anyway!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.value) {
        // If user clicks "Yes, add anyway", then add the driver
        addDriverToTable(
          vehicle,
          name,
          surname,
          telephone,
          address,
          returnTime
        );
      }
      // If user clicks "No, cancel", do nothing
    });
  } else {
    // If no duplicates, add the delivery driver to the table directly
    addDriverToTable(vehicle, name, surname, telephone, address, returnTime);
  }
}

function isDuplicate(name, surname) {
  return deliveryDrivers.some(
    (driver) =>
      driver.name.toLowerCase() === name.toLowerCase() &&
      driver.surname.toLowerCase() === surname.toLowerCase()
  );
}

function validateDelivery() {
  const name = $("#entryName").val().trim();
  const surname = $("#entrySurname").val().trim();
  const telephone = $("#entryTelephone").val().trim();
  const address = $("#entryAddress").val().trim();
  const returnTime = $("#entryReturnTime").val();

  let errors = [];
  if (!/^[\p{L}\s]+$/u.test(name)) {
    errors.push("Name must only contain letters.");
  }
  if (!/^[\p{L}\s]+$/u.test(surname)) {
    errors.push("Surname must only contain letters.");
  }
  if (!/^\d{7}$/.test(telephone)) {
    errors.push("Telephone must be exactly 7 digits.");
  }
  if (address.length < 2) {
    errors.push("Address must be at least 2 characters long.");
  }
  if (!returnTime) {
    errors.push("Return time is required.");
  }

  return errors;
}

function addDriverToTable(
  vehicle,
  name,
  surname,
  telephone,
  address,
  returnTime
) {
  const driver = new DeliveryDriver(name, surname, vehicle, telephone);
  driver.deliverAddress = address;
  driver.returnTime = returnTime;

  // Add driver to the global array
  deliveryDrivers.push(driver);

  const vehicleIcon =
    driver.vehicle === "Car"
      ? '<span class="large-icon"><i class="bi bi-car-front-fill"></i></span>'
      : '<span class="large-icon"><i class="bi bi-bicycle"></i></span>';

  const $deliveryBoardTableBody = $("#deliveryTable tbody");
  const newRow = $(`
    <tr>
      <td>${vehicleIcon}</td>
      <td>${driver.name}</td>
      <td>${driver.surname}</td>
      <td>${driver.telephone}</td>
      <td>${driver.deliverAddress}</td>
      <td>${driver.returnTime}</td>
    </tr>
  `);

  newRow.on("click", function () {
    $("#deliveryTable tbody tr").removeClass("selected");
    $(this).addClass("selected");
  });

  $deliveryBoardTableBody.append(newRow);

  // Reset form fields after adding new driver
  $(
    "#entryName, #entrySurname, #entryTelephone, #entryAddress, #entryReturnTime"
  ).val("");

  // Display success message
  swal.fire({
    title: "Success!",
    text: "Driver information has been added successfully",
    icon: "success",
    confirmButtonText: "OK",
  });
}

//validateDelivery function:

function validateDelivery() {
  const name = $("#entryName").val().trim();
  const surname = $("#entrySurname").val().trim();
  const telephone = $("#entryTelephone").val().trim();
  const address = $("#entryAddress").val().trim();
  const returnTime = $("#entryReturnTime").val().trim();

  let errors = [];

  if (!/^[\p{L}\s]+$/u.test(name)) {
    errors.push("Name must only contain letters.");
  }
  if (!/^[\p{L}\s]+$/u.test(surname)) {
    errors.push("Surname must only contain letters.");
  }
  if (!/^\d{7}$/.test(telephone)) {
    errors.push("Telephone must be exactly 7 digits.");
  }
  if (!address || address.length < 2) {
    errors.push("Address must be at least 2 characters.");
  }
  if (!returnTime) errors.push(" Enter the return time for selected driver");
  if (errors.length > 0) {
  }

  return errors;
}

function clearSelectedDeliveryDriver() {
  const $selectedRow = $("#deliveryTable tbody tr.selected");
  if ($selectedRow.length === 0) {
    Swal.fire({
      title: "Warning!",
      text: "Please Select a driver row to clear.",
      icon: "warning",
      confirmButtonText: "close",
    });
    return;
  }
  const driverIndex = $selectedRow.index();
  if (driverIndex > -1) {
    deliveryDrivers.splice(driverIndex, 1);
  }

  $selectedRow.remove();
  Swal.fire({
    title: "Success!",
    text: "Selected driver has been cleared from the Delivery Board!",
    icon: "success",
    confirmButtonText: "OK",
  });
}

//Toast

function showToast(message, type) {
  const toastHtml = `
        <div class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
  $("#toastContainer").append(toastHtml);
  $(".toast").toast("show");
}

//Navbar

$(document).ready(function () {
  // Show the dropdown menu on hover
  $(".navbar .dropdown").hover(
    function () {
      $(this).find(".dropdown-menu").stop(true, true).delay(200).fadeIn(500);
    },
    function () {
      $(this).find(".dropdown-menu").stop(true, true).delay(200).fadeOut(500);
    }
  );

  // Keep dropdown open while it's being hovered
  $(".dropdown-menu").hover(
    function () {
      $(this).stop(true, true);
    },
    function () {
      $(this).stop(true, true).delay(200).fadeOut(500);
    }
  );
});

// Bonus function: autocomplete for schedule delivery drivers.

function setupAutocomplete(staffMembers) {
  const staffNames = staffMembers.map((member) => ({
    label: `${member.name} ${member.surname}`,
    value: `${member.name} `,
    data: member,
  }));

  $("#entryName")
    .autocomplete({
      source: staffNames,
      select: function (event, ui) {
        const selectedMember = ui.item.data;
        $("#entrySurname").val(selectedMember.surname);
      },
      minLength: 0,
    })
    .focus(function () {
      $(this).autocomplete("search", "");
    });
}
