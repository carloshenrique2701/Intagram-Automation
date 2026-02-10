document.addEventListener('DOMContentLoaded', function() {
    const formCadastro = document.getElementById('formCadastro');
    
    // Se já estiver logado, redireciona
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = 'main.html';
        return;
    }
    
    formCadastro.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        // Pega valores
        const name = document.getElementById('userName').value.trim();
        const email = document.getElementById('userEmail').value.trim().toLowerCase();
        const password = document.getElementById('userPassword').value;
        
        // Validações
        if (!name || !email || !password) {
            mostrarErro('Todos os campos devem ser preenchidos!');
            return;
        }
        
        if (password.length < 6) {
            mostrarErro('A senha deve ter pelo menos 6 caracteres');
            return;
        }
        
        if (!validarEmail(email)) {
            mostrarErro('Email inválido');
            return;
        }
        
        // Mostrar loading
        const btnSubmit = formCadastro.querySelector('button[type="submit"]');
        const btnOriginalText = btnSubmit.textContent;
        btnSubmit.textContent = 'Cadastrando...';
        btnSubmit.disabled = true;
        
        try {
            const resp = await fetch('http://127.0.0.1:3000/cadastro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
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
                mostrarSucesso('Cadastro realizado com sucesso!');
                
                // Pequeno delay para mostrar mensagem
                setTimeout(() => {
                    window.location.href = 'main.html';
                }, 1000);
                
            } else {
                mostrarErro(data.message || 'Erro no cadastro');
                btnSubmit.textContent = btnOriginalText;
                btnSubmit.disabled = false;
            }
            
        } catch (error) {
            console.error('Erro no cadastro:', error);
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
        `;
        erroEl.textContent = mensagem;
        
        // Insere antes do formulário
        formCadastro.parentNode.insertBefore(erroEl, formCadastro);
        
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
        `;
        sucessoEl.textContent = mensagem;
        
        // Insere antes do formulário
        formCadastro.parentNode.insertBefore(sucessoEl, formCadastro);
    }
});