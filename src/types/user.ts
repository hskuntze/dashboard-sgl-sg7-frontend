import { OM } from "./om";
import { Perfil } from "./perfil";
import { Posto } from "./posto";

export type User = {
  id: number;
  nomecompleto: string;
  username: string;
  tipo: string;
  cpf: string;
  identidade: string;
  nomeguerra: string | null;
  telefone: string;
  email: string;
  organizacao: string;

  habilitado: boolean;
  registroCompleto: boolean;

  posto: Posto;
  om: OM;
  perfis: Perfil[];
};
