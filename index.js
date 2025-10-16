import readline from "readline";
import chalk from "chalk";
import GerenciadorFuncionarios from "./services/GerenciadorFuncionarios.js";
import Funcionario from "./models/Funcionario.js";
import Departamento from "./models/Departamento.js";

const caminhoArquivoFuncionarios = "./database/funcionarios.json";
const caminhoArquivoDepartamentos = "./database/departamentos.json";

const gerenciador = new GerenciadorFuncionarios();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Função que exibe as opções do menu para o usuário
function mostrarMenu() {
  console.log(
    chalk.magenta("\n=========== Gerenciador de Funcionários ==========\n")
  );
  console.log("1 - Adicionar funcionário");
  console.log("2 - Listar funcionários");
  console.log("3 - Atualizar funcionário");
  console.log("4 - Remover funcionário");
  console.log("5 - Adicionar departamento");
  console.log("6 - Listar departamentos");
  console.log("7 - Atualizar departamento");
  console.log("8 - Remover departamento");
  console.log("9 - Atribuir funcionário a departamento");
  console.log("10 - Ativar funcionário");
  console.log("11 - Inativar funcionário");
  console.log("12 - Listar apenas funcionários ativos");
  console.log("13 - Listar apenas funcionários inativos");
  console.log("0 - Sair\n");
  console.log(chalk.magenta("─────────────────────────────────────────────\n"));
}

