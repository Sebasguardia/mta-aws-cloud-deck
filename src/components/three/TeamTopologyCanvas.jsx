// src/components/three/TeamTopologyCanvas.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Visualizador 3D Interactivo y Fluido para Slide 04: Topología de Equipo MTA.
 *
 * Estructura investigada real:
 *  - 4 Nodos Centrales Dorados (Los 4 Encargados / Jefes Técnicos de MTA).
 *    Forman un núcleo tetraédrico/cuadrangular interconectado con pulso y halo.
 *  - 10 Nodos Periféricos (Los 10 Practicantes de Ingeniería Remotos).
 *    Distribuidos en constelación orbital con enlaces dinámicos hacia los 4 líderes.
 *  - Flujos de datos continuos (partículas de commit y telemetría de código).
 *
 * Rendimiento & Fluidez:
 *  - CERO RECARGA: `selectedNode` y `isActive` se manejan mediante mutable refs.
 *  - El canvas y contexto WebGL se crean una sola vez.
 *  - Transición fluida con lerp entre estados sin parpadeos.
 */
export function TeamTopologyCanvas({
  isActive = true,
  selectedNode = null,
  selectedSupervisor = null,
  onSelectNode = null,
}) {
  const containerRef = useRef(null);
  const animFrameId = useRef(null);
  const selectedNodeRef = useRef(selectedNode);
  const selectedSupervisorRef = useRef(selectedSupervisor);
  const isActiveRef = useRef(isActive);

  useEffect(() => {
    selectedNodeRef.current = selectedNode;
  }, [selectedNode]);

  useEffect(() => {
    selectedSupervisorRef.current = selectedSupervisor;
  }, [selectedSupervisor]);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 9.2);

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

    // ════════════════════════════════════════════════════════════
    // 4. LOS 4 ENCARGADOS / JEFES DE ÁREA TI (NÚCLEO CENTRAL)
    // ════════════════════════════════════════════════════════════
    const leadersGroup = new THREE.Group();
    mainGroup.add(leadersGroup);

    const supervisorGeo = new THREE.DodecahedronGeometry(0.32, 0);
    const supervisorWire = new THREE.WireframeGeometry(supervisorGeo);
    const supervisorMat = new THREE.LineBasicMaterial({
      color: 0xd4a017, // Oro AWS
      transparent: true,
      opacity: 0.95,
      linewidth: 1.8,
    });

    const supervisors = [];
    const supRadius = 1.0;
    for (let s = 0; s < 4; s++) {
      const angle = (s / 4) * Math.PI * 2 + Math.PI / 4;
      const sx = Math.cos(angle) * supRadius;
      const sz = Math.sin(angle) * supRadius;
      const sy = (s % 2 === 0 ? 0.2 : -0.2);

      const sMesh = new THREE.LineSegments(supervisorWire, supervisorMat.clone());
      sMesh.position.set(sx, sy, sz);
      leadersGroup.add(sMesh);

      // Micro-anillo orbital individual para cada encargado
      const ringGeo = new THREE.TorusGeometry(0.42, 0.01, 8, 24);
      const ringWire = new THREE.WireframeGeometry(ringGeo);
      const ringMat = new THREE.LineBasicMaterial({
        color: 0xffd700,
        transparent: true,
        opacity: 0.4,
      });
      const ringMesh = new THREE.LineSegments(ringWire, ringMat);
      ringMesh.rotation.x = Math.PI / 2.2;
      sMesh.add(ringMesh);

      supervisors.push({
        mesh: sMesh,
        ringMesh,
        basePos: new THREE.Vector3(sx, sy, sz),
        id: s,
      });
    }

    // Enlace en cuadrante entre los 4 supervisores (Backbone directivo)
    const supLinksPoints = [];
    for (let s = 0; s <= 4; s++) {
      supLinksPoints.push(supervisors[s % 4].basePos);
    }
    const supLinkGeo = new THREE.BufferGeometry().setFromPoints(supLinksPoints);
    const supLinkMat = new THREE.LineBasicMaterial({
      color: 0xd4a017,
      transparent: true,
      opacity: 0.5,
    });
    const supLinkLine = new THREE.Line(supLinkGeo, supLinkMat);
    leadersGroup.add(supLinkLine);

    // Núcleo central holográfico (Cubo de Git / Coordinación central)
    const hubBoxGeo = new THREE.BoxGeometry(0.45, 0.45, 0.45);
    const hubBoxWire = new THREE.WireframeGeometry(hubBoxGeo);
    const hubBoxMat = new THREE.LineBasicMaterial({
      color: 0xf5f1e8,
      transparent: true,
      opacity: 0.6,
    });
    const hubBox = new THREE.LineSegments(hubBoxWire, hubBoxMat);
    leadersGroup.add(hubBox);

    // ════════════════════════════════════════════════════════════
    // 5. LOS 10 PRACTICANTES DE INGENIERÍA REMOTOS
    // ════════════════════════════════════════════════════════════
    const NODES_COUNT = 10;
    const internMeshes = [];
    const internPositions = [];
    const baseRadius = 3.3;

    const internGeo = new THREE.OctahedronGeometry(0.24, 0);
    const internWire = new THREE.WireframeGeometry(internGeo);

    const internLinesGroup = new THREE.Group();
    mainGroup.add(internLinesGroup);
    const internLineObjects = [];

    for (let i = 0; i < NODES_COUNT; i++) {
      const angle = (i / NODES_COUNT) * Math.PI * 2;
      const elevation = Math.sin(i * 1.8) * 0.85;
      const x = Math.cos(angle) * baseRadius;
      const y = elevation;
      const z = Math.sin(angle) * (baseRadius * 0.88);

      const iMat = new THREE.LineBasicMaterial({
        color: 0x6e8e59, // Verde táctico esmeralda
        transparent: true,
        opacity: 0.85,
      });

      const iMesh = new THREE.LineSegments(internWire, iMat);
      iMesh.position.set(x, y, z);
      mainGroup.add(iMesh);
      internMeshes.push({ mesh: iMesh, mat: iMat, basePos: new THREE.Vector3(x, y, z), id: i });
      internPositions.push(new THREE.Vector3(x, y, z));

      // Asignar línea al supervisor más cercano (i % 4)
      const supTarget = supervisors[i % 4].basePos;
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        supTarget,
        new THREE.Vector3(x, y, z),
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x6e8e59,
        transparent: true,
        opacity: 0.22,
      });
      const connLine = new THREE.Line(lineGeo, lineMat);
      internLinesGroup.add(connLine);
      internLineObjects.push({ line: connLine, mat: lineMat, supIdx: i % 4, internIdx: i });
    }

    // Anillo exterior perimetral que interconecta a los 10 practicantes (Mesh descentralizada)
    const ringPoints = [];
    for (let i = 0; i <= NODES_COUNT; i++) {
      ringPoints.push(internPositions[i % NODES_COUNT]);
    }
    const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPoints);
    const ringMat = new THREE.LineBasicMaterial({
      color: 0xf5f1e8,
      transparent: true,
      opacity: 0.15,
    });
    const ringMesh = new THREE.Line(ringGeo, ringMat);
    mainGroup.add(ringMesh);

    // ════════════════════════════════════════════════════════════
    // 6. PAQUETES DE DATOS / COMMITS REMOTOS (TELEMETRÍA)
    // ════════════════════════════════════════════════════════════
    const dataCount = 50;
    const dataGeo = new THREE.BufferGeometry();
    const dataPositions = new Float32Array(dataCount * 3);
    const dataInfo = [];

    for (let i = 0; i < dataCount; i++) {
      const internIdx = i % NODES_COUNT;
      dataInfo.push({
        internIdx,
        supIdx: internIdx % 4,
        progress: Math.random(),
        speed: 0.007 + Math.random() * 0.012,
      });
      dataPositions[i * 3] = 0;
      dataPositions[i * 3 + 1] = 0;
      dataPositions[i * 3 + 2] = 0;
    }

    dataGeo.setAttribute("position", new THREE.BufferAttribute(dataPositions, 3));
    const dataMat = new THREE.PointsMaterial({
      color: 0xd4a017,
      size: 0.075,
      transparent: true,
      opacity: 0.85,
    });
    const dataPoints = new THREE.Points(dataGeo, dataMat);
    mainGroup.add(dataPoints);

    // ════════════════════════════════════════════════════════════
    // 7. MOUSE INTERACTION & PARALLAX FLUIDO
    // ════════════════════════════════════════════════════════════
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.45;
      targetY = y * 0.3;
    };

    container.addEventListener("mousemove", handleMouseMove, { passive: true });

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

    // ════════════════════════════════════════════════════════════
    // 8. RENDER LOOP CONTINUO (CERO RE-RENDER DE REACT)
    // ════════════════════════════════════════════════════════════
    const clock = new THREE.Clock();
    let isRunning = true;

    const animate = () => {
      if (!isRunning) return;
      animFrameId.current = requestAnimationFrame(animate);

      if (!isActiveRef.current) return;

      const elapsed = clock.getElapsedTime();

      // Inercia de ratón suave
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      mainGroup.rotation.y = elapsed * 0.15 + mouseX;
      mainGroup.rotation.x = Math.sin(elapsed * 0.2) * 0.06 - mouseY;

      // Rotación del núcleo de los 4 supervisores
      leadersGroup.rotation.y = -elapsed * 0.35;
      hubBox.rotation.x = elapsed * 0.6;
      hubBox.rotation.z = elapsed * 0.4;

      // Animar individualmente los 4 supervisores
      const curSup = selectedSupervisorRef.current;
      supervisors.forEach((s) => {
        s.mesh.rotation.y = elapsed * 0.9;
        s.ringMesh.rotation.z = elapsed * 1.2;

        const isHighlighted = curSup === s.id;
        const targetScale = isHighlighted ? 1.4 : 1.0;
        s.mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      });

      // Animar los 10 practicantes y responder a selectedNode
      const curSelected = selectedNodeRef.current;
      internMeshes.forEach((item, i) => {
        const m = item.mesh;
        m.rotation.y = elapsed * 0.8 + i;
        m.rotation.x = elapsed * 0.4;

        const isSelected = curSelected === i;
        const targetScale = isSelected ? 1.5 : 1.0;
        m.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);

        if (isSelected) {
          item.mat.color.setHex(0xd4a017); // Oro al seleccionar
          item.mat.opacity = 1.0;
        } else {
          item.mat.color.setHex(0x6e8e59); // Verde estándar
          item.mat.opacity = 0.85;
        }
      });

      // Iluminar líneas conectoras del nodo activo
      internLineObjects.forEach((link) => {
        if (curSelected === link.internIdx) {
          link.mat.color.setHex(0xd4a017);
          link.mat.opacity = 0.8;
        } else if (curSup === link.supIdx) {
          link.mat.color.setHex(0xd4a017);
          link.mat.opacity = 0.6;
        } else {
          link.mat.color.setHex(0x6e8e59);
          link.mat.opacity = 0.22;
        }
      });

      // Paquetes de datos fluyendo entre practicantes y líderes
      const posArr = dataPoints.geometry.attributes.position.array;
      for (let i = 0; i < dataCount; i++) {
        const info = dataInfo[i];
        info.progress += info.speed;
        if (info.progress > 1) info.progress = 0;

        const pNode = internPositions[info.internIdx];
        const sNode = supervisors[info.supIdx].mesh.position;

        // Trayecto de ida y vuelta
        posArr[i * 3] = pNode.x + (sNode.x - pNode.x) * info.progress;
        posArr[i * 3 + 1] = pNode.y + (sNode.y - pNode.y) * info.progress;
        posArr[i * 3 + 2] = pNode.z + (sNode.z - pNode.z) * info.progress;
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
  }, []);

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

export default TeamTopologyCanvas;

