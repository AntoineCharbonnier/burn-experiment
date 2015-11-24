import { Keyboard }  from './keyboard';
import { Sphere }    from './sphere';

class World {

  constructor( _options ) {
    let options    = _options || {};

    this.scene    = null;
    this.camera   = null;
    this.renderer = null;
    this.composer = null;
    this.keyboard = null;
    this.controls = null;
    this.sphere   = null;
    this.terrain   = null;
    this.ground   = null;
    this.container = options.container || document.body;

    this.params = {
          active: options.active || true,
          height: options.height || window.innerHeight,
          width:  options.width  || window.innerWidth
    };

    this.mouse = {
        x: null,
        y: null
    };

    this.clock = null;
    this.init()
  }

  init() {
    console.log("wolrd init")
  	this.scene  = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 )
  	this.camera.position.z = 0

    this.scene.add( this.camera )
    this.addLights()

    this.renderer = new THREE.WebGLRenderer({
        antialias: true
    });

  	this.renderer.setSize( this.params.width, this.params.height )

  	this.container.appendChild( this.renderer.domElement )

  	this.clock = Date.now()

    this.addSphere()
    
    this.addListeners()
  	
    this.animate()
  }

  addLights() {
      var ambient = new THREE.AmbientLight( 0x777777 )
      this.scene.add( ambient )

      var directionalLight = new THREE.DirectionalLight( 0xe2ffaa )
      directionalLight.position.x = 0
      directionalLight.position.y = 1
      directionalLight.position.z = 1
      directionalLight.position.normalize()
      this.scene.add( directionalLight )


      var light = new THREE.SpotLight( 0x999999, 2, 0 )
      light.position.set( -10, 9500, -12000 )
      light.target.position.set( 0, 0, 0 )
      light.castShadow = true
      this.scene.add( light )
  }

  addSphere() {
  	this.sphere = new Sphere()
  	this.scene.add( this.sphere.getMesh() )
  }

  addTerrain() {
    this.terrain = new Terrain()
    this.scene.add( this.terrain.getMesh() )
  }
  
  getScene() {
    return this.scene;
  }

  animate( ts ) {
    if (this.params.active) {
      window.requestAnimationFrame( this.animate.bind(this) );
      this.render( ts );
      this.sphere.update(ts);
    }
  }

  reset(){
    this.scene     = null;
    this.camera    = null;
    this.renderer  = null;
    this.composer  = null;
    this.keyboard  = null;
    this.clock     = null;
    this.sphere    = null;
  }

  render() {
    if (!this.params.active)
        this.params.active = true;
      this.renderer.render( this.scene, this.camera );
  }

  addListeners() {
  	window.addEventListener( 'resize', this.onWindowResize.bind( this ), false );
  	this.keyboard = new Keyboard();	
    this.keyboard.addObject( this.sphere.getMesh() );
  }

  onWindowResize() {
    this.params.width  = window.innerWidth;
    this.params.height = window.innerHeight;

    this.camera.aspect = this.params.width / this.params.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( this.params.width, this.params.height );
  }

}

export { World };