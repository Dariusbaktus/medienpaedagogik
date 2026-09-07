/**
 * Rennstrecke - Kart & Animal Driver
 * Low-poly 3D Kart with procedural animal character and smooth path follower physics.
 */

class KartVehicle {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.wheels = [];
    this.ears = [];
    
    this._buildModel();
    this.scene.add(this.group);

    this.reset();
  }

  reset() {
    this.group.position.set(0, 0, 0);
    this.group.rotation.set(0, 0, 0);
    this.speed = 0;
    this.maxSpeed = 16.0;
    this.currentWaypointIndex = 0;
    this.activeWaypoints = [];
    this.isDriving = false;
    this.isFinished = false;
    this.onFinishCallback = null;
    this.currentPathDecision = '';
    this.time = 0;
  }

  _buildModel() {
    // 1. Kart Chassis
    const chassisGeo = new THREE.BoxGeometry(2.0, 0.6, 3.2);
    const chassisMat = new THREE.MeshLambertMaterial({ color: 0xe63946 }); // Racing Red
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    chassis.position.y = 0.6;
    chassis.castShadow = true;
    this.group.add(chassis);

    // Front Bumper / Nose
    const noseGeo = new THREE.BoxGeometry(1.8, 0.4, 1.0);
    const noseMat = new THREE.MeshLambertMaterial({ color: 0x1d3557 });
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.position.set(0, 0.5, 1.8);
    this.group.add(nose);

    // Rear Spoiler
    const spoilerWingGeo = new THREE.BoxGeometry(2.4, 0.15, 0.6);
    const spoilerMat = new THREE.MeshLambertMaterial({ color: 0xffb703 });
    const spoiler = new THREE.Mesh(spoilerWingGeo, spoilerMat);
    spoiler.position.set(0, 1.4, -1.5);

    const postLGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.8);
    const postMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const postL = new THREE.Mesh(postLGeo, postMat);
    postL.position.set(-0.8, 1.0, -1.5);
    const postR = new THREE.Mesh(postLGeo, postMat);
    postR.position.set(0.8, 1.0, -1.5);
    this.group.add(spoiler, postL, postR);

    // Exhaust Pipes
    const pipeGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.5, 8);
    const pipeMat = new THREE.MeshLambertMaterial({ color: 0x888888 });
    const pipeL = new THREE.Mesh(pipeGeo, pipeMat);
    pipeL.rotation.x = Math.PI / 2;
    pipeL.position.set(-0.5, 0.4, -1.8);
    const pipeR = new THREE.Mesh(pipeGeo, pipeMat);
    pipeR.rotation.x = Math.PI / 2;
    pipeR.position.set(0.5, 0.4, -1.8);
    this.group.add(pipeL, pipeR);

    // 4 Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.4, 12);
    const wheelMat = new THREE.MeshLambertMaterial({ color: 0x222222 });
    const rimMat = new THREE.MeshLambertMaterial({ color: 0xf1faee });

    const wheelPositions = [
      { x: -1.15, y: 0.45, z: 1.1 },
      { x: 1.15, y: 0.45, z: 1.1 },
      { x: -1.15, y: 0.45, z: -1.1 },
      { x: 1.15, y: 0.45, z: -1.1 }
    ];

    wheelPositions.forEach(pos => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(pos.x, pos.y, pos.z);

      const tire = new THREE.Mesh(wheelGeo, wheelMat);
      tire.rotation.z = Math.PI / 2;
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.42, 8), rimMat);
      rim.rotation.z = Math.PI / 2;

      wheelGroup.add(tire, rim);
      this.group.add(wheelGroup);
      this.wheels.push(wheelGroup);
    });

    // 2. Animal Driver (Cute Bunny / Puppy)
    const driverGroup = new THREE.Group();
    driverGroup.position.set(0, 0.9, -0.1);

    // Head
    const headGeo = new THREE.SphereGeometry(0.55, 12, 12);
    const headMat = new THREE.MeshLambertMaterial({ color: 0xeddcd2 }); // Warm fur
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 0.5;
    driverGroup.add(head);

    // Racing Helmet
    const helmetGeo = new THREE.SphereGeometry(0.58, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.6);
    const helmetMat = new THREE.MeshLambertMaterial({ color: 0x457b9d, side: THREE.DoubleSide });
    const helmet = new THREE.Mesh(helmetGeo, helmetMat);
    helmet.position.y = 0.52;
    driverGroup.add(helmet);

    // Goggles
    const goggleGeo = new THREE.TorusGeometry(0.18, 0.05, 8, 12);
    const goggleMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
    const goggleL = new THREE.Mesh(goggleGeo, goggleMat);
    goggleL.position.set(-0.2, 0.55, 0.5);
    const goggleR = new THREE.Mesh(goggleGeo, goggleMat);
    goggleR.position.set(0.2, 0.55, 0.5);
    driverGroup.add(goggleL, goggleR);

    // Ears (Floppy / Animated)
    const earGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.6, 8);
    const earMat = new THREE.MeshLambertMaterial({ color: 0xddb892 });
    
    const earL = new THREE.Mesh(earGeo, earMat);
    earL.position.set(-0.35, 1.0, -0.1);
    earL.rotation.z = -0.3;
    const earR = new THREE.Mesh(earGeo, earMat);
    earR.position.set(0.35, 1.0, -0.1);
    earR.rotation.z = 0.3;

    driverGroup.add(earL, earR);
    this.ears.push(earL, earR);

    // Steering wheel
    const steerGeo = new THREE.TorusGeometry(0.3, 0.05, 8, 16);
    const steerMat = new THREE.MeshLambertMaterial({ color: 0x2b2d42 });
    const steer = new THREE.Mesh(steerGeo, steerMat);
    steer.rotation.x = 0.4;
    steer.position.set(0, 0.35, 0.7);
    driverGroup.add(steer);

    this.group.add(driverGroup);
  }

  setWaypoints(waypointList, onFinish) {
    this.activeWaypoints = waypointList;
    this.currentWaypointIndex = 0;
    this.onFinishCallback = onFinish;
    this.isDriving = true;
    this.isFinished = false;

    if (waypointList.length > 0) {
      this.group.position.copy(waypointList[0]);
    }
  }

  update(delta) {
    this.time += delta;

    if (!this.isDriving || this.activeWaypoints.length === 0) {
      if (this.isFinished) {
        // Victory hop & ear wiggle
        this.group.position.y = Math.abs(Math.sin(this.time * 8)) * 0.8;
        this.ears[0].rotation.z = -0.3 + Math.sin(this.time * 12) * 0.3;
        this.ears[1].rotation.z = 0.3 - Math.sin(this.time * 12) * 0.3;
      }
      return;
    }

    // Engine slight vibration
    this.group.position.y = Math.sin(this.time * 25) * 0.03;

    // Follow waypoints
    const targetPoint = this.activeWaypoints[this.currentWaypointIndex];
    if (!targetPoint) {
      this._finishDrive();
      return;
    }

    const currentPos = this.group.position.clone();
    currentPos.y = 0; // 2D flat movement
    const target2D = targetPoint.clone();
    target2D.y = 0;

    const distance = currentPos.distanceTo(target2D);
    const step = this.maxSpeed * delta;

    if (distance <= step * 1.5) {
      // Advance to next waypoint
      this.currentWaypointIndex++;
      if (this.currentWaypointIndex >= this.activeWaypoints.length) {
        this._finishDrive();
        return;
      }
    } else {
      // Move towards target point
      const dir = target2D.clone().sub(currentPos).normalize();
      this.group.position.addScaledVector(dir, step);

      // Smooth rotation towards travel direction
      const angle = Math.atan2(dir.x, dir.z);
      // Interpolate heading
      let diff = angle - this.group.rotation.y;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.group.rotation.y += diff * 12 * delta;

      // Wheel spin
      this.wheels.forEach(w => {
        w.children[0].rotation.x += this.maxSpeed * delta * 2.5;
      });

      // Ear wind flap
      this.ears[0].rotation.x = -0.2 + Math.sin(this.time * 15) * 0.15;
      this.ears[1].rotation.x = -0.2 + Math.sin(this.time * 15 + 1) * 0.15;
    }
  }

  _finishDrive() {
    this.isDriving = false;
    this.isFinished = true;
    if (this.onFinishCallback) {
      this.onFinishCallback();
    }
  }
}
