// src/components/three/IamSecurityCanvas.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Visualizador 3D Interactivo para Slide 11:
 * "Gobierno y Ciberseguridad con AWS IAM"
 *
 * Muestra el contraste visual entre:
 *  - `isRoot === true`:
 *    - Un único candado central gigante parpadeando en rojo carmesí (#C6432B) con grietas y alerta de brecha.
 *    - Los 10 nodos de desarrolladores están colapsados y amontonados detrás del mismo punto único vulnerable.
 *  - `isRoot === false` (Modo AWS IAM):
 *    - El candado central se transforma en un escudo poliédrico dorado brillante (AWS Shield / IAM Core).
 *    - Los 10 nodos se distribuyen en una matriz circular coordinada, cada uno protegido por su propia
 *      burbuja / micro-escudo con haz de permisos cifrados individual.
 *
 * Directivas de animación y física Three.js:
 *  - Lerp e interpolación inercial continua para el morphing suave entre estados.
 *  - Parallax con mouse responsivo.
 *  - Limpieza adecuada de memoria y listeners WebGL.
 */
export function IamSecurityCanvas({ isActive = true, isRoot = false, selectedUserId = null }) {
  const containerRef = useRef(null);
  const animFrameId = useRef(null);

  // Mantener referencias mutables para no destruir ni reiniciar la escena 3D WebGL
  const isRootRef = useRef(isRoot);
  const selectedUserIdRef = useRef(selectedUserId);
  const targetRotationYRef = useRef(0);
  const rotationBoostRef = useRef(0);

  useEffect(() => {
    isRootRef.current = isRoot;
  }, [isRoot]);

  useEffect(() => {
    selectedUserIdRef.current = selectedUserId;
    if (selectedUserId) {
      // Girar suavemente la constelación 3D para encarar de frente al practicante seleccionado
      const index = selectedUserId - 1;
      const nodeCount = 10;
      // Posición angular del nodo en la matriz circular
      const nodeAngle = (index / nodeCount) * Math.PI * 2;
      // Para que el nodo mire al frente (eje Z positivo hacia la cámara), rotamos el grupo
      targetRotationYRef.current = -nodeAngle;
      rotationBoostRef.current = 0.5; // Impulso dinámico al seleccionar
    }
  }, [selectedUserId]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;

    // 1. Escena y Cámara con perspectiva amplia para evitar clipping
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 9.8);

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

    // Radar / Disco perimetral de seguridad
    const radarGeo = new THREE.RingGeometry(3.6, 3.65, 64);
    const radarWire = new THREE.WireframeGeometry(radarGeo);
    const radarMat = new THREE.LineBasicMaterial({
      color: 0x444444,
      transparent: true,
      opacity: 0.35,
    });
    const radarMesh = new THREE.LineSegments(radarWire, radarMat);
    radarMesh.rotation.x = Math.PI / 2.2;
    radarMesh.position.y = -1.8;
    rootGroup.add(radarMesh);

    // ── 4. Núcleo de Autoridad de Acceso (Escudo / Candado Central) ──
    // Escudo / Dodecaedro principal
    const shieldGeo = new THREE.DodecahedronGeometry(1.2, 0);
    const shieldWire = new THREE.WireframeGeometry(shieldGeo);
    const shieldMat = new THREE.LineBasicMaterial({
      color: 0xd4a017,
      transparent: true,
      opacity: 0.9,
      linewidth: 1.5,
    });
    const shieldMesh = new THREE.LineSegments(shieldWire, shieldMat);
    rootGroup.add(shieldMesh);

    // Núcleo interno de llaves criptográficas (Octaedro)
    const keyCoreGeo = new THREE.OctahedronGeometry(0.65, 0);
    const keyCoreWire = new THREE.WireframeGeometry(keyCoreGeo);
    const keyCoreMat = new THREE.LineBasicMaterial({
      color: 0xf5f1e8,
      transparent: true,
      opacity: 0.8,
    });
    const keyCoreMesh = new THREE.LineSegments(keyCoreWire, keyCoreMat);
    rootGroup.add(keyCoreMesh);

    // ── 5. Los 10 Nodos de Practicantes (Usuarios IAM / Avatares) ──
    const nodeCount = 10;
    const nodes = [];
    const nodeGeo = new THREE.IcosahedronGeometry(0.32, 0);
    const nodeWire = new THREE.WireframeGeometry(nodeGeo);

    for (let i = 0; i < nodeCount; i++) {
      // Estado Root: Apilados y superpuestos caóticamente detrás del candado
      const angleRoot = (i / nodeCount) * Math.PI * 2;
      const posRoot = new THREE.Vector3(
        Math.cos(angleRoot) * 0.7,
        -0.5 + (i * 0.1),
        Math.sin(angleRoot) * 0.7
      );

      // Estado IAM: Matriz circular de radio 2.9 con micro-elevación armónica
      const angleIam = (i / nodeCount) * Math.PI * 2;
      const radiusIam = 2.9;
      const posIam = new THREE.Vector3(
        Math.cos(angleIam) * radiusIam,
        Math.sin(angleIam * 2) * 0.5,
        Math.sin(angleIam) * radiusIam
      );

      const mat = new THREE.LineBasicMaterial({
        color: 0x6e8e59,
        transparent: true,
        opacity: 0.85,
      });
      const mesh = new THREE.LineSegments(nodeWire, mat);
      mesh.position.copy(posRoot);
      rootGroup.add(mesh);

      // Rayo de política de seguridad conectando con el núcleo
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        mesh.position.clone(),
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0xd4a017,
        transparent: true,
        opacity: 0.3,
      });
      const beamLine = new THREE.Line(lineGeo, lineMat);
      rootGroup.add(beamLine);

      nodes.push({
        id: i + 1,
        mesh,
        mat,
        beamLine,
        lineMat,
        posRoot,
        posIam,
        currentPos: posRoot.clone(),
        index: i,
      });
    }

    // ── 6. Nube de Token Keys / Partículas de Ciberseguridad (60 puntos) ──
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVel = [];

    for (let i = 0; i < particleCount; i++) {
      const rad = 1.2 + Math.random() * 2.4;
      const angle = Math.random() * Math.PI * 2;
      particlePositions[i * 3] = Math.cos(angle) * rad;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 3.5;
      particlePositions[i * 3 + 2] = Math.sin(angle) * rad;

      particleVel.push({
        angle,
        rad,
        speed: 0.012 + Math.random() * 0.02,
      });
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xd4a017,
      size: 0.05,
      transparent: true,
      opacity: 0.65,
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

    // ── 9. Loop de animación con Lerp continuo y rotación reactiva suave ──
    const clock = new THREE.Clock();
    let isRunning = true;
    let morphProgress = isRootRef.current ? 0 : 1;
    let currentBaseRotationY = 0;

    const animate = () => {
      if (!isRunning) return;
      animFrameId.current = requestAnimationFrame(animate);

      if (!isActive) return;

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const currentIsRoot = isRootRef.current;
      const currentSelectedId = selectedUserIdRef.current;

      // Parallax inercial
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const targetProg = currentIsRoot ? 0 : 1;
      morphProgress += (targetProg - morphProgress) * 0.08;

      // Rotación suave del grupo 3D:
      // Si hay un usuario seleccionado, lerpeamos hacia su ángulo frontal con un giro suave
      if (currentSelectedId && !currentIsRoot) {
        // Reducir impulso suavemente
        rotationBoostRef.current *= 0.92;
        // Interpolación fluida hacia el ángulo del usuario seleccionado
        currentBaseRotationY += (targetRotationYRef.current - currentBaseRotationY) * 0.06;
        // Agregamos una ligera oscilación sutil
        rootGroup.rotation.y = currentBaseRotationY + Math.sin(elapsed * 0.8) * 0.08 + mouseX;
      } else {
        // Rotación libre continua estándar
        currentBaseRotationY += delta * (0.2 + morphProgress * 0.15);
        rootGroup.rotation.y = currentBaseRotationY + mouseX;
      }

      rootGroup.position.set(0, 0, 0);
      rootGroup.rotation.x = Math.sin(elapsed * 0.3) * 0.04 - mouseY;

      // Dinámica según Modo Root vs Modo IAM
      if (morphProgress < 0.5) {
        // MODO ROOT EN RIESGO: Sacudida roja y alarma
        const jitter = (Math.random() - 0.5) * 0.05;
        shieldMesh.position.x = jitter;
        shieldMat.color.lerp(new THREE.Color(0xc6432b), 0.15);
        keyCoreMat.color.lerp(new THREE.Color(0xc6432b), 0.15);
        particleMat.color.lerp(new THREE.Color(0xc6432b), 0.15);
      } else {
        // MODO IAM SEGURO: Escudo dorado con núcleo esmeralda/blanco
        shieldMesh.position.x = 0;
        shieldMat.color.lerp(new THREE.Color(0xd4a017), 0.1);
        keyCoreMat.color.lerp(new THREE.Color(0x6e8e59), 0.1);
        particleMat.color.lerp(new THREE.Color(0xd4a017), 0.1);
      }

      shieldMesh.rotation.y = elapsed * 0.6;
      shieldMesh.rotation.z = elapsed * 0.3;
      keyCoreMesh.rotation.y = -elapsed * 1.2;
      keyCoreMesh.rotation.x = elapsed * 0.7;
      radarMesh.rotation.z = elapsed * 0.15;

      // Animar los 10 nodos de practicantes
      nodes.forEach((node) => {
        const dest = new THREE.Vector3().lerpVectors(node.posRoot, node.posIam, morphProgress);
        node.currentPos.lerp(dest, 0.1);
        node.mesh.position.copy(node.currentPos);

        node.mesh.position.y += Math.sin(elapsed * 2.5 + node.index) * 0.035;
        node.mesh.rotation.y = elapsed * (0.7 + node.index * 0.1);

        const isCurrentSelected = currentSelectedId === node.id;

        if (morphProgress < 0.5) {
          node.mat.color.lerp(new THREE.Color(0x882222), 0.1);
          node.lineMat.color.lerp(new THREE.Color(0xc6432b), 0.1);
          node.lineMat.opacity = 0.15;
          node.mesh.scale.set(1, 1, 1);
        } else {
          if (isCurrentSelected) {
            // Destacar brillantemente el nodo seleccionado
            node.mat.color.lerp(new THREE.Color(0xfff3a0), 0.25);
            node.lineMat.color.lerp(new THREE.Color(0xd4a017), 0.25);
            node.lineMat.opacity = 0.95;
            node.mesh.scale.lerp(new THREE.Vector3(1.5, 1.5, 1.5), 0.2);
          } else {
            node.mat.color.lerp(new THREE.Color(0x6e8e59), 0.1);
            node.lineMat.color.lerp(new THREE.Color(0xd4a017), 0.1);
            node.lineMat.opacity = 0.35;
            node.mesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.15);
          }
        }

        // Actualizar geometría de línea de conexión
        const linePos = node.beamLine.geometry.attributes.position.array;
        linePos[3] = node.mesh.position.x;
        linePos[4] = node.mesh.position.y;
        linePos[5] = node.mesh.position.z;
        node.beamLine.geometry.attributes.position.needsUpdate = true;
      });

      // Partículas orbitales
      const posArray = particlePoints.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const pv = particleVel[i];
        pv.angle += pv.speed * (1 + morphProgress);
        posArray[i * 3] = Math.cos(pv.angle) * pv.rad;
        posArray[i * 3 + 2] = Math.sin(pv.angle) * pv.rad;
      }
      particlePoints.geometry.attributes.position.needsUpdate = true;

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

export default IamSecurityCanvas;
