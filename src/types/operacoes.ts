import { MaterialOMOperacao } from "./materialomop";
import { MaterialOperacao } from "./materialop";

export type OperacoesType = {
    codigo: number;
    operacao: string;
    inicio: string;
    fim: string;
    cidade: string;
    estado: string;
    conceito: string;
    latitude: string;
    longitude: string;
    pessoalEnvolvido: number;

    materiais: MaterialOperacao[];
    oms: MaterialOMOperacao[];
}