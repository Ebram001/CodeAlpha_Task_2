$(document).ready(function () {
  emailjs.init('vK1N_eqplSCFsxW2I');
  // Retrieve tasks from local storage or initialize an empty array
  var tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // Function to add a new task
  function addTask(name, date, userEmail) {
    tasks.push({ name: name, date: date, userEmail: userEmail });
    console.log('Task Name:', name);
    console.log('Task Date Time:', date);
    console.log('User Email:', userEmail);
    updateTaskList();
    saveTasksToLocalStorage();
}


  // Function to delete a task
  function deleteTask(index) {
      tasks.splice(index, 1);
      updateTaskList();
      saveTasksToLocalStorage();
  }

  // Function to update the task list
  function updateTaskList() {
      var taskListDiv = $('#taskList');
      taskListDiv.empty();

      if (tasks.length === 0) {
          taskListDiv.append('<p>No tasks added</p>');
      } else {
          var ul = $('<ul class="list-group"></ul>');
          tasks.forEach(function (task, index) {
              var li = $('<li class="list-group-item d-flex justify-content-between align-items-center">' + task.name + '  ' + task.date +
                  '<button class="btn btn-danger btn-sm ml-2 deleteTaskBtn" data-index="' + index + '">Delete</button></li>');
              ul.append(li);
          });

          taskListDiv.append(ul);

          // Attach click event for delete buttons
          $('.deleteTaskBtn').click(function () {
              var index = $(this).data('index');
              deleteTask(index);
          });
      }
  }

  // Function to save tasks to local storage
  function saveTasksToLocalStorage() {
      localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Function to show a success message using SweetAlert2
  function showSuccessMessage(message) {
      Swal.fire({
          icon: 'success',
          title: 'Success',
          text: message,
          timer: 2000,
          showConfirmButton: false
      });
  }

  // Function to send an email notification
  function sendEmailNotification(task) {
    // Your EmailJS service ID, template ID, and user ID
    const emailJsServiceId = 'service_jfbbgsq';
    const emailJsTemplateId = 'template_ksj84kw';
    const emailJsUserId = 'vK1N_eqplSCFsxW2I';

    // Initialize EmailJS
    emailjs.init(emailJsUserId);

    // Prepare data for the email template
    const templateParams = {
        taskName: task.name,
        taskDateTime: task.date,
        userEmail: task.userEmail
    };

    emailjs.send("service_jfbbgsq","template_ksj84kw", templateParams).then(function (response) {
      console.log('Email sent successfully:', response);
  }, function (error) {
      console.error('Email send failed:', error);
  });;
}

  


  // Event listener for the "Add Task" button
  $('#addTask').click(function () {
      var taskName = $('#taskName').val();
      var taskDateTime = $('#taskDateTime').val();
      var userEmail = $('#userEmail').val();

      if (taskName && taskDateTime && userEmail) {
          addTask(taskName, taskDateTime, userEmail);
          showSuccessMessage('Task added successfully!');

          // Schedule email notification for the task date and time
          var taskDateTimeObj = new Date(taskDateTime);
          var currentDate = new Date();

          // Check if the task date and time are in the future
          if (taskDateTimeObj > currentDate) {
              // Calculate the time difference in milliseconds
              var timeDifference = taskDateTimeObj - currentDate;

              // Schedule the email notification
              setTimeout(function () {
                  sendEmailNotification({ name: taskName, date: taskDateTime, userEmail: userEmail });
              }, timeDifference);
          }

      } else {
          Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Please fill in all fields',
          });
      }

      // Clear the input fields
      $('#taskName').val('');
      $('#taskDateTime').val('');
      $('#userEmail').val('');
  });

  // Initialize the task list on page load
  updateTaskList();
});
