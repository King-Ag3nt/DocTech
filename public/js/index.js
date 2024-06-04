/* eslint-disable */
import Swal from 'sweetalert2';
import { socket } from './components/socketinit.js';
import { prso } from './components/Personalization.js';
import { HomeSearch, smlSearch } from './components/search.js';
import {
  createshortcutQ,
  verifybooking,
  updatePendingToInqueue,
  DeleteBooking,
  SearchbynameforQ,
} from './components/booking.js';
import { addnewpatient, updatePatient } from './components/addnewpatient.js';
import {
  login,
  logout,
  updateMe,
  updatePassword,
  createNewUser,
  DeleteUser,
  updateuserHorzantel,
  restartEmail,
  confrestartEmail,
} from './components/login.js';
import {
  createPatientRecordNew,
  editPatientRecordNew,
  deleteRecordPatient,
  sendMRI,
  DeleteFilesMri,
} from './components/patientRecord.js';
import { createNewRelapse, upDateRelapceAxios, DeleteRelapse } from './components/relapses.js';
import { sendNewScale } from './components/parientLabs.js';
import { createPreSet, deletePreSet, updatePreSet } from './components/preSet.js';
import { collectDMD, VitalInformations, collectMainEntri, collectMedicationnew } from './FUNCTIONCOLLECTRECORD';
import { CreateREFDR, DeleteREFDR, findRefdr } from './components/searchREFDR.JS';
const creatingUser = document.querySelector('.creating-user');
const deleteUser = document.getElementsByClassName('Delete-user');
const formlogin = document.querySelector('.form-login-loglog');
const submitrelapsebtn = document.querySelector('.submitrelapsebtn');
const uploadForm = document.getElementById('upload-form');
const submitRelapce = document.getElementById('relapsesForm');
const upDateRelapce = document.getElementById('EditrelapsesForm');
const addREFDR = document.getElementById('referralForm');
const mainPrintRec = document.getElementsByClassName('mainPrintRec');
const trashBin = document.getElementsByClassName('trashBin');
const homeSearch = document.querySelector('.homeSearch');
const searchrefdoc = document.querySelector('.searchrefdoc');
const collectForm = document.querySelector('.collectForm');
const collectFormEdit = document.querySelector('.collectFormEdit');
const Logoutbtn = document.querySelector('.Logoutbtn');
const logoutt = document.querySelector('.logout');
const UserSettings = document.querySelector('.UserSettings');
const UserSettingspasword = document.querySelector('.UserSettingspasword');
const nph = document.querySelector('.formn-ph');
const searchbynameforQ = document.querySelector('.searchbynameforQ');
const searchranedate = document.querySelector('.searchranedate');
const addtoqueuefrompending = document.getElementsByClassName('addtoqueuefrompending');
const collectFormnewpaitent = document.querySelector('.collectFormnewpaitent');
const collectFormnewpaitentedit = document.querySelector('.collectFormnewpaitentedit');
const addtoqueueincase = document.getElementsByClassName('addtoqueueincase');
const trashBinrelapse = document.getElementsByClassName('trashBinrelapse');
const pindingdelete = document.getElementsByClassName('pindingdelete');
const DeleteFilesMriV = document.getElementsByClassName('DeleteFilesMri');
const DeleteREFBtn = document.getElementsByClassName('card-btnREFDR');
const SendNewScale = document.querySelector('.sendNewScale');
const PreSetFormMeds = document.querySelector('.PreSetFormMeds');
const addInsideRcord = document.querySelector('.addInsideRcord');
const addInsideRcordinves = document.querySelector('.addInsideRcordinves');
const PreSetDelete = document.getElementsByClassName('PreSetDelete');
const PreSetFormInvest = document.querySelector('.PreSetFormInvest');
const UpdateFormPreSetINV = document.getElementsByClassName('UpdateFormPreSetINV');
const UpdateFormPreSetMED = document.getElementsByClassName('UpdateFormPreSetMED');
const addtocartprint = document.getElementsByClassName('addtocartprint');
const phshoppingcart = document.querySelector('.ph-shopping-cart');
const addnoteincache = document.querySelector('.addnoteincache');
const changehorazintal = document.querySelector('.checkingofhorzontal');
const btnToggleVerification = document.getElementsByClassName('btnToggleVerification');
const btnEmailRestert = document.getElementById('E-mail_restertbtn');
const btnconfemailresert = document.getElementById('btnconfresetpassword');

