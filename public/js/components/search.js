import axios from 'axios';
import { createshortcutQ } from './booking';
import Swal from 'sweetalert2';

export const HomeSearch = async keyword => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/patient/homeSearch',
      params: { keyword },
    });

    const container = document.querySelector('.main-content');
    if (res.data.user.role === 'user') {
      container.innerHTML = '';
      res.data.patients.forEach((item, index) => {
        container.innerHTML += `<div class="card col-sm-12 col-3 m-2">
        <div class="card-items">
          <h3>${item.name}</h3>
          <div class="card-list">
            <div class="card-item1">
              <i class="ph ph-phone"></i>
              <span>Phone:${item.phoneNumber}</span>
            </div>
            <div class="card-item1">
              <i class="ph ph-calendar"></i>
              <span>DOB:${item.birthDate}</span>
            </div>
            <div class="card-item1">
              <i class="ph ph-calendar"></i>
              <span>Age :${item.age}</span>
            </div>
            <div class="card-item1">
              <i class="ph ph-barcode"></i>
              <span>Serial:${item.serial}</span>
            </div>
          </div>
          <div class="row w-100 mt-3 CREATEFASTQ" style="height: fit-content;">
          <div class="col-6 d-flex justify-content-center align-items-center">
            <button class="btn btn-outline-info addtoqueueincase px-4" PATIENTID ="${item._id}" >ADD</button>
          </div>
          <div class="col-6 d-flex justify-content-center align-items-center">
          <select class="form-select kshf">
          <option value="كشف">كشف</option>
          <option value="كشف مستعجل">كشف مستعجل</option>
          <option value="أستشارة">أستشارة</option>
          <option value="FREE">FREE</option>
        </select>
          </div>
        </div>
        </div>
      </div>`;
      });
      const addtoqueueincase = document.getElementsByClassName('addtoqueueincase');
      // addtoqueueincase
      if (addtoqueueincase) {
        Array.from(addtoqueueincase).forEach(item => {
          item.addEventListener('click', () => {
            const serial = item.parentNode.parentNode;
            const kshf = serial.querySelector('.kshf').value;
            const id = item.getAttribute('PATIENTID');
            console.log(id, kshf);

            createshortcutQ(id, kshf);
          });
        });
      }
    } else {
      container.innerHTML = '';
      res.data.patients.forEach((item, index) => {
        container.innerHTML += `<div class="card col-sm-12 col-3 m-2">
      <div class="card-items">
        <h3>${item.name}</h3>
        <div class="card-list">
          <div class="card-item1">
            <i class="ph ph-phone"></i>
            <span>Phone:${item.phoneNumber}</span>
          </div>
          <div class="card-item1">
            <i class="ph ph-calendar"></i>
            <span>DOB:${item.birthDate}</span>
          </div>
          <div class="card-item1">
            <i class="ph ph-calendar"></i>
            <span>Age :${item.age}</span>
          </div>
          <div class="card-item1">
            <i class="ph ph-barcode"></i>
            <span>Serial:${item.serial}</span>
          </div>
        </div>
        <a href="/newView/${item._id}" class="btn btn-outline-info px-4">Go</a>
      </div>
    </div>`;
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const smlSearch = async keyword => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/patient/homeSearch',
      params: { keyword },
    });

    console.log(res.data);
    const container = document.querySelector('.patient-items-container');
    container.innerHTML = '';
    res.data.patients.forEach((item, index) => {
      container.innerHTML += `
      <div class="row pb-2 border rounded-3 my-2">
      <div class="col-12 d-flex flex-column p-3 gap-1 fs-5">
        <span>Name:${item.name}</span>
        <span>Phone:${item.phoneNumber}</span>
        <span>Serial:${item.serial}</span>
      </div>
      <div class="col-12">
        <button class="btn btn-outline-success w-100 AddToQueue" data-serial="${item._id}">ADD</button>
      </div>
    </div>`;
    });

    const AddToQueue = document.querySelectorAll('.AddToQueue');
    AddToQueue.forEach(button => {
      button.addEventListener('click', e => {
        const serial = e.currentTarget.getAttribute('data-serial');
        const datetimeString = document.querySelector('.nq-date').value;
        const hagz = document.querySelector('#HAGZ').value;
        const note = document.querySelector('#notes').value;
        const status = document.querySelector('#status').value;

        // Check if datetimeString is empty
        if (!datetimeString) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Date is required',
          });
        } else {
          const dateTimeObject = new Date(datetimeString);

          console.log(hagz);
          const form = { serial, dateTimeObject, hagz, note, status };
          sendinqueue(form);
        }
      });
    });
    async function sendinqueue(serial) {
      try {
        const response = await axios({
          method: 'POST',
          url: '/api/v1/queue/e7gz',
          data: serial,
        });

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 2500,
        }).then(() => {
          location.reload();
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.response.data.message,
        });
      }
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: err.response.data.message,
    });
  }
};
