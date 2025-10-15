import readline from 'readline';
import GerenciadorFuncionarios from './services/GerenciadorFuncionarios.js';
import Funcionario from './models/Funcionario.js';
import Departamento from './models/Departamento.js';

const caminhoArquivoFuncionarios = './database/funcionarios.json';
const caminhoArquivoDepartamentos = './database/departamentos.json';

const gerenciador = new GerenciadorFuncionarios();

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// Função que exibe as opções do menu para o usuário
function mostrarMenu() {
  console.log('\n=========== Gerenciador de Funcionários ==========\n');
  console.log('1 - Adicionar funcionário');
  console.log('2 - Listar funcionários');
  console.log('3 - Atualizar funcionário');
  console.log('4 - Remover funcionário');
  console.log('5 - Adicionar departamento');
  console.log('6 - Listar departamentos');
  console.log('7 - Atualizar departamento');
  console.log('8 - Remover departamento');
  console.log('9 - Atribuir funcionário a departamento');
  console.log('0 - Sair');
}

// Função para perguntar algo para o usuário e esperar a resposta
function perguntar(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

// Função para atribuir funcionário a departamento, permite ID ou nome do departamento
async function atribuirFuncionarioADepartamento() {
  const idFuncionario = await perguntar('ID do funcionário: ');
  let inputDept = await perguntar('Informe ID ou nome do departamento: ');

  // Busca primeiro pelo ID
  let departamento = gerenciador.buscarDepartamentoPorId(inputDept);

  // Se não achar pelo ID, tenta pelo nome
  if (!departamento) {
    departamento = gerenciador.departamentos.find(d => d.nome.toLowerCase() === inputDept.toLowerCase());
  }

  if (!departamento) {
    console.log('Departamento não encontrado.');
    return;
  }

  try {
    gerenciador.atribuirFuncionarioADepartamento(idFuncionario, departamento.id);
    console.log('Funcionário atribuído ao departamento.');
  } catch (e) {
    console.log(`Erro ao atribuir funcionário: ${e.message}`);
  }
}

// Função principal que roda o menu em loop até o usuário sair
async function main() {
  // Tenta carregar dados anteriormente salvos
  await gerenciador.carregarDeArquivo(caminhoArquivoFuncionarios, caminhoArquivoDepartamentos);

  let opcao;
  do {
    mostrarMenu();
    // aqui amiga 
    opcao = await perguntar('Escolha uma opção: ');

    try {
      switch (opcao) {
        case '1': {
          // Entrada de dados para novo funcionário
          const nome = (await perguntar('Nome: ')).trim();
          const cargo = (await perguntar('Cargo: ')).trim();
          const salarioStr = (await perguntar('Salário: ')).trim();
          const salario = parseFloat(salarioStr);

          // Validação básica das entradas
          if (!nome) {
            console.log('Nome não pode ser vazio.');
            break;
          }
          if (!cargo) {
            console.log('Cargo não pode ser vazio.');
            break;
          }
          if (isNaN(salario) || salario < 0 || salario > 1000000) {
            console.log('Salário inválido. Deve ser um número positivo e razoável.');
            break;
          }

          // Cria funcionário com id gerado internamente
          const func = new Funcionario('', nome, cargo, salario);

          gerenciador.adicionarFuncionario(func);
          console.log(`Funcionário adicionado com ID: ${func.id}`);
          break;
        }
        case '2': {
          // Mostra lista de funcionários
          const lista = gerenciador.listarFuncionarios();
          if (lista.length === 0) {
            console.log('Nenhum funcionário cadastrado.');
          } else {
            lista.forEach(f => {
              console.log(`ID: ${f.id}, Nome: ${f.nome}, Cargo: ${f.cargo}, Salário: ${f.salario.toFixed(2)}, Ativo: ${f.ativo}, Departamento: ${f.departamentoId ?? 'Nenhum'}`);
            });
          }
          break;
        }
        case '3': {
          // Atualiza um funcionário existente
          const id = (await perguntar('ID do funcionário para atualizar: ')).trim();
          const nome = (await perguntar('Novo nome (deixe vazio para manter): ')).trim();
          const cargo = (await perguntar('Novo cargo (deixe vazio para manter): ')).trim();
          const salarioStr = (await perguntar('Novo salário (deixe vazio para manter): ')).trim();

          const novosDados = {};
          if (nome) novosDados.nome = nome;
          if (cargo) novosDados.cargo = cargo;
          if (salarioStr) {
            const salario = parseFloat(salarioStr);
            if (isNaN(salario) || salario < 0 || salario > 1000000) {
              console.log('Salário inválido. Deve ser um número positivo e razoável.');
              break;
            }
            novosDados.salario = salario;
          }

          gerenciador.atualizarFuncionario(id, novosDados);
          console.log('Funcionário atualizado.');
          break;
        }
        case '4': {
          // Remove um funcionário
          const id = (await perguntar('ID do funcionário para remover: ')).trim();
          gerenciador.removerFuncionario(id);
          console.log('Funcionário removido.');
          break;
        }
        case '5': {
          // Adiciona um novo departamento
          let id = (await perguntar('Informe o ID do departamento ou deixe vazio para gerar automático: ')).trim();
          const nomeDept = (await perguntar('Nome do departamento: ')).trim();

          // Usa geração interna se string vazia
          if (id === '') id = undefined;
          const dept = new Departamento(id, nomeDept);

          gerenciador.adicionarDepartamento(dept);
          console.log(`Departamento adicionado com ID: ${dept.id}`);
          break;
        }
        case '6': {
          // Lista departamentos
          const lista = gerenciador.listarDepartamentos();
          if (lista.length === 0) {
            console.log('Nenhum departamento cadastrado.');
          } else {
            lista.forEach(d => {
              console.log(`ID: ${d.id}, Nome: ${d.nome}`);
            });
          }
          break;
        }
        case '7': {
          // Atualiza um departamento existente
          const id = (await perguntar('ID do departamento para atualizar: ')).trim();
          const nome = (await perguntar('Novo nome do departamento: ')).trim();
          gerenciador.atualizarDepartamento(id, { nome });
          console.log('Departamento atualizado.');
          break;
        }
        case '8': {
          // Remove um departamento
          const id = (await perguntar('ID do departamento para remover: ')).trim();
          gerenciador.removerDepartamento(id);
          console.log('Departamento removido.');
          break;
        }
        case '9': {
          // Atribui funcionário a um departamento
          await atribuirFuncionarioADepartamento();
          break;
        }
        case '0': {
          // Salva dados e sai
          await gerenciador.salvarParaArquivo(caminhoArquivoFuncionarios, caminhoArquivoDepartamentos);
          console.log('Dados salvos. Saindo...');
          rl.close();
          break;
        }
        default:
          console.log(chalk.bgRedBright('Opção inválida.'));
      }
    } catch (e) {
      console.log(`Erro: ${e.message}`);
    }
  } while (opcao !== '0');
}

// Executa o programa
main();
