import { useEffect, useRef } from "react";

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
const FRAG = `precision mediump float;
uniform vec2 r;uniform float t;
vec3 ink=vec3(.043,.051,.071);vec3 dusk=vec3(.231,.247,.62);vec3 ember=vec3(.894,.341,.18);vec3 dawn=vec3(.949,.651,.353);
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.02;a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/r;vec2 q=uv;q.x*=r.x/r.y;
  float tt=t*.03;
  vec2 w=vec2(fbm(q*1.4+tt),fbm(q*1.4-tt+3.1));
  float f=fbm(q*1.2+w*1.6+vec2(0.,tt*.5));
  float y=uv.y+ (f-.5)*.35;
  float hz=smoothstep(.62,0.,y);
  vec3 c=mix(ink,dusk,smoothstep(.0,.55,hz)*.85);
  c=mix(c,ember,smoothstep(.55,.85,hz)*.85);
  c=mix(c,dawn,smoothstep(.82,1.,hz));
  float glow=exp(-pow((uv.x-.62)*2.2,2.)-pow(uv.y*5.,2.));
  c+=dawn*glow*.55;
  c*=.85+.15*f;
  c+=(h(gl_FragCoord.xy+t)-.5)*.05;
  gl_FragColor=vec4(c,1.);
}`;

export function ShaderBackground() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gl = c.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!gl) { c.style.display = "none"; return; }
    const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const pr = gl.createProgram()!;
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { c.style.display = "none"; return; }
    gl.useProgram(pr);
    const b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(pr, "r"), uT = gl.getUniformLocation(pr, "t");
    const resize = () => {
      const d = Math.min(window.devicePixelRatio, 1.5) * 0.6;
      c.width = c.clientWidth * d; c.height = c.clientHeight * d;
      gl.viewport(0, 0, c.width, c.height);
    };
    resize();
    window.addEventListener("resize", resize);
    let raf = 0; const start = performance.now();
    const draw = () => {
      gl.uniform2f(uR, c.width, c.height);
      gl.uniform1f(uT, reduce ? 20 : (performance.now() - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    draw();
    c.style.opacity = "1";
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return (
    <div className="absolute inset-0 bg-horizon" aria-hidden>
      <canvas ref={ref} className="h-full w-full opacity-0 transition-opacity duration-[2000ms]" />
    </div>
  );
}