//initializing socket-io
socket();
//end of initializing socket-io
//initializing Personalization
prso();
//end of initializing Personalization
if (changehorazintal) {
  changehorazintal.addEventListener('change', e => {
    e.preventDefault();
    const elementToConvert = document.querySelector('.checkingofhorzontal').checked;
    updateuserHorzantel(elementToConvert);
  });
}
if (btnEmailRestert) {
  btnEmailRestert.addEventListener('click', e => {
    e.preventDefault();
    const email = document.getElementById('E-mail_restert').value;
    console.log(email);
    const fd = { email: email };
    restartEmail(fd);
  });
}
if (btnconfemailresert) {
  btnconfemailresert.addEventListener('click', e => {
    e.preventDefault();
    const password = document.getElementById('passwordreset').value;
    const passwordConfirm = document.getElementById('confPasswordreset').value;
    const body = { password, passwordConfirm };
    const url = window.location.href;
    const token = url.split('/').pop();
    confrestartEmail(token, body);
  });
}
if (SendNewScale) {
  const form = document.querySelector('form');
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    // Collecting selected values
    const visual = document.querySelector('input[name="Visual"]:checked').value;
    const brainstem = document.querySelector('input[name="brainstem"]:checked').value;
    const pyramidal = document.querySelector('input[name="pyramidal"]:checked').value;
    const cerebellar = document.querySelector('input[name="cerebellar"]:checked').value;
    const sensory = document.querySelector('input[name="sensory"]:checked').value;
    const BB = document.querySelector('input[name="BB"]:checked').value;
    const mental = document.querySelector('input[name="mental"]:checked').value;
    const ambulation = document.querySelector('input[name="ambulation"]:checked').value;
    const edss = document.querySelector('input[name="edss"]').value;
    const status = document.querySelector('#status').value;
    const patientId = document.querySelector('.patientid').getAttribute('patientId');
    const formDate = {
      FSS: {},
      EDSS: '',
    };
    formDate.FSS.visual = visual;
    formDate.FSS.brainstem = brainstem;
    formDate.FSS.pyramidal = pyramidal;
    formDate.FSS.cerebellar = cerebellar;
    formDate.FSS.sensory = sensory;
    formDate.FSS.BB = BB;
    formDate.FSS.mental = mental;
    formDate.FSS.ambulation = ambulation;
    formDate.EDSS = edss;
    formDate.status = status;
    formDate.patient = patientId;
    sendNewScale(formDate, patientId);
  });
}
if (homeSearch) {
  homeSearch.addEventListener('submit', e => {
    e.preventDefault();
    if (!homeSearch.querySelector('.home-search').value) {
      location.reload();
    }
    HomeSearch(homeSearch.querySelector('.home-search').value);
  });
}

if (searchrefdoc) {
  searchrefdoc.addEventListener('submit', e => {
    e.preventDefault();
    if (!searchrefdoc.querySelector('.home-search').value) {
      location.reload();
    }
    findRefdr(searchrefdoc.querySelector('.home-search').value);
  });
}

if (DeleteREFBtn) {
  Array.from(DeleteREFBtn).forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const id = item.getAttribute('data-serial');
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
          DeleteREFDR(id);
        }
      });
    });
  });
}

if (trashBinrelapse) {
  Array.from(trashBinrelapse).forEach(item => {
    item.addEventListener('click', () => {
      const id = item.getAttribute('relapseID');
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
          DeleteRelapse(id);
        }
      });
    });
  });
}

if (DeleteFilesMriV) {
  Array.from(DeleteFilesMriV).forEach(item => {
    item.addEventListener('click', () => {
      const id = item.getAttribute('Delete-id');
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
          DeleteFilesMri(id);
        }
      });
    });
  });
}

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
// addtoqueueincase
if (addtoqueueincase) {
  Array.from(addtoqueueincase).forEach(item => {
    item.addEventListener('click', () => {
      const serial = item.parentNode.parentNode;
      const kshf = serial.querySelector('.kshf').value;
      const id = item.getAttribute('PATIENTID');
      createshortcutQ(id, kshf);
    });
  });
}
// collectFormnewpaitent
if (collectFormnewpaitent) {
  collectFormnewpaitent.addEventListener('submit', e => {
    e.preventDefault();

    const newpatient = {
      name: document.querySelector('#pName').value,
      sex: document.querySelector('#pSex').value,
      birthDate: document.querySelector('.dateOfDignosis').value,
      idNo: document.querySelector('#pID').value,
      phoneNumber: document.querySelector('#pPhone').value,
      area: document.querySelector('#pAddress').value,
      occupation: document.querySelector('#pOccupation').value,
      maritalStatus: document.querySelector('#pMaritalStatus').value,
      smoking: document.querySelector('#pSmoking').value,
      alcohol: document.querySelector('#pAlcohol').value,
      drugAbuse: document.querySelector('#pDrugAbuse').value,
      country: document.querySelector('#pCountry').value,
      drugType: {
        title: document.querySelector('#pDrugType').value,
        date: document.querySelector('.pDrugSince').value,
      },
    };
    addnewpatient(newpatient);
  });
}
// collectFormnewpaitentedit
if (collectFormnewpaitentedit) {
  collectFormnewpaitentedit.addEventListener('submit', e => {
    e.preventDefault();

    const newpatient = {
      name: document.querySelector('#pName').value,
      sex: document.querySelector('#pSex').value,
      birthDate: document.querySelector('.dateOfDignosis').value,
      idNo: document.querySelector('#pID').value,
      phoneNumber: document.querySelector('#pPhone').value,
      area: document.querySelector('#pAddress').value,
      occupation: document.querySelector('#pOccupation').value,
      maritalStatus: document.querySelector('#pMaritalStatus').value,
      smoking: document.querySelector('#pSmoking').value,
      alcohol: document.querySelector('#pAlcohol').value,
      country: document.querySelector('#pCountry').value,
      drugAbuse: document.querySelector('#pDrugAbuse').value,
      drugType: {
        title: document.querySelector('#pDrugType').value,
        date: document.querySelector('.pDrugSince').value,
      },
    };
    updatePatient(newpatient, document.querySelector('#pName').getAttribute('patient-id'));
  });
}

