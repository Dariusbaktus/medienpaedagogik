/**
 * Rennstrecke - Track Generator (Binary Tree Track Network)
 * Generates smooth 3D road meshes, curbs, signs, and target items for 2^N branch levels.
 */

class TrackGenerator {
  constructor(scene) {
    this.scene = scene;
    this.trackGroup = new THREE.Group();
    this.scene.add(this.trackGroup);
    
    this.roadWidth = 6.0;
    this.curbWidth = 0.5;
    
    // Target items definition
    this.targetDefinitions = [
      { id: 'carrot', name: 'Goldene Möhre', icon: '🥕', color: 0xff9900, secondary: 0x33cc33 },
      { id: 'trophy', name: 'Siegerpokal', icon: '🏆', color: 0xffd700, secondary: 0xcc9900 },
      { id: 'apple', name: 'Roter Apfel', icon: '🍎', color: 0xff2233, secondary: 0x22aa22 },
      { id: 'bone', name: 'Leckerer Knochen', icon: '🦴', color: 0xf5f5dc, secondary: 0xddddcb },
      { id: 'fish', name: 'Glitzer-Fisch', icon: '🐟', color: 0x3399ff, secondary: 0x0066cc },
      { id: 'star', name: 'Super-Stern', icon: '⭐', color: 0xffea00, secondary: 0xffaa00 },
      { id: 'cheese', name: 'Käsestück', icon: '🧀', color: 0xffbb00, secondary: 0xee9900 },
      { id: 'crown', name: 'Königskrone', icon: '👑', color: 0xffaa00, secondary: 0xff3366 }
    ];

    this.nodes = [];
    this.leafTargets = [];
    this.paths = {};
  }

  clear() {
    while (this.trackGroup.children.length > 0) {
      const obj = this.trackGroup.children[0];
      this.trackGroup.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
    }
    this.nodes = [];
    this.leafTargets = [];
    this.paths = {};
  }

  buildTrack(depth = 2) {
    this.clear();
    this.depth = depth;

    // Build the mathematical binary tree structure
    const root = {
      id: 'root',
      path: '',
      depth: 0,
      start: new THREE.Vector3(0, 0, 0),
      end: new THREE.Vector3(0, 0, 25),
      tangent: new THREE.Vector3(0, 0, 1),
      children: []
    };

    this.nodes.push(root);
    this._buildTreeRecursive(root, depth);

    // Render road segments & decorations
    this._renderNodeSegment(root);
    this._createDecorations();

    return {
      targets: this.leafTargets,
      paths: this.paths
    };
  }

  _buildTreeRecursive(node, maxDepth) {
    if (node.depth >= maxDepth) {
      // Leaf node: Add target goal
      const targetIndex = this.leafTargets.length % this.targetDefinitions.length;
      const targetDef = this.targetDefinitions[targetIndex];
      const leafInfo = {
        ...targetDef,
        path: node.path,
        position: node.end.clone().add(new THREE.Vector3(0, 0, 5)),
        node: node
      };
      this.leafTargets.push(leafInfo);
      this._createGoalArea(leafInfo);
      return;
    }

    const currentDepth = node.depth;
    let branchLength, lateralSpread;

    if (maxDepth === 1) {
      branchLength = 34;
      lateralSpread = 20;
    } else if (maxDepth === 2) {
      branchLength = 28 - currentDepth * 3;
      lateralSpread = (currentDepth === 0) ? 22 : 13;
    } else {
      // Level 3 (8 branches) - balanced spread for perfect visibility
      branchLength = 25 - currentDepth * 2.5;
      if (currentDepth === 0) lateralSpread = 22;
      else if (currentDepth === 1) lateralSpread = 13;
      else lateralSpread = 7.5;
    }

    const leftEnd = new THREE.Vector3(
      node.end.x + lateralSpread,
      0,
      node.end.z + branchLength
    );

    const rightEnd = new THREE.Vector3(
      node.end.x - lateralSpread,
      0,
      node.end.z + branchLength
    );

    const leftChild = {
      id: node.path + 'L',
      path: node.path + 'L',
      choice: 'L',
      depth: currentDepth + 1,
      start: node.end.clone(),
      end: leftEnd,
      control1: new THREE.Vector3(node.end.x + lateralSpread * 0.1, 0, node.end.z + branchLength * 0.4),
      control2: new THREE.Vector3(node.end.x + lateralSpread * 0.9, 0, node.end.z + branchLength * 0.6),
      children: []
    };

    const rightChild = {
      id: node.path + 'R',
      path: node.path + 'R',
      choice: 'R',
      depth: currentDepth + 1,
      start: node.end.clone(),
      end: rightEnd,
      control1: new THREE.Vector3(node.end.x - lateralSpread * 0.1, 0, node.end.z + branchLength * 0.4),
      control2: new THREE.Vector3(node.end.x - lateralSpread * 0.9, 0, node.end.z + branchLength * 0.6),
      children: []
    };

    node.children = [leftChild, rightChild];
    this.nodes.push(leftChild, rightChild);

    this._buildTreeRecursive(leftChild, maxDepth);
    this._buildTreeRecursive(rightChild, maxDepth);
  }

