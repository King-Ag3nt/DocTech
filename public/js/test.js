/* eslint-disable */

flatpickr('#datePicker', {
  dateFormat: 'Y-m-d',
  enableTime: false,
  time_24hr: true,
});
flatpickr('#date', {
  dateFormat: 'Y-m-d',
  enableTime: false,
  time_24hr: true,
});

function autoResize(textarea) {
  textarea.style.height = '30px';
  textarea.style.height = textarea.scrollHeight + 'px'; // Set new height based on content
}

function autoResizeinput(input) {
  input.style.height = 'auto'; // Reset height to auto
  input.style.height = input.scrollHeight + 'px'; // Set new height based on content
}

flatpickr('#RangeDate', {
  dateFormat: 'Y-m-d',
  mode: 'range',
  enableTime: false,
  disableMobile: 'true',
  time_24hr: true,
});
flatpickr('#NPQ', {
  dateFormat: 'Y-m-d H:i',
  enableTime: true,
  minDate: 'today',
  disableMobile: 'true',
  time_24hr: false,
});

// Event delegation for delete functionality
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('ph-x')) {
    if (
      e.target.parentElement.parentElement.parentElement.getElementsByClassName('twoinputs').length > 1 ||
      e.target.parentElement.parentElement.parentElement.getElementsByClassName('inputsWithPhotos').length > 1 ||
      e.target.parentElement.parentElement.parentElement.getElementsByClassName('fourinputs').length > 1 ||
      e.target.parentElement.parentElement.parentElement.getElementsByClassName('DMDinputs').length > 1
    ) {
      if (confirm('Are you sure you want to delete this image?')) {
        e.target.parentElement.parentElement.remove();
      }
    }
  }
});

function addcloneDMD(containerId) {
  // Get the container element
  const container = document.getElementById(containerId);

  // Clone the DMDinputs section
  const clone = container.querySelector('.DMDinputs').cloneNode(true);

  // Clear values in the cloned inputs
  clone.querySelectorAll('input, textarea, select').forEach(input => {
    input.value = '';
    input.checked = false;
  });

  // Set the value of the cloned select element to match the first select element

  const clonedSelect = clone.querySelector('select');
  clonedSelect.value = 'Choose';

  // Append the cloned section to the container
  container.appendChild(clone);

  // Initialize flatpickr for the cloned datepicker
  flatpickr('#datePicker', {
    dateFormat: 'Y-m-d',
    enableTime: false,
    time_24hr: true,
  });
}

function addclonemain(containerId) {
  // Find the container element
  var container = document.getElementById(containerId);
  if (container) {
    // Find the twoinputs element within the container
    var twoInputsElement = container.querySelector('.twoinputs');

    if (twoInputsElement) {
      // Clone the twoinputs div
      var clonedInputs = twoInputsElement.cloneNode(true);

      // Clear values in the cloned inputs
      clonedInputs.querySelectorAll('textarea').forEach(function (element) {
        element.value = '';
      });

      // Append the cloned inputs inside the container
      container.appendChild(clonedInputs);
    } else {
      console.error("Element with class 'twoinputs' not found within the container!");
    }
  } else {
    console.error('Container element not found!');
  }
}

function cloneInputsWithPhotos() {
  // Clone the inputsWithPhotos div
  const clonedInputs = document.querySelector('.inputsWithPhotos').cloneNode(true);

  // Clear values in the cloned inputs
  clonedInputs.querySelectorAll('textarea, input[type="text"]').forEach(function (element) {
    element.value = '';
  });

  // Clear file inputs in the cloned inputs
  clonedInputs.querySelectorAll('input[type="file"]').forEach(function (fileInput) {
    fileInput.value = ''; // Setting the value to an empty string clears the file input
  });

  // Clear content in the cloned inputs oldImgs div
  if (clonedInputs.querySelector('.oldImgs')) {
    clonedInputs.querySelector('.oldImgs').innerHTML = '';
  }

  // Append the cloned inputs inside the investigationsResultContainer
  document.getElementById('investigationsResultContainer').appendChild(clonedInputs);

  // Initialize date picker for the new cloned input
  flatpickr('#datePicker', {
    dateFormat: 'Y-m-d',
    enableTime: false,
    time_24hr: true,
  });
}