if (addtoqueuefrompending) {
  Array.from(addtoqueuefrompending).forEach(item => {
    item.addEventListener('click', () => {
      const serial = item.getAttribute('data-serial');
      updatePendingToInqueue(serial);
    });
  });
}
if (searchranedate) {
  searchranedate.addEventListener('click', () => {
    const RangeDate = document.querySelector('#RangeDate').value;
    if (!RangeDate) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Date is required',
      });
    } else {
      const dateStrings = RangeDate.split(' to ');
      const startDate = dateStrings[0]; // "2024-02-01"
      const endDate = dateStrings[1]; // "2024-02-03"
      location.assign(`/QueueV2/${startDate}/${endDate}`);
    }
  });
}

if (nph) {
  nph.addEventListener('submit', e => {
    e.preventDefault();

    const smallsearch = document.querySelector('.n-ph');
    if (!smallsearch.value) {
      const container = document.querySelector('.patient-items-container');
      container.innerHTML = '';
    } else {
      smlSearch(smallsearch.value);
    }
  });
}
if (searchbynameforQ) {
  searchbynameforQ.addEventListener('keyup', e => {
    // Check if the Enter key was pressed
    if (e.key === 'Enter') {
      // Check if there's a value in the input field
      if (!searchbynameforQ.value) {
        const container = document.querySelector('.patient-search-container');
        container.innerHTML = '';
      } else {
        // Call your search function with the input's value
        SearchbynameforQ(searchbynameforQ.value);
      }
    }
  });
}

// UserSettingspasword
if (UserSettingspasword) {
  UserSettingspasword.addEventListener('submit', e => {
    e.preventDefault();
    const passwordCurrent = document.querySelector('#oldPassword').value;
    const password = document.querySelector('#newPassword').value;
    const passwordConfirm = document.querySelector('#confirmPassword').value;

    const formdata = {
      passwordCurrent,
      password,
      passwordConfirm,
    };
    const userId = document.querySelector('#docName').getAttribute('data-user-id');

    updatePassword(formdata, userId);
  });
}
//updatingusersettings
if (UserSettings) {
  UserSettings.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.querySelector('#docName').value;
    const email = document.querySelector('#docEmail').value;
    const photo = document.querySelector('#docPhoto').files;
    const formData = new FormData();
    const fd = {
      name: name,
      email: email,
    };
    if (photo.length > 0) {
      formData.append('photo', photo[0]);
      formData.append('data', JSON.stringify(fd));
    } else {
      formData.append('data', JSON.stringify(fd));
    }
    const userId = document.querySelector('#docName').getAttribute('data-user-id');
    updateMe(formData, userId);
  });
}

