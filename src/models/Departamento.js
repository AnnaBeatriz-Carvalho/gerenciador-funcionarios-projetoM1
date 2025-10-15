// Define a classe Departamento que representa um departamento da empresa
class Departamento {
  constructor(id, nome) {
    this.id = id;     // Identificador único do departamento
    this.nome = nome; // Nome do departamento, ex: "Financeiro"
  }

  // Validação para garantir que o departamento tenha id e nome válidos
  validar() {
    if (!this.id || !this.nome) {
      throw new Error('ID e nome são obrigatórios para departamentos.');
    }
  }
}

export default Departamento;
