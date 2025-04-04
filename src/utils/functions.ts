/**
 * Função que recebe uma data (em string) no formato 'yyyy-mm-dd' e formata para 'dd/mm/yyyy'
 * @param date - String
 * @returns String formatada
 */
export const formatarData = (date: string) => {
  if (date) {
    let containsT = date.includes("T");
    if (!containsT) {
      const [year, month, day] = date.split("-"); // Divide a string em ano, mês e dia
      return `${day}/${month}/${year}`;
    } else {
      let aux = date.split("T");
      const [year, month, day] = aux[0].split("-");
      return `${day}/${month}/${year}`;
    }
  } else {
    return "";
  }
};

/**
 * Função que formata o perfil do usuário
 * @param perfil
 * @returns
 */
export const formatarPerfil = (perfil: string) => {
  const perfis: { [key: string]: string } = {
    PERFIL_ADMIN: "Administrador",
    PERFIL_USUARIO: "Usuário",
    PERFIL_OPERADOR_NOC: "Operador NOC",
    PERFIL_OPERADOR_OM: "Operador OM",
    PERFIL_SLI: "SLI",
  };

  return perfis[perfil];
};

export const formatarNumero = (num: number): string => {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1).replace(".0", "")}bi`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1).replace(".0", "")}mi`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1).replace(".0", "")} mil`;
  }
  return num.toString();
};
