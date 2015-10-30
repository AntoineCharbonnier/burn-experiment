let glslify = require('glslify');

class Sphere {

  constructor() {
    this.vertexShader   = glslify('../../vertex-shaders/simple.vert');
    this.fragmentShader = glslify('../../fragment-shaders/burn.frag');

    this.meshMaterial = new THREE.ShaderMaterial( {
      uniforms: { 
          time: { type: "f", value: 0 },
          weight: { type: "f", value: 0 },
          opacity: { type: 'f', value: 1.0 } ,
          redValue: { type: 'f', value: 0.0 }, 
          greenValue: { type: 'f', value: 0.0 },
          blueValue: { type: 'f', value: 0.0 },
          fragCoord: { type: "v2", value: new THREE.Vector2(0.2,0.2) },
          Resolution : { type: "v3", value: new THREE.Vector3(100,100,100) }
        },
        vertexShader: this.vertexShader,
        fragmentShader: this.fragmentShader,
        shading: THREE.SmoothShading,
        wireframe: false,
        transparent: true,
        // side: THREE.DoubleSide
      } 
    );

    // torus params
    this.radius          = 10
    this.tube            = 3
    this.radialSegments  = 64
    this.tubularSegments = 8
    this.p               = 2
    this.q               = 3
    this.heightScale     = 1


    // this.meshGeometry = new THREE.DodecahedronGeometry( 20, 1 );
    this.meshGeometry = new THREE.CylinderGeometry(1, 0, 1, 32, 32, true, 0)
    // this.meshGeometry = new THREE.PlaneGeometry(10, 10, 100, 100)
    
    // this.meshGeometry = new THREE.TorusKnotGeometry( this.radius, this.tube, this.radialSegments, this.tubularSegments, this.p, this.q, this.heightScale );
    
    this.mesh = new THREE.Object3D()



    this.mesh.add( new THREE.Mesh(
      this.meshGeometry,
      this.meshMaterial
    ));

    // this.mesh.position.z = -104;
    // this.mesh.position.y = 18;
    // this.mesh.position.z = -30;
    // this.mesh.position.y = 4;
    // this.mesh.rotation.x = -8
    // this.mesh.position.z = -500;
    // this.mesh.position.z = -20;
    this.mesh.position.y = 0;
    this.mesh.rotation.y = -11;
    this.mesh.position.z = -3;
    this.mesh.rotation.z = -Math.PI / 2
    

    this.data = {
      radius : 10,
      tube : 3,
      radialSegments : 64,
      tubularSegments : 8,
      p : 2,
      q : 3,
      heightScale : 1
    };


    // GUI settings
    // var gui = new dat.GUI();

    // var folder = gui.addFolder('THREE.TorusGeometry');

    // folder.add( this.data, 'radius', 1, 20 ).onChange( this.generateGeometry )
    // folder.add( this.data, 'tube', 0.1, 10 ).onChange( this.generateGeometry )
    // folder.add( this.data, 'radialSegments', 3, 300 ).step(1).onChange( this.generateGeometry )
    // folder.add( this.data, 'tubularSegments', 3, 20 ).step(1).onChange( this.generateGeometry )
    // folder.add( this.data, 'p', 1, 20 ).step(1).onChange( this.generateGeometry )
    // folder.add( this.data, 'q', 1, 20 ).step(1).onChange( this.generateGeometry )
    // folder.add( this.data, 'heightScale', 1, 20 ).onChange( this.generateGeometry )

    // this.generateGeometry()
    
    this.clock           = Date.now();
    
    this.speed           = 0.0003;
    this.weight          = 5;
    this.opacity         = 0.0;
    
    this.redValue        = 0;
    this.greenValue      = 0;
    this.blueValue       = 0;
    
    this.stepRed         = 0.001
    this.stepGreen       = 0.01
    this.stepBlue        = 0.005

    return this;
  }


  generateGeometry() {
    console.log(this.data)
    this.updateGroupGeometry( this.mesh,
      new THREE.TorusKnotGeometry(
          this.data.radius, this.data.tube, this.data.radialSegments, this.data.tubularSegments,
          this.data.p, this.data.q, this.data.heightScale
      )
    )
  }

  updateGroupGeometry( mesh, geometry ) {
    mesh.children[0].geometry.dispose();
    mesh.children[0].geometry = geometry;
    //these do not update nicely together if shared
  }


  update( ts ) {
    this.meshMaterial.uniforms[ 'time' ].value        = this.speed * ( Date.now() - this.clock );
  }


  setWeight( _weight ) {
    this.weight = _weight;
  }

  getSoundDataWave(){
    return this.waveData;
  }

  getSoundDataBar(){
    return this.barData;
  }

  getMesh() {
    return this.mesh;
  }

}

export { Sphere };