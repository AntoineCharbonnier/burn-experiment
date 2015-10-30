varying vec2 v_uv;
varying vec3 v_line_color;

uniform float opacity;
uniform float time;
varying float z;

#define M_PI 3.1415926535897932384626433832795

// void main()
// {
// 	/*  OLD FRAGMENT SHADER  */
//     // vec4 temp;
//     // float alpha = sin(v_uv.y * M_PI) / 4.;
//     // temp = vec4(v_line_color, opacity);
//     // gl_FragColor = temp;


//     vec2 position = -1.0 + 2.0 * v_uv;

//     float red = abs(sin(position.x * position.y + clamp( time / 5.0, 191.0 / 255.0, 38.0 / 255.0 )));
//     float green = abs(sin(position.x * position.y + clamp( time / 4.0, 209.0 / 255.0, 118.0 / 255.0 )));
//     float blue = abs(sin(position.x * position.y + clamp( time / 3.0, 228.0 / 255.0, 173.0 / 255.0 ) ));
//     float alpha = opacity - sin(v_uv.y * M_PI) / 4.;
//     gl_FragColor = vec4(red, green, blue, alpha);


// }


float noise(vec3 p) //Thx to Las^Mercury
{
  vec3 i = floor(p);
  vec4 a = dot(i, vec3(1., 57., 21.)) + vec4(0., 57., 21., 78.);
  vec3 f = cos((p-i)*acos(-1.))*(-.5)+.5;
  a = mix(sin(cos(a)*a),sin(cos(1.+a)*(1.+a)), f.x);
  a.xy = mix(a.xz, a.yw, f.y);
  return mix(a.x, a.y, f.z);
}

float sphere(vec3 p, vec4 spr)
{
  return length(spr.xyz-p) - spr.w;
}

float flame(vec3 p)
{
  float d = sphere(p*vec3(1.,.5,1.), vec4(.0,-1.,.0,1.));
  return d + (noise(p+vec3(.0,time*2.,.0)) + noise(p*3.)*.5)*.25*(p.y) ;
}

float scene(vec3 p)
{
  return min(100.-length(p) , abs(flame(p)) );
}

vec4 raymarch(vec3 org, vec3 dir)
{
  float d = 0.0, glow = 0.0, eps = 0.02;
  vec3  p = org;
  bool glowed = true;
  
  for(int i=0; i<64; i++)
  {
    d = scene(p) + eps;
    p += d * dir;
    if( d > eps )
    {
      if(flame(p) < .0)
        glowed=true;
      if(glowed)
            glow = float(i)/64.;
    }
  }
  return vec4(p,glow);
}

// void mainImage( out vec4 gl_FragColor, in vec2 fragCoord )
void main()
{
  vec2 v = -1.0 + 2.0 * v_uv.xy / 1.0;
  // v.x *= iResolution.x/iResolution.y;
  
  vec3 org = vec3(0., -2., 4.);
  vec3 dir = normalize(vec3(v.x*1.6, -v.y, -1.5));
  
  vec4 p = raymarch(org, dir);
  float glow = p.w;
  
  vec4 col = mix(vec4(1.,.5,.1,1.), vec4(0.1,.5,1.,1.), p.y*.02+.4);
  
  gl_FragColor = mix(vec4(0), col, pow(glow*2.,1.));
  // gl_FragColor = p;
  // gl_FragColor = col;
  // gl_FragColor = mix(vec4(1.), mix(vec4(1.,.5,.1,1.),vec4(0.1,.5,1.,1.),p.y*.02+.4), pow(glow*2.,4.));

}

