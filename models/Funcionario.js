import { nanoid } from 'nanoid';

// Classe que representa um Funcionário
class Funcionario {
  // O construtor cria um novo funcionário
  // Se o id não for passado ou for vazio, gera automaticamente um id curto
  constructor(id, nome, cargo, salario, ativo = true) {
    this.id = id && id.trim() !== '' ? id : nanoid(10); // Geração automática de ID

    this.nome = nome.trim();   // Remove espaços extras do nome
    this.cargo = cargo.trim(); // Remove espaços extras do cargo
    this.salario = salario;    // Salário do funcionário
    this.ativo = ativo;        // Status ativo ou não
    this.departamentoId = null; // Id do departamento associado (inicialmente nenhum)
  }

  // Valida os dados do funcionário para garantir consistência
  validar() {
    if (!this.nome || this.nome.length < 3 || !/^[\p{L}\s]+$/u.test(this.nome)) {
      throw new Error('Nome inválido. Deve ter pelo menos 3 letras e conter apenas letras e espaços.');
    }
    if (!this.cargo || this.cargo.length < 3) {
      throw new Error('Cargo inválido. Deve ter pelo menos 3 caracteres.');
    }
    if (!this.id) {
      throw new Error('ID é obrigatório.');
    }
    if (typeof this.salario !== 'number' || this.salario < 0 || this.salario > 1000000) {
      throw new Error('Salário deve ser um número positivo e razoável.');
    }
  }

  // Marca funcionário como ativo
  ativar() { this.ativo = true; }

  // Marca funcionário como inativo
  desativar() { this.ativo = false; }

  // Associa o funcionário a um departamento
  atribuirDepartamento(deptId) { this.departamentoId = deptId; }

  // Remove associação do funcionário com departamento
  removerDepartamento() { this.departamentoId = null; }
}

// Exporta a classe para ser usada em outros arquivos
export default Funcionario;