//conllectForm
if (collectForm) {
  collectForm.addEventListener('submit', event => {
    event.preventDefault(); // Prevent the default form submission
    const formData = new FormData();
    const diagnosis = document.querySelector('.diagnosiss').value;
    const dateOfOnSet = document.querySelector('.dateOfOnSet').value;
    const dateOfDignosis = document.querySelector('.dateOfDignosis').value;
    const complaint = collectMainEntri('complaintsContainer');
    const pastMedicalHistories = collectMainEntri('MhistorysContainer');
    const familyHistory = collectMainEntri('FhistorysContainer');
    const presentMedicalHistories = collectMainEntri('PmedicationsContainer');
    const vitalInformation = VitalInformations();
    const examination = collectMainEntri('examinationsContainer');
    const requestRadiology = collectMainEntri('investigationsContainer');
    const currentMedications = collectMedicationnew();
    const pastRadiology = collectInvistgatoin();
    const DMD = collectDMD();
    const currentUrl = window.location.href;

    const patientSerial = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);
    const fd = {
      diagnose: { title: diagnosis, dateOfOnSet, dateOfDignosis }, // Initialize diagnose as an empty string
      complaints: [],
      pastMedicalHistories: [],
      presentMedicalHistories: [],
      familyHistory: [],
      examination: [],
      vitalInformation: [],
      pastRadiology: [],
      pastlabtests: [],
      requestRadiology: [],
      currentMedications: [],
      plan: '',
    };
    fd.complaints = complaint;
    fd.pastMedicalHistories = pastMedicalHistories;
    fd.familyHistory = familyHistory;
    fd.presentMedicalHistories = presentMedicalHistories;
    fd.vitalInformation = vitalInformation;
    fd.examination = examination;
    fd.requestRadiology = requestRadiology;
    fd.pastRadiology = pastRadiology;
    fd.DMD = DMD;
    fd.currentMedications = currentMedications;
    fd.plan = document.querySelector('.collectplan').value;
    fd.note = document.querySelector('.collectnote').value;

    formData.append('patient', JSON.stringify(fd));

    createPatientRecordNew(formData, patientSerial, fd);

    function collectInvistgatoin() {
      const seaction = document.getElementById('investigationsResultContainer');
      const entries = seaction.getElementsByClassName('inputsWithPhotos');
      const finish = [];
      const tracing = [];
      let indexx = 0;
      for (const entry of entries) {
        indexx += 1;
        const titleInput = entry.querySelector('textarea[placeholder="Type"]');
        const commentInput = entry.querySelector('textarea[placeholder="Comment"]');
        const date = entry.querySelector('input[placeholder="Date"]');
        const img = entry.querySelector('.oldImgs');
        const imgArray = img && img.innerHTML.trim() !== '' ? img.innerHTML.split(',') : [];

        const imagesphotos = entry.querySelector('.imagesphotos');
        if (imagesphotos.files.length > 0) {
          Array.from(imagesphotos.files).forEach((image, index) => {
            formData.append(`MRI`, image);
          });
          tracing.push({ many: imagesphotos.files.length, where: indexx });
        }
        finish.push({
          title: titleInput.value,
          comment: commentInput.value,
          date: date.value,
          img: imgArray,
        });
      }
      formData.append('numberOfTheFile', JSON.stringify(tracing));
      return finish;
    }
  });
}
// editnewForm
if (collectFormEdit) {
  collectFormEdit.addEventListener('submit', event => {
    event.preventDefault(); // Prevent the default form submission
    const formData = new FormData();
    const diagnosis = document.querySelector('.diagnosiss').value;
    const dateOfOnSet = document.querySelector('.dateOfOnSet').value;
    const dateOfDignosis = document.querySelector('.dateOfDignosis').value;
    const complaint = collectMainEntri('complaintsContainer');
    const pastMedicalHistories = collectMainEntri('MhistorysContainer');
    const familyHistory = collectMainEntri('FhistorysContainer');
    const presentMedicalHistories = collectMainEntri('PmedicationsContainer');
    const vitalInformation = VitalInformations();
    const examination = collectMainEntri('examinationsContainer');
    const requestRadiology = collectMainEntri('investigationsContainer');
    const currentMedications = collectMedicationnew();
    const pastRadiology = collectInvistgatoin();
    const DMD = collectDMD();
    const currentUrl = window.location.href;

    const patientSerial = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);

    const fd = {
      diagnose: { title: diagnosis, dateOfOnSet, dateOfDignosis }, // Initialize diagnose as an empty string
      complaints: [],
      pastMedicalHistories: [],
      presentMedicalHistories: [],
      familyHistory: [],
      examination: [],
      vitalInformation: [],
      pastRadiology: [],
      pastlabtests: [],
      requestRadiology: [],
      currentMedications: [],
      plan: '',
    };
    fd.complaints = complaint;
    fd.pastMedicalHistories = pastMedicalHistories;
    fd.familyHistory = familyHistory;
    fd.presentMedicalHistories = presentMedicalHistories;
    fd.vitalInformation = vitalInformation;
    fd.examination = examination;
    fd.requestRadiology = requestRadiology;
    fd.pastRadiology = pastRadiology;
    fd.DMD = DMD;
    fd.currentMedications = currentMedications;
    fd.plan = document.querySelector('.collectplan').value;
    fd.note = document.querySelector('.collectnote').value;

    formData.append('patient', JSON.stringify(fd));

    editPatientRecordNew(formData, patientSerial);

    function collectInvistgatoin() {
      const seaction = document.getElementById('investigationsResultContainer');
      const entries = seaction.getElementsByClassName('inputsWithPhotos');
      const finish = [];
      const tracing = [];
      let indexx = 0;
      for (const entry of entries) {
        indexx += 1;
        const titleInput = entry.querySelector('textarea[placeholder="Type"]');
        const commentInput = entry.querySelector('textarea[placeholder="Comment"]');
        const date = entry.querySelector('input[placeholder="Date"]');
        const img = entry.querySelector('.oldImgs');
        const imgArray = img.innerHTML.trim() !== '' ? img.innerHTML.split(',') : [];

        const imagesphotos = entry.querySelector('.imagesphotos');
        if (imagesphotos.files.length > 0) {
          Array.from(imagesphotos.files).forEach((image, index) => {
            formData.append(`MRI`, image);
          });
          tracing.push({ many: imagesphotos.files.length, where: indexx });
        }
        finish.push({
          title: titleInput.value,
          comment: commentInput.value,
          date: date.value,
          img: imgArray,
        });
      }
      formData.append('numberOfTheFile', JSON.stringify(tracing));
      return finish;
    }
  });
}
//end if editing
if (submitRelapce) {
  submitrelapsebtn.addEventListener('click', e => {
    e.preventDefault();
    submitrelapseForm();
    function submitrelapseForm() {
      // const patientId = document.getElementById('patient').value;
      const relapses = [];
      const relapseSections = document.querySelectorAll('.relapse-section');
      relapseSections.forEach(section => {
        const systemsAffected = section.querySelector('.systemsAffected').value;
        let startedAt = section.querySelector('.startedAt').value;
        let endedAt = section.querySelector('.endedAt').value;
        const recovery = section.querySelector('.recovery').value;

        //- Get treatments within the relapse section
        const treatments = [];
        const treatmentInputs = section.querySelectorAll('.treatments');

        treatmentInputs.forEach(treatment => {
          const treatmentType = treatment.querySelector('.treatmentType').value;
          const treatmentDescription = treatment.querySelector('.treatmentDescription').value;
          const treatmentFrom = treatment.querySelector('.treatmentFrom').value;
          const treatmentTo = treatment.querySelector('.treatmentTo').value;

          treatments.push({
            Type: treatmentType,
            description: treatmentDescription,
            from: treatmentFrom,
            to: treatmentTo,
          });
        });
        const overValue = document.querySelector('.overValue').value;
        const overUnit = document.querySelector('.overUnit').value;
        const over = overValue + ' ' + overUnit;
        const residue = section.querySelector('.residue').value;
        relapses.push({
          systemsAffected,
          startedAt,
          endedAt,
          recovery,
          treatments,
          over,
          residue,
        });
      });

      const formDataa = {
        patient: document.querySelector('.patientId').getAttribute('patientid'),
        relapses,
      };
      const serial = document.querySelector('.patientId').getAttribute('requiredserial');
      createNewRelapse(formDataa, document.querySelector('.patientId').getAttribute('patientid'), serial);
      //- Add logic to send data to the server or perform other actions
    }
  });
}
if (upDateRelapce) {
  submitrelapsebtn.addEventListener('click', e => {
    e.preventDefault();
    submitrelapseForm();
  });

  function submitrelapseForm() {
    // const patientId = document.getElementById('patient').value;
    const relapses = [];
    const relapseSections = document.querySelectorAll('.relapse-section');
    relapseSections.forEach(section => {
      const systemsAffected = section.querySelector('.systemsAffected').value;
      let startedAt = section.querySelector('.startedAt').value;
      let endedAt = section.querySelector('.endedAt').value;
      const recovery = section.querySelector('.recovery').value;

      //- Get treatments within the relapse section
      const treatments = [];
      const treatmentInputs = section.querySelectorAll('.treatments');

      treatmentInputs.forEach(treatment => {
        const treatmentType = treatment.querySelector('.treatmentType').value;
        const treatmentDescription = treatment.querySelector('.treatmentDescription').value;
        const treatmentFrom = treatment.querySelector('.treatmentFrom').value;
        const treatmentTo = treatment.querySelector('.treatmentTo').value;

        treatments.push({
          Type: treatmentType,
          description: treatmentDescription,
          from: treatmentFrom,
          to: treatmentTo,
        });
      });

      const residue = section.querySelector('.residue').value;
      relapses.push({
        systemsAffected,
        startedAt,
        endedAt,
        recovery,
        treatments,
        residue,
      });
    });

    const formDataa = {
      relapses,
    };

    const serial = document.querySelector('.numberSerial').textContent;
    const RelapseID = document.querySelector('.relapseId').textContent;

    upDateRelapceAxios(formDataa, RelapseID, serial);
    //- Add logic to send data to the server or perform other actions
  }
}
// here start uploadForm
if (uploadForm) {
  let meme = 0;
  uploadForm.addEventListener('submit', event => {
    event.preventDefault(); // Prevent the default form submission
    if (meme == 0) {
      const formData = new FormData();
      const fileInput = document.getElementById('photo');

      if (fileInput && fileInput.files.length > 0) {
        for (let i = 0; i < fileInput.files.length; i++) {
          formData.append('MRI', fileInput.files[i]);
        }

        formData.append('patient', document.getElementById('name').getAttribute('patientid'));
        formData.append('name', document.getElementById('name').value);
        formData.append('date', document.getElementById('date').value);

        // Call the sendMRI function to send the files to the server

        sendMRI(formData);
        meme = meme + 1;
        // Additional actions after sending the files (if needed)
      }
    }
  });
}
// here end uploadForm
//end here

