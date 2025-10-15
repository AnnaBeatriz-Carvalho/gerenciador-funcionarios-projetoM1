import fs from 'fs/promises';
import Funcionario from '../models/Funcionario.js';
import Departamento from '../models/Departamento.js';
import chalk from 'chalk';

// Gerencia a lista de funcionários e departamentos e operações sobre eles
class GerenciadorFuncionarios {
  constructor() {
    this.funcionarios = [];  // Lista de funcionários
    this.departamentos = []; // Lista de departamentos
  }

  // Adiciona funcionário após validar dados e verificar duplicidade
  adicionarFuncionario(func) {
    func.validar();
    if (this.buscarFuncionarioPorId(func.id)) {
      throw new Error(chalk.bgRed(`Funcionário com este ${chalk.yellow(func.id)} já existe.`));
    }
    this.funcionarios.push(func);
  }

  // Retorna lista de todos funcionários
  listarFuncionarios() {
    return this.funcionarios;
  }

  // Busca funcionário por ID
  buscarFuncionarioPorId(id) {
    return this.funcionarios.find(f => f.id === id);
  }

  // Atualiza dados do funcionário pelo ID
  atualizarFuncionario(id, novosDados) {
    const func = this.buscarFuncionarioPorId(id);
    if (!func) throw new Error(chalk.bgRed('Funcionário não encontrado.'));
    Object.assign(func, novosDados);
    func.validar();
  }

  // Remove funcionário pelo ID
  removerFuncionario(id) {
    const idx = this.funcionarios.findIndex(f => f.id === id);
    if (idx === -1) throw new Error(chalk.bgRed('Funcionário não encontrado.'));
    this.funcionarios.splice(idx, 1);
  }

  // Adiciona departamento validando e evitando duplicatas
  adicionarDepartamento(dept) {
    dept.validar();
    if (this.buscarDepartamentoPorId(dept.id)) {
      throw new Error(chalk.bgRed('Departamento com este ID já existe.'));
    }
    this.departamentos.push(dept);
  }

  // Lista departamentos
  listarDepartamentos() {
    return this.departamentos;
  }

  // Busca departamento por ID
  buscarDepartamentoPorId(id) {
    return this.departamentos.find(d => d.id === id);
  }

  // Atualiza dados do departamento pelo ID
  atualizarDepartamento(id, novosDados) {
    const dept = this.buscarDepartamentoPorId(id);
    if (!dept) throw new Error(chalk.red('Departamento não encontrado.'));
    Object.assign(dept, novosDados);
    dept.validar();
  }

  // Remove departamento e "desvincula" funcionários que pertencem a ele
  removerDepartamento(id) {
    const idx = this.departamentos.findIndex(d => d.id === id);
    if (idx === -1) throw new Error(chalk.red('Departamento não encontrado.'));
    this.funcionarios.forEach(f => {
      if (f.departamentoId === id) f.removerDepartamento();
    });
    this.departamentos.splice(idx, 1);
  }

  // Atribui funcionário a um departamento
  atribuirFuncionarioADepartamento(idFuncionario, idDepartamento) {
    const func = this.buscarFuncionarioPorId(idFuncionario);
    const dept = this.buscarDepartamentoPorId(idDepartamento);
    if (!func) throw new Error(chalk.red('Funcionário não encontrado.'));
    if (!dept) throw new Error(chalk.red('Departamento não encontrado.'));
    func.atribuirDepartamento(idDepartamento);
  }

  // Salva dados nos arquivos JSON
  async salvarParaArquivo(caminhoFuncionarios, caminhoDepartamentos) {
    await fs.writeFile(caminhoFuncionarios, JSON.stringify(this.funcionarios, null, 2), 'utf8');
    await fs.writeFile(caminhoDepartamentos, JSON.stringify(this.departamentos, null, 2), 'utf8');
  }

  // Carrega dados dos arquivos JSON, caso existam
  async carregarDeArquivo(caminhoFuncionarios, caminhoDepartamentos) {
    try {
      const dadosFuncs = await fs.readFile(caminhoFuncionarios, 'utf8');
      const funcs = JSON.parse(dadosFuncs);
      this.funcionarios = funcs.map(f => {
        const func = new Funcionario(f.id, f.nome, f.cargo, f.salario, f.ativo);
        func.departamentoId = f.departamentoId ?? null;
        return func;
      });
    } catch (error) {
      if (error.code === 'ENOENT') this.funcionarios = [];
      else throw error;
    }

    try {
      const dadosDepts = await fs.readFile(caminhoDepartamentos, 'utf8');
      const depts = JSON.parse(dadosDepts);
      this.departamentos = depts.map(d => new Departamento(d.id, d.nome));
    } catch (error) {
      if (error.code === 'ENOENT') this.departamentos = [];
      else throw error;
    }
  }
}

export default GerenciadorFuncionarios;