function addcloneMedications() {
  // Clone the fourinputs div
  var clonedInputs = document.querySelector('.fourinputs').cloneNode(true);

  // Clear values in the cloned inputs
  clonedInputs.querySelectorAll('textarea, input[type="text"]').forEach(function (element) {
    element.value = '';
  });

  // Append the cloned inputs inside the medicationsContainer
  document.getElementById('medicationsContainer').appendChild(clonedInputs);
  flatpickr('#datePicker', {
    dateFormat: 'Y-m-d',
    enableTime: false,
    time_24hr: true,
  });
}

function previewPhoto(event, previewId) {
  const previewImage = document.getElementById(previewId);
  const input = event.target;

  if (input.files && input.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {
      previewImage.src = e.target.result;
    };

    reader.readAsDataURL(input.files[0]);
  }
}
if (document.querySelector('.print-dc')) {
  document.addEventListener('DOMContentLoaded', function () {
    // Get the height of the "header" class
    const headerHeight = document.querySelector('.header').offsetHeight;
    const dcHeight = document.querySelector('.print-dc').offsetHeight;

    // Apply the height to the "header-space" class
    document.querySelector('.header-space').style.height = headerHeight + 'px';
    document.querySelector('.print-img').style.height = dcHeight + 'px';
  });
}
const medicationpresetitem = document.getElementsByClassName('medicationpresetitem');
const investigationpresetitem = document.getElementsByClassName('investigationpresetitem');
if (medicationpresetitem) {
  Array.from(medicationpresetitem).forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const itemofthatString = item.getAttribute('itemofthat');
      const itemofthatArray = JSON.parse(itemofthatString);
      const izi = itemofthatArray
        .map(item => {
          return `<div class="row fourinputs twoinputs">
        <div class="col-12 my-1">
          <textarea class="form-control" id="autoHeightTextarea" oninput="autoResize(this)" placeholder="Type" autocomplete="on" name="medicationsType">${item.title}</textarea>
        </div>
        <div class="col-12 my-1">
          <textarea class="form-control" id="autoHeightTextarea" oninput="autoResize(this)" placeholder="Comment" autocomplete="on" name="medicationsComment">${item.comment}</textarea>
        </div>
        <div class="col-12 col-md-6 my-1">
          <input type="text" id="datePicker" class="form-control text-center" placeholder="Started At" />
        </div>
        <div class="col-12 col-md-6 my-1">
          <input type="text" id="datePicker" class="form-control text-center" placeholder="Ended At" />
        </div>
        <div class="col-12 my-1 text-center fs-2">
          <i class="ph ph-bold ph-x"></i>
        </div>
      </div>`;
        })
        .join(''); // Join the array of HTML strings into a single string
      document.querySelector('#medicationsContainer').insertAdjacentHTML('beforeend', izi); // Append new elements

      flatpickr('#datePicker', {
        dateFormat: 'Y-m-d',
        enableTime: false,
        time_24hr: true,
      });
    });
  });
}
if (investigationpresetitem) {
  Array.from(investigationpresetitem).forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const itemofthatString = item.getAttribute('itemofthat');
      const itemofthatArray = JSON.parse(itemofthatString);
      const izi = itemofthatArray
        .map(item => {
          return `<div class="twoinputs row">
          <div class="col-12 my-1">
            <textarea class="form-control" id="autoHeightTextarea" oninput="autoResize(this)" placeholder="Type" autocomplete="on" name="investigationsType">${item.title}</textarea>
          </div>
          <div class="col-12 my-1">
            <textarea class="form-control" id="autoHeightTextarea" oninput="autoResize(this)" placeholder="Comment" autocomplete="on" name="investigationsComment">${item.comment}</textarea>
          </div>
          <div class="col-12 my-1 text-center fs-2">
            <i class="ph ph-bold ph-x"></i>
          </div>
        </div>`;
        })
        .join(''); // Join the array of HTML strings into a single string
      document.querySelector('#investigationsContainer').insertAdjacentHTML('beforeend', izi); // Use innerHTML to set the content
    });
  });
}
