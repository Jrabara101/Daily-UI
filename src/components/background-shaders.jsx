import { Warp } from "@paper-design/shaders-react";

export default function Wrapper({ children }) {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="fixed  w-full h-full -z-10">
        <Warp
          style={{ width: "100vw", height: "100vh" }}
          proportion={0.45}
          softness={1}
          distortion={0.25}
          swirl={0.8}
          swirlIterations={10}
          shape="checks"
          shapeScale={0.1}
          scale={1}
          rotation={0}
          speed={1}
          colors={[
            "hsl(203, 100%, 62%)",
            "hsl(255, 100%, 72%)",
            "hsl(158, 99%, 59%)",
            "hsl(264, 100%, 61%)",
          ]}
        />
      </div>
      <div className="flex items-center justify-center min-h-screen w-full">
        {children}
      </div>
    </div>
  );
}
