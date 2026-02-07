document.addEventListener('DOMContentLoaded', function () {
   
    const userNameElement = document.getElementById('userName');
    const userEmailElement = document.getElementById('userEmail');
    const user =  JSON.parse(localStorage.getItem('user'));
    
    if (user) {
        userNameElement.innerText = user.name;
        userEmailElement.innerText = user.email;
    } else {
        window.location.href = 'login.html';
    }

});

//Botões das configurações
const sectionChangeEmail = document.getElementById('changeEmail');
const sectionChangePassword = document.getElementById('changePassword');
const sectionPutIntagramLogin = document.getElementById('putIntagramLogin');
const btnAddCredenciais = document.getElementById('btnAddCredenciais');
const sectionDeleteAccont = document.getElementById('deleteAccont');
const settingsSections = [sectionChangeEmail, sectionChangePassword, btnAddCredenciais, sectionPutIntagramLogin, sectionDeleteAccont]

//Modal para alteração de email
const modalChangeEmail = document.getElementById('modal-change-email');
const modalContentAlertEmail = document.getElementById('modal-content-alert-email');
const modalContentNewEmail = document.getElementById('modal-content-new-email');
const contentsChangeEmail = [modalContentAlertEmail, modalContentNewEmail];

//Modal para alteração de senha
const modalChangePassword = document.getElementById('modal-change-password');
const modalContentAlertPassword = document.getElementById('modal-content-alert-password');
const modalContentConfirmEmail = document.getElementById('modal-content-confirm-email');
const modalContentNewPassword = document.getElementById('modal-content-new-password');
const contentChangePassword = [modalContentAlertPassword, modalContentConfirmEmail, modalContentNewPassword];

//Modal para as credenciais do instagram
const modalCredentialsInstagram = document.getElementById('modal-credentials-instagram');

//Modal para excluir a conta
const modalDeleteAccont = document.getElementById('modal-delete-accont');
const modalContentAlertDeleteAccont = document.getElementById('modal-content-alert-delete-accont');
const modalContentConfirmEmailDelete = document.getElementById('modal-content-confirm-email-delete-accont');
const modalContentConfirmPasswordDelete = document.getElementById('modal-content-confirm-password-delete-accont');
const contentDelete = [modalContentAlertDeleteAccont, modalContentConfirmEmailDelete, modalContentConfirmPasswordDelete]

//Todos os modals das configurações
const modals = document.querySelectorAll('.modal')

const cancelModal = document.querySelectorAll('.cancel');
    
cancelModal.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        closeAllModals();
    });
});

function closeAllModals() {
    
    modals.forEach(modal => {
        modal.style.display = 'none';
    });

    cleanAllInputs();

}

function cleanAllInputs() {
    
    const inputsModal = document.querySelectorAll('#inputModal');

    inputsModal.forEach(input => {
        input.textContent = '';
    });

}

window.addEventListener('click', (e) => {
    modals.forEach(modal => {
        if (e.target === modal) {
            closeAllModals();
        }
    });
});

settingsSections.forEach(sectionBtn => sectionBtn.addEventListener('click', () => {

    const modal = sectionBtn.getAttribute('data-modal');

    closeAllModals();
    cleanAllInputs();

    switch (modal) {
        case modalChangeEmail.id:
            modalChangeEmail.style.display = 'flex';
            contentsChangeEmail.forEach(modalContent => modalContent.style.display = 'none');
            contentsChangeEmail[0].style.display = 'block';
            break;
    
        case modalChangePassword.id:
            modalChangePassword.style.display = 'flex';
            contentChangePassword.forEach(modalContent => modalContent.style.display = 'none');
            contentChangePassword[0].style.display = 'block';
            break;
    
        case modalCredentialsInstagram.id:
            modalCredentialsInstagram.style.display = 'flex';
            break;
    
        case modalDeleteAccont.id:
            modalDeleteAccont.style.display = 'flex';
            contentDelete.forEach(modalContent => modalContent.style.display = 'none');
            contentDelete[0].style.display = 'block';
            break;
    
        default:
            break;
    }

}));

const btnLogout = document.getElementById('logoutBtn');

btnLogout.addEventListener('click', () => {

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';

});

const user =  JSON.parse(localStorage.getItem('user'));

//Mudar email
const confirmAlertChangeEmail = document.getElementById('confirm-alert-change-email');

confirmAlertChangeEmail.addEventListener('click', () => {
    contentsChangeEmail[0].style.display = 'none';
    contentsChangeEmail[1].style.display = 'block';
});

//Mudar senha
const confirmAlertChangePassword = document.getElementById('confirmAlertChangePassword');
const formConfirmEmailChangePassword = document.getElementById('formConfirmEmailChangePassword');

confirmAlertChangePassword.addEventListener('click', () => {
    contentChangePassword[0].style.display = 'none';
    contentChangePassword[1].style.display = 'block';
});

formConfirmEmailChangePassword.addEventListener('submit', (e) => {

    e.preventDefault();

    const emailConfirmtionInputChangePassword = document.getElementById('email-confirmation-change-password').value;

    if (user.email === emailConfirmtionInputChangePassword) {
        contentChangePassword[1].style.display = 'none';
        contentChangePassword[2].style.display = 'block';
    } else {
        alert('Email incorreto.');
        closeAllModals();
    } 

});


//Deletar conta
const confirmAlertDeleteAccont = document.getElementById('confirmAlertDeleteAccont');
const formCheckEmailDelete = document.getElementById('formCheckEmailDelete');

confirmAlertDeleteAccont.addEventListener('click', () => {
    contentDelete[0].style.display = 'none';
    contentDelete[1].style.display = 'block';
});


formCheckEmailDelete.addEventListener('submit', (e) => {

    const emailConfirmtionInputDelete = document.getElementById('email-confirmation-delete').value;
    if (user.email === emailConfirmtionInputDelete) {
        contentDelete[1].style.display = 'none';
        contentDelete[2].style.display = 'block';
    } else {
        alert('Email incorreto.');
        closeAllModals();
    }    

});
