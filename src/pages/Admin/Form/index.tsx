import { useCallback, useEffect, useState } from "react";
import "./styles.css";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Posto } from "types/posto";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import Loader from "components/Loader";
import { User } from "types/user";
import { OM } from "types/om";
import { Perfil } from "types/perfil";

type FormData = {
  nomecompleto: string;
  username: string;
  password: string;
  tipo: string;
  cpf: string;
  identidade: string;
  nomeguerra: string | null;
  telefone: string;
  email: string;
  organizacao: string;
  om: OM;
  perfil: Perfil;
  habilitado: string;
  posto: number;
};

const UsuarioForm = () => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = useForm<FormData>();

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCivil, setIsCivil] = useState<boolean | null>(null);
  const [postos, setPostos] = useState<Posto[]>([]);
  const [oms, setOms] = useState<OM[]>([]);

  const urlParams = useParams();
  const navigate = useNavigate();

  const onSubmit = (formData: FormData) => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: `/usuarios/${isEditing ? `atualizar/${urlParams.id}` : "registrar"}`,
      method: isEditing ? "PUT" : "POST",
      withCredentials: true,
      data: {
        ...formData,
        tipo: formData.tipo === "1" ? "Militar" : "Civil",
        password: formData.password,
        perfis: [
          {
            id: formData.perfil.id,
          },
        ],
        posto: {
          id: Number(formData.posto),
        },
        om: {
          codigo: formData.om ? Number(formData.om.codigo) : null,
        },
      },
    };

    requestBackend(requestParams)
      .then((res) => {
        toast.success(`Sucesso ao ${isEditing ? "atualizar" : "registrar"} o usuário`);
        navigate("/dashboard-sgl-sg7/usuario");
      })
      .catch((err) => {
        if (err.response && err.response.data.message) {
          toast.error(`Erro ao ${isEditing ? "atualizar" : "registrar"} o usuário. ${err.response.data.message}`);
        } else {
          toast.error(`Erro ao ${isEditing ? "atualizar" : "registrar"} o usuário.`);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const loadPostos = useCallback(() => {
    const requestParams: AxiosRequestConfig = {
      url: "/postos",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        let data = res.data as Posto[];
        setPostos(data);
      })
      .catch(() => {
        toast.error("Não foi possível carregar os postos/graduações.");
      });
  }, []);

  const loadOms = useCallback(() => {
    const requestOmParams: AxiosRequestConfig = {
      url: "/oms",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestOmParams)
      .then((res) => {
        setOms(res.data as OM[]);
      })
      .catch((err) => {
        toast.error(err);
      });
  }, []);

  const loadInfo = useCallback(() => {
    if (isEditing) {
      setLoading(true);

      const requestParams: AxiosRequestConfig = {
        url: `/usuarios/id/${urlParams.id}`,
        withCredentials: true,
        method: "GET",
      };

      requestBackend(requestParams)
        .then((res) => {
          let data = res.data as User;

          setValue("email", data.email);
          setValue("identidade", data.identidade);
          setValue("cpf", data.cpf);
          setValue("username", data.username);
          setValue("organizacao", data.organizacao);
          setValue("nomecompleto", data.nomecompleto);
          if (data.nomeguerra) {
            setValue("nomeguerra", data.nomeguerra);
          }
          if (data.posto) {
            setValue("posto", data.posto.id);
          }
          if (data.om) {
            setValue("om", data.om);
            setValue("om.codigo", data.om.codigo);
          }

          setValue("tipo", data.tipo === "Militar" ? "1" : "2");
          setIsCivil(data.tipo === "Civil" ? true : false);
          setValue("telefone", data.telefone);

          setValue("perfil", data.perfis[0]);
          setValue("perfil.id", data.perfis[0].id);

          setValue("habilitado", String(data.habilitado));
        })
        .catch((err) => {
          toast.error("Erro ao tentar carregar informações do usuário.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isEditing, setValue, urlParams.id]);

  const handleSelectTipo = (e: React.MouseEvent<HTMLInputElement>) => {
    let isCivil = e.currentTarget.value === "2" ? true : false;
    setIsCivil(isCivil);
  };

  useEffect(() => {
    if (urlParams.id && urlParams.id !== "inserir") {
      setIsEditing(true);
    }
  }, [urlParams]);

  useEffect(() => {
    loadInfo();
    loadPostos();
    loadOms();
  }, [loadPostos, loadInfo, loadOms]);

  return (
    <div className="element-container">
      <form onSubmit={handleSubmit(onSubmit)} className="element-form">
        <div className="element-content">
          <div className="element-left">
            <h6 className="mt-3 ml-2">DADOS DO USUÁRIO</h6>
            {/* Tipo (civil ou militar) */}
            <div className="element-input-group element-radio-input-group">
              <span>
                Tipo<span className="campo-obrigatorio">*</span>
              </span>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${errors.tipo ? "is-invalid" : ""}`}
                  value="1"
                  id="militar"
                  {...register("tipo", { required: "Campo obrigatório" })}
                  onClick={handleSelectTipo}
                />
                <label htmlFor="militar">Militar</label>
                <div className="invalid-feedback d-block">{errors.tipo?.message}</div>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${errors.tipo ? "is-invalid" : ""}`}
                  value="2"
                  id="civil"
                  {...register("tipo", { required: "Campo obrigatório" })}
                  onClick={handleSelectTipo}
                />
                <label htmlFor="civil">Civil</label>
                <div className="invalid-feedback d-block">{errors.tipo?.message}</div>
              </div>
            </div>
            {isCivil !== null && (
              <>
                <div className="element-input-group form-floating">
                  <input type="text" className={`form-control`} id="nome" placeholder="Nome" {...register("nomecompleto")} />
                  <label htmlFor="nome">Nome completo</label>
                  <div className="invalid-feedback d-block">{errors.nomecompleto?.message}</div>
                </div>
                <div className="element-input-group form-floating">
                  <input type="text" className={`form-control`} id="username" placeholder="Nome de usuário (Login)" {...register("username")} />
                  <label htmlFor="username">Nome de usuário (Login)</label>
                  <div className="invalid-feedback d-block">{errors.username?.message}</div>
                </div>
                <div className="element-input-group form-floating">
                  <input type="text" className={`form-control`} id="organizacao" placeholder="Organização" {...register("organizacao")} />
                  <label htmlFor="organizacao">Organização</label>
                  <div className="invalid-feedback d-block">{errors.organizacao?.message}</div>
                </div>
                <div className="element-input-group form-floating">
                  <input type="text" className={`form-control`} id="cpf" placeholder="CPF" {...register("cpf")} />
                  <label htmlFor="cpf">CPF</label>
                  <div className="invalid-feedback d-block">{errors.cpf?.message}</div>
                </div>
                <div className="element-input-group form-floating">
                  <input type="email" className={`form-control`} id="email" placeholder="Email" {...register("email")} />
                  <label htmlFor="email">Email</label>
                  <div className="invalid-feedback d-block">{errors.email?.message}</div>
                </div>
                <div className="element-input-group form-floating">
                  <input type="text" className={`form-control`} id="identidade" placeholder="Identidade" {...register("identidade")} />
                  <label htmlFor="identidade">Identidade</label>
                  <div className="invalid-feedback d-block">{errors.identidade?.message}</div>
                </div>
                <div className="element-input-group form-floating">
                  <Controller
                    name="perfil.id"
                    control={control}
                    rules={{ required: "Campo obrigatório" }}
                    render={({ field }) => (
                      <select id="perfil" className={`form-select ${errors.perfil ? "is-invalid" : ""}`} {...field} value={field.value}>
                        <option>Selecione um perfil</option>
                        <option key={"perfil" + 1} value={1}>
                          Admin
                        </option>
                        <option key={"perfil" + 2} value={2}>
                          Usuário
                        </option>
                        <option key={"perfil" + 3} value={3}>
                          Operador NOC
                        </option>
                        <option key={"perfil" + 4} value={4}>
                          Operador OM
                        </option>
                        <option key={"perfil" + 5} value={5}>
                          SLI
                        </option>
                      </select>
                    )}
                  />
                  <label htmlFor="perfil">
                    Perfil<span className="campo-obrigatorio">*</span>
                  </label>
                  <div className="invalid-feedback d-block">{errors.perfil?.message}</div>
                </div>
                {/* Habilitado */}
                <div className="element-input-group element-radio-input-group">
                  <span>
                    Habilitado<span className="campo-obrigatorio">*</span>
                  </span>
                  <div className="form-check">
                    <input
                      type="radio"
                      className={`form-check-input ${errors.habilitado ? "is-invalid" : ""}`}
                      value="true"
                      id="habilitado-sim"
                      {...register("habilitado", { required: "Campo obrigatório" })}
                    />
                    <label htmlFor="habilitado-sim">Sim</label>
                    <div className="invalid-feedback d-block">{errors.habilitado?.message}</div>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className={`form-check-input ${errors.habilitado ? "is-invalid" : ""}`}
                      value="false"
                      id="habilitado-nao"
                      {...register("habilitado", { required: "Campo obrigatório" })}
                    />
                    <label htmlFor="habilitado-nao">Não</label>
                    <div className="invalid-feedback d-block">{errors.habilitado?.message}</div>
                  </div>
                </div>
                {!isEditing && (
                  <div className="element-input-group form-floating">
                    <input type="password" className={`form-control`} id="password" placeholder="Senha" {...register("password")} />
                    <label htmlFor="password">Senha (provisória)</label>
                    <div className="invalid-feedback d-block">{errors.password?.message}</div>
                  </div>
                )}
                <div className="element-input-group form-floating">
                  <input type="text" className={`form-control`} id="telefone" placeholder="Telefone" {...register("telefone")} />
                  <label htmlFor="telefone">Telefone</label>
                  <div className="invalid-feedback d-block">{errors.telefone?.message}</div>
                </div>
              </>
            )}
          </div>
          <div className="element-right">
            {!isCivil && isCivil !== null && (
              <>
                <h6 className="mt-3 ml-2">DADOS DO USUÁRIO MILITAR</h6>
                {/* Nome de guerra */}
                <div className="element-input-group form-floating">
                  <input
                    type="text"
                    className={`form-control ${errors.nomeguerra ? "is-invalid" : ""}`}
                    id="nome-guerra"
                    placeholder="Nome de guerra"
                    {...register("nomeguerra", {
                      required: "Campo obrigatório",
                    })}
                  />
                  <label htmlFor="nome-guerra">Nome de guerra</label>
                  <div className="invalid-feedback d-block">{errors.nomeguerra?.message}</div>
                </div>
                {/* Posto */}
                <div className="element-input-group form-floating">
                  <Controller
                    name="posto"
                    control={control}
                    rules={{
                      required: "Campo obrigatório",
                    }}
                    render={({ field }) => (
                      <select id="posto" className={`form-select ${errors.posto ? "is-invalid" : ""}`} {...field}>
                        <option value="">Selecione um posto/graduação</option>
                        {postos && postos.length > 0 && postos.map((p) => <option value={p.id}>{p.titulo}</option>)}
                      </select>
                    )}
                  />
                  <label htmlFor="posto">Posto/graduação</label>
                  <div className="invalid-feedback d-block">{errors.posto?.message}</div>
                </div>
                {/* OM */}
                <div className="element-input-group form-floating">
                  <Controller
                    name="om.codigo"
                    control={control}
                    rules={{ required: "Campo obrigatório" }}
                    render={({ field }) => (
                      <select id="om" className={`form-select ${errors.om ? "is-invalid" : ""}`} {...field} value={field.value}>
                        <option>Selecione uma OM</option>
                        {oms &&
                          oms.map((om) => (
                            <option key={om.codigo} value={om.codigo}>
                              {om.sigla}
                            </option>
                          ))}
                      </select>
                    )}
                  />
                  <label htmlFor="om">
                    OM<span className="campo-obrigatorio">*</span>
                  </label>
                  <div className="invalid-feedback d-block">{errors.om?.message}</div>
                </div>
              </>
            )}
          </div>
        </div>
        {loading ? (
          <div className="loader-div">
            <Loader />
          </div>
        ) : (
          <div className="form-buttons">
            <button className="button submit-button">Salvar</button>
            <Link to={"/dashboard-sgl-sg7"}>
              <button type="button" className="button delete-button">
                Voltar
              </button>
            </Link>
          </div>
        )}
      </form>
    </div>
  );
};

export default UsuarioForm;
