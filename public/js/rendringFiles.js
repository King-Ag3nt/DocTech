import axios from 'axios';
import Swal from 'sweetalert2';

export const getFolder = async id => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/v1/patient/patientRecord/getPatientFiles/${id}`,
    });
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = ``;

    Array.from(res.data.data.patientMRI).forEach((element, index) => {
      const folder = document.createElement('div');
      folder.classList.add('folder');
      folder.innerHTML = `    
     <i class="ph-bold ph-folder-simple"></i>
    <span >Name: ${element.image.name}</span>
                         `;
      mainContent.appendChild(folder);
    });

    const folderClose = document.getElementById('folder-close');
    const folders = document.getElementsByClassName('folder');
    const folderPcontainer = document.querySelector('.folder-popup-container');
    const leftcontent = document.querySelector('.left-content');
    const filescontainer = document.querySelector('.files-container');

    if (folders) {
      Array.from(folders).forEach((folder, index) => {
        folder.addEventListener('click', () => {
          folderPcontainer.classList.remove('popup-hide');
          createFoldercontainer(res.data.data.patientMRI[index]);
        });
        // rendringFiles(folder.id);
      });
      if (folderClose) {
        folderClose.addEventListener('click', () => {
          folderPcontainer.classList.add('popup-hide');
        });
      }
    }

    function createFoldercontainer(folderData) {
      leftcontent.innerHTML = `<span>Name:${folderData.image.name}</span><span>Date:${folderData.image.date}</span>`;
      filescontainer.innerHTML = `${folderData.image.path.map(path => {
        return `
        <a href="/img/MRI/${path}" data-lightbox="models">
          <img src="/img/MRI/${path}" />
        </a>
        `;
      })}`;
    }
    // res.data.data.patientMRI
  } catch (err) {
    console.log(err);
  }
};

export const rendringFiles = async id => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/v1/patient/patientRecord/getPatientFiles/${id}`,
    });

    const folderPcontainerr = document.querySelector('.files-container');
    folderPcontainerr.innerHTML = `
<a href="/img/next.png" data-lightbox="models">
  <img src="/img/next.png" />
</a>
`;
  } catch (err) {
    console.log(err);
  }
};
