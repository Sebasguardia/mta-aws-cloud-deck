// src/components/three/HybridCoreCanvas.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Visualizador 3D Limpio, Icónico y Fluido para Slide 03:
 * "Naturaleza y Sector de la Empresa: MTA Software (Híbrido Metalmecánica + Software Cloud)"
 *
 * Diseño conceptual claro y elegante:
 *  1. [Lado/Capa Metalmecánica - Físico]:
 *     - Engranaje técnico de precisión industrial en tono esmeralda/oliva (#6E8E59).
 *     - Geometría limpia: Toroide con dientes ortogonales bien espaciados y rotación suave y pesada.
 *  2. [Lado/Capa Software & Cloud - Digital]:
 *     - Núcleo poliédrico brillante en Oro AWS (#D4A017) que representa la nube y el backend.
 *     - Anillo orbital de telecomunicaciones/datos con 3 nodos de proyectos clave (ERP Workspace, Strato Studio, VIISION).
 *     - Nube minimalista de 60 partículas estelares de datos (sin saturar la pantalla).
 *  3. Reactividad & Fluidez:
 *     - Responde al prop `activeMode` (0: Híbrido, 1: Solo Mecánica, 2: Solo Software)
 *     - Lerping suave y fluido de escala, opacidad y velocidad sin reiniciar ni parpadear el WebGL.
 *     - Parallax interactivo inercial con el movimiento del ratón.
 */
export function HybridCoreCanvas({
  isActive = true,
  activeMode = 0, // 0 = Híbrido / Ambos, 1 = Metalmecánica, 2 = Software TI
  onSelectMode = null,
}) {
  const containerRef = useRef(null);
  const animFrameId = useRef(null);
  const activeModeRef = useRef(activeMode);
  const pulseRef = useRef(0);

  useEffect(() => {
    activeModeRef.current = activeMode;
    pulseRef.current = 1.0;
  }, [activeMode]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 460;
    const height = container.clientHeight || 400;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
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

    // 3. Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // ── SUB-SISTEMA 1: ENGRANAJE METALMECÁNICO (Precisión Industrial) ──
    const metalGroup = new THREE.Group();
    rootGroup.add(metalGroup);

    // Aro exterior del engranaje
    const gearRingGeo = new THREE.TorusGeometry(1.6, 0.09, 12, 48);
    const gearRingWire = new THREE.WireframeGeometry(gearRingGeo);
    const gearMat = new THREE.LineBasicMaterial({
      color: 0x6e8e59, // Oliva/Esmeralda industrial
      transparent: true,
      opacity: 0.9,
    });
    const gearRingMesh = new THREE.LineSegments(gearRingWire, gearMat);
    gearRingMesh.rotation.x = Math.PI / 2;
    metalGroup.add(gearRingMesh);

    // 6 Dientes de engranaje mecánicos simétricos (claros y visibles)
    const teethCount = 6;
    const teethGroup = new THREE.Group();
    teethGroup.rotation.x = Math.PI / 2;
    for (let i = 0; i < teethCount; i++) {
      const angle = (i / teethCount) * Math.PI * 2;
      const toothGeo = new THREE.BoxGeometry(0.25, 0.22, 0.12);
      const toothWire = new THREE.WireframeGeometry(toothGeo);
      const toothMesh = new THREE.LineSegments(toothWire, gearMat);
      toothMesh.position.set(Math.cos(angle) * 1.76, Math.sin(angle) * 1.76, 0);
      toothMesh.rotation.z = angle;
      teethGroup.add(toothMesh);
    }
    metalGroup.add(teethGroup);

    // Eje interior de ensamblaje mecánico
    const axleGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.35, 12);
    const axleWire = new THREE.WireframeGeometry(axleGeo);
    const axleMesh = new THREE.LineSegments(axleWire, gearMat);
    axleMesh.rotation.x = Math.PI / 2;
    metalGroup.add(axleMesh);

    // ── SUB-SISTEMA 2: NÚCLEO DE SOFTWARE & CLOUD (Oro AWS) ──
    const cloudGroup = new THREE.Group();
    rootGroup.add(cloudGroup);

    // Núcleo cuántico central (Octaedro brillante)
    const coreGeo = new THREE.OctahedronGeometry(0.82, 0);
    const coreWire = new THREE.WireframeGeometry(coreGeo);
    const coreMat = new THREE.LineBasicMaterial({
      color: 0xd4a017, // Oro AWS
      transparent: true,
      opacity: 0.95,
      linewidth: 1.5,
    });
    const coreMesh = new THREE.LineSegments(coreWire, coreMat);
    cloudGroup.add(coreMesh);

    // Anillo orbital de datos y red cloud
    const orbitGeo = new THREE.TorusGeometry(2.35, 0.02, 12, 64);
    const orbitWire = new THREE.WireframeGeometry(orbitGeo);
    const orbitMat = new THREE.LineBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.6,
    });
    const orbitMesh = new THREE.LineSegments(orbitWire, orbitMat);
    orbitMesh.rotation.x = Math.PI / 3;
    cloudGroup.add(orbitMesh);

    // 3 Balizas / Nodos satélites (Workspace ERP, Strato Studio, VIISION)
    const nodeGeo = new THREE.DodecahedronGeometry(0.2, 0);
    const nodeWire = new THREE.WireframeGeometry(nodeGeo);
    const projectNodes = [];

    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2;
      const nMesh = new THREE.LineSegments(nodeWire, coreMat);
      const nGroup = new THREE.Group();
      nGroup.add(nMesh);
      cloudGroup.add(nGroup);

      // Rayo conector limpio al núcleo
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(Math.cos(angle) * 2.35, Math.sin(angle) * 0.4, Math.sin(angle) * 2.35),
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0xd4a017,
        transparent: true,
        opacity: 0.35,
      });
      const connLine = new THREE.Line(lineGeo, lineMat);
      cloudGroup.add(connLine);

      projectNodes.push({
        group: nGroup,
        mesh: nMesh,
        connLine,
        angle,
        speed: 0.012,
        radius: 2.35,
        yPhase: i * 2.1,
      });
    }

    // 60 Partículas sutiles de telemetría (limpias, sin ruido visual)
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const pVel = [];

    for (let i = 0; i < particleCount; i++) {
      const r = 1.3 + Math.random() * 2.2;
      const th = Math.random() * Math.PI * 2;
      const ph = (Math.random() - 0.5) * 0.9;
      particlePos[i * 3] = r * Math.cos(th) * Math.cos(ph);
      particlePos[i * 3 + 1] = r * Math.sin(ph);
      particlePos[i * 3 + 2] = r * Math.sin(th) * Math.cos(ph);
      pVel.push({ r, th, ph, speed: 0.008 + Math.random() * 0.01 });
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.055,
      color: 0xd4a017,
      transparent: true,
      opacity: 0.75,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    cloudGroup.add(particlePoints);

    // ── MOUSE PARALLAX & CLICK INTERACTION ──
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetMouseX = nx * 0.35;
      targetMouseY = ny * 0.25;
    };

    const handleClick = () => {
      pulseRef.current = 1.0;
      if (onSelectMode) {
        const next = (activeModeRef.current + 1) % 3;
        onSelectMode(next);
      }
    };

    container.addEventListener("mousemove", handleMouseMove, { passive: true });
    container.addEventListener("click", handleClick);

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

    // ── ANIMATION LOOP FLUIDO A 60 FPS ──
    const clock = new THREE.Clock();
    let isRunning = true;

    let targetMetalScale = 1.0;
    let targetMetalOpacity = 0.9;
    let targetCloudScale = 1.0;
    let targetCloudOpacity = 0.95;

    let curMetalScale = 1.0;
    let curCloudScale = 1.0;

    const animate = () => {
      if (!isRunning) return;
      animFrameId.current = requestAnimationFrame(animate);

      if (!isActive) return;

      const elapsed = clock.getElapsedTime();

      // Parallax suave
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Pulse decay
      if (pulseRef.current > 0.01) {
        pulseRef.current *= 0.92;
      } else {
        pulseRef.current = 0;
      }
      const pulse = pulseRef.current;

      // Evaluar modo actual
      const mode = activeModeRef.current; // 0: Híbrido, 1: Metalmecánica, 2: Software TI
      if (mode === 0) {
        targetMetalScale = 1.0;
        targetMetalOpacity = 0.85;
        targetCloudScale = 1.0;
        targetCloudOpacity = 0.95;
      } else if (mode === 1) {
        // Enfatizar Metalmecánica (engranaje crece y se ilumina)
        targetMetalScale = 1.25;
        targetMetalOpacity = 1.0;
        targetCloudScale = 0.65;
        targetCloudOpacity = 0.2;
      } else if (mode === 2) {
        // Enfatizar Software (núcleo y nodos se expanden, engranaje se disuelve)
        targetMetalScale = 0.65;
        targetMetalOpacity = 0.2;
        targetCloudScale = 1.25;
        targetCloudOpacity = 1.0;
      }

      curMetalScale += (targetMetalScale - curMetalScale) * 0.08;
      curCloudScale += (targetCloudScale - curCloudScale) * 0.08;

      metalGroup.scale.setScalar(curMetalScale * (1 + pulse * 0.12));
      cloudGroup.scale.setScalar(curCloudScale * (1 + pulse * 0.14));

      gearMat.opacity = targetMetalOpacity;
      coreMat.opacity = targetCloudOpacity;
      orbitMat.opacity = targetCloudOpacity * 0.65;

      // Inclinación y rotación coordinada
      rootGroup.rotation.y = elapsed * 0.18 + mouseX;
      rootGroup.rotation.x = 0.35 + Math.sin(elapsed * 0.2) * 0.06 - mouseY;

      // Giro del engranaje mecánico (física ponderada)
      gearRingMesh.rotation.z = elapsed * 0.45;
      teethGroup.rotation.z = elapsed * 0.45;
      axleMesh.rotation.z = -elapsed * 0.3;

      // Rotación del núcleo de Software
      coreMesh.rotation.y = -elapsed * 0.7;
      coreMesh.rotation.z = elapsed * 0.35;
      coreMesh.scale.setScalar(1 + Math.sin(elapsed * 2.5) * 0.06 + pulse * 0.2);

      orbitMesh.rotation.z = elapsed * 0.25;

      // Órbita de los 3 proyectos satélites
      projectNodes.forEach((nd) => {
        nd.angle += nd.speed * (1 + pulse * 1.4);
        const nx = Math.cos(nd.angle) * nd.radius;
        const nz = Math.sin(nd.angle) * nd.radius;
        const ny = Math.sin(elapsed * 1.8 + nd.yPhase) * 0.35;

        nd.group.position.set(nx, ny, nz);
        nd.mesh.rotation.y = elapsed * 1.2;

        const posArr = nd.connLine.geometry.attributes.position.array;
        posArr[3] = nx;
        posArr[4] = ny;
        posArr[5] = nz;
        nd.connLine.geometry.attributes.position.needsUpdate = true;
      });

      // Partículas suaves de datos
      const pArr = particlePoints.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const pv = pVel[i];
        pv.th += pv.speed * (1 + pulse * 1.5);
        pArr[i * 3] = pv.r * Math.cos(pv.th) * Math.cos(pv.ph);
        pArr[i * 3 + 1] = pv.r * Math.sin(pv.ph) + Math.sin(elapsed * 1.2 + i) * 0.04;
        pArr[i * 3 + 2] = pv.r * Math.sin(pv.th) * Math.cos(pv.ph);
      }
      particlePoints.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      isRunning = false;
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("click", handleClick);
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
        minHeight: "360px",
        position: "relative",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      title="Clic para alternar enfoque 3D: [Híbrido] / [Mecánica] / [Software Cloud]"
      aria-label="Modelo 3D interactivo simplificado: Dualidad Metalmecánica y Software B2B de MTA"
    />
  );
}

export default HybridCoreCanvas;


