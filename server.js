//Configurando o servidor
const express = require('express');
const app = express();

//Configurar o servidor para apresentar arquivos estáticos
app.use(express.static('public'))

//Habilitar body do formulário
app.use(express.urlencoded({ extended: true }))

//Configurar conexão com banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'Ved5157189!',
    host: 'localhost',
    port: 5432,
    database: 'doe',
})

//Configurando a template engine (nunjucks)
const nunjucks = require('nunjucks');
nunjucks.configure('./', {
    express: app,
    noCache: true,
})

//Configurar a apresentação da página
app.get('/', function(req, res) {

    db.query("SELECT * FROM donors", function(err, result) {
        if (err) return res.send("Erro de banco de dados.")
        
        const donors = result.rows
        return res.render("index.html", { donors })
    })
});

app.post('/', function(req, res) {
    //pegar dados do formulário
    const name = req.body.name;
    const email = req.body.email;
    const blood = req.body.blood;

    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios.")
    }

    //Adicionar valor dentro do array
    // donors.push({
    //     name: name,
    //     blood: blood,
    // });

    //Adicionar valores dentro do banco de dados
    const query = `
        INSERT INTO donors ("name", "email", "blood") 
        VALUES ($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, function(err) {
        //Fluxo de Erro
        if (err) return res.send("Erro no Banco de Dados")

        //Fluxo Ideal
        return res.redirect('/');
    })

});

//Ligar servidor, e permitir acesso na porta 3000
app.listen(3000, function() {
    console.log('Iniciei o Server!!')
});
