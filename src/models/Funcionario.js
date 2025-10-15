// Define a classe Funcionario que representa um funcionário da empresa
class Funcionario {
  // O construtor cria um novo funcionário com os dados básicos
  constructor(id, nome, cargo, salario, ativo = true) {
    this.id = id;               // Identificador único para o funcionário
    this.nome = nome;           // Nome do funcionário
    this.cargo = cargo;         // Cargo que ele ocupa
    this.salario = salario;     // Salário do funcionário
    this.ativo = ativo;         // Se o funcionário está ativo ou não, padrão true
    this.departamentoId = null; // Id do departamento ao qual o funcionário pertence (inicialmente nenhum)
  }

  // Método para validar os dados do funcionário antes de usar
  validar() {
    if (!this.id || !this.nome || !this.cargo) {
      throw new Error('ID, nome e cargo são obrigatórios.');
    }
    // Verifica se o salário é um número positivo
    if (typeof this.salario !== 'number' || this.salario < 0) {
      throw new Error('Salário deve ser um número positivo.');
    }
  }

  // Métodos para ativar/desativar o funcionário
  ativar() { this.ativo = true; }
  desativar() { this.ativo = false; }

  // Métodos para associar ou remover departamento
  atribuirDepartamento(deptId) { this.departamentoId = deptId; }
  removerDepartamento() { this.departamentoId = null; }
}

export default Funcionario;
