let glslify = require('glslify');
let PERLIN_NOISE = require('../vendors/improved_perlin_noise');

class Terrain {

  constructor() {

    this.worldWidth           = 20
    this.worldDepth           = 20
    this.worldHalfWidth       = this.worldWidth / 2
    this.worldHalfDepth       = this.worldDepth / 2
    this.opacity              = 0.0;
    this.noiseDisplacementPic = 1.0;
    this.amplitude = 0.0;

    this.clock = new THREE.Clock();

    this.vertexShader   = glslify('../../vertex-shaders/terrain-sombrero.vert');
    this.fragmentShader = glslify('../../fragment-shaders/terrain.frag');

    /* FROM SAMSY */
    this.options = {
      elevation: 1,
      noise_range: 1,
      sombrero_amplitude: 0.2,
      sombrero_frequency: 10.0,
      speed: 0.8,
      segments: 80,
      wireframe_color: '#ff0000',
      perlin_passes: 1,
      wireframe: false,
      floor_visible: true,
      transparent: true,
      opacity: 1.0
    };

    this.options2 = {
      elevation: 1,
      noise_range: 1,
      sombrero_amplitude: 0.2,
      sombrero_frequency: 10.0,
      speed: 0.8,
      segments: 80,
      wireframe_color: '#000000',
      perlin_passes: 1,
      wireframe: true,
      floor_visible: true,
      transparent: true,
      opacity: 0.0
    };

    this.uniforms = {
      time: {
        type: "f",
        value: 0.0
      },
      speed: {
        type: "f",
        value: this.options.speed
      },
      elevation: {
        type: "f",
        value: this.options.elevation
      },
      noise_range: {
        type: "f",
        value: this.options.noise_range
      },
      offset: {
        type: "f",
        value: this.options.elevation
      },
      perlin_passes: {
        type: "f",
        value: this.options.perlin_passes
      },
      sombrero_amplitude: {
        type: "f",
        value: this.options.sombrero_amplitude
      },
      sombrero_frequency: {
        type: "f",
        value: this.options.sombrero_frequency
      },
      line_color: {
        type: "c",
        value: new THREE.Color(this.options.wireframe_color)
      },
      opacity: {
        type: 'f',
        value: this.options.opacity
      }
    };

    this.uniforms2 = {
      time: {
        type: "f",
        value: 0.0
      },
      speed: {
        type: "f",
        value: this.options2.speed
      },
      elevation: {
        type: "f",
        value: this.options2.elevation
      },
      noise_range: {
        type: "f",
        value: this.options2.noise_range
      },
      offset: {
        type: "f",
        value: this.options2.elevation
      },
      perlin_passes: {
        type: "f",
        value: this.options2.perlin_passes
      },
      sombrero_amplitude: {
        type: "f",
        value: this.options2.sombrero_amplitude
      },
      sombrero_frequency: {
        type: "f",
        value: this.options2.sombrero_frequency
      },
      line_color: {
        type: "c",
        value: new THREE.Color(this.options2.wireframe_color)
      },
      opacity: {
        type: 'f',
        value: this.options2.opacity
      }
    };


    this.squareSize = 10

    this.plane_geometry = new THREE.PlaneBufferGeometry(this.squareSize, this.squareSize, this.options.segments, this.options.segments);
    this.plane_geometry2 = new THREE.PlaneBufferGeometry(this.squareSize, this.squareSize, this.options.segments, this.options.segments);

    
    this.plane_material = new THREE.ShaderMaterial({
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      wireframe: this.options.wireframe,
      wireframeLinewidth: 1,
      transparent: true,
      uniforms: this.uniforms
    });

    this.plane_material2 = new THREE.ShaderMaterial({
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      wireframe: this.options2.wireframe,
      wireframeLinewidth: 1,
      transparent: true,
      uniforms: this.uniforms2
    });

    this.groundMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      specular: 0x050505
    });

    this.groundMaterial2 = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      specular: 0x050505
    });

    this.groundMaterial.color.setHSL(0, 0, 0);
    this.groundMaterial2.color.setHSL(0, 0, 0);
    
    // this.materials  = [this.groundMaterial, this.plane_material];
    // this.materials2 = [this.groundMaterial2, this.plane_material2];
    this.materials  = [ this.plane_material];
    this.materials2 = [ this.plane_material2];
    
    this.plane_mesh = new THREE.Object3D()


    this.plane_mesh.add( THREE.SceneUtils.createMultiMaterialObject(this.plane_geometry, this.materials) );
    // this.plane_mesh.add( THREE.SceneUtils.createMultiMaterialObject(this.plane_geometry2, this.materials2) );
    
    // this.plane_mesh.add( new THREE.Mesh(this.plane_geometry, this.plane_material) );
    // this.plane_mesh.add( new THREE.Mesh(this.plane_geometry2, this.plane_material2) );


    this.plane_mesh.rotation.x = 3.8;
    this.plane_mesh.rotation.y = 3;
    this.plane_mesh.position.z = -20;
    this.plane_mesh.rotation.z = 0
    this.plane_mesh.position.y = -2;

    // if(this.quality == false){
    //   // console.log("fuck")
    //   this.plane_mesh.position.y = -2;
    //   this.plane_mesh.position.z = -6;
    // }

    this.tick = 0;

    return this;
  }

  update( ts ) {
    this.tick += 1
    this.opacity = Math.sin(this.opacity + this.tick / 1000)
    this.plane_material.uniforms['time'].value           = this.clock.getElapsedTime();
    // this.plane_material2.uniforms['time'].value          = this.clock.getElapsedTime();
    this.plane_material.uniforms[ 'opacity' ].value      =  this.opacity;
    // this.plane_material2.uniforms[ 'opacity' ].value     =  this.opacity;
    this.plane_material.uniforms['perlin_passes'].value  = this.noiseDisplacementPic ;
    // this.plane_material2.uniforms['perlin_passes'].value = this.noiseDisplacementPic ;
  }

  getMesh() {
    return this.plane_mesh;
  }

}

export { Terrain };