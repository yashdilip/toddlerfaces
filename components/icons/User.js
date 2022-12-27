import * as React from "react";
function SvgUser(props) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      width={200}
      height={200}
      style={{
        height: "100%",
        width: "100%",
      }}
      {...props}
    >
      <g
        className="user_svg__ldl-scale"
        style={{
          transformOrigin: "50% 50%",
        }}
      >
        <g className="user_svg__ldl-ani">
          <g className="user_svg__ldl-layer">
            <circle
              fill="#333"
              r={40}
              cy={50}
              cx={50}
              transform="scale(.728)"
            />
          </g>
          <g
            style={{
              transformOrigin: "50px 50px",
              animation:
                "1.111111s linear -.777778s infinite normal forwards running breath-6892c85d-0fb9-4423-8fcb-b1cebfbc31c8",
            }}
            className="user_svg__ldl-ani"
          >
            <path d="M38.293 10.92h.291-.291z" />
          </g>
          <g
            style={{
              transformOrigin: "50px 50px",
              animation:
                "1.111111s linear -.888889s infinite normal forwards running breath-6892c85d-0fb9-4423-8fcb-b1cebfbc31c8",
            }}
            className="user_svg__ldl-ani"
          >
            <path d="M37.492 10.92z" />
          </g>
          <g
            style={{
              transformOrigin: "50px 50px",
              animation:
                "1.111111s linear -1s infinite normal forwards running breath-6892c85d-0fb9-4423-8fcb-b1cebfbc31c8",
            }}
            className="user_svg__ldl-ani"
          >
            <path d="M38.22 10.92h-.582.582z" />
          </g>
          <g className="user_svg__ldl-layer">
            <path
              fill="#f5e6c8"
              d="M44.7 37.783l-1.311-.655c4.077-2.694 6.479-7.571 5.533-12.958-.947-5.46-5.533-9.756-11.066-10.338-.437-.073-.8-.073-1.238-.073h-.873c-6.698.364-12.085 5.897-12.085 12.74 0 4.441 2.257 8.372 5.751 10.629l-1.31.655c-4.878 2.84-8.227 8.008-8.3 14.05 4.15 4.441 10.047 7.208 16.599 7.208s12.449-2.767 16.598-7.207c-.145-6.043-3.421-11.284-8.299-14.05z"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}
export default SvgUser;
