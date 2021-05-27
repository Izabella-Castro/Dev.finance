
//Abre modal e fecha modal
const modal = {
    open() {
        document.querySelector('.modal-overlay').classList.add('active');
    },
    close() {
        document.querySelector('.modal-overlay').classList.remove('active');
    }
}

const Storage = {
    get() { // get: retornar um valor
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []; //parse: transforma em objeto js
    },
    set(transactions) { //set: atribui um valor
        localStorage.setItem("dev.finances:transactions",JSON.stringify(transactions)) //stringify: de objeto js para string

    }
}

//Entradas
//A soma das entradas
//A soma das saídas
//total de entradas - saidas
//adição de entrada
//romovedir de operação
const operation = {
    all: Storage.get(),
    add(transacao){
        operation.all.push(transacao); //push: add um novo item a matriz

        app.reload()
    },

    remove(index){
        operation.all.splice(index,1) //splice: remover item da matriz

        app.reload()
    },

    incomes() { //entrada de dinhero
        let totalIncome = 0;
        operation.all.forEach(operationTransaction => { // forEach: executará uma função para cada elemento presente em um array.
            if (operationTransaction.amount > 0) {
                totalIncome += operationTransaction.amount
            }
        }) 

        return totalIncome
    },

    expenses() { //saida de dinherio
        let totalExpense = 0;
        operation.all.forEach(operationTransaction => {
            if (operationTransaction.amount < 0) {
                totalExpense += operationTransaction.amount

            }
        })

        return totalExpense
    },

    total() { 
        totalOperation = operation.incomes() + operation.expenses()
        return totalOperation
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTransaction(transaction,index); //colocando o <tr> entre o const html
        tr.dataset.index = index;
        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) {
        const amount = utils.formatCurrency(transaction.amount)
        const CSSclass = transaction.amount > 0 ? "income" : "expense";
        const html = `
         <td class="description">${transaction.description}</td>
         <td class=${CSSclass}>${amount}</td>
         <td class="date">${transaction.date}</td>
         <td><img onclick ="operation.remove(${index})" src="./assets/minus.svg" alt="remover transação"></td>
        `
        return html
    },

    //Mostra na tela de entrada 
    updateBalance() {
        document.getElementById('incomeDisplay').innerHTML = utils.formatCurrency(operation.incomes())
        document.getElementById('expenseDisplay').innerHTML = utils.formatCurrency(operation.expenses())
        document.getElementById('totalDisplay').innerHTML = utils.formatCurrency(operation.total())
    },

    clearTransactions(){
        DOM.transactionsContainer.innerHTML = "";
    }
}

const utils = {
    formatAmount (value){
        value = Number(value.replace(/\,\./g,"")) * 100
        return value
    },

    formatDate (date){
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : "";

        value = String(value).replace(/\D/g, "");    // /\D/ -> Ache só números g-> pega todos
        //replace(/\D/g,"") vai tirar tudo que não for número, ou seja, o sinal. O sinal só irá aparecer novamente quando entrar na condição signal
        value = Number(value) / 100;
        value = value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

        return signal + value
    }
}

const form = {
    //Chamando do html
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    //Pegando os valores inseridos
    getValue(){
        return{
        description: form.description.value,
        amount: form.amount.value,
        date: form.date.value
        }
    },

    //verificar se todas as informações foram preenchidas
    validateFields(){
        const {description, amount, date} = form.getValue()
        if (description.trim() === "" || amount.trim() === "" || date.trim() === ""){   //trim -> limpeza dos espaços vazios
            throw new Error("Por favor, preencha todos os campos")                 //throw -> jogar para fora
        }
    },
    
    //formatar os dados para salvar
    formatValues(){
        let {description, amount, date} = form.getValue()
        amount = utils.formatAmount(amount)
        date = utils.formatDate(date)
        return {
            description, amount, date
        }
    },


    clearTransaction (){
        form.description.value = ""
        form.amount.value = ""
        form.date.value = ""
    },

    //ativação das funções acima
    submit (event){
        event.preventDefault()

        try {
             //verificar se todas as informações foram preenchidas
             form.validateFields()
             //formatar os dados para salvar
             const SaveTransaction = form.formatValues()
             //salvar
             operation.add(SaveTransaction)
             //apagar os dados do formulário
             form.clearTransaction()
             //modal feche
             modal.close()
             //atualizar a aplicação, ja tem no proprio operation.add 
        }catch (error){
            alert(error.message)
        }
       
    }
}

//Uma aplicação que faz a leitura de tudo
const app ={
    init(){
        operation.all.forEach(DOM.addTransaction) //corrigido o formulário e levando para dom
        
        DOM.updateBalance() //Atualização dos cartões
        Storage.set(operation.all) //atualizando o localstorage
    },
    reload(){
        DOM.clearTransactions();
        app.init()
    }
}

app.init()