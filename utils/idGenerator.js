// Função para criar id
export default function gerarIdNumerico(tamanho = 8) {
  let resultado = '';
  const caracteres = '0123456789';
  for (let i = 0; i < tamanho; i++) {
    resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return resultado;
}