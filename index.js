import readline from 'readline';
import { nanoid } from 'nanoid';
import GerenciadorFuncionarios from './services/GerenciadorFuncionarios.js';
import Funcionario from './models/Funcionario.js';
import Departamento from './models/Departamento.js';

const caminhoArquivoFuncionarios = './funcionarios.json';
const caminhoArquivoDepartamentos = './departamentos.json';

const gerenciador = new GerenciadorFuncionarios();

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function mostrarMenu() {
  console.log('\nGerenciador Majestoso de Funcionários');
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

function perguntar(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

async function atribuirFuncionarioADepartamento() {
  const idFuncionario = await perguntar('ID do funcionário: ');
  let inputDept = await perguntar('Informe ID ou nome do departamento: ');

  // Tenta buscar departamento pelo id
  let departamento = gerenciador.buscarDepartamentoPorId(inputDept);

  // Se não achar pelo id, busca pelo nome (case insensitive)
  if (!departamento) {
    departamento = gerenciador.departamentos.find(
      d => d.nome.toLowerCase() === inputDept.toLowerCase()
    );
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

async function main() {
  await gerenciador.carregarDeArquivo(caminhoArquivoFuncionarios, caminhoArquivoDepartamentos);

  let opcao;
  do {
    mostrarMenu();
    opcao = await perguntar('Escolha uma opção: ');

    try {
      switch (opcao) {
        case '1': {
          const nome = await perguntar('Nome: ');
          const cargo = await perguntar('Cargo: ');
          const salarioStr = await perguntar('Salário: ');
          const salario = parseFloat(salarioStr);

          if (isNaN(salario) || salario < 0) {
            console.log('Salário inválido. Deve ser um número positivo.');
            break;
          }

          const id = nanoid(5);
          const func = new Funcionario(nanoid(5), nome, cargo, salario);
          gerenciador.adicionarFuncionario(func);
          console.log(`Funcionário adicionado com ID: ${id}`);
          break;
        }
        case '2': {
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
          const id = await perguntar('ID do funcionário para atualizar: ');
          const nome = await perguntar('Novo nome (deixe vazio para manter): ');
          const cargo = await perguntar('Novo cargo (deixe vazio para manter): ');
          const salarioStr = await perguntar('Novo salário (deixe vazio para manter): ');

          const novosDados = {};
          if (nome) novosDados.nome = nome;
          if (cargo) novosDados.cargo = cargo;
          if (salarioStr) {
            const salario = parseFloat(salarioStr);
            if (isNaN(salario) || salario < 0) {
              console.log('Salário inválido. Deve ser um número positivo.');
              break;
            }
            novosDados.salario = salario;
          }

          gerenciador.atualizarFuncionario(id, novosDados);
          console.log('Funcionário atualizado.');
          break;
        }
        case '4': {
          const id = await perguntar('ID do funcionário para remover: ');
          gerenciador.removerFuncionario(id);
          console.log('Funcionário removido.');
          break;
        }
        case '5': {
          const nome = await perguntar('Nome do departamento: ');
          const id = nanoid(5);
          const dept = new Departamento(id, nome);
          gerenciador.adicionarDepartamento(dept);
          console.log(`Departamento adicionado com ID: ${id}`);
          break;
        }
        case '6': {
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
          const id = await perguntar('ID do departamento para atualizar: ');
          const nome = await perguntar('Novo nome do departamento: ');
          gerenciador.atualizarDepartamento(id, { nome });
          console.log('Departamento atualizado.');
          break;
        }
        case '8': {
          const id = await perguntar('ID do departamento para remover: ');
          gerenciador.removerDepartamento(id);
          console.log('Departamento removido.');
          break;
        }
        case '9': {
          await atribuirFuncionarioADepartamento();
          break;
        }
        case '0': {
          await gerenciador.salvarParaArquivo(caminhoArquivoFuncionarios, caminhoArquivoDepartamentos);
          console.log('Dados salvos. Saindo...');
          rl.close();
          break;
        }
        default:
          console.log('Opção inválida.');
      }
    } catch (e) {
      console.log(`Erro: ${e.message}`);
    }
  } while (opcao !== '0');
}

main();
