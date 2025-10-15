👥 Gerenciador de Funcionários – Projeto M1

Um sistema de gerenciamento de funcionários e departamentos desenvolvido em Node.js com interface interativa via terminal.
Ideal para uso em setores como Recursos Humanos, este projeto foi desenvolvido em squad como projeto final do Módulo 1.

📦 Funcionalidades

✅ Adicionar funcionários com nome, cargo, salário e se possuem filhos

✅ Listar todos os funcionários

✅ Atualizar dados de um funcionário

✅ Remover um funcionário

✅ Adicionar departamentos

✅ Listar departamentos

✅ Atualizar ou remover departamentos

✅ Atribuir um funcionário a um departamento

✅ Verificar se o funcionário possui filhos

🧰 Tecnologias Utilizadas

Node.js

ESModules (type: "module")

Módulo nativo readline

Biblioteca nanoid
 para geração de IDs únicos

⚙️ Requisitos

Node.js versão 14 ou superior

Terminal com suporte a entrada interativa

🚀 Como Executar

Clone o repositório

git clone https://github.com/usuario/gerenciador-funcionarios-projetoM1.git
cd gerenciador-funcionarios-projetoM1


Instale as dependências

npm install nanoid


Execute o sistema

node src/index.js

🧭 Menu Principal
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
1 - Adicionar Funcionário
Solicita:
Nome
Cargo
Salário
Possui filhos? (Sim/Não)
Gera um ID único automaticamente e salva o funcionário.

2 - Listar Funcionários
Exibe:
ID
Nome
Cargo
Salário
Status (Ativo)
Departamento (se houver)
Possui filhos: Sim ou Não

3 - Atualizar Funcionário
Atualiza os dados de um funcionário informado por ID.
É possível alterar:
Nome
Cargo
Salário
Informação sobre filhos
Campos em branco mantêm os dados atuais.

4 - Remover Funcionário
Remove um funcionário com base no ID informado.

5 - Adicionar Departamento
Cria um novo departamento informando apenas o nome.
ID é gerado automaticamente.

6 - Listar Departamentos
Exibe todos os departamentos com:
ID
Nome

7 - Atualizar Departamento
Permite alterar o nome de um departamento via ID.

8 - Remover Departamento
Remove um departamento com base no ID informado.

9 - Atribuir Funcionário a Departamento
Associa um funcionário a um departamento existente.
Você pode informar o departamento por:
ID
Nome (sem diferenciação entre maiúsculas/minúsculas)

💡 Exemplos de Uso
➕ Adicionando Funcionário
Nome: João  
Cargo: Analista  
Salário: 4500  
Possui filhos? sim  
Funcionário adicionado com ID: A1b2C  

🗃 Listando Departamentos
ID: dept1 | Nome: Recursos Humanos  
ID: dept2 | Nome: Tecnologia da Informação  

🔄 Atribuindo Funcionário a Departamento
ID do funcionário: A1b2C  
Informe ID ou nome do departamento: tecnologia da informação  
Funcionário atribuído ao departamento.  

📎 Observações Importantes
IDs são gerados com 5 caracteres via nanoid(5)
Salários devem ser números válidos e positivos
Atualizações podem ser parciais (ex: apenas nome)
Departamentos podem ser buscados por ID ou nome (case-insensitive)
A informação "Possui filhos" é coletada ao adicionar ou atualizar funcionários e exibida nas listagens

## 👩‍💼 Autores
Ana Beatriz – Líder
Marcelo Henrique
Lindicy
João Lucas
Vanessa
Marcos