if (addREFDR) {
  addREFDR.addEventListener('submit', e => {
    e.preventDefault();
    const formdata = {
      name: '',
      description: '',
      email: '',
      phoneNumber: [],
    };
    const doctor_name = document.querySelector('.doctor_name').value;
    const doctor_description = document.querySelector('.doctor_description').value;
    const email_address = document.querySelector('.email_address').value;
    const phone_numbers = Array.from(document.querySelectorAll('.phone_number')).map(item => item.value);
    formdata.name = doctor_name;
    formdata.description = doctor_description;
    formdata.email = email_address;
    formdata.phoneNumber = phone_numbers;
    CreateREFDR(formdata);
  });
}

if (logoutt) {
  logoutt.addEventListener('click', e => {
    e.preventDefault();
    logout();
  });
}

if (creatingUser) {
  creatingUser.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.querySelector('#userName').value;
    const email = document.querySelector('#userEmail').value;
    const password = document.querySelector('#userPassword').value;
    const passwordConfirm = document.querySelector('#userConfirmPassword').value;
    const fd = {
      name: name,
      email: email,
      password: password,
      passwordConfirm: passwordConfirm,
    };

    createNewUser(fd);
  });
}
if (deleteUser) {
  Array.from(deleteUser).forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const id = item.getAttribute('data-user-id');
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
          Swal.fire({
            title: 'Deleted!',
            text: 'Your file has been deleted.',
            icon: 'success',
          }).then(() => {
            DeleteUser(id);
          });
        }
      });
    });
  });
}
if (formlogin) {
  formlogin.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

// function changeDateFormat(dateString) {
//   // Parse the input date string using the original format
//   const dateParts = dateString.split('-');
//   const jsDate = new Date(`20${dateParts[2]}`, dateParts[0] - 1, dateParts[1]);
//   // Format the date as DD/MM/YY
//   const formattedDate = jsDate.toLocaleDateString('en-GB');

//   return formattedDate;
// }

// document.addEventListener('DOMContentLoaded', function () {
//   if (queueNumber) {
//     const eventSource = new EventSource('/api/v1/queue/Queuetestingkeepalive');
//     const notificationCount = document.getElementById('notificationCount');
//     console.log('notificationCount element:', notificationCount);

//     eventSource.onmessage = async function (event) {
//       try {
//         const data = JSON.parse(event.data);
//         console.log('Received data from server:', data);

//         // Asynchronously update the notification count
//         await updateNotificationCount(data.queue);

//         // Update the previousQueue with the latest data
//         previousQueue = data.queue;
//       } catch (error) {
//         console.error('Error processing message:', error);
//       }
//     };

//     async function updateNotificationCount(newData) {
//       // Simulate an asynchronous task, you can replace this with your actual logic
//       return new Promise(resolve => {
//         setTimeout(() => {
//           // Update the notification count
//           notificationCount.textContent = newData;
//           console.log('Notification count updated to:', newData);

//           // Resolve the promise
//           resolve();
//         }, 0); // You can adjust the timeout duration based on your actual logic
//       });
//     }
//   }
// });

if (mainPrintRec) {
  Array.from(mainPrintRec).forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const medicationPrint = item.parentNode.parentNode.querySelector('.medicationPrint');
      const Noteprint = item.parentNode.parentNode.querySelector('.Noteprint');
      const radiologyContinergamed = item.parentNode.parentNode.querySelector('.radiologyContinergamed');
      const datePrintat = item.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('.createdAtPrint');
      const diagnosisPatientAt =
        item.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('.diagnosePrintat');
      function printGenraldata() {
        const namePrint = document.querySelector('.namePrint');
        const datePrint = document.querySelector('.datePrint');
        const diagnosisPrint = document.querySelector('.diagnosisPrint');
        const patientsName = document.querySelector('.patientsName');
        const serialPrint = document.querySelector('.serialPrint');
        namePrint.textContent = `Name:${patientsName.textContent}`;
        datePrint.textContent = `Date:${datePrintat.textContent}`;
        diagnosisPrint.textContent = `Diagnosis:${diagnosisPatientAt.textContent}`;
        serialPrint.textContent = `Serial:${patientsName.getAttribute('serial-of-patient')}`;
      }
      function LoopngintoNoteprint(item) {
        let finish = '';
        finish += `<div class="row">
          <div class="col-12 px-3 fs-5">
            <p>${item.textContent}</p>
          </div>
        </div>`;
        return finish;
      }
      function LoopngintoTheradiology() {
        const radiologyprint = radiologyContinergamed.getElementsByClassName('sectionradio');
        let finish = '';
        Array.from(radiologyprint).forEach(item => {
          finish += `
          <div class="col-16 px-3 fs-5 d-flex justify-content-between align-items-center border-bottom">
            <p class="text-start">${item.querySelector('.radiologyType').textContent}</p>
            <p class="text-end">${item.querySelector('.radiologyComment').textContent}</p>
          </div>
        `;
        });
        return finish;
      }
      function LoopngintoThemedcations() {
        const dataofmedication = medicationPrint.getElementsByClassName('medecationContinergamed');
        let finish = '';
        Array.from(dataofmedication).forEach(item => {
          finish += `         
          <div class="col-16 px-3 fs-5 d-flex justify-content-between align-items-center border-bottom">
            <p class="text-start">${item.querySelector('.medicationType').textContent}</p>
            <p class="text-end">${item.querySelector('.medicationComment').textContent}</p>
          </div>`;
        });
        return finish;
      }
      async function printMedication() {
        const mainContainerBodyOfRoshta = document.querySelector('.mainconteinerbodyofroshta');
        mainContainerBodyOfRoshta.innerHTML = '';
        const inputOptions = {
          medication: 'Medication',
          radiology: 'Radiology',
          Note: 'Note',
          both: 'Both',
        };
        const { value: color } = await Swal.fire({
          title: 'Select Type',
          icon: 'question',
          input: 'radio',
          inputOptions,
          inputValidator: value => {
            if (!value) {
              return 'You need to choose something!';
            }
          },
        });

        switch (color) {
          case 'medication':
            mainContainerBodyOfRoshta.innerHTML = LoopngintoThemedcations();
            window.print();
            break;
          case 'radiology':
            mainContainerBodyOfRoshta.innerHTML = LoopngintoTheradiology();
            window.print();
            break;
          case 'Note':
            mainContainerBodyOfRoshta.innerHTML = LoopngintoNoteprint(Noteprint);
            window.print();
            break;
          case 'both':
            mainContainerBodyOfRoshta.innerHTML = LoopngintoThemedcations() + LoopngintoTheradiology();
            window.print();
            break;
          default:
            break;
        }
      }
      printMedication();
      printGenraldata();
    });
  });
}

