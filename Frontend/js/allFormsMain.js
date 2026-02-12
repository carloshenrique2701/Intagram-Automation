//Form para adicionar as senhas do instagram
const credentialsInstagramForm = document.getElementById('instagramCredentialsForm')

credentialsInstagramForm.addEventListener('submit', async (e) => {
    e.stopPropagation();
    e.preventDefault();

    const instagramEmailInput = document.getElementById('instagramEmailOrNumber');
    const instagramPasswordInput = document.getElementById('instagramPassword');
    const submitBtn = e.target.querySelector('button[type="submit"]');

    // Validação básica
    if (!instagramEmailInput.value.trim() || !instagramPasswordInput.value.trim()) {
        alert('Por favor, preencha todos os campos');
        return;
    }

    // Desabilita botão para evitar múltiplos cliques
    submitBtn.disabled = true;
    submitBtn.textContent = 'Salvando...';

    try {
        const token = localStorage.getItem('token');
        
        const response = await fetch('http://localhost:3000/instagram-login', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }, 
            body: JSON.stringify({
                instagramEmail: instagramEmailInput.value.trim(),
                instagramPassword: instagramPasswordInput.value
            })
        });

        const data = await response.json();

        if (data.success) {
            // Atualiza o localStorage com dados atualizados
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            
            mostrarSucesso(data.message || 'Credenciais do Instagram Salvas!', credentialsInstagramForm);
            
            instagramPasswordInput.value = '';
            
            if (data.user.instagramEmail) {
                instagramEmailInput.value = `Email salvo: ${data.user.instagramEmail}`;
            }
            
            setTimeout(() => {
                closeAllModals();
            }, 1500);
            
        } else {
            mostrarErro(data.message || 'Erro ao salvar credenciais.', credentialsInstagramForm);
        }

    } catch (error) {
        console.error('Erro:', error);
        alert('Erro de conexão com o servidor. Tente novamente.');
    } finally {
        // Reabilita o botão
        submitBtn.disabled = false;
        submitBtn.textContent = 'Salvar';
    }
});




//Form para atualizar email
const changeEmailForm = document.getElementById('putEmailForm');

changeEmailForm.addEventListener('submit', async (e) => {
   
    e.preventDefault();

    const newEmail = document.getElementById('new-email').value.toLowerCase();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const user = JSON.parse(localStorage.getItem('user'));

    if (newEmail === user.email) return mostrarErro('O novo email deve ser diferente do atual', changeEmailForm);
    if (!user) {
        window.location.href = 'login.html';
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Salvando...';

    try {

        const token = localStorage.getItem('token');

        const resp = await fetch('http://localhost:3000/update-user/email', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                oldEmail: user.email,
                newEmail: newEmail
            })
        });

        const data = await resp.json();

        if (data.success) {

            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            
            mostrarSucesso(data.message || 'Email alterado com sucesso!', changeEmailForm);
            
            const userEmailElement = document.getElementById('userEmail');
            const user =  JSON.parse(localStorage.getItem('user'));

            if (user) {
                userEmailElement.innerText = user.email;
            } else {
                window.location.href = 'login.html';
            }

            setTimeout(() => {
                closeAllModals();
            }, 1500);

            
        } else {

            mostrarErro(data.message || 'Ocorreu um erro ao altrar o email. Tente novamente mais tarde', changeEmailForm);
            
        }

    } catch (error) {
        console.error('Erro:', error);
        alert('Erro de conexão com o servidor. Tente novamente.');
    } finally {
        // Reabilita o botão
        submitBtn.disabled = false;
        submitBtn.textContent = 'Salvar';
    }


});




//Form para atualizar senha
const putPasswordForm = document.getElementById('putPasswordForm');

