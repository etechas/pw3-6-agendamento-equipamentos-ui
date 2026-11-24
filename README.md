Planejamento do Projeto Prático: Angular + Spring Boot
🅰️Guia de Implementação no Angular
Esta seção descreve os requisitos de arquitetura, fluxo de dados e layout visual que todos os alunos devem seguir no desenvolvimento do frontend.

📐 Arquitetura Angular do Projeto
O frontend deve conter uma estrutura simples e organizada em 3 pilares principais :

Unable to render rich display

gráfico TD
    A[Modelo / Interface TypeScript] --> B[Serviço HTTP]
    B --> C[Componente: Listagem / Tabela]
    B --> D[Componente: Formulário Reativo]
    
    API de subgrafo do Spring Boot
        E[GET / POST / PUT / DELETE / PATCH]
    fim
    
    B <==>|Cliente HTTP RxJS| E
Model ( /models): Interface TypeScript definindo os campos da entidade.
Serviço ( /services): Classe @Injectableresponsável por fazer requisições via HttpClient.
Componentes ( /components):
Listagem: Tabela ou nota de cartões com as opções de ação e botões de editar/excluir.
Formulário: Tela ou modal para criar/editar os registros com ReactiveFormsModule.
🎨 Wireframe e Layout das Telas (Diagrama Visual)
Abaixo está o esboço em formato Mermaid descrevendo a experiência visual esperada para os projetos:

1. Tela de Listagem (Painel)

gráfico TB
    subgráfico Cabeçalho ["Barra Superior / Navegação"]
        H1["🏷️ Sistema de Gestão Escolar"] --- H2["➕ Botão: Novo Registro"]
    fim

    subgraph Tabela ["Tabela Principai de Registros "]
        T1["ID | Atributo 1 | Atributo 2 | Status / Indicador | Ações"]
        T2[" 1 | Exemplo 1 | Valor 100 | 🟡 PENDENTE | [ ⚡ Ação Regra ] [ ✏️ Editar ] [ 🗑️ Excluir ] "]
        T3[" 2 | Exemplo 2 | Valor 050 | 🟢 CONCLUÍDO | [ ⚡ Ação Regra ] [ ✏️ Editar ] [ 🗑️ Excluir ] "]
    fim

    subgrafo Feedback ["Mensagens de Retorno"]
        F1["✅ Sucesso: Operação realizada com sucesso!"]
        F2["❌ Erro Backend: Saldo insuficiente ou limite atingido."]
    fim

    Cabeçalho --> Tabela
    Tabela --> Feedback
2. Tela de Formulário (Cadastro/Edição)

gráfico TB
    subgrafo Formulário [" 📝 Formulário (ReactiveFormsModule) "]
        F1["Campo 1: Texto de entrada (Obrigatório)"]
        F2["Campo 2: Entrada Numérico/Dados"]
        F3["Campo 3: Selecionar menu suspenso (Status/Opção)"]
        
        B1["💾 Botão: Salvar Registro"]
        B2["❌ Botão: Cancelar / Voltar"]
    fim

    F1 --> B1
    F2 --> B1
    F3 --> B1
📋 Requisitos Detalhados para os Alunos (Exercício Angular)
Para considerar o módulo Angular Aprovado , o aluno deve implementar os seguintes requisitos:

Interface TypeScript ( models/entidade.model.ts):

Deve possuir os mesmos nomes e tipos de atributos definidos na classe @EntityJava.
serviço HTTP ( services/entidade.service.ts):

Injetar o HttpClient.
Implementar os métodos:
listar(): realizar GETe retornar um Observable<Entidade[]>.
buscarPorId(id): realizar GETo indivíduo.
cadastrar(obj): realizar POST.
atualizar(id, obj): realizar PUT.
excluir(id): realizar DELETE.
executarRegra(id, params): realizar o POST/ PATCHespecífico da regra de negócio (ex: debitar, reservar, votar).
Componente de Listagem ( components/listagem):

Chamar o serviço no ciclo de vida ( ngOnInitou signals).
Renderizar os dados dinamicamente ( *ngForou novo bloco @for).
Adicione destaque visual para status (ex: emblemas coloridos para APROVADO, PENDENTE, LOTADO).
Ter um botão dedicado para acionar a Regra de Negócio diretamente da linha/cartão do item.
Componente do Formulário ( components/formulario):

Utilizar FormGroupe FormBuilder.
Adicionar validações ( Validators.required, Validators.min, etc.) e exibir mensagem de erro abaixo do campo se estiver inválido.
Tratar reaproveitamento da tela tanto para Inclusão quanto para Edição .
Tratamento de Exceções da Regra de Negócio:

Se o backend lançar uma exceção (HTTP Status 400 Bad Requestou 409 Conflict), o serviço do Angular deverá capturar e exibir uma mensagem amigável (ex: alert()ou mensagem na tela informando "Erro: Saldo insuficiente!").