  _renderNodeSegment(node) {
    if (node.id === 'root') {
      const curve = new THREE.LineCurve3(node.start, node.end);
      this._createRoadRibbon(curve, 10, true, node.path);
      this._createStartBanner(node.start);
    }

    if (node.children && node.children.length > 0) {
      this._createForkSign(node);

      node.children.forEach(child => {
        const curve = new THREE.CubicBezierCurve3(
          child.start,
          child.control1,
          child.control2,
          child.end
        );
        this._createRoadRibbon(curve, 24, false, child.path);
        this._renderNodeSegment(child);
      });
    }
  }

  _createRoadRibbon(curve, segments = 20, isStart = false, pathKey = '') {
    const points = curve.getPoints(segments);
    
    if (pathKey) {
      this.paths[pathKey] = points;
    } else {
      this.paths['root'] = points;
    }

    const roadGeo = new THREE.BufferGeometry();
    const curbLeftGeo = new THREE.BufferGeometry();
    const curbRightGeo = new THREE.BufferGeometry();

    const roadVertices = [];
    const curbLVertices = [];
    const curbRVertices = [];

    const halfW = this.roadWidth / 2;

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const tangent = (i < points.length - 1) 
        ? points[i + 1].clone().sub(p).normalize()
        : p.clone().sub(points[i - 1]).normalize();
      
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      const leftEdge = p.clone().addScaledVector(normal, -halfW);
      const rightEdge = p.clone().addScaledVector(normal, halfW);

      const curbLOuter = p.clone().addScaledVector(normal, -halfW - this.curbWidth);
      const curbROuter = p.clone().addScaledVector(normal, halfW + this.curbWidth);

      // Road plane
      roadVertices.push(leftEdge.x, 0.05, leftEdge.z);
      roadVertices.push(rightEdge.x, 0.05, rightEdge.z);

      // Curbs
      curbLVertices.push(curbLOuter.x, 0.12, curbLOuter.z);
      curbLVertices.push(leftEdge.x, 0.12, leftEdge.z);

      curbRVertices.push(rightEdge.x, 0.12, rightEdge.z);
      curbRVertices.push(curbROuter.x, 0.12, curbROuter.z);
    }

    const indices = [];
    for (let i = 0; i < points.length - 1; i++) {
      const a = i * 2;
      const b = i * 2 + 1;
      const c = (i + 1) * 2;
      const d = (i + 1) * 2 + 1;
      indices.push(a, b, c, b, d, c);
    }

    roadGeo.setAttribute('position', new THREE.Float32BufferAttribute(roadVertices, 3));
    roadGeo.setIndex(indices);
    roadGeo.computeVertexNormals();
    const roadMat = new THREE.MeshLambertMaterial({ color: 0x333742, side: THREE.DoubleSide });
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    this.trackGroup.add(roadMesh);

    curbLeftGeo.setAttribute('position', new THREE.Float32BufferAttribute(curbLVertices, 3));
    curbLeftGeo.setIndex(indices);
    curbLeftGeo.computeVertexNormals();
    const curbLMat = new THREE.MeshLambertMaterial({ color: 0xe63946, side: THREE.DoubleSide });
    this.trackGroup.add(new THREE.Mesh(curbLeftGeo, curbLMat));

