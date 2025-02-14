import { useForm } from "react-hook-form";
import { FilterMaterialType } from "types/filtermaterialom";

import "./styles.css";

type Props = {
  onSubmitFilter: (data: FilterMaterialType) => void;
  cmdo?: string | null;
};

const FilterMaterialOM = ({ onSubmitFilter, cmdo }: Props) => {
  const { register, handleSubmit } = useForm<FilterMaterialType>();

  const onSubmit = (filter: FilterMaterialType) => {
    onSubmitFilter(filter);
  };

  return (
    <div className="filter-bar">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            type="text"
            placeholder="Nome do equipamento"
            className="form-control"
            {...register("nomeeqp")}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="PN"
            className="form-control"
            {...register("pn")}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="SN"
            className="form-control"
            {...register("sn")}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="CMDO"
            className={`form-control ${cmdo !== null ? "disabled" : ""}`}
            {...register("cmdo", {
              value: cmdo !== null ? cmdo : "",
            })}
            disabled={cmdo !== null ? true : false}
          />
        </div>
        <button type="submit" className="filter-icon">
          <i className="bi bi-search" />
        </button>
      </form>
    </div>
  );
};

export default FilterMaterialOM;
