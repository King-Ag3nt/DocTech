import axios from 'axios';
import Swal from 'sweetalert2';

export const createshortcutQ = async (patient, hagz) => {
  try {
    const response = await axios({
      method: 'POST',
      url: '/api/v1/queue/',
      data: { patient: patient, hagz: hagz },
    });
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'The patient has been added to the queue.',
      showConfirmButton: false,
      timer: 2500,
    });
  } catch (err) {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: err.response.data.message,
      showConfirmButton: false,
      timer: 2500,
    });
  }
};
export const updatePendingToInqueue = async id => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/queue/updatePendingToInqueue/' + id,
    });
    if (res.data.status === 'success') {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 2500,
      }).then(() => {
        location.reload();
      });
    }
  } catch (e) {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: e.response.data.message,
      showConfirmButton: false,
      timer: 2500,
    });
  }
};

export const DeleteBooking = async id => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/queue/DeleteBooking/${id}`,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    if (res.data.status === 'success') {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'The patient has been deleted from the queue.',
        showConfirmButton: false,
        timer: 2500,
      }).then(() => {
        location.assign(`/QueueV2`);
      });
    }
  } catch (err) {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: err.response.data.message,
      showConfirmButton: false,
      timer: 2500,
    });
  }
};

export const SearchbynameforQ = async keyword => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/queue/searchbynameorphone',
      data: { keyword },
    });
    console.log(res);
    if (res.data.status === 'success') {
      console.log(res);
      const container = document.querySelector('.patient-search-container');
      container.innerHTML = '';
      Array.from(res.data.data.result).forEach(item => {
        container.innerHTML += `
          <div class="col-12 flex-column d-md-flex align-items-center gap-1 mb-3 QM-item-Container">
          <!-- Queue item -->
          <div class="col-12 border p-2 my-1 rounded-3 pq-info QM-item">
            <div class="row">
              <div class="col-12 text-center wrd-break mb-2">
              <span class="fs-3">${item.patient.name}</span>
              </div>
              <div class="col-12 col-md-12 col-xl-6 d-flex flex-column gap-1 word-wrap">
                <span>Age:${item.patient.age}</span>
                <span>Serial:${item.patient.serial}</span>
                <span>Phone:</span>
                <span>${item.patient.phoneNumber}</span>
                <span>حجز:${item.HAGZ}</span>
              </div>
              <div class="col-12 col-md-12 col-xl-6 d-flex flex-column gap-1 text-xl-center">
              <span>Appointment At</span>
              <span>${new Date(item.date).toLocaleString('en-US', { weekday: 'long' })}</span>
              <span>${new Date(item.date).toLocaleString('en-US', { month: 'long', day: 'numeric' })}</span>
              <span>${new Date(item.date).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</span>
            </div>
              </div>
            </div>
            <div class="row mt-3 mb-1 d-flex justify-content-center w-100">
              <div class="col-12">
                <button class="btn btn-outline-danger w-100 pindingdelete" type="button" delete-serial="${item._id}">Delete</button>
              </div>
            </div>
          </div>
          <!-- Queue item -->
        </div>
        `;
      });
      const pindingdelete = document.getElementsByClassName('pindingdelete');
      if (pindingdelete) {
        Array.from(pindingdelete).forEach(item => {
          item.addEventListener('click', () => {
            const id = item.getAttribute('delete-serial');
            Swal.fire({
              title: 'Are you sure?',
              text: "You won't be able to revert this!",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, delete it!',
            }).then(result => {
              if (result.isConfirmed) {
                DeleteBooking(id);
              }
            });
          });
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

export const verifybooking = async id => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/queue/verifybooking/' + id,
    });
    return res.data;
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: err.response.data.message,
    });
  }
};
