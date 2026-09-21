// src/components/three/RoadmapContinuityCanvas.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Visualizador 3D Interactivo para Slide 13:
 * "Roadmap de Adopción Cloud y Continuidad Técnica"
 *
 * Simboliza la evolución temporal por fases:
 *  - 3 Estaciones / Monolitos que representan las 3 etapas del curso:
 *    1. Etapa 01 (Diagnóstico y Fundamentos): Cubo facetado verde oliva/oro con check luminoso (COMPLETADA).
 *    2. Etapa 02 (Aprovisionamiento y Staging): Prisma hexagonal dorado con haz láser ascendente (SIGUIENTE HITO ACTIVO).
 *    3. Etapa 03 (Automatización y Migración Final): Dodecaedro en wireframe blueprint cian/plata (FUTURO).
 *  - Conectados por un riel / vector de datos curvo donde viajan pulsos luminosos continuos.
 *  - La estación seleccionada (`activePhase`) se eleva, expande sus anillos orbitales y amplifica su iluminación.
 *  - Parallax suave con mouse e interpolación lerp inercial.
 */
export function RoadmapContinuityCanvas({
  isActive = true,
  activePhase = 1, // 0 = Etapa 1, 1 = Etapa 2, 2 = Etapa 3
}) {
  const containerRef = useRef(null);
  const animFrameId = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;

    // 1. Escena y Cámara con perspectiva amplia para evitar clipping
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.6, 9.8);

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

    // Plataforma base técnica / Riel temporal
    const trackCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-3.2, -1.2, 0.8),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(3.2, 1.2, -0.8),
    ]);
    const trackGeo = new THREE.TubeGeometry(trackCurve, 64, 0.03, 8, false);
    const trackWire = new THREE.WireframeGeometry(trackGeo);
    const trackMat = new THREE.LineBasicMaterial({
      color: 0x555555,
      transparent: true,
      opacity: 0.35,
    });
    const trackMesh = new THREE.LineSegments(trackWire, trackMat);
    rootGroup.add(trackMesh);

    // ── 4. Las 3 Estaciones del Roadmap ──
    const stations = [];
    const stationConfigs = [
      {
        id: 0,
        name: "Etapa 01",
        pos: new THREE.Vector3(-2.8, -1.0, 0.7),
        color: 0x6e8e59, // Verde completado
        geo: new THREE.BoxGeometry(1.2, 1.2, 1.2),
        label: "COMPLETADA",
      },
      {
        id: 1,
        name: "Etapa 02",
        pos: new THREE.Vector3(0, 0.1, 0),
        color: 0xd4a017, // Oro activo / siguiente hito
        geo: new THREE.CylinderGeometry(0.7, 0.7, 1.4, 6),
        label: "SIGUIENTE HITO",
      },
      {
        id: 2,
        name: "Etapa 03",
        pos: new THREE.Vector3(2.8, 1.1, -0.7),
        color: 0x888888, // Plata futuro
        geo: new THREE.DodecahedronGeometry(0.85, 0),
        label: "FUTURO",
      },
    ];

    stationConfigs.forEach((cfg) => {
      const group = new THREE.Group();
      group.position.copy(cfg.pos);

      const wire = new THREE.WireframeGeometry(cfg.geo);
      const mat = new THREE.LineBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.85,
        linewidth: 1.5,
      });
      const mesh = new THREE.LineSegments(wire, mat);
      group.add(mesh);

      // Anillo orbital de telemetría alrededor de la estación
      const ringGeo = new THREE.TorusGeometry(1.1, 0.015, 16, 48);
      const ringWire = new THREE.WireframeGeometry(ringGeo);
      const ringMat = new THREE.LineBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.3,
      });
      const ringMesh = new THREE.LineSegments(ringWire, ringMat);
      ringMesh.rotation.x = Math.PI / 2.3;
      group.add(ringMesh);

      // Núcleo interno de energía
      const innerGeo = new THREE.OctahedronGeometry(0.4, 0);
      const innerWire = new THREE.WireframeGeometry(innerGeo);
      const innerMat = new THREE.LineBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.9,
      });
      const innerMesh = new THREE.LineSegments(innerWire, innerMat);
      group.add(innerMesh);

      rootGroup.add(group);
      stations.push({
        id: cfg.id,
        group,
        mesh,
        mat,
        ringMesh,
        ringMat,
        innerMesh,
        innerMat,
        basePos: cfg.pos.clone(),
        color: cfg.color,
      });
    });

    // ── 5. Partícula Viajera en el Riel Temporal ──
    const travelerGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const travelerMat = new THREE.MeshBasicMaterial({
      color: 0xd4a017,
      wireframe: true,
    });
    const travelerMesh = new THREE.Mesh(travelerGeo, travelerMat);
    rootGroup.add(travelerMesh);

    // ── 6. Nube de Partículas de Hitos (60 puntos) ──
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

    // ── 7. Parallax del mouse ──
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

    // ── 8. Resize Observer ──
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

    // ── 9. Loop de Animación ──
    const clock = new THREE.Clock();
    let isRunning = true;

    const animate = () => {
      if (!isRunning) return;
      animFrameId.current = requestAnimationFrame(animate);

      if (!isActive) return;

      const elapsed = clock.getElapsedTime();

      // Mouse Parallax
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      rootGroup.position.set(0, 0, 0);
      rootGroup.rotation.y = elapsed * 0.12 + mouseX;
      rootGroup.rotation.x = Math.sin(elapsed * 0.25) * 0.04 - mouseY;

      // Movimiento continuo de la partícula sobre el riel temporal
      const t = (elapsed * 0.15) % 1;
      const p = trackCurve.getPoint(t);
      travelerMesh.position.copy(p);
      const pulse = 1 + Math.sin(elapsed * 8) * 0.2;
      travelerMesh.scale.set(pulse, pulse, pulse);

      // Dinámica de las 3 estaciones según activePhase
      stations.forEach((st) => {
        const isSelected = st.id === activePhase;

        st.mesh.rotation.y = elapsed * (isSelected ? 0.8 : 0.3);
        st.ringMesh.rotation.z = elapsed * (isSelected ? 0.5 : 0.2);
        st.innerMesh.rotation.y = -elapsed * (isSelected ? 1.2 : 0.5);

        // Elevación e iluminación reactiva
        const targetY = st.basePos.y + (isSelected ? 0.25 : 0) + Math.sin(elapsed * 2 + st.id) * 0.05;
        st.group.position.y += (targetY - st.group.position.y) * 0.1;

        const targetScale = isSelected ? 1.18 : 1.0;
        st.group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

        if (isSelected) {
          st.mat.opacity = 1.0;
          st.ringMat.opacity = 0.65;
          st.innerMat.opacity = 1.0;
        } else {
          st.mat.opacity = 0.6;
          st.ringMat.opacity = 0.2;
          st.innerMat.opacity = 0.5;
        }
      });

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
  }, [isActive, activePhase]);

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
