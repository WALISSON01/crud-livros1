require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json()); 


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB conectado!'))
.catch(err => console.error('Erro ao conectar MongoDB:', err));


const livroSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    autor: { type: String, required: true },
    editora: { type: String, required: true },
    ano: { type: Number, required: true },
    preco: { type: Number, required: true }
});

const Livro = mongoose.model('Livro', livroSchema);


app.get('/livros', async (req, res) => {
    try {
        const livros = await Livro.find();
        res.json(livros);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.get('/livros/:id', async (req, res) => {
    try {
        const livro = await Livro.findById(req.params.id);
        if (!livro) return res.status(404).json({ message: 'Livro não encontrado' });
        res.json(livro);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.post('/livros', async (req, res) => {
    const { titulo, autor, editora, ano, preco } = req.body;
    const livro = new Livro({ titulo, autor, editora, ano, preco });

    try {
        const novoLivro = await livro.save();
        res.status(201).json(novoLivro);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


app.put('/livros/:id', async (req, res) => {
    try {
        const livro = await Livro.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!livro) return res.status(404).json({ message: 'Livro não encontrado' });
        res.json(livro);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


app.delete('/livros/:id', async (req, res) => {
    try {
        const livro = await Livro.findByIdAndDelete(req.params.id);
        if (!livro) return res.status(404).json({ message: 'Livro não encontrado' });
        res.json({ message: 'Livro removido com sucesso' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
