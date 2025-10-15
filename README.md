# 👥 gerenciador-funcionarios-projetoM1
Um sistema de gerenciamento de funcionários e departamentos em Node.js com interface interativa via terminal. Permite adicionar, listar, atualizar, remover funcionários e departamentos, bem como atribuir funcionários a departamentos.
Este projeto é um gerenciador de funcionarios, voltado para uso em departamentos como o de Recursos Humanos. Esse projeto foi desenvolvido em squad como projeto final do modulo 1.


## 📦 Funcionalidades

- ✅ Adicionar funcionários com nome, cargo e salário
- ✅: Listar todos os funcionários
- ✅: Atualizar dados de um funcionário
- ✅: Remover um funcionário
- ✅: Adicionar departamentos
- ✅: Listar departamentos
- ✅: Atualizar ou remover departamentos
- ✅: Atribuir um funcionário a um departamento

## 🧰 Tecnologias
- Node.js
- ESModules (type: "module")
- Módulo nativo readline
- Biblioteca [nanoid](https://www.npmjs.com/package/nanoid) para geração de IDs únicos

## ⚙️ Requisitos
- Node.js 14+ instalado
- Terminal com suporte a entrada interativa
  
## 🚀 Como Executar
1. **Instale as dependências** (apenas o nanoid):
   
bash
npm install nanoid
Execute o sistema no terminal:

node src/index.js

Use o menu para navegar pelas opções:
Gerenciador de Funcionários
1 - Adicionar funcionário
2 - Listar funcionários
3 - Atualizar funcionário
4 - Remover funcionário
5 - Adicionar departamento
6 - Listar departamentos
7 - Atualizar departamento
8 - Remover departamento
9 - Atribuir funcionário a departamento
0 - Sair

📌 O Que Cada Opção Faz
1 - Adicionar funcionário
Solicita:
Nome
Cargo
Salário
O sistema gera um ID automaticamente e salva o funcionário.

2 - Listar funcionários
Mostra todos os funcionários cadastrados com seus dados:
ID
Nome
Cargo
Salário
Se está ativo
A qual departamento pertence (se houver)

3 - Atualizar funcionário
Permite atualizar os dados de um funcionário específico informando seu ID.
Você pode alterar:
Nome
Cargo
Salário
Pode deixar campos em branco para manter os dados atuais.

4 - Remover funcionário
Remove um funcionário do sistema com base no ID informado.

5 - Adicionar departamento
Cria um novo departamento informando apenas o nome. O ID é gerado automaticamente.

6 - Listar departamentos
Exibe todos os departamentos cadastrados, com ID e nome.

7 - Atualizar departamento
Permite alterar o nome de um departamento, informando seu ID atual.

8 - Remover departamento
Remove um departamento do sistema com base no ID informado.

9 - Atribuir funcionário a departamento
Associa um funcionário a um departamento.
Você pode informar o departamento pelo ID ou nome (sem diferença entre maiúsculas/minúsculas).

0 - Sair
Encerra o programa. (Se o sistema estiver com persistência ativa, salvaria os dados aqui.)

## 📌 Exemplos de Interações
➕ Adicionando Funcionário:
Nome: João
Cargo: Analista
Salário: 4500
Funcionário adicionado com ID: A1b2C

## 🗃 Listando Departamentos:
ID: dept1, Nome: Recursos Humanos
ID: dept2, Nome: Tecnologia da Informação

## 🔄 Atribuindo Funcionário:
ID do funcionário: A1b2C
Informe ID ou nome do departamento: tecnologia da informação
Funcionário atribuído ao departamento.

## 💡 Observações Importantes
IDs são gerados automaticamente com 5 caracteres usando a lib nanoid
Os salários precisam ser números válidos e positivos
Departamentos podem ser buscados por ID ou nome, mesmo que o nome esteja em letras maiúsculas ou minúsculas
Campos deixados vazios em atualizações não são modificados

❗ Observações
IDs são gerados automaticamente com 5 caracteres (nanoid(5))
Departamentos podem ser buscados por ID ou nome
O sistema aceita atualizações parciais (ex: apenas nome)
Os salários devem ser números positivos


👩‍💼 Autores:
Ana Beatriz – Líder
Marcelo Henrique
Lindicy
João Lucas
Vanessa
Marcos
Marcos

Vanessa
