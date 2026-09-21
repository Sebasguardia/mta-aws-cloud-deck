// src/components/three/TeamTopologyCanvas.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Visualizador 3D Interactivo para Slide 04: Topología de Equipo 100% Remoto.
 *
 * Simboliza la red distribuida de ingeniería ágil de MTA:
 *  - 1 Nodo Central (Jefe de Desarrollo / Lead Architect): Icosaedro dorado pulsante con halo.
 *  - 10 Nodos Periféricos (Practicantes de ingeniería distribuidos): Esferas tácticas que orbitan en constelación.
 *  - Aristas dinámicas (Líneas de conexión de datos): Red de colaboración que se actualiza en cada frame.
 *  - Partículas de código / telemetry en tránsito continuo entre nodos.
 *
 * Interacción:
 *  - Raycasting / Mouse move para parallax 3D y orientación de la red.
 *  - Hover highlight si el mouse se aproxima a nodos periféricos.
 *  - Pausa de bucle de animación si isActive es false (0 consumo GPU de fondo).
 */
export function TeamTopologyCanvas({ isActive = true, selectedNode = null, onSelectNode = null }) {
  const containerRef = useRef(null);
  const animFrameId = useRef(null);
  const sceneState = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // 3. Grupo Principal
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 4. Nodo Central (Jefe de Desarrollo / Lead)
    const centerGeo = new THREE.IcosahedronGeometry(0.55, 1);
    const centerWireGeo = new THREE.WireframeGeometry(centerGeo);
    const centerMat = new THREE.LineBasicMaterial({
      color: 0xd4a017, // Gold accent
      linewidth: 2,
    });
    const centerMesh = new THREE.LineSegments(centerWireGeo, centerMat);
    mainGroup.add(centerMesh);

    // Halo interior central
    const innerCoreGeo = new THREE.SphereGeometry(0.28, 16, 16);
    const innerCoreMat = new THREE.MeshBasicMaterial({
      color: 0xd4a017,
      wireframe: true,
    });
    const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    mainGroup.add(innerCore);

    // 5. 10 Nodos Periféricos (Practicantes de ingeniería distribuidos)
    const NODES_COUNT = 10;
    const nodeMeshes = [];
    const baseRadius = 3.2;
    const nodePositions = [];

    const nodeGeo = new THREE.OctahedronGeometry(0.24, 0);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: 0x4a5d3a, // Olive industrial
      wireframe: true,
    });

    for (let i = 0; i < NODES_COUNT; i++) {
      const angle = (i / NODES_COUNT) * Math.PI * 2;
      const elevation = Math.sin(i * 1.7) * 0.9;
      const x = Math.cos(angle) * baseRadius;
      const y = elevation;
      const z = Math.sin(angle) * (baseRadius * 0.85);

      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat.clone());
      nodeMesh.position.set(x, y, z);
      nodeMesh.userData = { id: i, angle, elevation, baseRadius };
      mainGroup.add(nodeMesh);
      nodeMeshes.push(nodeMesh);
      nodePositions.push(new THREE.Vector3(x, y, z));
    }

    // 6. Aristas de conexión (Líneas entre Nodo Central y los 10 nodos)
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xf5f1e8,
      transparent: true,
      opacity: 0.22,
    });

    const linesGroup = new THREE.Group();
    mainGroup.add(linesGroup);

    const lineObjects = [];
    for (let i = 0; i < NODES_COUNT; i++) {
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        nodePositions[i],
      ]);
      const line = new THREE.Line(lineGeo, lineMat);
      linesGroup.add(line);
      lineObjects.push(line);
    }

    // Interconexiones entre nodos contiguos (mesh / red mallada)
    const ringLinePoints = [];
    for (let i = 0; i <= NODES_COUNT; i++) {
      ringLinePoints.push(nodePositions[i % NODES_COUNT]);
    }
    const ringLineGeo = new THREE.BufferGeometry().setFromPoints(ringLinePoints);
    const ringLineMat = new THREE.LineBasicMaterial({
      color: 0x4a5d3a,
      transparent: true,
      opacity: 0.18,
    });
    const ringLine = new THREE.Line(ringLineGeo, ringLineMat);
    mainGroup.add(ringLine);

    // 7. Paquetes de datos flotantes (Data Stream)
    const dataCount = 40;
    const dataGeo = new THREE.BufferGeometry();
    const dataPos = new Float32Array(dataCount * 3);
    const dataOffsets = [];

    for (let i = 0; i < dataCount; i++) {
      dataOffsets.push({
        targetNode: i % NODES_COUNT,
        progress: Math.random(),
        speed: 0.006 + Math.random() * 0.008,
      });
      dataPos[i * 3] = 0;
      dataPos[i * 3 + 1] = 0;
      dataPos[i * 3 + 2] = 0;
    }

    dataGeo.setAttribute("position", new THREE.BufferAttribute(dataPos, 3));
    const dataMat = new THREE.PointsMaterial({
      color: 0xd4a017,
      size: 0.08,
      transparent: true,
      opacity: 0.9,
    });
    const dataPoints = new THREE.Points(dataGeo, dataMat);
    mainGroup.add(dataPoints);

    sceneState.current = {
      mainGroup,
      centerMesh,
      innerCore,
      nodeMeshes,
      lineObjects,
      ringLine,
      dataPoints,
      dataOffsets,
      renderer,
      camera,
    };

    // 8. Mouse parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.55;
      targetY = y * 0.35;
    };

    container.addEventListener("mousemove", handleMouseMove, { passive: true });

    // 9. Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // 10. Animation Loop
    let clock = new THREE.Clock();
    let isRunning = true;

    const animate = () => {
      if (!isRunning) return;
      animFrameId.current = requestAnimationFrame(animate);

      if (!isActive) return;

      const elapsed = clock.getElapsedTime();

      // Parallax inercial
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      mainGroup.rotation.y = elapsed * 0.12 + mouseX;
      mainGroup.rotation.x = Math.sin(elapsed * 0.15) * 0.08 - mouseY;

      // Rotación núcleo
      centerMesh.rotation.x = elapsed * 0.4;
      centerMesh.rotation.y = elapsed * 0.6;
      innerCore.rotation.y = -elapsed * 0.8;

      // Micro-pulsaciones en nodos
      for (let i = 0; i < NODES_COUNT; i++) {
        const mesh = nodeMeshes[i];
        mesh.rotation.y = elapsed * 0.7 + i;
        mesh.rotation.x = elapsed * 0.5;

        // Si está seleccionado por props, agrandar y brillar
        if (selectedNode === i) {
          mesh.scale.set(1.4, 1.4, 1.4);
          mesh.material.color.setHex(0xd4a017);
        } else {
          mesh.scale.set(1, 1, 1);
          mesh.material.color.setHex(0x4a5d3a);
        }
      }

      // Animación de paquetes de datos
      const positions = dataPoints.geometry.attributes.position.array;
      for (let i = 0; i < dataCount; i++) {
        const info = dataOffsets[i];
        info.progress += info.speed;
        if (info.progress > 1) info.progress = 0;

        const targetPos = nodePositions[info.targetNode];
        // Interpolar desde centro (0,0,0) hacia nodo
        positions[i * 3] = targetPos.x * info.progress;
        positions[i * 3 + 1] = targetPos.y * info.progress;
        positions[i * 3 + 2] = targetPos.z * info.progress;
      }
      dataPoints.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      isRunning = false;
      container.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isActive, selectedNode]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    />
  );
}
