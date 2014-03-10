var container = document.getElementById("container");

var trackedObject = function(id, obj, h) {
    this.tagId = id
    this.meshObject = obj
    this.height = typeof h !== 'undefined' ? h : 0;
}

var myRenderer = new function() {

    this.camera = null
    this.scene = null
    this.renderer = null
    this.initialized = false
    this.enabled = false

    this.objects = {} // the objects that will be added in the scene, mapping tagId -> meshObject
    this.cameraData = {}
    this.coordinateMapper = coordinateMapper;

    this.size = {
        width : 1278, // because of the 1px border
        height: 766   // because of the 1px border
    };
    this.calibData = {
     "projection" : new THREE.Matrix4(3.743125153, 0.0, 0.0, 0.0, 0.0, 6.284374873, 0.0, 0.0, 0.0, -0.9812087834, -1.020202041, -1.0, 0.0, 0.0, -202.020202, 0.0).transpose(),
     "modelview" : new THREE.Matrix4(1.0, -1.485680693e-18, 2.907019987e-16, 0.0, 7.587362145e-18, 0.9997797012, -0.02099059522, 0.0, -2.906067869e-16, 0.02099059522, 0.9997797012, 0.0, -5.874633005e-15, -215.3942413, -1398.93335, 1.0).transpose()
       // "projection": new THREE.Matrix4(),
       // "modelview": new THREE.Matrix4()
    };

    this.updateCalib = function(p, mv) {
        this.calibData.projection = new THREE.Matrix4(p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7], p[8], p[9], p[10], p[11], p[12], p[13], p[14], p[15]).transpose();
        this.calibData.modelview = new THREE.Matrix4(mv[0], mv[1], mv[2], mv[3], mv[4], mv[5], mv[6], mv[7], mv[8], mv[9], mv[10], mv[11], mv[12], mv[13], mv[14], mv[15]).transpose();

        this.applyMatrices();
    }

    this.updateCamera = function(cam) {        
        this.cameraData.intrinsic = new THREE.Matrix3(cam.intrinsic[0], cam.intrinsic[1], cam.intrinsic[2], cam.intrinsic[3], cam.intrinsic[4], cam.intrinsic[5],cam.intrinsic[6], cam.intrinsic[7], cam.intrinsic[8]).transpose();
        this.cameraData.rotation = new THREE.Matrix3(cam.rotation[0], cam.rotation[1], cam.rotation[2], cam.rotation[3], cam.rotation[4], cam.rotation[5],cam.rotation[6], cam.rotation[7], cam.rotation[8]).transpose();
        this.cameraData.translation = new THREE.Vector3(cam.translation[0], cam.translation[1], cam.translation[2])
        this.coordinateMapper.init(this.cameraData.intrinsic, this.cameraData.rotation, this.cameraData.translation);
    }

    this.applyMatrices = function() {
        this.camera.projectionMatrix = this.calibData.projection
        this.scene.matrixWorld.copy(this.calibData.modelview)
        this.scene.matrix.copy(this.calibData.modelview)
    }

    this.init = function() {
//var camera = new THREE.PerspectiveCamera( 75, 1280/768, 0.1, 1000 );
        this.camera = new THREE.Camera();
        this.scene = new THREE.Scene();

        this.scene.matrixAutoUpdate = false;

        this.renderer = new THREE.WebGLRenderer({antialias: true })
        this.renderer.setSize(this.size.width, this.size.height);

        this.applyMatrices();
//        this.updateCamera();
        
        container.appendChild(this.renderer.domElement);

        this.initialized = true;
    }

    this.addObject = function(obj) {
        this.objects[obj.tagId] = obj
        this.scene.add( obj.meshObject );
    }

    this.updateTag = function(tagId, xPos, yPos, rot) {
//        scene.remove(objects[tagId].meshObject)
        if (tagId in this.objects) {
//            var currPos = this.objects[tagId].meshObject.position;
            var newPos = this.coordinateMapper.pixel2mm(xPos, yPos, this.objects[tagId].height);
            this.objects[tagId].meshObject.position.x = newPos.x;
            this.objects[tagId].meshObject.position.y = newPos.y;
            printInfo(tagId, xPos, yPos, newPos.x, newPos.y);
        } else {
            console.log("tag undefined: " + tagId);
        }
    }

}

function printInfo(tagId, x, y, newX, newY) {
    var el = $('#tags');
    el.html(el.html()+ tagId + "   old: x: " + x + ", y: " + y + ",           new: " + newX + ", " + newY + "<br />");
}


function createCube(scene) {
    var geometry = new THREE.CubeGeometry(5,5,0);
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.x = 0;
    cube.position.y = 0;
    cube.position.z = 0;
    return cube;
}

function addLines(scene) {
    var material = new THREE.LineBasicMaterial({
        color: 0xff00ff
    });
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-200, -200, 0));
    geometry.vertices.push(new THREE.Vector3(200, 200, 0));

    var geometry2 = new THREE.Geometry();
    geometry2.vertices.push(new THREE.Vector3(-200, 200, 0));
    geometry2.vertices.push(new THREE.Vector3(200, -200, 0));

//    geometry.vertices.push(new THREE.Vector3(1, 0, 0));
    var line = new THREE.Line(geometry, material);
    var line2 = new THREE.Line(geometry2, new THREE.LineBasicMaterial({color: 0xff0000 }));
    scene.add(line);
    scene.add(line2);
}

function render() {
    requestAnimationFrame(render);
    myRenderer.renderer.render(myRenderer.scene, myRenderer.camera);
}


myRenderer.init()


var cubeMesh = createCube(myRenderer.scene)
var cube = new trackedObject(97, cubeMesh, 55)
var square = new trackedObject(6, createCube(myRenderer.scene))
myRenderer.addObject(cube)
myRenderer.addObject(square)


addLines(myRenderer.scene)

render()