// Função para perguntar algo para o usuário e esperar a resposta
function perguntar(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

// Função para atribuir funcionário a departamento, permite ID ou nome do departamento
async function atribuirFuncionarioADepartamento() {
  const idFuncionario = await perguntar("ID do funcionário: ");
  let inputDept = await perguntar("Informe ID ou nome do departamento: ");

  // Busca primeiro pelo ID
  let departamento = gerenciador.buscarDepartamentoPorId(inputDept);

  // Se não achar pelo ID, tenta pelo nome
  if (!departamento) {
    departamento = gerenciador.departamentos.find(
      (d) => d.nome.toLowerCase() === inputDept.toLowerCase()
    );
  }

  if (!departamento) {
    console.log("Departamento não encontrado.");
    return;
  }

  try {
    gerenciador.atribuirFuncionarioADepartamento(
      idFuncionario,
      departamento.id
    );
    console.log("Funcionário atribuído ao departamento.");
  } catch (e) {
    console.log(`Erro ao atribuir funcionário: ${e.message}`);
  }
}

// Função principal que roda o menu em loop até o usuário sair
async function main() {
  // Tenta carregar dados anteriormente salvos
  await gerenciador.carregarDeArquivo(
    caminhoArquivoFuncionarios,
    caminhoArquivoDepartamentos
  );

  let opcao;
  do {
    mostrarMenu();
    opcao = await perguntar("Escolha uma opção: ");

    try {
      switch (opcao) {
        case "1": {
          // Entrada de dados para novo funcionário
          const nome = (await perguntar("Nome: ")).trim();
          const cargo = (await perguntar("Cargo: ")).trim();
          let salarioStr = (await perguntar("Salário: ")).trim();
          let dependentesStr = (
            await perguntar(
              "Quantidade de filhos ou dependentes menores de 14 anos: "
            )
          ).trim();
          const salario = parseFloat(salarioStr);
          const dependentes = parseInt(dependentesStr);

          // Normaliza vírgula decimal para ponto (usuário PT-BR)
          salarioStr = salarioStr.replace(/\./g, "").replace(",", ".");


          // Validação básica das entradas
          if (!nome) {
            console.log("Nome não pode ser vazio.");
            break;
          }
          if (!cargo) {
            console.log("Cargo não pode ser vazio.");
            break;
          }
          if (isNaN(salario) || salario < 0 || salario > 1_000_000) {
            console.log(
              "Salário inválido. Use um número positivo (ex: 2500.00 ou 2.500,00)."
            );
            break;
          }
          if (!Number.isInteger(dependentes) || dependentes < 0 || dependentes > 100) {
            console.log(
              "Dependentes inválidos. Informe 0 ou um número inteiro não negativo."
            );
            break;
          }

          // Cria funcionário com id gerado internamente (atribui id ANTES de adicionar)
          const func = new Funcionario("", nome, cargo, salario, dependentes);

          // Se o gerenciador fornece um gerador de id, use e atribua antes de adicionar
          try {
            const id =
              typeof gerenciador.gerarIdUnicoNumerico === "function"
                ? gerenciador.gerarIdUnicoNumerico(2)
                : null;

            if (id !== null && id !== undefined) {
              func.id = id;
            }
            // Se o gerenciador espera gerar o id internamente, comente a linha acima
          } catch (e) {
            // não interrompe — apenas loga; o gerenciador pode setar o id depois
            console.warn(
              "Aviso: falha ao gerar id localmente:",
              e?.message ?? e
            );
          }

          // Adiciona ao gerenciador (agora com id definido quando possível)
          try {
            gerenciador.adicionarFuncionario(func);

            console.log(`Funcionário adicionado com ID: ${func.id}`);
            let salarioTotalDisplay = "N/A";
            try {
              salarioTotalDisplay =
                typeof func.salarioComFamilia === "function"
                  ? `R$ ${func.salarioComFamilia().toFixed(2)}`
                  : "N/A";
            } catch (e) {
              salarioTotalDisplay = "Erro no cálculo do salário";
            }
            console.log(
              `Funcionário adicionado com salário total: ${salarioTotalDisplay}`
            );
          } catch (e) {
            console.log("Erro ao adicionar funcionário:", e?.message ?? e);
          }

          break;
        }

        case "2": {
          // Mostra lista de funcionários
          // Mostra lista de funcionários (formatada)
          const lista = gerenciador.listarFuncionarios();

          if (!lista || lista.length === 0) {
            console.log("Nenhum funcionário cadastrado.");
          } else {
            // opcional: ordenar por nome
            const ordenada = [...lista].sort((a, b) =>
              (a.nome || "").localeCompare(b.nome || "")
            );

            ordenada.forEach((f) => {
              const salarioBase =
                typeof f.salario === "number" ? f.salario.toFixed(2) : "N/A";
              // protege caso o método não exista ou lançe erro
              let salarioTotal = "N/A";
              try {
                salarioTotal =
                  typeof f.salarioComFamilia === "function"
                    ? f.salarioComFamilia().toFixed(2)
                    : salarioTotal;
              } catch (e) {
                salarioTotal = "Erro cálculo";
              }
              const dependentes =
                typeof f.dependentes === "number" ? f.dependentes : "N/A";
              const departamento = f.departamentoId ?? "Nenhum";
              const ativo = !!f.ativo;

              console.log(
                `\nID: ${f.id}\n` +
                `Nome: ${f.nome}\n` +
                `Cargo: ${f.cargo}\n` +
                `Salário base: R$ ${salarioBase}\n` +
                `Dependentes: ${dependentes}\n` +
                `Salário total: R$ ${salarioTotal}\n` +
                `Ativo: ${ativo}\n` +
                `Departamento: ${departamento}\n` +
                "-----------------------------"
              );
            });
          }

          break;
        }
        case "3": {
          // Atualiza um funcionário existente
          const id = (await perguntar("ID do funcionário para atualizar: ")).trim();
          const nome = (await perguntar("Novo nome (deixe vazio para manter): ")).trim();
          const cargo = (await perguntar("Novo cargo (deixe vazio para manter): ")).trim();
          const salarioStr = (await perguntar("Novo salário (deixe vazio para manter): ")).trim();
          const dependentesStr = (await perguntar("Novo número de dependentes (deixe vazio para manter): ")).trim();

          const novosDados = {};

          if (nome) novosDados.nome = nome;
          if (cargo) novosDados.cargo = cargo;
          if (salarioStr) {
            const salario = parseFloat(salarioStr);
            if (isNaN(salario) || salario < 0 || salario > 1000000) {
              console.log("Salário inválido. Deve ser um número positivo e razoável.");
              
            }
            novosDados.salario = salario;
          }

          if (dependentesStr) {
            const dependentes = parseInt(dependentesStr, 10);
            if (isNaN(dependentes) || dependentes < 0 || dependentes > 10) {
              console.log("Número de dependentes inválido. Deve ser entre 0 e 10.");
              break;
            }
            novosDados.dependentes = dependentes;
          }

          gerenciador.atualizarFuncionario(id, novosDados);
          console.log("Funcionário atualizado com sucesso.");
          break;
        }

        case "4": {
          // Remove um funcionário
          const id = (
            await perguntar("ID do funcionário para remover: ")
          ).trim();
          gerenciador.removerFuncionario(id);
          console.log("Funcionário removido.");
          break;
        }
        case "5": {
          // Adiciona um novo departamento
          let id = (
            await perguntar(
              "Informe o ID do departamento ou deixe vazio para gerar automático: "
            )
          ).trim();
          const nomeDept = (await perguntar("Nome do departamento: ")).trim();

          // Usa geração interna se string vazia
          if (id === "") id = undefined;
          const dept = new Departamento(id, nomeDept);

          gerenciador.adicionarDepartamento(dept);
          console.log(`Departamento adicionado com ID: ${dept.id}`);
          break;
        }
        case "6": {
          // Lista departamentos
          const lista = gerenciador.listarDepartamentos();
          if (lista.length === 0) {
            console.log("Nenhum departamento cadastrado.");
          } else {
            lista.forEach((d) => {
              console.log(`ID: ${d.id}, Nome: ${d.nome}`);
            });
          }
          break;
        }
        case "7": {
          // Atualiza um departamento existente
          const id = (
            await perguntar("ID do departamento para atualizar: ")
          ).trim();
          const nome = (await perguntar("Novo nome do departamento: ")).trim();
          gerenciador.atualizarDepartamento(id, { nome });
          console.log("Departamento atualizado.");
          break;
        }
        case "8": {
          // Remove um departamento
          const id = (
            await perguntar("ID do departamento para remover: ")
          ).trim();
          gerenciador.removerDepartamento(id);
          console.log("Departamento removido.");
          break;
        }
        case "9": {
          // Atribui funcionário a um departamento
          await atribuirFuncionarioADepartamento();
          break;
        }
        case "10": {
          const id = await perguntar("ID do funcionário para ativar: ");
          const func = gerenciador.buscarFuncionarioPorId(id);
          if (func) {
            func.ativar();
            console.log("Funcionário ativado.");
          } else {
            console.log("Funcionário não encontrado.");
          }
          break;
        }
        case "11": {
          const id = await perguntar("ID do funcionário para inativar: ");
          const func = gerenciador.buscarFuncionarioPorId(id);
          if (func) {
            func.desativar();
            console.log("Funcionário inativado.");
          } else {
            console.log("Funcionário não encontrado.");
          }
          break;
        }
        case "12": {
          const ativos = gerenciador
            .listarFuncionarios()
            .filter((f) => f.ativo);
          if (ativos.length === 0) {
            console.log("Nenhum funcionário ativo.");
          } else {
            ativos.forEach((f) => {
              console.log(
                `ID: ${f.id}, Nome: ${f.nome}, Cargo: ${f.cargo
                }, Salário total: R$ ${f
                  .salarioComFamilia()
                  .toFixed(2)}, Dependentes: ${f.dependentes}`
              );
            });
          }
          break;
        }
        case "13": {
          const inativos = gerenciador
            .listarFuncionarios()
            .filter((f) => !f.ativo);
          if (inativos.length === 0) {
            console.log("Nenhum funcionário inativo.");
          } else {
            inativos.forEach((f) => {
              console.log(
                `ID: ${f.id}, Nome: ${f.nome}, Cargo: ${f.cargo
                }, Salário total: R$ ${f
                  .salarioComFamilia()
                  .toFixed(2)}, Dependentes: ${f.dependentes}`
              );
            });
          }
          break;
        }
        case "0": {
          // Salva dados e sai
          await gerenciador.salvarParaArquivo(
            caminhoArquivoFuncionarios,
            caminhoArquivoDepartamentos
          );
          console.log("Dados salvos. Saindo...");
          rl.close();
          break;
        }
        default:
          console.log(chalk.bgRedBright("Opção inválida."));
      }
    } catch (e) {
      console.log(`Erro: ${e.message}`);
    }
  } while (opcao !== "0");
}

// Executa o programa
main();
