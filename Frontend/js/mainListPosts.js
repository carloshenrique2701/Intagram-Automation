document.addEventListener('DOMContentLoaded', async () => {

    const postList = document.getElementById('postList');
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user'));
    const noPost = document.getElementById('noPost');
    noPost.style.display = 'none';

    try {

        const resp = await fetch('http://127.0.0.1:3000/check-credentials', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ email: user.email })
        });

        const data = await resp.json();

        if(!data.success) {
            postList.innerHTML = `
                <span id="noPost">Erro ao verificar credenciais do Instagram. <br>
                    <button id="btnAddCredenciais" data-modal="modal-credentials-instagram" >Adicionar credenciais do instagram.</button>
                </span>
            `;
            const btnAddCredenciais = document.getElementById('btnAddCredenciais');
            btnAddCredenciais.style.display = 'none';
            noPost.style.display = 'block';
            return;
        }

        if (!data.credentials) {
            noPost.style.display = 'block';
            return;
        }

        noPost.style.display = 'none';
        await listAllPosts();

    } catch (error) {
        console.error('Erro ao procurar credenciais: ', error);
    }

    function listAllPosts () {

        console.log('em produção...')

    }

});