if (trashBin) {
  Array.from(trashBin).forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const id = e.target.getAttribute('recordId');
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
          Swal.fire({
            title: 'Deleted!',
            text: 'Your file has been deleted.',
            icon: 'success',
          }).then(() => {
            deleteRecordPatient(id);
          });
        }
      });
    });
  });
}

if (Logoutbtn) {
  Logoutbtn.addEventListener('click', e => {
    e.preventDefault();
    logout();
  });
}

if (PreSetFormMeds) {
  PreSetFormMeds.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.querySelector('.nameofmedication').value;
    const medicationsContainer = collectMainEntri('medicationsContainer');
    console.log('medicationsContainer:', medicationsContainer);
    const fd = {
      name,
      currentMedications: medicationsContainer,
    };
    createPreSet(fd);
  });
}
if (PreSetFormInvest) {
  PreSetFormInvest.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.querySelector('.nameofinvestigation').value;
    const investigationContainer = collectMainEntri('investigationsContainer');
    const fd = {
      name,
      requestedInvestigations: investigationContainer,
    };
    createPreSet(fd);
  });
}
if (addInsideRcordinves) {
  addInsideRcordinves.addEventListener('click', e => {
    e.preventDefault();
    const name = document.querySelector('.nameofinvestigation').value;
    if (name) {
      const investigationContainer = collectMainEntri('investigationsContainer');
      const fd = {
        name,
        requestedInvestigations: investigationContainer,
      };
      createPreSet(fd);
    } else {
      Swal.fire('Error', 'Please Enter Name', 'error');
    }
  });
}
if (addInsideRcord) {
  addInsideRcord.addEventListener('click', e => {
    e.preventDefault();
    const name = document.querySelector('.nameofmedication').value;
    if (name) {
      const medicationsContainer = collectMainEntri('medicationsContainer');
      const fd = {
        name,
        currentMedications: medicationsContainer,
      };
      createPreSet(fd);
    } else {
      Swal.fire('Error', 'Please Enter Name', 'error');
    }
  });
}

