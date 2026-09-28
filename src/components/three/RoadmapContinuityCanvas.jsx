// src/components/three/RoadmapContinuityCanvas.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Visualizador 3D Interactivo para Slide 13:
 * "Roadmap de Adopción Cloud y Continuidad Técnica (2 Etapas Curriculares SENATI)"
 *
 * Simboliza la evolución temporal de las 2 etapas del proyecto:
 *  - Estación 0 (Etapa 01: Diagnóstico y Fundamentos Cloud - Semana 6):
 *    Monolito cúbico facetado con núcleo esmeralda (#6e8e59) que representa la base arquitectónica:
 *    el diseño perimetral de Amazon VPC, las políticas de IAM y la auditoría inicial.
 *  - Estación 1 (Etapa 02: Servicios Core, Almacenamiento y BD - Semana 7):
 *    Torre de cómputo hexagonal dorada (#d4a017) que representa Amazon EC2 / Lambda, junto con
 *    un cilindro segmentado de base de datos RDS y anillos de almacenamiento S3/EFS.
 *
 * Características de interacción y rendimiento:
 *  - Riel curvo de datos con pulso luminoso continuo viajando entre la Etapa 1 y la Etapa 2.
 *  - Transición fluida entre etapas sin reinicio del WebGL canvas (uso de `useRef`).
 *  - Rotación e iluminación armónica con respuesta inercial al ratón (Parallax).
 */
export function RoadmapContinuityCanvas({
  isActive = true,
  activePhase = 1, // 0 = Etapa 1, 1 = Etapa 2
}) {
  const containerRef = useRef(null);
  const animFrameId = useRef(null);

  // Mantener referencia mutable para activePhase para no destruir ni recargar el WebGL
  const activePhaseRef = useRef(activePhase);
  useEffect(() => {
    activePhaseRef.current = activePhase;
  }, [activePhase]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;

    // 1. Escena y Cámara con perspectiva amplia para evitar clipping
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 9.6);

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
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Riel temporal curvo que une directamente las 2 etapas
    const trackCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.6, -0.6, 0.6),
      new THREE.Vector3(-1.0, 0.1, 0.3),
      new THREE.Vector3(1.0, -0.1, -0.2),
      new THREE.Vector3(2.6, 0.6, -0.6),
    ]);
    const trackGeo = new THREE.TubeGeometry(trackCurve, 64, 0.035, 8, false);
    const trackWire = new THREE.WireframeGeometry(trackGeo);
    const trackMat = new THREE.LineBasicMaterial({
      color: 0x555555,
      transparent: true,
      opacity: 0.35,
    });
    const trackMesh = new THREE.LineSegments(trackWire, trackMat);
    rootGroup.add(trackMesh);

    // ── 4. Estación 0: Etapa 01 (Diagnóstico, Fundamentos, VPC e IAM) ──
    const station0Group = new THREE.Group();
    station0Group.position.set(-2.4, -0.5, 0.5);
    rootGroup.add(station0Group);

    // Monolito cúbico de VPC / Red
    const s0BoxGeo = new THREE.BoxGeometry(1.4, 1.4, 1.4);
    const s0BoxWire = new THREE.WireframeGeometry(s0BoxGeo);
    const s0BoxMat = new THREE.LineBasicMaterial({
      color: 0x6e8e59,
      transparent: true,
      opacity: 0.85,
    });
    const s0BoxMesh = new THREE.LineSegments(s0BoxWire, s0BoxMat);
    station0Group.add(s0BoxMesh);

    // Anillo exterior de perímetro CloudFront
    const s0RingGeo = new THREE.TorusGeometry(1.2, 0.02, 16, 48);
    const s0RingWire = new THREE.WireframeGeometry(s0RingGeo);
    const s0RingMat = new THREE.LineBasicMaterial({
      color: 0x6e8e59,
      transparent: true,
      opacity: 0.4,
    });
    const s0RingMesh = new THREE.LineSegments(s0RingWire, s0RingMat);
    s0RingMesh.rotation.x = Math.PI / 2.2;
    station0Group.add(s0RingMesh);

    // Candado / Octaedro de seguridad IAM central
    const s0CoreGeo = new THREE.OctahedronGeometry(0.55, 0);
    const s0CoreWire = new THREE.WireframeGeometry(s0CoreGeo);
    const s0CoreMat = new THREE.LineBasicMaterial({
      color: 0xf5f1e8,
      transparent: true,
      opacity: 0.9,
    });
    const s0CoreMesh = new THREE.LineSegments(s0CoreWire, s0CoreMat);
    station0Group.add(s0CoreMesh);

    // ── 5. Estación 1: Etapa 02 (Servicios Core EC2, S3, RDS, Lambda) ──
    const station1Group = new THREE.Group();
    station1Group.position.set(2.4, 0.5, -0.5);
    rootGroup.add(station1Group);

    // Servidor / Torre hexagonal de cómputo (Amazon EC2)
    const s1TowerGeo = new THREE.CylinderGeometry(0.75, 0.75, 1.6, 6);
    const s1TowerWire = new THREE.WireframeGeometry(s1TowerGeo);
    const s1TowerMat = new THREE.LineBasicMaterial({
      color: 0xd4a017,
      transparent: true,
      opacity: 0.9,
    });
    const s1TowerMesh = new THREE.LineSegments(s1TowerWire, s1TowerMat);
    station1Group.add(s1TowerMesh);

    // Base de datos administrada cilíndrica interna (Amazon RDS)
    const s1DbGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.9, 16);
    const s1DbWire = new THREE.WireframeGeometry(s1DbGeo);
    const s1DbMat = new THREE.LineBasicMaterial({
      color: 0xf5f1e8,
      transparent: true,
      opacity: 0.85,
    });
    const s1DbMesh = new THREE.LineSegments(s1DbWire, s1DbMat);
    station1Group.add(s1DbMesh);

    // Anillo de almacenamiento masivo y respaldos (Amazon S3 / EFS)
    const s1StorageGeo = new THREE.TorusGeometry(1.3, 0.025, 16, 48);
    const s1StorageWire = new THREE.WireframeGeometry(s1StorageGeo);
    const s1StorageMat = new THREE.LineBasicMaterial({
      color: 0xd4a017,
      transparent: true,
      opacity: 0.45,
    });
    const s1StorageMesh = new THREE.LineSegments(s1StorageWire, s1StorageMat);
    s1StorageMesh.rotation.x = Math.PI / 2.3;
    station1Group.add(s1StorageMesh);

    // ── 6. Partícula Viajera en el Riel Temporal ──
    const travelerGeo = new THREE.SphereGeometry(0.13, 16, 16);
    const travelerMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
    });
    const travelerMesh = new THREE.Mesh(travelerGeo, travelerMat);
    rootGroup.add(travelerMesh);

    // Halo secundario del viajero
    const travelerHaloGeo = new THREE.IcosahedronGeometry(0.24, 0);
    const travelerHaloWire = new THREE.WireframeGeometry(travelerHaloGeo);
    const travelerHaloMat = new THREE.LineBasicMaterial({
      color: 0xd4a017,
      transparent: true,
      opacity: 0.7,
    });
    const travelerHaloMesh = new THREE.LineSegments(travelerHaloWire, travelerHaloMat);
    travelerMesh.add(travelerHaloMesh);

    // ── 7. Nube de Partículas de Hitos (60 puntos) ──
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 8;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xd4a017,
      size: 0.045,
      transparent: true,
      opacity: 0.55,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particlePoints);

    // ── 8. Parallax del mouse ──
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetMouseX = nx * 0.35;
      targetMouseY = ny * 0.2;
    };

    container.addEventListener("mousemove", handleMouseMove, { passive: true });

    // ── 9. Resize Observer ──
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

    // ── 10. Loop de Animación Fluido y Continuo ──
    const clock = new THREE.Clock();
    let isRunning = true;

    const animate = () => {
      if (!isRunning) return;
      animFrameId.current = requestAnimationFrame(animate);

      if (!isActive) return;

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const currentPhase = activePhaseRef.current;

      // Mouse Parallax inercial
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      rootGroup.position.set(0, 0, 0);
      rootGroup.rotation.y = elapsed * 0.12 + mouseX;
      rootGroup.rotation.x = Math.sin(elapsed * 0.25) * 0.04 - mouseY;

      // Movimiento continuo de la partícula sobre el riel temporal
      const t = (elapsed * 0.18) % 1;
      const p = trackCurve.getPoint(t);
      travelerMesh.position.copy(p);
      travelerHaloMesh.rotation.y = elapsed * 2.0;
      travelerHaloMesh.rotation.z = elapsed * 1.5;

      // Rotaciones armónicas de las 2 estaciones
      s0BoxMesh.rotation.y = elapsed * (currentPhase === 0 ? 0.7 : 0.25);
      s0RingMesh.rotation.z = elapsed * (currentPhase === 0 ? 0.5 : 0.2);
      s0CoreMesh.rotation.y = -elapsed * (currentPhase === 0 ? 1.0 : 0.4);

      s1TowerMesh.rotation.y = elapsed * (currentPhase === 1 ? 0.7 : 0.25);
      s1StorageMesh.rotation.z = elapsed * (currentPhase === 1 ? 0.5 : 0.2);
      s1DbMesh.rotation.y = -elapsed * (currentPhase === 1 ? 1.0 : 0.4);

      // Elevación e iluminación reactiva con Lerp para cada estación
      const isS0Selected = currentPhase === 0;
      const targetS0Y = -0.5 + (isS0Selected ? 0.25 : 0) + Math.sin(elapsed * 2.0) * 0.04;
      station0Group.position.y += (targetS0Y - station0Group.position.y) * 0.1;
      const scaleS0 = isS0Selected ? 1.16 : 0.98;
      station0Group.scale.lerp(new THREE.Vector3(scaleS0, scaleS0, scaleS0), 0.1);
      s0BoxMat.opacity = THREE.MathUtils.lerp(s0BoxMat.opacity, isS0Selected ? 1.0 : 0.6, 0.1);
      s0RingMat.opacity = THREE.MathUtils.lerp(s0RingMat.opacity, isS0Selected ? 0.65 : 0.25, 0.1);

      const isS1Selected = currentPhase === 1;
      const targetS1Y = 0.5 + (isS1Selected ? 0.25 : 0) + Math.sin(elapsed * 2.0 + 1) * 0.04;
      station1Group.position.y += (targetS1Y - station1Group.position.y) * 0.1;
      const scaleS1 = isS1Selected ? 1.16 : 0.98;
      station1Group.scale.lerp(new THREE.Vector3(scaleS1, scaleS1, scaleS1), 0.1);
      s1TowerMat.opacity = THREE.MathUtils.lerp(s1TowerMat.opacity, isS1Selected ? 1.0 : 0.6, 0.1);
      s1StorageMat.opacity = THREE.MathUtils.lerp(s1StorageMat.opacity, isS1Selected ? 0.7 : 0.25, 0.1);

      // Color del viajero según la estación que enfoca
      if (isS1Selected) {
        travelerHaloMat.color.lerp(new THREE.Color(0xd4a017), 0.1);
      } else {
        travelerHaloMat.color.lerp(new THREE.Color(0x6e8e59), 0.1);
      }

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
  }, [isActive]);

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

export default RoadmapContinuityCanvas;
