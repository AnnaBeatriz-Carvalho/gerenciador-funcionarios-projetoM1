import gerarIdNumerico from '../utils/idGenerator.js';
// Classe que representa um Departamento
class Departamento {
  // Gera id automático se não for passado ou vazio
  constructor(id, nome) {
    this.id = id && id.trim() !== '' ? id : gerarIdNumerico(8); // Gera id curto automático

    this.nome = nome.trim(); // Remove espaços extras do nome
  }

  // Valida os dados do departamento para garantir integridade
  validar() {
    if (!this.id || !/^[a-zA-Z0-9_-]{5,}$/i.test(this.id)) {
      throw new Error('ID inválido. Deve ter pelo menos 5 caracteres alfanuméricos, "_" ou "-".');
    }
    if (!this.nome || this.nome.length < 3) {
      throw new Error('Nome inválido. Deve ter pelo menos 3 caracteres.');
    }
  }
}

// Exporta a classe para ser usada em outros arquivos
export default Departamento;
