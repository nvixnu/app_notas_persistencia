// Variáveis globais da aplicação
let dados = []; // ECMASCRIPT LET


/**
 * Altera a visualização dos cards (lista, grade-grande ou grade-pequena)
 */
// ECMASCRIPT ARROW FUNCTION
const alteraClasse = (classe) => {
    document.getElementById("cards").className = classe;
}

/**
 * Captura o tipo da visualização em telas pequenas
 */
const selecionaNaTelaPequena = () => {
    const selecionado = document.getElementById("menu-cabecalho-tela-pequena").value;

    const classeMap = {
        "l": "lista",
        "gg": "grade-grande",
        "gp": "grade-pequena"
    };

    alteraClasse(classeMap[selecionado]);
}

/**
 * Adiciona um novo item/card na lista/grid
 */
const addItemLista = (item, index) => {
    document.getElementById("msg-lista-vazia").style.display = "none";
    const li = document.createElement("li");

    const textArea = document.createElement("textarea");
    textArea.placeholder = "Informe o texto...";
    textArea.addEventListener("keyup", ({ target } /*ECMASCRIPT DESTRUCTURING */) => {
        dados[index].texto = target.value;
    });
    li.appendChild(textArea);

    const date = document.createElement("input");
    date.type = "date";
    date.addEventListener("change", ({ target } /*ECMASCRIPT DESTRUCTURING */) => {
        dados[index].data = target.value;
    });
    li.appendChild(date);

    const range = document.createElement("input");
    range.type = "range";
    range.value = 0;
    range.max = "3";
    range.addEventListener("change", ({ target }) => {
        alteraCorPrioridade(li, target.value);
        dados[index].prioridade = target.value;
    });

    const label = document.createElement("label");
    label.innerText = "Prioridade";
    label.append(range);
    li.appendChild(label);

    if (item) { // Se houver valor em item...
        const { texto, data, prioridade } = item; // ECMASCRIPT DESTRUCTURING 
        textArea.value = texto;
        date.value = data;
        range.value = prioridade;
        alteraCorPrioridade(li, prioridade);
    }

    document.getElementById("cards").appendChild(li);
}

/**
 * Remove as classes de prioridade e adiciona apenas uma
 */
const alteraCorPrioridade = (li, prioridade) => {
    li.className = `prioridade-${prioridade}`;
}

/**
 * Remove os itens da lista e os re-adiciona, de forma ordenada
 */
const ordenarPorPrioridade = () => {
    const ul = document.getElementById("cards");
    ul.innerHTML = '';
    dados /* ECMASCRIPT ARRAY SORT E FOREACH */
        .sort((a, b) => b.prioridade - a.prioridade)
        .forEach((item, index) => addItemLista(item, index));
}


/**
 * Salva os dados no localStorage/sessionStorage
 */
const login = () => {
    const usuario = document.getElementById('login-usuario');
    const senha = document.getElementById('login-senha');
    const lembrar = document.getElementById('login-lembrar');

    if(usuario.value.trim() == 'adm' && senha.value.trim() == 'adm'){
        document.getElementById("modal").classList = 'off';
        loadData();
        if(lembrar.checked){
            localStorage.setItem('usuario', 'adm');
            localStorage.setItem('senha', 'adm');
        }else{
            sessionStorage.setItem('usuario', 'adm');
            sessionStorage.setItem('senha', 'adm');
        }
    }else{
        alert("usuário e/ou senha inválidos")
    }
}

/**
 * Limpa os dados do localStorage / sessionStorage
 */
const logout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("senha");
    sessionStorage.removeItem("usuario");
    sessionStorage.removeItem("senha");
    document.getElementById("cards").innerHTML = '';
    document.getElementById("modal").classList = 'on';
}

const salvarAlteracoesServidor = async () => {
    /*
    //INFELIZMENTE O LIVE SERVER NÃO POSSUI SUPORTE PARA ATUALIZAÇÃO DE ARQUIVOS
    try {  
        await fetch('./data.json', {
            method: "POST",
            body: JSON.stringify(dados), //Transforma o Json em uma string
            headers: {
              "Content-Type": "application/json"
            }
          });
    } catch (err) {    
        alert(`Atenção: Erro ${err}`); // ECMASCRIPT TEMPLATE LITERAL
        console.error(err);
    } 
    */  

    localStorage.setItem("dados", JSON.stringify(dados))
    alert("Dados atualizados com sucesso!")
}

/**
 * Lê os dados da aplicação de um arquivo de texto (formato JSON)
 */
// ECMASCRIPT CONST, ASYNC/AWAIT, ARROW FUNCTION
const loadData = async () => {
    if(!localStorage.getItem("dados")){
        try {  
            const response = await fetch('./data.json');
            const data = await response.json();
            data.forEach((item, index) => addItemLista(item, index)); // ECMASCRIPT FOREACH
            dados = [...data]; // ECMASCRIPT SPREAD OPERATOR
        } catch (err) {    
            alert(`Atenção: Erro ${err}`); // ECMASCRIPT TEMPLATE LITERAL
            console.error(err);
        }
    }else{
        dados = [...JSON.parse(localStorage.getItem("dados"))];
        dados.forEach((item, index) => addItemLista(item, index)); 
    }
}

//Se tem usuário logado, carrega os dados. Se não, exibe a modal de login
if(localStorage.getItem("usuario") || sessionStorage.getItem("usuario")){
    loadData();
}else{
    document.getElementById("modal").classList = "on"
}

