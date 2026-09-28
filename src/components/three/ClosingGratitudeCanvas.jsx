// src/components/three/ClosingGratitudeCanvas.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Visualizador 3D para Slide 14:
 * "Cierre del Deck — 5 Investigadores SENATI & Núcleo AWS Cloud"
 *
 * Características conceptuales y geométricas:
 *  - Núcleo central pentagonal / Dodecaedro de Arquitectura AWS con doble anillo orbital.
 *  - 5 Nodos Mayores de Ciberseguridad y Nube que representan a los 5 integrantes del equipo de investigación:
 *    1. Jara Vega Analí
 *    2. Estilo Ratache Diego Rafael
 *    3. Suclupe López Jean Pierre
 *    4. Gonzales Ramirez Alfredo Valentino
 *    5. Guardia Ticlla Sebastian Jesús
 *  - Cada nodo proyecta un haz de luz coherente hacia el núcleo central, simbolizando la coautoría del proyecto.
 *  - Modo Celebración Épico ("Hyper-Warp Celebration"):
 *    Al presionar "CELEBRAR", se dispara una aceleración cósmica de 200 partículas estelares,
 *    expansión radial de ondas de choque, giro dinámico y pulsación lumínica multicolor.
 */
export function ClosingGratitudeCanvas({
  isActive = true,
  celebrateTrigger = 0,
}) {
  const containerRef = useRef(null);
  const animFrameId = useRef(null);
  const celebratePulseRef = useRef(0);
  const celebrateCountRef = useRef(celebrateTrigger);

  // Trigger pulse effect when celebrateTrigger increments
  useEffect(() => {
    if (celebrateTrigger > 0) {
      celebratePulseRef.current = 1.0;
    }
    celebrateCountRef.current = celebrateTrigger;
  }, [celebrateTrigger]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.3, 10.0);

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

    // 3. Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // ── 4. Núcleo Geodésico Global (AWS Global Backbone) ──
    const globeGeo = new THREE.IcosahedronGeometry(1.5, 1);
    const globeWire = new THREE.WireframeGeometry(globeGeo);
    const globeMat = new THREE.LineBasicMaterial({
      color: 0xd4a017,
      transparent: true,
      opacity: 0.85,
      linewidth: 1.5,
    });
    const globeMesh = new THREE.LineSegments(globeWire, globeMat);
    rootGroup.add(globeMesh);

    // Núcleo interno de gratitud (Octaedro palpitante de AWS)
    const innerGeo = new THREE.OctahedronGeometry(0.75, 0);
    const innerWire = new THREE.WireframeGeometry(innerGeo);
    const innerMat = new THREE.LineBasicMaterial({
      color: 0x6e8e59,
      transparent: true,
      opacity: 0.9,
    });
    const innerMesh = new THREE.LineSegments(innerWire, innerMat);
    rootGroup.add(innerMesh);

    // Halo orbital ecuatorial (Route 53 & CloudFront CDN)
    const haloGeo = new THREE.TorusGeometry(2.7, 0.02, 16, 64);
    const haloWire = new THREE.WireframeGeometry(haloGeo);
    const haloMat = new THREE.LineBasicMaterial({
      color: 0xf5f1e8,
      transparent: true,
      opacity: 0.45,
    });
    const haloMesh = new THREE.LineSegments(haloWire, haloMat);
    haloMesh.rotation.x = Math.PI / 2.3;
    rootGroup.add(haloMesh);

    // Segundo anillo orbital inclinado
    const halo2Geo = new THREE.TorusGeometry(3.3, 0.018, 16, 64);
    const halo2Wire = new THREE.WireframeGeometry(halo2Geo);
    const halo2Mat = new THREE.LineBasicMaterial({
      color: 0xd4a017,
      transparent: true,
      opacity: 0.35,
    });
    const halo2Mesh = new THREE.LineSegments(halo2Wire, halo2Mat);
    halo2Mesh.rotation.x = -Math.PI / 3;
    rootGroup.add(halo2Mesh);

    // ── 5. Los 5 Nodos de los Investigadores de SENATI ──
    const researchers = [
      { id: 1, name: "Jara Vega", code: "JV" },
      { id: 2, name: "Estilo Ratache", code: "ER" },
      { id: 3, name: "Suclupe López", code: "SL" },
      { id: 4, name: "Gonzales Ramirez", code: "GR" },
      { id: 5, name: "Guardia Ticlla", code: "GT" },
    ];

    const nodes = [];
    const nodeGeo = new THREE.DodecahedronGeometry(0.42, 0);
    const nodeWire = new THREE.WireframeGeometry(nodeGeo);

    researchers.forEach((res, i) => {
      const angle = (i / researchers.length) * Math.PI * 2;
      const radius = 2.65;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = Math.sin(angle * 2) * 0.4;

      const nodeGroup = new THREE.Group();
      nodeGroup.position.set(x, y, z);

      const mat = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? 0xd4a017 : 0x6e8e59,
        transparent: true,
        opacity: 0.9,
      });
      const mesh = new THREE.LineSegments(nodeWire, mat);
      nodeGroup.add(mesh);

      // Micro-anillo de órbita individual
      const microRingGeo = new THREE.TorusGeometry(0.58, 0.012, 8, 32);
      const microRingWire = new THREE.WireframeGeometry(microRingGeo);
      const microRingMat = new THREE.LineBasicMaterial({
        color: 0xf5f1e8,
        transparent: true,
        opacity: 0.35,
      });
      const microRingMesh = new THREE.LineSegments(microRingWire, microRingMat);
      microRingMesh.rotation.x = Math.PI / 2.2;
      nodeGroup.add(microRingMesh);

      // Rayo conector con el centro de AWS
      const beamGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        nodeGroup.position.clone(),
      ]);
      const beamMat = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? 0xd4a017 : 0x6e8e59,
        transparent: true,
        opacity: 0.35,
      });
      const beamLine = new THREE.Line(beamGeo, beamMat);
      rootGroup.add(beamLine);

      rootGroup.add(nodeGroup);

      nodes.push({
        group: nodeGroup,
        mesh,
        microRingMesh,
        beamLine,
        beamMat,
        angle,
        baseRadius: radius,
        speed: 0.012,
        yPhase: i * 1.25,
      });
    });

    // ── 6. Nube de Partículas / Confetti Técnico Cósmico (200 puntos) ──
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleVel = [];

    const goldColor = new THREE.Color(0xd4a017);
    const emeraldColor = new THREE.Color(0x6e8e59);
    const whiteColor = new THREE.Color(0xf5f1e8);

    for (let i = 0; i < particleCount; i++) {
      const rad = 0.8 + Math.random() * 3.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      particlePositions[i * 3] = rad * Math.cos(theta) * Math.cos(phi);
      particlePositions[i * 3 + 1] = rad * Math.sin(phi);
      particlePositions[i * 3 + 2] = rad * Math.sin(theta) * Math.cos(phi);

      const colorPick = i % 3 === 0 ? goldColor : i % 3 === 1 ? emeraldColor : whiteColor;
      particleColors[i * 3] = colorPick.r;
      particleColors[i * 3 + 1] = colorPick.g;
      particleColors[i * 3 + 2] = colorPick.b;

      particleVel.push({
        rad,
        baseRad: rad,
        theta,
        phi,
        speed: 0.008 + Math.random() * 0.015,
        burstSpeed: 0.06 + Math.random() * 0.12,
      });
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
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

    // ── 9. Loop de Animación Continuo y Reactivo ──
    const clock = new THREE.Clock();
    let isRunning = true;

    const animate = () => {
      if (!isRunning) return;
      animFrameId.current = requestAnimationFrame(animate);

      if (!isActive) return;

      const elapsed = clock.getElapsedTime();

      // Mouse Parallax inercial
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Celebrate burst decay con spring suave
      if (celebratePulseRef.current > 0.01) {
        celebratePulseRef.current *= 0.94;
      } else {
        celebratePulseRef.current = 0;
      }
      const pulse = celebratePulseRef.current;

      rootGroup.position.set(0, 0, 0);
      rootGroup.rotation.y = elapsed * (0.16 + pulse * 1.2) + mouseX;
      rootGroup.rotation.x = Math.sin(elapsed * 0.25) * 0.04 - mouseY;

      // Rotaciones del núcleo central
      globeMesh.rotation.y = elapsed * (0.35 + pulse * 2.5);
      globeMesh.rotation.x = elapsed * 0.2;
      globeMesh.scale.setScalar(1 + pulse * 0.3);

      innerMesh.rotation.y = -elapsed * (0.9 + pulse * 3.0);
      innerMesh.rotation.z = elapsed * 0.5;
      innerMesh.scale.setScalar(1 + Math.sin(elapsed * 4) * 0.08 + pulse * 0.4);

      haloMesh.rotation.z = elapsed * (0.2 + pulse * 1.5);
      halo2Mesh.rotation.z = -elapsed * (0.18 + pulse * 1.2);

      // Animar los 5 Nodos de Investigadores SENATI
      nodes.forEach((nd) => {
        nd.angle += nd.speed * (1 + pulse * 2.8);
        const curRadius = nd.baseRadius + pulse * 0.8;
        const curX = Math.cos(nd.angle) * curRadius;
        const curZ = Math.sin(nd.angle) * curRadius;
        const curY = Math.sin(elapsed * 2.5 + nd.yPhase) * 0.45;

        nd.group.position.set(curX, curY, curZ);
        nd.mesh.rotation.y = elapsed * (1.2 + pulse * 3.0);
        nd.microRingMesh.rotation.z = elapsed * 0.8;

        // Actualizar rayo de energía con el centro
        const lineArr = nd.beamLine.geometry.attributes.position.array;
        lineArr[3] = curX;
        lineArr[4] = curY;
        lineArr[5] = curZ;
        nd.beamLine.geometry.attributes.position.needsUpdate = true;
        nd.beamMat.opacity = 0.35 + pulse * 0.5;
      });

      // Partículas cósmicas con soporte de warp celebración
      const posArr = particlePoints.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const pv = particleVel[i];
        pv.theta += pv.speed * (1 + pulse * 2.5);
        const r = pv.baseRad + pulse * pv.burstSpeed * 22;
        posArr[i * 3] = r * Math.cos(pv.theta) * Math.cos(pv.phi);
        posArr[i * 3 + 1] = r * Math.sin(pv.phi) + Math.sin(elapsed * 1.8 + i) * 0.12;
        posArr[i * 3 + 2] = r * Math.sin(pv.theta) * Math.cos(pv.phi);
      }
      particlePoints.geometry.attributes.position.needsUpdate = true;
      particleMat.size = 0.06 + pulse * 0.08;

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

export default ClosingGratitudeCanvas;
