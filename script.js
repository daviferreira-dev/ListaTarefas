(function () {

    let tarefas = [
        { id: 1, descricao: 'Estudar para a prova', concluida: false },
        { id: 2, descricao: 'Fazer um projeto de arte', concluida: false },
        { id: 3, descricao: 'Comprar mantimentos', concluida: true },
        { id: 4, descricao: 'Ler um capítulo do livro', concluida: false },
        { id: 5, descricao: 'Limpar o quarto', concluida: true },
        { id: 6, descricao: 'Praticar exercícios físicos', concluida: false },
        { id: 7, descricao: 'Enviar relatório do trabalho', concluida: false }
    ];

    let listaElementos = document.querySelector('.todo-list');
    let filtros = document.querySelectorAll('input[name="filter"]');
    let inputNovaTarefa = document.querySelector('#novaTarefa');
    let proximoId = tarefas.length + 1;

    // Retorna o filtro que está agora
    function filtroSelecionado() {
        for (i = 0; i < filtros.length; i++) {
            if (filtros[i].checked) {
                return filtros[i].value;
            }
        }
        return 'all';
    }

    // Alterna o status de conclusão da tarefa pelo id
    function alternarConcluida(id) {
        for (i = 0; i < tarefas.length; i++) {
            if (tarefas[i].id === id) {
                tarefas[i].concluida = !tarefas[i].concluida;
                break;
            }
        }
        renderizarTarefas();
    }

    // Limpa a lista
    function limparLista() {
        while (listaElementos.firstChild) {
            listaElementos.removeChild(listaElementos.firstChild);
        }
    }

    // Cria um checkbox para a tarefa
    function criarCheckbox(tarefa) {
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = tarefa.concluida;
        checkbox.setAttribute('aria-label', (tarefa.concluida ? 'Marcar como não concluída: ' : 'Marcar como concluída: ') + tarefa.descricao);
        checkbox.addEventListener('change', function () {
            alternarConcluida(tarefa.id);
        });
        return checkbox;
    }

    // Cria o elemento <li> para a tarefa
    function criarItemTarefa(tarefa) {
        let li = document.createElement('li');
        li.setAttribute('role', 'listitem');
        if (tarefa.concluida) {
            li.className = 'completed';
        }
        let checkbox = criarCheckbox(tarefa);
        let texto = document.createElement('p');
        texto.textContent = tarefa.descricao;
        li.appendChild(checkbox);
        li.appendChild(texto);
        return li;
    }

    // Renderiza a lista conforme o filtro específico
    function renderizarTarefas() {
        let filtro = filtroSelecionado();
        limparLista();

        let tarefasFiltradas;
        if (filtro === 'completed') {
            tarefasFiltradas = tarefas.filter(function (tarefa) { return tarefa.concluida; });
        } else if (filtro === 'pending') {
            tarefasFiltradas = tarefas.filter(function (tarefa) { return !tarefa.concluida; });
        } else {
            tarefasFiltradas = tarefas;
        }

        if (tarefasFiltradas.length === 0) {
            let itemVazio = document.createElement('li');
            itemVazio.textContent = 'Nenhuma tarefa encontrada.';
            itemVazio.style.fontStyle = 'italic';
            itemVazio.style.color = '#666';
            listaElementos.appendChild(itemVazio);
            return;
        }

        for (let i = 0; i < tarefasFiltradas.length; i++) {
            let item = criarItemTarefa(tarefasFiltradas[i]);
            listaElementos.appendChild(item);
        }
    }

    // Adiciona evento para atualização do filtro
    function habilitarFiltros() {
        for (let i = 0; i < filtros.length; i++) {
            filtros[i].addEventListener('change', renderizarTarefas);
        }
    }

    // Adiciona evento para remover a última tarefa ao pressionar "Backspace" com o foco no input de nova tarefa
    function habilitarRemoverUltimaTarefa() {
        inputNovaTarefa.addEventListener('keydown', function (event) { // Usamos 'keydown' para capturar o Backspace antes da ação padrão
            if (event.key === 'Backspace' && inputNovaTarefa.value.trim() === '' && tarefas.length > 0) {
                tarefas.pop(); // Remove o último elemento do array 'tarefas'
                renderizarTarefas();
            }
        });
    }
    
    // Adiciona evento para adicionar nova tarefa ao pressionar "Enter"
    function habilitarAdicionarTarefa() {
        inputNovaTarefa.addEventListener('keypress', function (event) {
            if (event.key === 'Enter' && inputNovaTarefa.value.trim() !== '') {
                const novaDescricao = inputNovaTarefa.value.trim();
                const novaTarefa = {
                    id: proximoId++,
                    descricao: novaDescricao,
                    concluida: false
                };
                tarefas.push(novaTarefa);
                inputNovaTarefa.value = '';
                renderizarTarefas();
            }
        });
    }

    // Chama a função habilitar filtros
    habilitarFiltros();

    // Chama a função para habilitar a adição de tarefas
    habilitarAdicionarTarefa();

    // Chama a função para habilitar a remoção da última tarefa
    habilitarRemoverUltimaTarefa();

    // Chama a função renderizar tarefas inicialmente
    renderizarTarefas();

})();