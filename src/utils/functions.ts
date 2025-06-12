/**
 * Função que recebe uma data (em string) no formato 'yyyy-mm-dd' e formata para 'dd/mm/yyyy'
 * @param date - String
 * @returns String formatada
 */
export const formatarData = (date: string) => {
  if (date && date !== "-" && date !== "00:00:00") {
    let containsT = date.includes("T");
    let containsSpace = date.includes(" ");
    if (containsSpace) {
      const [dt, time] = date.split(" ");
      const [year, month, day] = dt.split("-");
      return `${day}/${month}/${year}`;
    } else if (!containsT) {
      const [year, month, day] = date.split("-"); // Divide a string em ano, mês e dia
      return `${day}/${month}/${year}`;
    } else {
      let aux = date.split("T");
      const [year, month, day] = aux[0].split("-");
      return `${day}/${month}/${year}`;
    }
  } else {
    return "-";
  }
};

export function formatarDataParaMesAno(dataStr: string): string {
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

  const data = new Date(dataStr);
  const mes = meses[data.getMonth()];
  const ano = data.getFullYear();

  return `${mes}/${ano}`;
}

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
  if (num) {
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
  } else {
    return "";
  }
};

export const formatarDinheiro = (num: number): string => {
  if (num !== undefined && num !== 0) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(num));
  } else {
    return "R$ 0,00";
  }
};
