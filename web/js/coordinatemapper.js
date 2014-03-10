
var coordinateMapper = {}


coordinateMapper.rotation = new THREE.Matrix3();
coordinateMapper.intrinsic = new THREE.Matrix3();
coordinateMapper.translation = new THREE.Vector3();
coordinateMapper.enabled = false;

//};//myRenderer.coordinateMapper || {};

THREE.Matrix3.prototype.get = function(row, column) {
    return this.elements[ (row)*3 + column ]
}

THREE.Matrix3.prototype.toMatrix4 = function() {
    te = this.elements
    return new THREE.Matrix4(te[0], te[1], te[2], 0, 
                             te[3], te[4], te[5], 0,
                             te[6], te[7], te[8], 0,
                                 0,     0,     0, 0)
 }

coordinateMapper.init = function(intrinsic, rotation, translation) {
    this.intrinsic = intrinsic;
    this.rotation = rotation;
    this.translation = translation;
    this.enabled = true;
    console.log("coordinate mapper initialized");
}


coordinateMapper.pixel2mm = function(x, y, height) {
    var rotationMat, transVector, KK, invA, invRot, new_x, new_y;

    if (!this.enabled) {
        return {x: -1, y: -1};
    } else {
	    rotationMat = this.rotation;
	    transVector = this.translation;    
	    KK = this.intrinsic;

	    invA = new THREE.Matrix3().getInverse(KK.toMatrix4(), true);
	    invRot = new THREE.Matrix3().getInverse(rotationMat.toMatrix4());
	    projectionPoint = new THREE.Vector3(x,y,1);

	    projectionPoint = projectionPoint.applyMatrix3( invA );//dot.numeric(invA,projectionPoint);       
//        console.log(projectionPoint.x, projectionPoint.y, projectionPoint.z)

	    var Z = height;
	    var a = rotationMat.get(0, 0)/rotationMat.get(1, 0);
	    var b = rotationMat.get(0, 0)/rotationMat.get(2, 0);
	    var c = rotationMat.get(0, 1) - a * rotationMat.get(1, 1);
	    var d = rotationMat.get(0, 2) - a * rotationMat.get(1, 2);
	    var e = rotationMat.get(0, 1) - b * rotationMat.get(2, 1);
	    var f = rotationMat.get(0, 2) - b * rotationMat.get(2, 2);
	    var g = (d-f*c/e)*Z+(1-c/e)*transVector.x-a*transVector.y+(b*c/e)*transVector.z;
	    var h = (1-c/e)*projectionPoint.x-a*projectionPoint.y+b*c/e;
	    var zp = g/h;
	    var xp = projectionPoint.x*zp;
	    var yp = projectionPoint.y*zp;

	    projectionPoint.x = xp;
	    projectionPoint.y = yp;
	    projectionPoint.z = zp;

	    projectionPoint = projectionPoint.sub(transVector); //numeric.sub(projectionPoint,transVector);
	    projectionPoint = projectionPoint.applyMatrix3(invRot); //numeric.dot(invRot,projectionPoint);

	    new_x = projectionPoint.x;
	    new_y = projectionPoint.y;

	    return {x: new_x, y: new_y};
    }
}

//myRenderer.coordinateMapper = coordinateMapper;
//myRenderer.applyMatrices();


