export const glassV= /*glsl*/`
    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;
export const glassF = /*glsl*/`
    uniform vec4 color;
    void main() {
        gl_FragColor = color;
   }
`;


//VERTEX SHADER PLANE
export const planeV = /*glsl*/`
    uniform vec2 res;
    varying vec3 vPos;
    varying vec2 vUv;
    uniform float time;
    void main() {
        //passée par threejs
        vec4 position = vec4(vec3(position.x, position.y, position.z-2.0), 1.0);//2.0*sin(position.x/5.0+time)
        vPos = position.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * position;
        //position relative to screen size
        vUv = uv * 2.0 - 1.0;
        vUv.x *= res.x / res.y;
    }
`;

//FRAGMENT SHADER PLANE
export const planeF = /*glsl*/`
    varying vec3 vPos;
    varying vec2 vUv;
    uniform float time;

    //PALETTE COULEUR
    vec3 palette(float t)
    {
        vec3 a = vec3(0.5, 0.5, 0.5);
        vec3 b = vec3(0.5, 0.5, 0.5);
        vec3 c = vec3(1.0, 1.0, 1.0	);
        vec3 d = vec3(0.00, 0.33, 0.67);
        return (a + b*cos(6.28318*(c*t+d)));
    }

    //SDF COEUR
    float dot2( in vec2 v ) { return dot(v,v); }
    float sdHeart(vec2 p){
        p.x = abs(p.x);

        if(p.y+p.x > 1.0)
            return sqrt(dot2(p-vec2(0.25,0.75))) - sqrt(2.0)/4.0;
        return sqrt(min(dot2(p-vec2(0.00,1.00)),
                        dot2(p-0.5*max(p.x+p.y,0.0)))) * sign(p.x-p.y);
    }

    void main() {
        vec2 nuv = vUv;
        vec2 uv0 = vUv;
        uv0.y += 0.5;
        //SDF cercle
        // float d = length(vUv);
        // d -= 0.5;
        vec3 final = vec3(0.0);
        vec3 color = vec3(0.0);
        float d = 0.;
        for (float i = 0.0; i < 4.0; i++){
            nuv = fract(nuv*1.6);
            nuv.x -=0.5;
            nuv.y += 0.1;
            color = palette(sdHeart(uv0) + i*.4 + time*0.02);
            d = sdHeart(nuv)*13. * exp(-sdHeart(uv0));
            d = sin(d+time*0.5)/8.0;
            d = 0.01/abs(d);
            // d = pow(0.01/d, 2.);
            final += d*color *0.1;
        }
        gl_FragColor = vec4(final, 1.0);
    }
`;