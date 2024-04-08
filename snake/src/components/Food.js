import React from "react";

const Food = (props) => {
  const style = {
    left: `${props.dot.position[0]}%`,
    top: `${props.dot.position[1]}%`,
  };

  return (
    <div className={"food-dot-" + props.dot.type.toString()} style={style} />
  );
};

export default Food;
