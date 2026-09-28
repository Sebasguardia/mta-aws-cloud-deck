// src/components/three/LegacyHostingerCanvas.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Visualizador 3D Interactivo para Slide 06: Servidor Legacy Monolítico (Hostinger Compartido).
 *
 * Mejoras de rendimiento y fluidez:
 *  - 100% fluido: `isActive`, `isFaultActive` y `selectedComponentIdx` se leen vía `useRef` dentro del bucle
 *    `requestAnimationFrame`, eliminando por completo cualquier parpadeo, desmontado o recreación de WebGL.
 *  - Interacción con las 3 opciones:
 *    - Opción 0: Hosting Compartido (Chasis/Rack Monolítico y sus repisas) se expande, brilla y pulsa en rojo de alerta.
 *    - Opción 1: Control de Versiones / Repositorio (Cápsulas de código y bus de sincronización) se destacan con anillos de telemetría.
 *    - Opción 2: Testing Fragmentado en 'Localhost' (Octaedro CPU descentralizado y satélites individuales desconectados).
 *  - Cuando se hace clic en "Simular Colapso":
 *    - La transición al modo colapso sísmico ocurre en vivo y en pleno movimiento continuo con oscilación dinámica,
 *      alerta cromática progresiva y lluvia de fallas de paquetes sin pausar ni recargar el canvas.
 */
