// src/components/three/PortfolioMonolithCanvas.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Visualizador 3D Interactivo y Holográfico para Slide 05: Portafolio de Proyectos.
 *
 * Características mejoradas:
 *  - Texturizado con las imágenes reales de los 3 proyectos (/assets/images):
 *      1. Strato Studio (/assets/images/strato.png) — Monolito comercial con framing dorado (#D4A017).
 *      2. VIISION (/assets/images/visiion.png) — Monolito B2B con framing esmeralda (#6E8E59).
 *      3. Workspace MTA (/assets/images/mta.png) — Núcleo ERP interno con ALERTA CRÍTICA (#C6432B / #FF4444).
 *         Diseño distintivo de reactor en peligro de caída operacional (SPOF) con pulsación de advertencia.
 *  - CERO RECARGA DE CANVAS: `activeIndex` e `isActive` se leen con `useRef`,
 *    las transiciones de foco y escala se resuelven mediante lerp matemático suave.
 *  - Clic en los monolitos 3D para seleccionar directamente el proyecto en la UI.
 */
export function PortfolioMonolithCanvas({
  isActive = true,
  activeIndex = 2,
  onSelectProject = null,
}) {
  const containerRef = useRef(null);
  const animFrameId = useRef(null);
  const activeIndexRef = useRef(activeIndex);
  const isActiveRef = useRef(isActive);
  const onSelectRef = useRef(onSelectProject);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    onSelectRef.current = onSelectProject;
  }, [onSelectProject]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 550;
    const height = container.clientHeight || 450;

    // 1. Scene & Camera — calibrada para encuadre completo de los 3 monolitos sin recortes
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.0, 8.2);

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

    // 3. Texture Loader para las 3 imágenes
    const textureLoader = new THREE.TextureLoader();
    const stratoTex = textureLoader.load("/assets/images/strato.png");
    const visiionTex = textureLoader.load("/assets/images/visiion.png");
    const mtaTex = textureLoader.load("/assets/images/mta.png");

    [stratoTex, visiionTex, mtaTex].forEach((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
    });

    // 4. Grupo Principal
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 5. Configuración de los 3 Monolitos (espaciado calibrado para encuadre completo)
    const projectsConfig = [
      {
        id: 0,
        name: "Strato Studio",
        texture: stratoTex,
        accentColor: 0xd4a017,
        xPos: -2.0,
        isInternalRisk: false,
      },
      {
        id: 1,
        name: "VIISION",
        texture: visiionTex,
        accentColor: 0x6e8e59,
        xPos: 0,
        isInternalRisk: false,
      },
      {
        id: 2,
        name: "Workspace MTA",
        texture: mtaTex,
        accentColor: 0xc6432b,
        xPos: 2.0,
        isInternalRisk: true, // ERP Crítico con riesgo de caída en Hostinger
      },
    ];

    const monolithObjects = [];
    const raycastTargets = [];

    projectsConfig.forEach((proj) => {
      const pGroup = new THREE.Group();
      pGroup.position.set(proj.xPos, 0, 0);
      rootGroup.add(pGroup);

      // --- Monolito Base (Placa/Pantalla Holográfica con Imagen) ---
      const plateGeo = new THREE.PlaneGeometry(1.6, 1.1);
      const plateMat = new THREE.MeshBasicMaterial({
        map: proj.texture,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide,
      });
      const plateMesh = new THREE.Mesh(plateGeo, plateMat);
      pGroup.add(plateMesh);

      // --- Marco Estructural Táctico (Wireframe alrededor de la imagen) ---
      const frameGeo = new THREE.BoxGeometry(1.68, 1.18, 0.12);
      const frameWire = new THREE.WireframeGeometry(frameGeo);
      const frameMat = new THREE.LineBasicMaterial({
        color: proj.accentColor,
        transparent: true,
        opacity: 0.8,
        linewidth: 1.5,
      });
      const frameMesh = new THREE.LineSegments(frameWire, frameMat);
      pGroup.add(frameMesh);

      // --- Halo/Pedestal de telemetría inferior ---
      const baseRingGeo = new THREE.TorusGeometry(0.85, 0.015, 8, 32);
      const baseRingWire = new THREE.WireframeGeometry(baseRingGeo);
      const baseRingMat = new THREE.LineBasicMaterial({
        color: proj.accentColor,
        transparent: true,
        opacity: 0.45,
      });
      const baseRingMesh = new THREE.LineSegments(baseRingWire, baseRingMat);
      baseRingMesh.rotation.x = Math.PI / 2;
      baseRingMesh.position.y = -0.75;
      pGroup.add(baseRingMesh);

      // --- Si es Workspace MTA (ERP Interno): Adicionar baliza de RIESGO CRÍTICO ---
      let warningBeacon = null;
      let warningHalo = null;
      if (proj.isInternalRisk) {
        // Octaedro de advertencia pulsante encima del monolito
        const beaconGeo = new THREE.OctahedronGeometry(0.24, 0);
        const beaconWire = new THREE.WireframeGeometry(beaconGeo);
        const beaconMat = new THREE.LineBasicMaterial({
          color: 0xff3333,
          transparent: true,
          opacity: 0.95,
        });
        warningBeacon = new THREE.LineSegments(beaconWire, beaconMat);
        warningBeacon.position.y = 0.85;
        pGroup.add(warningBeacon);

        // Anillo de alerta en ángulo
        const warnRingGeo = new THREE.TorusGeometry(0.38, 0.012, 8, 24);
        const warnRingWire = new THREE.WireframeGeometry(warnRingGeo);
        const warnRingMat = new THREE.LineBasicMaterial({
          color: 0xff2222,
          transparent: true,
          opacity: 0.7,
        });
        warningHalo = new THREE.LineSegments(warnRingWire, warnRingMat);
        warningHalo.rotation.x = Math.PI / 2.3;
        warningBeacon.add(warningHalo);
      }

      // Invisible bounding box for raycasting clicks
      const hitGeo = new THREE.BoxGeometry(1.8, 1.6, 0.5);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.userData = { id: proj.id };
      pGroup.add(hitMesh);
      raycastTargets.push(hitMesh);

      monolithObjects.push({
        group: pGroup,
        plateMesh,
        frameMesh,
        frameMat,
        baseRingMesh,
        warningBeacon,
        warningHalo,
        id: proj.id,
        isInternalRisk: proj.isInternalRisk,
        accentColor: proj.accentColor,
        baseX: proj.xPos,
      });
    });

    // 6. Enlace de bus de datos entre los 3 monolitos (Representando el SPOF de Hostinger)
    const busPoints = [
      new THREE.Vector3(-2.0, -0.75, 0),
      new THREE.Vector3(0, -0.75, 0),
      new THREE.Vector3(2.0, -0.75, 0),
    ];
    const busGeo = new THREE.BufferGeometry().setFromPoints(busPoints);
    const busMat = new THREE.LineBasicMaterial({
      color: 0xc6432b,
      transparent: true,
      opacity: 0.35,
    });
    const busLine = new THREE.Line(busGeo, busMat);
    rootGroup.add(busLine);

    // 7. Partículas de carga de servidor (80 puntos)
    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const pVel = [];

    for (let i = 0; i < particleCount; i++) {
      const px = (Math.random() - 0.5) * 6.5;
      const py = (Math.random() - 0.5) * 2.8;
      const pz = (Math.random() - 0.5) * 2.0;
      particlePos[i * 3] = px;
      particlePos[i * 3 + 1] = py;
      particlePos[i * 3 + 2] = pz;
      pVel.push({
        x: px,
        y: py,
        z: pz,
        speed: 0.005 + Math.random() * 0.01,
      });
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.045,
      color: 0xd4a017,
      transparent: true,
      opacity: 0.7,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particlePoints);

    // 8. Interacción de Mouse, Parallax & Raycasting
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    const raycaster = new THREE.Raycaster();
    const mouseCoord = new THREE.Vector2();

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetMouseX = nx * 0.35;
      targetMouseY = ny * 0.2;
    };

    const handleClick = (e) => {
      const rect = container.getBoundingClientRect();
      mouseCoord.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseCoord.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouseCoord, camera);
      const intersects = raycaster.intersectObjects(raycastTargets);
      if (intersects.length > 0) {
        const clickedId = intersects[0].object.userData.id;
        if (onSelectRef.current) {
          onSelectRef.current(clickedId);
        }
      }
    };

    container.addEventListener("mousemove", handleMouseMove, { passive: true });
    container.addEventListener("click", handleClick);

    // Resize Observer
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

    // 9. Render Loop Continuo y Fluido
    const clock = new THREE.Clock();
    let isRunning = true;

    const animate = () => {
      if (!isRunning) return;
      animFrameId.current = requestAnimationFrame(animate);

      if (!isActiveRef.current) return;

      const elapsed = clock.getElapsedTime();

      // Inercia de ratón
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      rootGroup.rotation.y = mouseX * 0.6;
      rootGroup.rotation.x = -mouseY * 0.4;

      const activeIdx = activeIndexRef.current;

      // Desplazamiento cinemático suave para centrar el cliente seleccionado en pantalla
      // baseX: Strato = -2.0, VIISION = 0, MTA = 2.0
      // Al restar el baseX del seleccionado, ese monolito se traslada exactamente a x = 0 (centro)
      const selectedObj = monolithObjects.find((m) => m.id === activeIdx);
      const targetCenterX = selectedObj ? -selectedObj.baseX : 0;
      rootGroup.position.x += (targetCenterX - rootGroup.position.x) * 0.08;

      // Animar cada monolito
      monolithObjects.forEach((m) => {
        const isSelected = m.id === activeIdx;

        // Foco visual y escalado suave
        const targetScale = isSelected ? 1.15 : 0.82;
        const targetZ = isSelected ? 0.45 : -0.15;
        m.group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        m.group.position.z += (targetZ - m.group.position.z) * 0.1;

        // Levitación flotante
        m.group.position.y = Math.sin(elapsed * 1.5 + m.id * 1.2) * 0.08;

        // Suave rotación oscilante
        m.group.rotation.y = Math.sin(elapsed * 0.8 + m.id) * 0.12;

        // Resplandor del marco activo
        m.frameMat.opacity = isSelected ? 1.0 : 0.4;
        m.plateMesh.material.opacity = isSelected ? 1.0 : 0.75;

        // Animación especial para Workspace MTA (Riesgo y parálisis)
        if (m.warningBeacon) {
          const blink = Math.sin(elapsed * 5) * 0.3 + 0.7;
          m.warningBeacon.rotation.y = elapsed * 1.8;
          m.warningBeacon.scale.setScalar(1 + (blink - 0.7) * 0.4);
          if (m.warningHalo) {
            m.warningHalo.rotation.z = -elapsed * 2.2;
          }
        }
      });

      // Partículas flotando suavemente
      const posArr = particlePoints.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const pv = pVel[i];
        posArr[i * 3 + 1] = pv.y + Math.sin(elapsed * 1.2 + i) * 0.06;
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
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        cursor: "pointer",
        overflow: "hidden",
      }}
      title="Haz clic sobre cualquier monolito para inspeccionarlo en detalle"
    />
  );
}

export default PortfolioMonolithCanvas;