if (PreSetDelete) {
  Array.from(PreSetDelete).forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const id = item.getAttribute('data-serial');
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
          deletePreSet(id);
        }
      });
    });
  });
}
if (UpdateFormPreSetINV) {
  Array.from(UpdateFormPreSetINV).forEach(item => {
    item.addEventListener('submit', e => {
      e.preventDefault();
      const id = item.getAttribute('data-id');
      const name = item.querySelector('.nameofmedication').value;
      const requestedInvestigations = collectMainEntri('UpdateContainerINV' + id);
      const fd = {
        name,
        requestedInvestigations: requestedInvestigations,
      };

      updatePreSet(fd, id);
    });
  });
}
if (UpdateFormPreSetMED) {
  Array.from(UpdateFormPreSetMED).forEach(item => {
    item.addEventListener('submit', e => {
      e.preventDefault();
      const id = item.getAttribute('data-id');
      const name = item.querySelector('.nameofmedication').value;
      const currentMedications = collectMainEntri('UpdateContainerMED' + id);
      const fd = {
        name,
        currentMedications: currentMedications,
      };
      updatePreSet(fd, id);
    });
  });
}
// Function to update the cart display
function updateCartDisplay() {
  const cartt = JSON.parse(localStorage.getItem('cart')) || [];
  const elementToConvert = document.getElementById('elementToConvert');
  elementToConvert.innerHTML = '';
  cartt.forEach(htmlString => {
    elementToConvert.innerHTML += htmlString;
  });
}

