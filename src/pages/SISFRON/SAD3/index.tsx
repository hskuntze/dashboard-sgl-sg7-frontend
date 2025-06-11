import MenuLateral from "components/MenuLateral";

const SisfronSAD3 = () => {
  const handleMenuClick = () => {};

  return (
    <div style={{ display: "flex" }}>
      <MenuLateral onMenuClick={handleMenuClick} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "calc(100vh - 71px)",
        }}
      >
        <span className="em-desenvolvimento-title">SAD 3</span>
        <span className="em-desenvolvimento-text">Em desenvolvimento</span>
      </div>
    </div>
  );
};

export default SisfronSAD3;
