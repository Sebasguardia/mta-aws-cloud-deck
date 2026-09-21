// src/components/three/LegacyHostingerCanvas.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Visualizador 3D Interactivo para Slide 06: Servidor Legacy Monolítico (Hostinger Compartido).
 *
 * Simboliza la fragilidad de la infraestructura actual:
 *  - Rack / Torre de Servidor Monolítico en wireframe industrial (escala de grises técnica / monochrome).
 *  - 3 Cápsulas de Aplicaciones comprimidas dentro del mismo servidor:
 *    - App 1: Strato Studio (Amarillo tenue)
 *    - App 2: VIISION (Verde tenue)
 *    - App 3: Workspace MTA ERP (Rojo alerta)
 *  - Modo Simulación "¿Qué pasa si cae el servidor?":
 *    - Cuando `isFaultActive` es true, el servidor sufre una oscilación sísmica (jitter / shake),
 *      sus aristas parpadean en rojo de alerta (`#c6432b`), y los paquetes de datos colapsan al suelo.
 *
 * Interacción:
 *  - Parallax inercial de cámara mediante movimiento del mouse.
 *  - Pausa de render si isActive es false para preservar ciclos de GPU.
 */
export function LegacyHostingerCanvas({ isActive = true, isFaultActive = false }) {
  const containerRef = useRef(null);
  const animFrameId = useRef(null);
  const sceneState = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.8);

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

    // 4. Rack Monolítico (Chasis del servidor compartido)
    const rackGeo = new THREE.BoxGeometry(2.2, 3.8, 1.8);
    const rackWire = new THREE.WireframeGeometry(rackGeo);
    const rackMat = new THREE.LineBasicMaterial({
      color: 0x555555, // Gris industrial legacy
      transparent: true,
      opacity: 0.7,
      linewidth: 1.5,
    });
    const rackMesh = new THREE.LineSegments(rackWire, rackMat);
    mainGroup.add(rackMesh);

    // Repisas internas del rack (Slots compartidos)
    const shelvesCount = 4;
    const shelves = [];
    for (let i = 0; i < shelvesCount; i++) {
      const y = -1.4 + i * 0.95;
      const shelfGeo = new THREE.PlaneGeometry(2.1, 1.7);
      const shelfWire = new THREE.WireframeGeometry(shelfGeo);
      const shelfMat = new THREE.LineBasicMaterial({
        color: 0x333333,
        transparent: true,
        opacity: 0.4,
      });
      const shelf = new THREE.LineSegments(shelfWire, shelfMat);
      shelf.rotation.x = Math.PI / 2;
      shelf.position.y = y;
      mainGroup.add(shelf);
      shelves.push(shelf);
    }

    // 5. Las 3 Cápsulas de Apps comprimidas en el mismo hosting
    const appColors = [0xd4a017, 0x4a5d3a, 0xc6432b];
    const appMeshes = [];
    for (let i = 0; i < 3; i++) {
      const appGeo = new THREE.BoxGeometry(1.6, 0.55, 1.3);
      const appWire = new THREE.WireframeGeometry(appGeo);
      const appMat = new THREE.LineBasicMaterial({
        color: appColors[i],
        transparent: true,
        opacity: 0.85,
      });
      const appMesh = new THREE.LineSegments(appWire, appMat);
      appMesh.position.y = -0.95 + i * 0.95;
      mainGroup.add(appMesh);
      appMeshes.push(appMesh);
    }

    // 6. Núcleo compartido de CPU / RAM (Octaedro central vulnerable)
    const cpuGeo = new THREE.OctahedronGeometry(0.4, 0);
    const cpuMat = new THREE.MeshBasicMaterial({
      color: 0x888888,
      wireframe: true,
    });
    const cpuMesh = new THREE.Mesh(cpuGeo, cpuMat);
    cpuMesh.position.set(0, 0, 0);
    mainGroup.add(cpuMesh);

    // 7. Paquetes de tráfico de red concurrentes
    const trafficCount = 60;
    const trafficGeo = new THREE.BufferGeometry();
    const trafficPos = new Float32Array(trafficCount * 3);
    const trafficVel = [];

    for (let i = 0; i < trafficCount; i++) {
      trafficPos[i * 3] = (Math.random() - 0.5) * 3;
      trafficPos[i * 3 + 1] = 2.4 + Math.random() * 1.5;
      trafficPos[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
      trafficVel.push(0.02 + Math.random() * 0.03);
    }

    trafficGeo.setAttribute("position", new THREE.BufferAttribute(trafficPos, 3));
    const trafficMat = new THREE.PointsMaterial({
      color: 0xf5f1e8,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
    });
    const trafficPoints = new THREE.Points(trafficGeo, trafficMat);
    mainGroup.add(trafficPoints);

    sceneState.current = {
      mainGroup,
      rackMesh,
      rackMat,
      appMeshes,
      cpuMesh,
      trafficPoints,
      trafficVel,
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
      targetX = x * 0.45;
      targetY = y * 0.25;
    };

    container.addEventListener("mousemove", handleMouseMove, { passive: true });

    // 9. Resize Observer
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

      // Mouse Parallax
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Si la simulación de fallo está activa: shake violento y color rojo
      if (isFaultActive) {
        const shakeX = (Math.random() - 0.5) * 0.08;
        const shakeY = (Math.random() - 0.5) * 0.08;
        const shakeZ = (Math.random() - 0.5) * 0.08;

        mainGroup.position.set(shakeX, shakeY, shakeZ);
        mainGroup.rotation.y = elapsed * 0.6 + mouseX + (Math.random() - 0.5) * 0.05;
        mainGroup.rotation.x = -mouseY + (Math.random() - 0.5) * 0.05;

        rackMat.color.setHex(0xc6432b); // Rojo crítico
        cpuMesh.material.color.setHex(0xc6432b);
        cpuMesh.scale.set(1.5, 1.5, 1.5);
      } else {
        mainGroup.position.set(0, 0, 0);
        mainGroup.rotation.y = elapsed * 0.25 + mouseX;
        mainGroup.rotation.x = Math.sin(elapsed * 0.5) * 0.05 - mouseY;

        rackMat.color.setHex(0x555555); // Monocromo industrial normal
        cpuMesh.material.color.setHex(0x888888);
        cpuMesh.scale.set(1, 1, 1);
      }

      cpuMesh.rotation.y = elapsed * 1.2;
      cpuMesh.rotation.x = elapsed * 0.8;

      // Movimiento de partículas de tráfico
      const posArray = trafficPoints.geometry.attributes.position.array;
      for (let i = 0; i < trafficCount; i++) {
        if (isFaultActive) {
          // Caída descontrolada / colapso
          posArray[i * 3 + 1] -= 0.12;
          if (posArray[i * 3 + 1] < -2.5) {
            posArray[i * 3 + 1] = 2.4;
          }
        } else {
          // Flujo hacia el rack
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
  }, [isActive, isFaultActive]);

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
