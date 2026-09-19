// src/components/three/CriticalBottleneckCanvas.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Visualizador 3D Interactivo para Slide 08:
 * "El Punto Único de Fallo y Cuello de Botella Crítico (SPOF)"
 *
 * Directivas de animación y física (/threejs-geometry + /threejs-animation + /threejs-interaction):
 * - Representación geométrica tipo terminal militar / blueprint CAD:
 *   - Monolito central de Hostinger (chasis wireframe facetado con núcleo de CPU/RAM).
 *   - 3 Nodos satélite vinculados por vigas de comunicación láser (Strato Studio, VIISION, Workspace MTA ERP).
 * - Dinámica reactiva con `isDown` y `activeProblem`:
 *   - Modo Normal: Rotación suave, pulsos de datos circundantes dorados y verdes, integridad al 100%.
 *   - Modo Fallo / Sobrecarga (`isDown === true` o problema seleccionado):
 *     - El monolito tiembla sísmicamente con jitter de micro-fractura.
 *     - Las vigas de enlace parpadean y se disgregan en partículas de error rojo carmesí (#c6432b).
 *     - Los nodos de satélite pierden órbita y caen o parpadean en alarma.
 * - Soporta parallax orbital con mouse y optimización estricta de requestAnimationFrame.
 */
export function CriticalBottleneckCanvas({
  isActive = true,
  isDown = false,
  activeProblem = 0,
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
    camera.position.set(0, 0.5, 9.2);

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

    // 3. Grupo principal
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Anillo exterior de telemetría / radar
    const ringGeo = new THREE.RingGeometry(3.6, 3.65, 64);
    const ringWire = new THREE.WireframeGeometry(ringGeo);
    const ringMat = new THREE.LineBasicMaterial({
      color: 0x444444,
      transparent: true,
      opacity: 0.35,
    });
    const telemetryRing = new THREE.LineSegments(ringWire, ringMat);
    telemetryRing.rotation.x = Math.PI / 2.3;
    telemetryRing.position.y = -1.6;
    rootGroup.add(telemetryRing);

    // 4. Monolito Hostinger Central (Servidor Compartido SPOF)
    const serverChassisGeo = new THREE.BoxGeometry(1.8, 3.2, 1.8);
    const serverChassisWire = new THREE.WireframeGeometry(serverChassisGeo);
    const serverMat = new THREE.LineBasicMaterial({
      color: 0x888888,
      transparent: true,
      opacity: 0.8,
      linewidth: 1.5,
    });
    const serverMesh = new THREE.LineSegments(serverChassisWire, serverMat);
    rootGroup.add(serverMesh);

    // Núcleo de CPU/RAM (Icosaedro palpitante en el interior del chasis)
    const coreGeo = new THREE.IcosahedronGeometry(0.65, 1);
    const coreWire = new THREE.WireframeGeometry(coreGeo);
    const coreMat = new THREE.LineBasicMaterial({
      color: 0xd4a017,
      transparent: true,
      opacity: 0.9,
    });
    const coreMesh = new THREE.LineSegments(coreWire, coreMat);
    rootGroup.add(coreMesh);

    // 5. Los 3 Nodos de Aplicaciones Dependientes
    // Satélite 1: Workspace MTA (ERP)
    // Satélite 2: Strato Studio
    // Satélite 3: VIISION
    const satellites = [];
    const beams = [];
    const satConfigs = [
      { name: "ERP", color: 0xc6432b, pos: [-2.6, 1.4, 0.4], geo: new THREE.OctahedronGeometry(0.48, 0) },
      { name: "Strato", color: 0xd4a017, pos: [2.5, 1.1, -0.6], geo: new THREE.BoxGeometry(0.7, 0.7, 0.7) },
      { name: "VIISION", color: 0x6e8e59, pos: [0.1, -2.2, 1.5], geo: new THREE.DodecahedronGeometry(0.45, 0) },
    ];

    satConfigs.forEach((cfg) => {
      const group = new THREE.Group();
      group.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);

      const wire = new THREE.WireframeGeometry(cfg.geo);
      const mat = new THREE.LineBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.85,
      });
      const mesh = new THREE.LineSegments(wire, mat);
      group.add(mesh);

      rootGroup.add(group);
      satellites.push({ group, mesh, mat, basePos: [...cfg.pos], color: cfg.color });

      // Viga de conexión / Rayo de datos con el servidor central
      const lineMat = new THREE.LineDashedMaterial({
        color: cfg.color,
        dashSize: 0.2,
        gapSize: 0.1,
        transparent: true,
        opacity: 0.5,
      });
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(...cfg.pos),
      ]);
      const beamLine = new THREE.Line(lineGeo, lineMat);
      beamLine.computeLineDistances();
      rootGroup.add(beamLine);
      beams.push({ beamLine, lineMat, origColor: cfg.color, targetPos: new THREE.Vector3(...cfg.pos) });
    });

    // 6. Nube de Partículas de Estrés / Carga Concurrente (80 puntos)
    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = [];

    for (let i = 0; i < particleCount; i++) {
      const rad = 1.2 + Math.random() * 2.6;
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 4;

      particlePositions[i * 3] = Math.cos(angle) * rad;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = Math.sin(angle) * rad;

      particleSpeeds.push({
        angle,
        rad,
        y,
        speed: 0.015 + Math.random() * 0.025,
        fallSpeed: 0.05 + Math.random() * 0.07,
      });
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xf5f1e8,
      size: 0.055,
      transparent: true,
      opacity: 0.7,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particlePoints);

    // 7. Manejador de Parallax Suave por Mouse
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetMouseX = nx * 0.4;
      targetMouseY = ny * 0.25;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // 8. Resize Observer para reajuste responsive
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

    // 9. Loop de Animación con Tasa de Refresco
    const clock = new THREE.Clock();
    let isRunning = true;

    const animate = () => {
      if (!isRunning) return;
      animFrameId.current = requestAnimationFrame(animate);

      if (!isActive) return;

      const elapsed = clock.getElapsedTime();

      // Interpolar inercia de mouse
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const faultTriggered = isDown;

      if (faultTriggered) {
        // SACUDIDA ANALÓGICA POR COLAPSO (Jitter / Failure Oscillation)
        const jitterX = (Math.random() - 0.5) * 0.09;
        const jitterY = (Math.random() - 0.5) * 0.09;
        const jitterZ = (Math.random() - 0.5) * 0.09;

        rootGroup.position.set(jitterX, jitterY, jitterZ);
        rootGroup.rotation.y = elapsed * 0.4 + mouseX;
        rootGroup.rotation.x = -mouseY + (Math.random() - 0.5) * 0.03;

        // Servidor y Núcleo en Alarma Crítica Roja
        serverMat.color.setHex(0xc6432b);
        coreMat.color.setHex(0xc6432b);
        coreMesh.scale.set(1.4, 1.4, 1.4);
        particleMat.color.setHex(0xc6432b);

        // Satélites y vigas desconectadas
        beams.forEach((b) => {
          b.lineMat.color.setHex(0x551111);
          b.lineMat.opacity = Math.random() > 0.4 ? 0.3 : 0.05;
        });

        satellites.forEach((sat, idx) => {
          sat.mat.color.setHex(0x882222);
          sat.group.position.y = sat.basePos[1] + Math.sin(elapsed * 4 + idx) * 0.08 - 0.35;
          sat.group.rotation.x += 0.04;
          sat.group.rotation.z += 0.03;
        });
      } else {
        // MODO OPERATIVO NORMAL
        rootGroup.position.set(0, 0, 0);
        rootGroup.rotation.y = elapsed * 0.22 + mouseX;
        rootGroup.rotation.x = Math.sin(elapsed * 0.4) * 0.04 - mouseY;

        serverMat.color.setHex(0x777777);
        coreMat.color.setHex(0xd4a017);
        coreMesh.scale.set(1.0, 1.0, 1.0);
        particleMat.color.setHex(0xf5f1e8);

        beams.forEach((b) => {
          b.lineMat.color.setHex(b.origColor);
          b.lineMat.opacity = 0.6;
        });

        satellites.forEach((sat, idx) => {
          sat.mat.color.setHex(sat.color);
          // Órbita flotante armónica
          sat.group.position.y = sat.basePos[1] + Math.sin(elapsed * 1.5 + idx * 1.2) * 0.12;
          sat.group.rotation.y = elapsed * 0.8;
          sat.group.rotation.x = elapsed * 0.4;
        });
      }

      // Rotación del núcleo central
      coreMesh.rotation.y = elapsed * 1.4;
      coreMesh.rotation.x = elapsed * 0.9;
      telemetryRing.rotation.z = elapsed * 0.1;

      // Actualizar partículas
      const posArr = particlePoints.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const sp = particleSpeeds[i];
        if (faultTriggered) {
          // Colapso descendente
          posArr[i * 3 + 1] -= sp.fallSpeed;
          if (posArr[i * 3 + 1] < -3.2) {
            posArr[i * 3 + 1] = 3.2;
          }
        } else {
          // Órbita cilíndrica constante
          sp.angle += sp.speed;
          posArr[i * 3] = Math.cos(sp.angle) * sp.rad;
          posArr[i * 3 + 2] = Math.sin(sp.angle) * sp.rad;
        }
      }
      particlePoints.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      isRunning = false;
      window.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isActive, isDown, activeProblem]);

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

export default CriticalBottleneckCanvas;