// Add to cart
if (addtocartprint) {
  Array.from(addtocartprint).forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const htmll = item.parentNode.parentNode;
      const htmllCopy = htmll.cloneNode(true);
      htmllCopy.classList.add('cardPrintAdd');
      const mtAutoDiv = htmllCopy.querySelector('.mt-auto');
      if (mtAutoDiv) {
        mtAutoDiv.parentNode.removeChild(mtAutoDiv);
      }
      const modifiedHTMLString = htmllCopy.outerHTML;

      // Retrieve existing cart from localStorage or initialize as an empty array
      let cart = JSON.parse(localStorage.getItem('cart')) || [];

      // Add the modified HTML string to the cart array
      cart.push(modifiedHTMLString);

      // Store the updated cart back into localStorage
      localStorage.setItem('cart', JSON.stringify(cart));

      // Update the cart display
      updateCartDisplay();

      Swal.fire({
        icon: 'success',
        title: 'Added to cart successfully!',
        showConfirmButton: false,
        timer: 500,
      });
    });
  });
}

// View cart
if (phshoppingcart) {
  // Initially update cart display
  updateCartDisplay();

  // Download cart
  const downloadBtn = document.getElementById('downloadBtn');
  downloadBtn.addEventListener('click', e => {
    e.preventDefault();
    const printSpace = document.getElementById('printSpace');
    printSpace.innerHTML = elementToConvert.innerHTML; // Copy content to printSpace
    window.print();
    localStorage.removeItem('cart');
    updateCartDisplay(); // Update cart display after printing
  });
}

if (addnoteincache) {
  addnoteincache.addEventListener('click', e => {
    e.preventDefault();
    const note = document.querySelector('.collectthenote').value;
  });
}
if (btnToggleVerification) {
  Array.from(btnToggleVerification).forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const itemId = item.getAttribute('data-item-id');
      const isVerified = item.getAttribute('data-is-verified') === 'true';
      // Toggle the verification status
      const newVerificationStatus = !isVerified;
      // Update the visual appearance of the button based on the new verification status
      const iconElement = item.querySelector('i');
      if (newVerificationStatus) {
        // Change icon to verified
        iconElement.className = 'fas fa-check-circle';
      } else {
        // Change icon to not verified
        iconElement.className = 'far fa-circle';
      }
      // Send the updated verification status to the server
      verifybooking(itemId);
      // Update the data-is-verified attribute of the button
      item.setAttribute('data-is-verified', newVerificationStatus.toString());
    });
  });
}
