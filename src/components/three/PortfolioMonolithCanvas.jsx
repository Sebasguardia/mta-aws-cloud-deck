// src/components/three/PortfolioMonolithCanvas.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Visualizador 3D Interactivo para Slide 05: Portafolio de Proyectos.
 *
 * Representa los 3 núcleos de software como monolitos flotantes con geometría facetada
 * y hologramas wireframe que responden al hover y selección:
 *  - Monolito 01: Strato Studio (Growth / Media) - Estructura piramidal dorada.
 *  - Monolito 02: VIISION (B2B Conversion / ERP) - Cilindro facetado industrial.
 *  - Monolito 03: Workspace MTA (ERP Interno Core) - Cubo hiperbólico con reactor central pulsante.
 *
 * Interacción:
 *  - Parallax inercial de cámara por mouse.
 *  - Resaltado y rotación acelerada del monolito activo.
 *  - Partículas orbitales que unen los 3 productos en una constelación de software.
 */
export function PortfolioMonolithCanvas({ isActive = true, activeIndex = 0 }) {
  const containerRef = useRef(null);
  const animFrameId = useRef(null);
  const monolithsRef = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

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

    // 4. Tres Monolitos
    const monoliths = [];
    const positions = [-2.6, 0, 2.6];

    // --- Monolito 1: Strato Studio (Cono facetado / Pirámide de Growth) ---
    const m1Geo = new THREE.ConeGeometry(0.85, 1.8, 6);
    const m1Wire = new THREE.WireframeGeometry(m1Geo);
    const m1Mat = new THREE.LineBasicMaterial({ color: 0xd4a017, transparent: true, opacity: 0.85 });
    const m1 = new THREE.LineSegments(m1Wire, m1Mat);
    m1.position.x = positions[0];
    mainGroup.add(m1);
    monoliths.push(m1);

    // --- Monolito 2: VIISION (Cilindro facetado / Estructura ERP B2B) ---
    const m2Geo = new THREE.CylinderGeometry(0.75, 0.75, 1.7, 8);
    const m2Wire = new THREE.WireframeGeometry(m2Geo);
    const m2Mat = new THREE.LineBasicMaterial({ color: 0x4a5d3a, transparent: true, opacity: 0.85 });
    const m2 = new THREE.LineSegments(m2Wire, m2Mat);
    m2.position.x = positions[1];
    mainGroup.add(m2);
    monoliths.push(m2);

    // --- Monolito 3: Workspace MTA (Reactor Core / Cubo de Operaciones Críticas) ---
    const m3Group = new THREE.Group();
    const m3BoxGeo = new THREE.BoxGeometry(1.4, 1.4, 1.4);
    const m3Wire = new THREE.WireframeGeometry(m3BoxGeo);
    const m3Mat = new THREE.LineBasicMaterial({ color: 0xc6432b, transparent: true, opacity: 0.9 });
    const m3Cube = new THREE.LineSegments(m3Wire, m3Mat);
    m3Group.add(m3Cube);

    // Núcleo interno del ERP
    const coreGeo = new THREE.OctahedronGeometry(0.55, 0);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xd4a017, wireframe: true });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    m3Group.add(coreMesh);
    m3Group.position.x = positions[2];
    mainGroup.add(m3Group);
    monoliths.push(m3Group);

    monolithsRef.current = monoliths;

    // 5. Partículas ambientales de carga / transacciones
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 8.5;
      particlePos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xd4a017,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particleSystem);

    // 6. Mouse parallax
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

    // 7. Resize Observer
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

    // 8. Animation Loop
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

      mainGroup.rotation.y = mouseX;
      mainGroup.rotation.x = -mouseY;

      // Rotación y levitación individual
      monoliths.forEach((m, idx) => {
        const isCurrent = idx === activeIndex;
        const speed = isCurrent ? 0.9 : 0.4;
        m.rotation.y = elapsed * speed + idx;
        m.rotation.x = Math.sin(elapsed * 0.8 + idx) * 0.15;
        m.position.y = Math.sin(elapsed * 1.2 + idx) * 0.12;

        // Escala activa
        const targetScale = isCurrent ? 1.2 : 0.95;
        m.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
      });

      // Rotación especial del reactor Workspace MTA
      coreMesh.rotation.y = -elapsed * 1.5;
      coreMesh.rotation.z = elapsed * 0.8;

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
  }, [isActive, activeIndex]);

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