export function LegacyHostingerCanvas({
  isActive = true,
  isFaultActive = false,
  selectedComponentIdx = 0,
  onSelectComponent = null,
}) {
  const containerRef = useRef(null);
  const animFrameId = useRef(null);

  const isActiveRef = useRef(isActive);
  const isFaultRef = useRef(isFaultActive);
  const selectedIdxRef = useRef(selectedComponentIdx);
  const onSelectRef = useRef(onSelectComponent);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    isFaultRef.current = isFaultActive;
  }, [isFaultActive]);

  useEffect(() => {
    selectedIdxRef.current = selectedComponentIdx;
  }, [selectedComponentIdx]);

  useEffect(() => {
    onSelectRef.current = onSelectComponent;
  }, [onSelectComponent]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.1, 7.8);

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

    // 4. Rack Monolítico (Chasis del servidor compartido) - Componente 0
    const rackGeo = new THREE.BoxGeometry(2.3, 3.9, 1.9);
    const rackWire = new THREE.WireframeGeometry(rackGeo);
    const rackMat = new THREE.LineBasicMaterial({
      color: 0x555555,
      transparent: true,
      opacity: 0.75,
      linewidth: 1.5,
    });
    const rackMesh = new THREE.LineSegments(rackWire, rackMat);
    mainGroup.add(rackMesh);

    // Acento perimetral de advertencia para el Rack (hosting compartido)
    const rackAuraGeo = new THREE.BoxGeometry(2.4, 4.0, 2.0);
    const rackAuraWire = new THREE.WireframeGeometry(rackAuraGeo);
    const rackAuraMat = new THREE.LineBasicMaterial({
      color: 0xc6432b,
      transparent: true,
      opacity: 0.0,
      linewidth: 1.5,
    });
    const rackAuraMesh = new THREE.LineSegments(rackAuraWire, rackAuraMat);
    mainGroup.add(rackAuraMesh);

    // Repisas internas del rack (Slots compartidos)
    const shelvesCount = 4;
    const shelves = [];
    for (let i = 0; i < shelvesCount; i++) {
      const y = -1.4 + i * 0.95;
      const shelfGeo = new THREE.PlaneGeometry(2.15, 1.75);
      const shelfWire = new THREE.WireframeGeometry(shelfGeo);
      const shelfMat = new THREE.LineBasicMaterial({
        color: 0x3a3a3a,
        transparent: true,
        opacity: 0.45,
      });
      const shelf = new THREE.LineSegments(shelfWire, shelfMat);
      shelf.rotation.x = Math.PI / 2;
      shelf.position.y = y;
      mainGroup.add(shelf);
      shelves.push(shelf);
    }

    // 5. Las 3 Cápsulas de Apps comprimidas en el mismo hosting (Componente 1: Repositorio & Código)
    const appColors = [0xd4a017, 0x6e8e59, 0xc6432b];
    const appMeshes = [];
    const appGroup = new THREE.Group();
    mainGroup.add(appGroup);

    for (let i = 0; i < 3; i++) {
      const appGeo = new THREE.BoxGeometry(1.65, 0.58, 1.35);
      const appWire = new THREE.WireframeGeometry(appGeo);
      const appMat = new THREE.LineBasicMaterial({
        color: appColors[i],
        transparent: true,
        opacity: 0.85,
        linewidth: 1.5,
      });
      const appMesh = new THREE.LineSegments(appWire, appMat);
      appMesh.position.y = -0.95 + i * 0.95;
      appGroup.add(appMesh);

      // Aro de halo alrededor de cada app
      const ringGeo = new THREE.TorusGeometry(0.9, 0.012, 6, 28);
      const ringWire = new THREE.WireframeGeometry(ringGeo);
      const ringMat = new THREE.LineBasicMaterial({
        color: appColors[i],
        transparent: true,
        opacity: 0.35,
      });
      const ringMesh = new THREE.LineSegments(ringWire, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      appMesh.add(ringMesh);

      appMeshes.push({ mesh: appMesh, ring: ringMesh, mat: appMat });
    }

    // 6. Núcleo compartido de CPU / RAM (Octaedro central vulnerable)
    const cpuGeo = new THREE.OctahedronGeometry(0.42, 0);
    const cpuMat = new THREE.MeshBasicMaterial({
      color: 0x888888,
      wireframe: true,
    });
    const cpuMesh = new THREE.Mesh(cpuGeo, cpuMat);
    cpuMesh.position.set(0, 0, 0);
    mainGroup.add(cpuMesh);

    // 7. Satélites de Testing Localhost Descentralizados (Componente 2: Testing Fragmentado)
    const localhostGroup = new THREE.Group();
    mainGroup.add(localhostGroup);

    const laptopNodes = [];
    const laptopAngles = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];
    for (let i = 0; i < 3; i++) {
      const angle = laptopAngles[i];
      const rad = 2.2;
      const lx = Math.cos(angle) * rad;
      const lz = Math.sin(angle) * rad;

      const nodeGeo = new THREE.BoxGeometry(0.55, 0.1, 0.45);
      const nodeWire = new THREE.WireframeGeometry(nodeGeo);
      const nodeMat = new THREE.LineBasicMaterial({
        color: 0xd4a017,
        transparent: true,
        opacity: 0.5,
      });
      const nodeMesh = new THREE.LineSegments(nodeWire, nodeMat);
      nodeMesh.position.set(lx, -1.5, lz);

      // Rayo parpadeante desconectado
      const dashPts = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(-lx * 0.4, 0.6, -lz * 0.4)];
      const dashGeo = new THREE.BufferGeometry().setFromPoints(dashPts);
      const dashMat = new THREE.LineDashedMaterial({
        color: 0xc6432b,
        dashSize: 0.15,
        gapSize: 0.1,
        transparent: true,
        opacity: 0.4,
      });
      const dashLine = new THREE.Line(dashGeo, dashMat);
      dashLine.computeLineDistances();
      nodeMesh.add(dashLine);

      localhostGroup.add(nodeMesh);
      laptopNodes.push({ mesh: nodeMesh, mat: nodeMat, dashLine });
    }

    // 8. Paquetes de tráfico de red concurrentes (65 partículas)
    const trafficCount = 65;
    const trafficGeo = new THREE.BufferGeometry();
    const trafficPos = new Float32Array(trafficCount * 3);
    const trafficVel = [];

    for (let i = 0; i < trafficCount; i++) {
      trafficPos[i * 3] = (Math.random() - 0.5) * 3.2;
      trafficPos[i * 3 + 1] = 2.4 + Math.random() * 1.5;
      trafficPos[i * 3 + 2] = (Math.random() - 0.5) * 2.8;
      trafficVel.push(0.02 + Math.random() * 0.03);
    }

    trafficGeo.setAttribute("position", new THREE.BufferAttribute(trafficPos, 3));
    const trafficMat = new THREE.PointsMaterial({
      color: 0xf5f1e8,
      size: 0.052,
      transparent: true,
      opacity: 0.65,
    });
    const trafficPoints = new THREE.Points(trafficGeo, trafficMat);
    mainGroup.add(trafficPoints);

    // 9. Mouse Parallax Interactivo
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.45;
      targetY = y * 0.25;
    };

    container.addEventListener("mousemove", handleMouseMove, { passive: true });

    // 10. Resize Observer
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

    // 11. Render Loop Continuo y Fluido
    let clock = new THREE.Clock();
    let isRunning = true;

    const animate = () => {
      if (!isRunning) return;
      animFrameId.current = requestAnimationFrame(animate);

      if (!isActiveRef.current) return;

      const elapsed = clock.getElapsedTime();
      const isFault = isFaultRef.current;
      const selectedIdx = selectedIdxRef.current;

      // Inercia de ratón suave
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // ── Comportamiento de Selección de Componentes (Hover/Click interactivo) ──
      // Opción 0: Hosting Compartido (Resaltar y expandir Chasis del Servidor)
      if (selectedIdx === 0) {
        const pulse = 1 + Math.sin(elapsed * 4) * 0.04;
        rackMesh.scale.lerp(new THREE.Vector3(pulse, pulse, pulse), 0.1);
        rackAuraMat.opacity = 0.6 + Math.sin(elapsed * 4) * 0.3;
        rackMat.color.setHex(isFault ? 0xff2222 : 0xc6432b);
      } else {
        rackMesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        rackAuraMat.opacity = 0;
        rackMat.color.setHex(isFault ? 0xc6432b : 0x555555);
      }

      // Opción 1: Control de Versiones / Repositorio (Resaltar y expandir Cápsulas de Apps)
      appMeshes.forEach((item, i) => {
        if (selectedIdx === 1) {
          const appPulse = 1.12 + Math.sin(elapsed * 3 + i) * 0.05;
          item.mesh.scale.lerp(new THREE.Vector3(appPulse, appPulse, appPulse), 0.1);
          item.mat.opacity = 1.0;
          item.ring.material.opacity = 0.8;
        } else {
          item.mesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
          item.mat.opacity = 0.85;
          item.ring.material.opacity = 0.35;
        }
      });

      // Opción 2: Testing Fragmentado en 'Localhost' (Expandir nodos satélites desconectados)
      localhostGroup.rotation.y = elapsed * 0.35;
      laptopNodes.forEach((node, i) => {
        if (selectedIdx === 2) {
          const satPulse = 1.25 + Math.sin(elapsed * 5 + i) * 0.08;
          node.mesh.scale.lerp(new THREE.Vector3(satPulse, satPulse, satPulse), 0.1);
          node.mat.color.setHex(0xc6432b);
          node.mat.opacity = 0.95;
          node.dashLine.material.opacity = 0.85;
        } else {
          node.mesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
          node.mat.color.setHex(0xd4a017);
          node.mat.opacity = 0.45;
          node.dashLine.material.opacity = 0.3;
        }
      });

      // ── Comportamiento de Simulación de Colapso en Pleno Movimiento ──
      if (isFault) {
        const shakeIntensity = 0.09;
        const shakeX = (Math.random() - 0.5) * shakeIntensity;
        const shakeY = (Math.random() - 0.5) * shakeIntensity;
        const shakeZ = (Math.random() - 0.5) * shakeIntensity;

        mainGroup.position.set(shakeX, shakeY, shakeZ);
        mainGroup.rotation.y = elapsed * 0.7 + mouseX + (Math.random() - 0.5) * 0.06;
        mainGroup.rotation.x = -mouseY + (Math.random() - 0.5) * 0.06;

        cpuMesh.material.color.setHex(0xff1111);
        cpuMesh.scale.lerp(new THREE.Vector3(1.6, 1.6, 1.6), 0.1);
        trafficMat.color.setHex(0xff3333);
      } else {
        mainGroup.position.set(0, 0, 0);
        mainGroup.rotation.y = elapsed * 0.25 + mouseX;
        mainGroup.rotation.x = Math.sin(elapsed * 0.5) * 0.05 - mouseY;

        cpuMesh.material.color.setHex(0x888888);
        cpuMesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        trafficMat.color.setHex(0xf5f1e8);
      }

      cpuMesh.rotation.y = elapsed * 1.5;
      cpuMesh.rotation.x = elapsed * 0.9;

      // Movimiento continuo de partículas de tráfico
      const posArray = trafficPoints.geometry.attributes.position.array;
      for (let i = 0; i < trafficCount; i++) {
        if (isFault) {
          // Lluvia de colapso rápido
          posArray[i * 3 + 1] -= 0.14;
          if (posArray[i * 3 + 1] < -2.5) {
            posArray[i * 3 + 1] = 2.4;
          }
        } else {
          // Flujo suave hacia el rack
          posArray[i * 3 + 1] -= trafficVel[i];
          if (posArray[i * 3 + 1] < -2.0) {
            posArray[i * 3 + 1] = 2.4;
          }
        }
      }
      trafficPoints.geometry.attributes.position.needsUpdate = true;

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
  }, []); // Sin dependencias para garantizar 0 reinicios de WebGL

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

export default LegacyHostingerCanvas;
