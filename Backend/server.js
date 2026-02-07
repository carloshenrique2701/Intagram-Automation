require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = express();

// Configurações iniciais
const JWT_SECRET = process.env.JWT_SECRET || require('crypto').randomBytes(64).toString('hex');
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Conectar ao banco de dados
require('./config/DataBase');
const User = require('./models/User');
const Post = require('./models/Post');

// Configuração do Google Drive
const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: ['https://www.googleapis.com/auth/drive.file']
});

const drive = google.drive({ version: 'v3', auth });

// Configuração do Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'tmp/uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueName + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Apenas imagens são permitidas (jpeg, jpg, png, gif, webp)'));
    }
});

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ 
            success: false,
            message: 'Token não fornecido' 
        });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ 
                success: false,
                message: 'Token inválido ou expirado' 
            });
        }
        req.user = user;
        next();
    });
};

// Rota de Cadastro
app.post('/cadastro', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Validações
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Todos os campos são obrigatórios!' 
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'A senha deve ter pelo menos 6 caracteres'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Email inválido'
            });
        }

        // Verificar se email já existe
        const emailExistente = await User.findOne({ email: email.toLowerCase() });
        if (emailExistente) {
            return res.status(400).json({ 
                success: false,
                message: 'Email já cadastrado.' 
            });
        }

        // Criar usuário
        const user = new User({ 
            name, 
            email: email.toLowerCase(), 
            password 
        });

        await user.save();

        // Gerar token
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                name: user.name
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(201).json({ 
            success: true,
            message: 'Usuário cadastrado com sucesso!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Erro ao realizar cadastro:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Erro no servidor.' 
        });
    }
});

// Rota de Login 
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Email e senha são obrigatórios!' 
            });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });

        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Credenciais inválidas.' 
            });
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false,
                message: 'Credenciais inválidas.' 
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                name: user.name
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(200).json({ 
            success: true,
            message: 'Login realizado com sucesso!',
            token,
            user: { 
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Erro ao realizar login:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Erro no servidor.' 
        });
    }
});

// Dados Instagram (COM CRIPTOGRAFIA)
app.put('/instagram-login', authenticateToken, async (req, res) => {
    try {
        const { instagramEmail, instagramPassword } = req.body;
        const userId = req.user.userId;

        if (!instagramEmail || !instagramPassword) {
            return res.status(400).json({ 
                success: false,
                message: 'Dados do Instagram são obrigatórios' 
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'Usuário não encontrado.' 
            });
        }

        user.instagramCredentials = {
            email: instagramEmail,
            password: instagramPassword 
        };

        await user.save();

        return res.status(200).json({ 
            success: true,
            message: 'Dados do Instagram atualizados com sucesso!' 
        });

    } catch (error) {
        console.error('Erro ao atualizar dados do Instagram:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Erro no servidor.' 
        });
    }
});

// Rota de Upload
app.post('/api/upload', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        // Validação dos campos do formulário
        const { description, datePost } = req.body;

        if (!description || !datePost) {
            return res.status(400).json({ 
                success: false,
                message: 'Descrição e data do post são obrigatórios.' 
            });
        }

        if (!req.file) {
            return res.status(400).json({ 
                success: false,
                message: 'Nenhuma imagem enviada.' 
            });
        }

        // Validar data
        const postDate = new Date(datePost);
        if (isNaN(postDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Data inválida.'
            });
        }

        // Upload para Google Drive
        const fileMetadata = {
            name: `post_${req.user.userId}_${Date.now()}`,
            parents: [process.env.GOOGLE_DRIVE_FOLDER_ID]
        };
        
        const media = {
            mimeType: req.file.mimetype,
            body: fs.createReadStream(req.file.path)
        };
        
        const driveResponse = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id, webViewLink, webContentLink'
        });

        // Criar post no banco de dados
        const newPost = new Post({
            userId: req.user.userId,
            description: description,
            datePost: postDate,
            imageUrl: driveResponse.data.webViewLink,
            driveFileId: driveResponse.data.id
        });

        await newPost.save();
        
        // Limpar arquivo temporário
        fs.unlinkSync(req.file.path);
        
        res.status(201).json({
            success: true,
            message: 'Post criado com sucesso!',
            post: {
                id: newPost._id,
                description: newPost.description,
                datePost: newPost.datePost,
                imageUrl: newPost.imageUrl,
                createdAt: newPost.createdAt
            }
        });
        
    } catch (error) {
        console.error('Erro no upload:', error);
        
        // Limpar arquivo temporário em caso de erro
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao processar upload' 
        });
    }
});

// Rota para listar posts do usuário
app.get('/api/posts', authenticateToken, async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.user.userId })
            .sort({ datePost: 1 })
            .select('-__v');
            
        res.json({
            success: true,
            posts
        });
    } catch (error) {
        console.error('Erro ao buscar posts:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar posts'
        });
    }
});

// Rota para deletar post
app.delete('/api/posts/:id', authenticateToken, async (req, res) => {
    try {
        const post = await Post.findOne({ 
            _id: req.params.id, 
            userId: req.user.userId 
        });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post não encontrado'
            });
        }

        // Opcional: deletar do Google Drive também
        // await drive.files.delete({ fileId: post.driveFileId });
        
        await post.deleteOne();

        res.json({
            success: true,
            message: 'Post deletado com sucesso'
        });
    } catch (error) {
        console.error('Erro ao deletar post:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao deletar post'
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});