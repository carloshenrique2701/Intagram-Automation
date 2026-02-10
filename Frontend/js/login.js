document.addEventListener('DOMContentLoaded', function() {
    const formLogin = document.getElementById('formLogin');
    
    // Se já estiver logado, redireciona
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = 'main.html';
        return;
    }
    
    formLogin.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        // Pega valores
        const email = document.getElementById('loginEmail').value.trim().toLowerCase();
        const password = document.getElementById('loginPassword').value;
        
        // Mostrar loading
        const btnSubmit = formLogin.querySelector('button[type="submit"]');
        const btnOriginalText = btnSubmit.textContent;
        btnSubmit.textContent = 'Efetuando Login...';
        btnSubmit.disabled = false;

        // Validações
        if (!email || !password) {
            setTimeout(() => {
                btnSubmit.textContent = btnOriginalText;
                mostrarErro('Todos os campos devem ser preenchidos!');
            }, 1000);
            btnSubmit.disabled = false;
            return;
        }
        
        if (password.length < 6) {
            setTimeout(() => {
                btnSubmit.textContent = btnOriginalText;
                mostrarErro('A senha deve ter pelo menos 6 caracteres');
            }, 1000);
            btnSubmit.disabled = false;
            return;
        }
        
        if (!validarEmail(email)) {
            setTimeout(() => {
                btnSubmit.textContent = btnOriginalText;
                mostrarErro('Email inválido');
            }, 1000);
            btnSubmit.disabled = false;
            return;
        }
        
        
        try {
            const resp = await fetch('http://127.0.0.1:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });
            
            const data = await resp.json();
            
            if (data.success) {
                // Salva dados
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Feedback visual
                mostrarSucesso('Login realizado com sucesso!');
                
                // Pequeno delay para mostrar mensagem
                setTimeout(() => {
                    window.location.href = 'main.html';
                }, 1000);
                
            } else {
                mostrarErro(data.message || 'Erro no login');
                btnSubmit.textContent = btnOriginalText;
            }
            
        } catch (error) {
            console.error('Erro no login:', error);
            mostrarErro('Erro de conexão. Tente novamente.');
            btnSubmit.textContent = btnOriginalText;
            btnSubmit.disabled = false;
        }
    });
    
    // Funções auxiliares
    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    function mostrarErro(mensagem) {
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
        formLogin.parentNode.insertBefore(erroEl, formLogin);
        
    }
    
    function mostrarSucesso(mensagem) {
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
        formLogin.parentNode.insertBefore(sucessoEl, formLogin);
    }
});