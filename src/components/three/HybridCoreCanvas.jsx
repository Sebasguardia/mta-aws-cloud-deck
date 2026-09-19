// src/components/three/HybridCoreCanvas.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Visualizador 3D Interactivo para Slide 03: Naturaleza Híbrida de MTA.
 * Representa la dualidad:
 *  - Estructura Mecánica/Metalmecánica: Engranaje/Icosaedro wireframe con shaders y vértices tácticos.
 *  - Matriz Digital de Software: Nube de partículas orbitales en anillo y núcleo pulsante dorado (#D4A017).
 *
 * Interacción:
 *  - Raycasting / Mouse move para rotación inercial y parallax de cámara.
 *  - Pausa de bucle cuando el slide no está activo (cero costo de GPU).
 */
export function HybridCoreCanvas({ isActive = true }) {
  const containerRef = useRef(null);
  const animFrameId = useRef(null);
  const sceneObjects = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7);

    // 2. Renderer con alpha y antialiasing
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
    const group = new THREE.Group();
    scene.add(group);

    // 3.1 Núcleo Metalmecánico: Octaedro / Icosaedro técnico industrial con aristas duras
    const metalGeo = new THREE.IcosahedronGeometry(1.65, 1);
    const wireframeGeo = new THREE.WireframeGeometry(metalGeo);
    const wireframeMat = new THREE.LineBasicMaterial({
      color: 0x4a5d3a, // Olive industrial
      linewidth: 1.5,
      transparent: true,
      opacity: 0.85,
    });
    const wireframeMesh = new THREE.LineSegments(wireframeGeo, wireframeMat);
    group.add(wireframeMesh);

    // 3.2 Engranaje central rotatorio (Toroides segmentados)
    const gearGeo = new THREE.TorusGeometry(1.2, 0.08, 6, 16);
    const gearMat = new THREE.MeshBasicMaterial({
      color: 0xd4a017, // Gold accent
      wireframe: true,
    });
    const gearMesh = new THREE.Mesh(gearGeo, gearMat);
    gearMesh.rotation.x = Math.PI / 2;
    group.add(gearMesh);

    // 3.3 Anillo exterior de Software / Telemetría
    const ringGeo = new THREE.RingGeometry(2.3, 2.36, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf5f1e8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
      wireframe: true,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    group.add(ringMesh);

    // 3.4 Partículas orbitales (Software B2B Data stream)
    const particlesCount = 180;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      const radius = 2.0 + Math.random() * 0.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * 1.2;
      posArray[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      posArray[i * 3 + 1] = radius * Math.sin(phi);
      posArray[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);
    }

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));

    const particlesMat = new THREE.PointsMaterial({
      size: 0.055,
      color: 0xd4a017,
      transparent: true,
      opacity: 0.85,
    });
    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    group.add(particleSystem);

    sceneObjects.current = { group, wireframeMesh, gearMesh, ringMesh, particleSystem };

    // 4. Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      targetX = (x / rect.width) * 0.8;
      targetY = (y / rect.height) * 0.8;
    };

    container.addEventListener("mousemove", onMouseMove);

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // 5. Render loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);

      if (!isActive) return;

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Inercia suave hacia el mouse
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      group.rotation.y = time * 0.25 + mouseX * 1.2;
      group.rotation.x = time * 0.12 + mouseY * 1.2;

      wireframeMesh.rotation.z = -time * 0.15;
      gearMesh.rotation.z = time * 0.4;
      particleSystem.rotation.y = time * 0.35;
      ringMesh.rotation.z = time * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameId.current);
      container.removeEventListener("mousemove", onMouseMove);
      resizeObserver.disconnect();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      metalGeo.dispose();
      wireframeGeo.dispose();
      wireframeMat.dispose();
      gearGeo.dispose();
      gearMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
    };
  }, [isActive]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "360px",
        position: "relative",
        cursor: "grab",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-label="Modelo 3D interactivo: Coexistencia Metalmecánica y Software Cloud"
    />
  );
}
