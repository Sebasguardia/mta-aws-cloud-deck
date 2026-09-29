// src/components/three/StagingInstanceCanvas.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Visualizador 3D Ultra-Optimizada para Slide 13:
 * "Capa de Cómputo: Entorno de Staging Unificado (Amazon EC2 + EBS 30GB gp3)"
 *
 * Arquitectura gráfica:
 *  - Servidor Blade EC2 central: estructura isométrica con Wireframe dorado/titanio,
 *    placas de interfaz y LEDs activos de red.
 *  - Módulo EBS gp3 acoplado: Torus giratorio y base de disco con anillo de lectura/escritura (3 000 IOPS).
 *  - 10 Practicantes Orbitales (P01..P10): Nodos octaédricos brillantes con sus roles reales
 *    (Frontend, Backend, QA, DBA, DevOps, etc.) y haces de interconexión hacia el servidor.
 *  - Paquetes de datos viajeros continuos (Git Commits / HTTP tests).
 *  - Starfield cósmico inmersivo idéntico al estándar del deck (Slide 06 y Slide 12).
 *  - Cámara dinámica reactiva a los modos de enfoque y parallax suave con el mouse.
 */
export function StagingInstanceCanvas({
  isActive = true,
  isOnline = true,
  instanceType = "t3.micro",
  focusMode = "panoramic",
}) {
  const containerRef = useRef(null);
  const animFrameId = useRef(null);

  const isOnlineRef = useRef(isOnline);
  const focusModeRef = useRef(focusMode);
  const instanceTypeRef = useRef(instanceType);

  useEffect(() => {
    isOnlineRef.current = isOnline;
    focusModeRef.current = focusMode;
    instanceTypeRef.current = instanceType;
  }, [isOnline, focusMode, instanceType]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 600;
    let height = container.clientHeight || 550;

    // 1. Escena y Cámara con perspectiva cinematográfica
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.6, 9.2);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 3. Grupo Principal
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 4. Luces calibradas
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xd4a017, 3.5);
    dirLight1.position.set(6, 8, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x7a9b5c, 2.5);
    dirLight2.position.set(-6, -3, -4);
    scene.add(dirLight2);

    // ── 5. Servidor Central EC2 (Blade Rack con jaula de red y volumen) ──
    const serverGroup = new THREE.Group();
    rootGroup.add(serverGroup);

    // Chasis principal transparente/sólido
    const chassisGeo = new THREE.BoxGeometry(2.6, 0.75, 3.2);
    const chassisMat = new THREE.MeshBasicMaterial({
      color: 0x18181c,
      transparent: true,
      opacity: 0.85,
    });
    const chassisMesh = new THREE.Mesh(chassisGeo, chassisMat);
    serverGroup.add(chassisMesh);

    // Armazón wireframe perimetral de oro AWS
    const chassisWireGeo = new THREE.WireframeGeometry(chassisGeo);
    const chassisWireMat = new THREE.LineBasicMaterial({
      color: 0xd4a017,
      transparent: true,
      opacity: 0.75,
      linewidth: 1.5,
    });
    const chassisWire = new THREE.LineSegments(chassisWireGeo, chassisWireMat);
    serverGroup.add(chassisWire);

    // Bisel frontal superior dorado
    const goldBezelGeo = new THREE.BoxGeometry(2.64, 0.14, 0.1);
    const goldBezelMat = new THREE.MeshBasicMaterial({ color: 0xd4a017 });
    const goldBezel = new THREE.Mesh(goldBezelGeo, goldBezelMat);
    goldBezel.position.set(0, 0.31, 1.61);
    serverGroup.add(goldBezel);

    // Ranuras de ventilación frontales
    for (let i = 0; i < 5; i++) {
      const ventGeo = new THREE.BoxGeometry(1.5, 0.035, 0.05);
      const ventMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
      const vent = new THREE.Mesh(ventGeo, ventMat);
      vent.position.set(-0.25, -0.22 + i * 0.09, 1.61);
      serverGroup.add(vent);
    }

    // LEDs frontales de actividad y estado
    const leds = [];
    for (let i = 0; i < 8; i++) {
      const ledGeo = new THREE.SphereGeometry(0.048, 12, 12);
      const ledMat = new THREE.MeshBasicMaterial({
        color: i < 5 ? 0x7a9b5c : 0xd4a017,
      });
      const ledMesh = new THREE.Mesh(ledGeo, ledMat);
      ledMesh.position.set(0.72 + (i % 2) * 0.22, -0.15 + Math.floor(i / 2) * 0.14, 1.62);
      serverGroup.add(ledMesh);
      leds.push(ledMesh);
    }

    // ── 6. Volumen Amazon EBS gp3 de 30 GB (Disco SSD en la base) ──
    const ebsGroup = new THREE.Group();
    ebsGroup.position.set(0, -0.92, 0);
    serverGroup.add(ebsGroup);

    const ebsGeo = new THREE.CylinderGeometry(1.25, 1.25, 0.36, 32);
    const ebsMat = new THREE.MeshBasicMaterial({
      color: 0x141416,
      transparent: true,
      opacity: 0.85,
    });
    const ebsMesh = new THREE.Mesh(ebsGeo, ebsMat);
    ebsGroup.add(ebsMesh);

    const ebsWireGeo = new THREE.WireframeGeometry(ebsGeo);
    const ebsWireMat = new THREE.LineBasicMaterial({
      color: 0x7a9b5c,
      transparent: true,
      opacity: 0.8,
    });
    const ebsWire = new THREE.LineSegments(ebsWireGeo, ebsWireMat);
    ebsGroup.add(ebsWire);

    // Anillo giratorio de lectura/escritura (3 000 IOPS base)
    const ringGeo = new THREE.TorusGeometry(1.42, 0.035, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xd4a017,
      transparent: true,
      opacity: 0.9,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ebsGroup.add(ringMesh);

    // Anillo exterior esmeralda (Throughput 125 MB/s)
    const ringGeo2 = new THREE.TorusGeometry(1.56, 0.02, 16, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x7a9b5c,
      transparent: true,
      opacity: 0.65,
    });
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.x = Math.PI / 2;
    ebsGroup.add(ringMesh2);

    // Bus de interconexión PCI-e / canal NVMe
    const busGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.45, 16);
    const busMat = new THREE.MeshBasicMaterial({ color: 0xd4a017 });
    const busMesh = new THREE.Mesh(busGeo, busMat);
    busMesh.position.set(0, -0.48, 0);
    serverGroup.add(busMesh);

    // ── 7. 10 Practicantes Orbitales (Terminales P01 - P10) ──
    const internsGroup = new THREE.Group();
    rootGroup.add(internsGroup);

    const internRoles = [
      { id: "P01", name: "P01 Frontend (React)", color: 0x61dafb },
      { id: "P02", name: "P02 Frontend (Next.js)", color: 0x61dafb },
      { id: "P03", name: "P03 Fullstack (TS)", color: 0x3178c6 },
      { id: "P04", name: "P04 Backend (Node.js)", color: 0x7a9b5c },
      { id: "P05", name: "P05 Backend (APIs REST)", color: 0x7a9b5c },
      { id: "P06", name: "P06 UI/UX & Assets", color: 0xe8a0bf },
      { id: "P07", name: "P07 QA Engineer (Jest)", color: 0xd4a017 },
      { id: "P08", name: "P08 Database Admin", color: 0x336791 },
      { id: "P09", name: "P09 DevOps Junior (Git)", color: 0xf05032 },
      { id: "P10", name: "P10 Cloud Operator", color: 0xd4a017 },
    ];

    const internNodes = [];
    const internCount = 10;

    for (let i = 0; i < internCount; i++) {
      const angle = (i / internCount) * Math.PI * 2;
      const radius = 3.9 + (i % 2 === 0 ? 0.35 : -0.25);
      const yBase = Math.sin(angle * 2) * 0.75;

      const internObj = new THREE.Group();
      internObj.position.set(Math.cos(angle) * radius, yBase, Math.sin(angle) * radius);
      internsGroup.add(internObj);

      // Terminal octaédrica facetada
      const nodeGeo = new THREE.OctahedronGeometry(0.20, 0);
      const nodeMat = new THREE.MeshBasicMaterial({
        color: internRoles[i].color,
        wireframe: false,
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      internObj.add(nodeMesh);

      // Wireframe alrededor del nodo
      const nodeWireGeo = new THREE.WireframeGeometry(nodeGeo);
      const nodeWireMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.85,
      });
      const nodeWire = new THREE.LineSegments(nodeWireGeo, nodeWireMat);
      internObj.add(nodeWire);

      // Aro orbital
      const nodeRingGeo = new THREE.TorusGeometry(0.30, 0.015, 8, 24);
      const nodeRingMat = new THREE.MeshBasicMaterial({
        color: internRoles[i].color,
        transparent: true,
        opacity: 0.5,
      });
      const nodeRing = new THREE.Mesh(nodeRingGeo, nodeRingMat);
      nodeRing.rotation.x = Math.PI / 3;
      internObj.add(nodeRing);

      // Rayo de red hacia el servidor central
      const linePositions = new Float32Array([
        internObj.position.x, internObj.position.y, internObj.position.z,
        0, 0, 0,
      ]);
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
      const lineMat = new THREE.LineBasicMaterial({
        color: internRoles[i].color,
        transparent: true,
        opacity: 0.45,
      });
      const beamLine = new THREE.Line(lineGeo, lineMat);
      internsGroup.add(beamLine);

      // Paquete de datos viajero (Commit Git / Test request)
      const packetGeo = new THREE.SphereGeometry(0.075, 12, 12);
      const packetMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const packetMesh = new THREE.Mesh(packetGeo, packetMat);
      internsGroup.add(packetMesh);

      internNodes.push({
        group: internObj,
        mesh: nodeMesh,
        ring: nodeRing,
        beam: beamLine,
        packet: packetMesh,
        role: internRoles[i],
        baseAngle: angle,
        radius,
        yBase,
        progress: (i / internCount),
      });
    }

    // ── 8. Campo Estelar Cósmico (380 estrellas) ──
    const starCount = 380;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starCol = new Float32Array(starCount * 3);

    const cGold = new THREE.Color(0xd4a017);
    const cEmerald = new THREE.Color(0x7a9b5c);
    const cWhite = new THREE.Color(0xf5f1e8);

    for (let i = 0; i < starCount; i++) {
      const r = 4.5 + Math.random() * 8.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);

      const colChoice = Math.random() > 0.6 ? cGold : (Math.random() > 0.3 ? cWhite : cEmerald);
      starCol[i * 3] = colChoice.r;
      starCol[i * 3 + 1] = colChoice.g;
      starCol[i * 3 + 2] = colChoice.b;
    }

    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starCol, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // ── 9. Parallax con mouse ──
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / height) * 2 - 1);
      targetX = x * 0.45;
      targetY = y * 0.35;
    };
    container.addEventListener("mousemove", onMouseMove, { passive: true });

    // ── 10. Loop de Animación Continuo ──
    const clock = new THREE.Clock();
    let isRunning = true;

    const camTargets = {
      panoramic: { pos: new THREE.Vector3(0, 1.6, 9.2), lookAt: new THREE.Vector3(0, 0, 0) },
      server: { pos: new THREE.Vector3(0, 0.8, 5.2), lookAt: new THREE.Vector3(0, 0, 0) },
      ebs: { pos: new THREE.Vector3(0, -0.6, 4.4), lookAt: new THREE.Vector3(0, -0.85, 0) },
      interns: { pos: new THREE.Vector3(2.5, 2.2, 6.5), lookAt: new THREE.Vector3(1.2, 0, 0) },
    };

    const curCamLookAt = new THREE.Vector3(0, 0, 0);

    const animate = () => {
      if (!isRunning) return;
      animFrameId.current = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();
      const online = isOnlineRef.current;
      const fMode = focusModeRef.current;

      // Parallax suavizado
      mouseX += (targetX - mouseX) * 0.06;
      mouseY += (targetY - mouseY) * 0.06;

      // Rotación y flotación física del servidor
      if (online) {
        serverGroup.rotation.y = Math.sin(elapsed * 0.4) * 0.3 + mouseX * 0.6;
        serverGroup.rotation.x = 0.22 - mouseY * 0.5 + Math.sin(elapsed * 0.8) * 0.03;
        serverGroup.position.y = Math.sin(elapsed * 1.6) * 0.08;

        // Giro acelerado del anillo IOPS de EBS (3 000 IOPS)
        ringMesh.rotation.z = elapsed * 3.2;
        ringMesh2.rotation.z = -elapsed * 2.0;

        // Parpadeo sincronizado de los LEDs frontales
        leds.forEach((led, idx) => {
          const blink = 0.35 + Math.sin(elapsed * 10 + idx * 1.5) * 0.65;
          led.material.opacity = blink;
          led.scale.setScalar(0.9 + blink * 0.25);
        });

        // Giro armónico de los 10 practicantes y envío de paquetes hacia el Staging Server
        internNodes.forEach((node, idx) => {
          const currentAngle = node.baseAngle + elapsed * 0.22;
          node.group.position.x = Math.cos(currentAngle) * node.radius;
          node.group.position.z = Math.sin(currentAngle) * node.radius;
          node.group.position.y = node.yBase + Math.sin(elapsed * 2 + idx) * 0.18;

          node.mesh.rotation.y = elapsed * 1.8;
          node.mesh.rotation.x = elapsed * 1.2;
          node.ring.rotation.z = elapsed * 2.5;

          // Actualizar rayo de red
          const lineArr = node.beam.geometry.attributes.position.array;
          lineArr[0] = node.group.position.x;
          lineArr[1] = node.group.position.y;
          lineArr[2] = node.group.position.z;
          lineArr[3] = serverGroup.position.x;
          lineArr[4] = serverGroup.position.y;
          lineArr[5] = serverGroup.position.z;
          node.beam.geometry.attributes.position.needsUpdate = true;
          node.beam.material.opacity = 0.25 + Math.sin(elapsed * 4 + idx * 0.8) * 0.2;

          // Paquete de datos viajero
          node.progress = (node.progress + 0.008) % 1.0;
          node.packet.position.lerpVectors(node.group.position, serverGroup.position, node.progress);
          const pPulse = 0.8 + Math.sin(elapsed * 12 + idx) * 0.3;
          node.packet.scale.setScalar(pPulse);
        });

        // Giro del campo estelar
        starPoints.rotation.y = elapsed * 0.03;
      } else {
        // Modo OFFLINE / SERVIDOR APAGADO
        serverGroup.rotation.y = mouseX * 0.4;
        serverGroup.rotation.x = 0.22 - mouseY * 0.3;
        serverGroup.position.y = 0;
        ringMesh.rotation.z = 0;
        ringMesh2.rotation.z = 0;
        leds.forEach((led) => {
          led.material.opacity = 0.15;
          led.scale.setScalar(0.8);
        });
        internNodes.forEach((node) => {
          node.beam.material.opacity = 0.08;
          node.packet.scale.setScalar(0);
        });
      }

      // Cámara suave interpolada según focusMode
      const targetCam = camTargets[fMode] || camTargets.panoramic;
      camera.position.lerp(targetCam.pos, 0.06);
      curCamLookAt.lerp(targetCam.lookAt, 0.06);
      camera.lookAt(curCamLookAt);

      renderer.render(scene, camera);
    };

    animate();

    // ── 11. Resize Observer ──
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          width = w;
          height = h;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animFrameId.current);
      resizeObserver.disconnect();
      container.removeEventListener("mousemove", onMouseMove);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        cursor: "grab",
        userSelect: "none",
        overflow: "hidden",
      }}
    />
  );
}

export default StagingInstanceCanvas;