putPasswordForm.addEventListener('submit', async (e) => {
   
    e.preventDefault();

    const newPassword = document.getElementById('new-password').value.toLowerCase();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (newPassword.length < 6) return mostrarErro('A senha deve conter 6 no mínimo digitos.', putPasswordForm);
    if (!user) {
        window.location.href = 'login.html';
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Salvando...';

    try {

        const token = localStorage.getItem('token');

        const resp = await fetch('http://localhost:3000/update-user/password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                email: user.email,
                newPassword: newPassword
            })
        });

        const data = await resp.json();

        if (data.success) {

            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            
            mostrarSucesso(data.message || 'Senha alterado com sucesso!', putPasswordForm);
            
            setTimeout(() => {
                closeAllModals();
            }, 1500);

        } else {

            mostrarErro(data.message || 'Ocorreu um erro ao altrar a sua senha. Tente novamente mais tarde', putPasswordForm);
            
        }

    } catch (error) {
        console.error('Erro:', error);
        mostrarErro('Erro de conexão com o servidor. Tente novamente.', putPasswordForm);
    } finally {
        // Reabilita o botão
        submitBtn.disabled = false;
        submitBtn.textContent = 'Salvar';
    }

});



//Form para deletar a conta
const deleteAccontForm = document.getElementById('deleteAccontForm');

deleteAccontForm.addEventListener('submit', async (e) => {

    e.preventDefault();

    const password = document.getElementById('password-confirmation').value;
    const user = JSON.parse(localStorage.getItem('user'));
    const submitBtn = e.target.querySelector('button[type="submit"]');

    if (password.length < 6) return mostrarErro('A senha deve conter 6 caracteres', deleteAccontForm);
    if (!user) {
        window.location.href = 'login.html';
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Checando...';

    try {

        const token = localStorage.getItem('token');

        const resp = await fetch('http://localhost:3000/validate-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                password: password,
                email: user.email
            })
        });

        const data = await resp.json();

        if (data.success) {

            mostrarSucesso('Deletando...', deleteAccontForm);
            
            const isDeleted = await fetch('http://localhost:3000/delete-account', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    email: user.email
                })
            });

            const dataDeleted = await isDeleted.json();

            if (dataDeleted.success) {

                mostrarSucesso(dataDeleted.message || 'Sua conta foi deletada com sucesso!', deleteAccontForm);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = 'login.html';

            } else {

                mostrarErro(dataDeleted.message || 'Erro no servidor. Tente novamente mais tarde.', deleteAccontForm);

            }

        } else {

            mostrarErro(data.message || 'Erro no servidor. Tente novamente mais tarde.', deleteAccontForm);

        }

    } catch (error) {
        console.error('Erro no servidor: ', error);
        mostrarErro('Erro no servidor. Tente novamente mais tarde.', deleteAccontForm);
    } finally {
        // Reabilita o botão
        submitBtn.disabled = false;
        submitBtn.textContent = 'Deletar';
    }


});




const formUploadPost = document.getElementById('newPostForm');

