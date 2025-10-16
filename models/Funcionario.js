
// Classe que representa um Funcionário
class Funcionario {
  constructor(id, nome, cargo, salario, dependentes = 0, ativo = true) {
    this.id = id //&& id.trim() !== '' ? id : gerarIdNumerico(10);
    this.nome = nome.trim();
    this.cargo = cargo.trim();
    this.salario = salario;
    this.dependentes = dependentes; //número de filhos/dependentes
    this.ativo = ativo;
    this.departamentoId = null;
  }

  ativar() { this.ativo = true; }
  desativar() { this.ativo = false; }
  atribuirDepartamento(deptId) { this.departamentoId = deptId; }
  removerDepartamento() { this.departamentoId = null; }

  // Salário real com adicional de salário-família (se fizer jus)
  salarioComFamilia() {
    if (this.salario <= 1906.04 && this.dependentes > 0) {
      return this.salario + 65.00 * this.dependentes; // valor atual por dependente
    }
    return this.salario;
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
    if (!Number.isInteger(this.dependentes) || this.dependentes < 0 || this.dependentes > 10) {
      throw new Error('Número de dependentes inválido. Deve ser um número inteiro entre 0 e 10.');
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
