// services/GerenciadorFuncionarios.js
import fs from 'fs/promises';
import Funcionario from '../models/Funcionario.js';
import Departamento from '../models/Departamento.js';
import chalk from 'chalk';
import gerarIdNumerico from '../utils/idGenerator.js';

class GerenciadorFuncionarios {
  constructor() {
    this.funcionarios = [];  // Lista de funcionários
    this.departamentos = []; // Lista de departamentos
  }

  gerarIdUnicoNumerico(tamanho = 8) {
    let id;
    do {
      id = gerarIdNumerico(tamanho);
      id = String(id); // garante string
    } while (this.buscarFuncionarioPorId(id));
    return id;
  }

  // Adiciona funcionário após validar dados e verificar duplicidade
  adicionarFuncionario(func) {
    // se não veio id, gera aqui; senão normaliza para string
    if (!func.id) {
      func.id = this.gerarIdUnicoNumerico();
    } else {
      func.id = String(func.id);
    }

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

  // Busca funcionário por ID (normaliza para string)
  buscarFuncionarioPorId(id) {
    const idStr = String(id);
    return this.funcionarios.find(f => String(f.id) === idStr);
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
    const idx = this.funcionarios.findIndex(f => String(f.id) === String(id));
    if (idx === -1) throw new Error(chalk.bgRed('Funcionário não encontrado.'));
    this.funcionarios.splice(idx, 1);
  }

  // Adiciona departamento validando e evitando duplicatas
  adicionarDepartamento(dept) {
    // garante id do dept como string (gera se não existir)
    if (!dept.id) dept.id = String(gerarIdNumerico(8));
    else dept.id = String(dept.id);

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
    return this.departamentos.find(d => String(d.id) === String(id));
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
    const idx = this.departamentos.findIndex(d => String(d.id) === String(id));
    if (idx === -1) throw new Error(chalk.red('Departamento não encontrado.'));
    this.funcionarios.forEach(f => {
      if (String(f.departamentoId) === String(id)) {
        if (typeof f.removerDepartamento === 'function') f.removerDepartamento();
        else f.departamentoId = null;
      }
    });
    this.departamentos.splice(idx, 1);
  }

  // Atribui funcionário a um departamento
  atribuirFuncionarioADepartamento(idFuncionario, idDepartamento) {
    const func = this.buscarFuncionarioPorId(idFuncionario);
    const dept = this.buscarDepartamentoPorId(idDepartamento);
    if (!func) throw new Error(chalk.red('Funcionário não encontrado.'));
    if (!dept) throw new Error(chalk.red('Departamento não encontrado.'));
    if (typeof func.atribuirDepartamento === 'function') {
      func.atribuirDepartamento(idDepartamento);
    } else {
      func.departamentoId = idDepartamento;
    }
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
        const id = f.id ? String(f.id) : this.gerarIdUnicoNumerico();
        const func = new Funcionario(
          id,
          f.nome,
          f.cargo,
          f.salario,
          f.dependentes ?? 0,
          f.ativo ?? true
        );
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
      this.departamentos = depts.map(d => {
        const id = d.id ? String(d.id) : String(gerarIdNumerico(8));
        return new Departamento(id, d.nome);
      });
    } catch (error) {
      if (error.code === 'ENOENT') this.departamentos = [];
      else throw error;
    }
  }
}

export default GerenciadorFuncionarios;