formUploadPost.addEventListener('submit', async (e) => {

    e.preventDefault();

    const canvas = document.querySelector('#canvas');
    const postName = document.getElementById('postName').value;
    const description = document.getElementById('postDescription').value;
    const date = document.getElementById('datePost').value;
    const time = document.getElementById('timePost').value;
    const btnSubmit = e.target.querySelector("button[type='submit']");

    const datePost = new Date(`${date}T${time}`);
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    //Verificações
    
    if (!user || !token) {
        mostrarErro('Você precisa estar logado!', formUploadPost);
        window.location.href = 'login.html';
        return;
    }
    if (!postName) return mostrarErro('O post precisa ter um nome!', formUploadPost);
    if (!canvas.toDataURL('image/png')) return mostrarErro('O post precisa ter um arquivo de imagem válido!', formUploadPost);
    if (!user.instagramEmail) return mostrarErro('Você precisa estar com suas credenciais do instagram cadastradas! Vá para janela principal e cadastre-as!', formUploadPost);
    
    // Verificar se canvas tem imagem
    try {
        const hasImage = await new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob !== null);
            }, 'image/png');
        });
        
        if (!hasImage) {
            return mostrarErro('O post precisa ter uma imagem válida!', formUploadPost);
        }
    } catch (error) {
        console.error('Erro ao verificar canvas:', error);
        return mostrarErro('Erro ao processar imagem!', formUploadPost);
    }

    btnSubmit.textContent = 'Salvando post...';
    btnSubmit.disabled = true;

    try {
        
        // Converter canvas para blob
        const blob = await new Promise((resolve) => {
            canvas.toBlob(resolve, 'image/png');
        });

        const formData = new FormData();
        formData.append('image', blob, `post-${Date.now()}.png`);
        formData.append('postName', postName);
        formData.append('description', description || ''); 
        formData.append('datePost', datePost.toISOString());

        const resp = await fetch('http://127.0.0.1:3000/api/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!resp.ok) {
            const text = await resp.text();
            throw new Error(`Erro HTTP: ${resp.status} - ${text}`);
        }

        const data = await resp.json();

        if (data.success) {
            mostrarSucesso('Post salvo com sucesso!', formUploadPost);
            
            // Limpar formulário
            document.getElementById('postName').value = '';
            document.getElementById('postDescription').value = '';
            
            // Recarregar lista de posts
            if (typeof listPosts === 'function') {
                await listPosts();
            }
            
            setTimeout(() => {
                closeAllModals();
            }, 1500);

        } else {
            mostrarErro(data.message || 'Erro ao salvar post. Tente novamente.', formUploadPost);
        }

    } catch (error) {
        console.error('Erro no servidor: ', error);
        mostrarErro('Ocorreu um erro ao salvar seu post. Tente novamente mais tarde.', formUploadPost);
    } finally {
        btnSubmit.textContent = 'Salvar Post';
        btnSubmit.disabled = false;
    }

});

async function listPosts() {
    console.log('em produção...')
}


//Funções extras
function mostrarErro(mensagem, form) {
    // Remove mensagens anteriores
    const errosAnteriores = document.querySelectorAll('.mensagem-erro');
    errosAnteriores.forEach(el => el.remove());
    
    // Cria nova mensagem
    const erroEl = document.createElement('div');
    erroEl.className = 'mensagem-erro';
    erroEl.style.cssText = `
        color: #dc3545;
        background: #f8d7da;
        border: 1px solid #f5c6cb;
        padding: 10px;
        margin: 10px 0;
        border-radius: 4px;
        margin-bottom: 20px;
    `;
    erroEl.textContent = mensagem;
    
    // Insere antes do formulário
    form.parentNode.insertBefore(erroEl, form);
    
}

function mostrarSucesso(mensagem, form) {
    // Remove mensagens anteriores
    const sucessosAnteriores = document.querySelectorAll('.mensagem-sucesso');
    sucessosAnteriores.forEach(el => el.remove());
    
    const errosAnteriores = document.querySelectorAll('.mensagem-erro');
    errosAnteriores.forEach(el => el.remove());
    // Cria nova mensagem
    const sucessoEl = document.createElement('div');
    sucessoEl.className = 'mensagem-sucesso';
    sucessoEl.style.cssText = `
        color: #155724;
        background: #d4edda;
        border: 1px solid #c3e6cb;
        padding: 10px;
        margin: 10px 0;
        border-radius: 4px;
        margin-bottom: 20px;
    `;
    sucessoEl.textContent = mensagem;
    
    // Insere antes do formulário
    form.parentNode.insertBefore(sucessoEl, form);
}

function closeAllModals() {

    const modals = document.querySelectorAll('.modal')
    
    modals.forEach(modal => {
        modal.style.display = 'none';
    });

    cleanAllInputs();

}

function cleanAllInputs() {
    
    const inputsModal = document.querySelectorAll('.inputModal');

    inputsModal.forEach(input => {
        input.textContent = '';
        input.value = '';
    });

}