    curbRightGeo.setAttribute('position', new THREE.Float32BufferAttribute(curbRVertices, 3));
    curbRightGeo.setIndex(indices);
    curbRightGeo.computeVertexNormals();
    const curbRMat = new THREE.MeshLambertMaterial({ color: 0xf1faee, side: THREE.DoubleSide });
    this.trackGroup.add(new THREE.Mesh(curbRightGeo, curbRMat));
  }

  _createStartBanner(pos) {
    const group = new THREE.Group();
    group.position.copy(pos).add(new THREE.Vector3(0, 0, 2));

    const postGeo = new THREE.CylinderGeometry(0.2, 0.2, 5, 8);
    const postMat = new THREE.MeshLambertMaterial({ color: 0x457b9d });
    
    const postL = new THREE.Mesh(postGeo, postMat);
    postL.position.set(-this.roadWidth / 2 - 0.8, 2.5, 0);
    const postR = new THREE.Mesh(postGeo, postMat);
    postR.position.set(this.roadWidth / 2 + 0.8, 2.5, 0);
    group.add(postL, postR);

    const bannerGeo = new THREE.BoxGeometry(this.roadWidth + 2, 1.2, 0.3);
    const bannerMat = new THREE.MeshLambertMaterial({ color: 0x2a9d8f });
    const banner = new THREE.Mesh(bannerGeo, bannerMat);
    banner.position.set(0, 4.5, 0);
    group.add(banner);

    const lineGeo = new THREE.PlaneGeometry(this.roadWidth, 1.5);
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const line = new THREE.Mesh(lineGeo, lineMat);
    line.rotation.x = -Math.PI / 2;
    line.position.set(0, 0.08, 0);
    group.add(line);

    this.trackGroup.add(group);
  }

  _createTextTexture(text, bgColor = '#1d3557', textColor = '#ffffff', width = 256, height = 128) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    
    // Border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, width - 6, height - 6);

    // Text
    ctx.fillStyle = textColor;
    ctx.font = 'bold 34px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  _createForkSign(node) {
    const forkPos = node.end.clone();
    const group = new THREE.Group();
    group.position.copy(forkPos);

    const islandGeo = new THREE.CylinderGeometry(0.8, 1.2, 0.4, 8);
    const islandMat = new THREE.MeshLambertMaterial({ color: 0xffb703 });
    const island = new THREE.Mesh(islandGeo, islandMat);
    island.position.set(0, 0.2, 1);
    group.add(island);

    const postGeo = new THREE.CylinderGeometry(0.15, 0.15, 3.5, 8);
    const postMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const post = new THREE.Mesh(postGeo, postMat);
    post.position.set(0, 1.75, 1);
    group.add(post);

    // Backing board
    const backGeo = new THREE.BoxGeometry(5.2, 1.3, 0.15);
    const backMat = new THREE.MeshLambertMaterial({ color: 0x1d3557 });
    const backMesh = new THREE.Mesh(backGeo, backMat);
    backMesh.position.set(0, 3.2, 0.98);
    group.add(backMesh);

    // Left sign (Blue, points Left) -> placed on +X (Left on screen)
    const texL = this._createTextTexture('⬅️ LINKS', '#3a86ff', '#ffffff', 256, 128);
    const signLMat = new THREE.MeshBasicMaterial({ map: texL, side: THREE.DoubleSide });
    const signLGeo = new THREE.PlaneGeometry(2.3, 1.15);
    const signL = new THREE.Mesh(signLGeo, signLMat);
    signL.position.set(1.25, 3.2, 1.08);
    group.add(signL);

    // Right sign (Red, points Right) -> placed on -X (Right on screen)
    const texR = this._createTextTexture('RECHTS ➡️', '#e63946', '#ffffff', 256, 128);
    const signRMat = new THREE.MeshBasicMaterial({ map: texR, side: THREE.DoubleSide });
    const signRGeo = new THREE.PlaneGeometry(2.3, 1.15);
    const signR = new THREE.Mesh(signRGeo, signRMat);
    signR.position.set(-1.25, 3.2, 1.08);
    group.add(signR);

    this.trackGroup.add(group);
  }

  _createGoalArea(leaf) {
    const group = new THREE.Group();
    group.position.copy(leaf.position);

    const padGeo = new THREE.CylinderGeometry(3.5, 3.8, 0.4, 16);
    const padMat = new THREE.MeshLambertMaterial({ color: leaf.color });
    const pad = new THREE.Mesh(padGeo, padMat);
    pad.position.y = 0.2;
    group.add(pad);

    const ringGeo = new THREE.TorusGeometry(3.6, 0.2, 8, 24);
    const ringMat = new THREE.MeshLambertMaterial({ color: 0xffd700 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.4;
    group.add(ring);

    // Floating Goal Label
    const labelTex = this._createTextTexture(`${leaf.icon} ${leaf.name} (${leaf.path})`, '#1d3557', '#ffd700', 384, 96);
    const labelMat = new THREE.MeshBasicMaterial({ map: labelTex, side: THREE.DoubleSide });
    const labelGeo = new THREE.PlaneGeometry(4.2, 1.05);
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.position.set(0, 4.8, 0);
    group.add(labelMesh);

    const itemGroup = new THREE.Group();
    itemGroup.position.set(0, 2.5, 0);
    itemGroup.userData = { isTargetItem: true, spinSpeed: 0.03, floatOffset: Math.random() * Math.PI };

    if (leaf.id === 'carrot') {
      const coneGeo = new THREE.ConeGeometry(0.8, 2.2, 10);
      const coneMat = new THREE.MeshLambertMaterial({ color: 0xff7700 });
      const carrot = new THREE.Mesh(coneGeo, coneMat);
      carrot.rotation.x = Math.PI;
      itemGroup.add(carrot);

      const leafGeo = new THREE.CylinderGeometry(0.1, 0.3, 0.8, 6);
      const leafMat = new THREE.MeshLambertMaterial({ color: 0x38b000 });
      const greens = new THREE.Mesh(leafGeo, leafMat);
      greens.position.y = 1.2;
      itemGroup.add(greens);
    } else if (leaf.id === 'trophy') {
      const cupGeo = new THREE.CylinderGeometry(1.0, 0.4, 1.6, 12, 1, true);
      const cupMat = new THREE.MeshLambertMaterial({ color: 0xffd700 });
      const cup = new THREE.Mesh(cupGeo, cupMat);
      const baseGeo = new THREE.BoxGeometry(1.2, 0.4, 1.2);
      const baseMat = new THREE.MeshLambertMaterial({ color: 0x664400 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = -1.0;
      itemGroup.add(cup, base);
    } else if (leaf.id === 'star') {
      const starGeo = new THREE.DodecahedronGeometry(1.2);
      const starMat = new THREE.MeshLambertMaterial({ color: 0xffe600 });
      const star = new THREE.Mesh(starGeo, starMat);
      itemGroup.add(star);
    } else {
      const orbGeo = new THREE.SphereGeometry(1.2, 12, 12);
      const orbMat = new THREE.MeshLambertMaterial({ color: leaf.color });
      const orb = new THREE.Mesh(orbGeo, orbMat);
      itemGroup.add(orb);
    }

    group.add(itemGroup);
    this.trackGroup.add(group);
  }

  _createDecorations() {
    const groundGeo = new THREE.PlaneGeometry(300, 300);
    const groundMat = new THREE.MeshLambertMaterial({ color: 0x70b247 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -0.01, 60);
    this.trackGroup.add(ground);

    const treeGeo = new THREE.ConeGeometry(1.5, 3.5, 6);
    const treeMat = new THREE.MeshLambertMaterial({ color: 0x2d6a4f });
    const trunkGeo = new THREE.CylinderGeometry(0.3, 0.4, 1.5, 6);
    const trunkMat = new THREE.MeshLambertMaterial({ color: 0x582f0e });

    for (let i = 0; i < 35; i++) {
      const treeGroup = new THREE.Group();
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 0.75;
      const foliage = new THREE.Mesh(treeGeo, treeMat);
      foliage.position.y = 2.8;
      treeGroup.add(trunk, foliage);

      const x = (Math.random() - 0.5) * 120;
      const z = Math.random() * 110 - 10;
      if (Math.abs(x) > 10) {
        treeGroup.position.set(x, 0, z);
        const scale = 0.8 + Math.random() * 0.6;
        treeGroup.scale.set(scale, scale, scale);
        this.trackGroup.add(treeGroup);
      }
    }
  }
}
