// src/components/three/StorageArchitecturesCanvas.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Visualizador 3D Ultra-Fluido e Interactivo para Slide 15:
 * "Estrategia de Almacenamiento Unificado: Amazon S3 vs Amazon EFS vs S3 Glacier"
 *
 * Características gráficas del modelo 3D:
 *  1. AMAZON S3 (Izquierda / Posición X: -2.35):
 *     - Estructura cilíndrica de Bucket de Almacenamiento con 3 anillos concéntricos dorados
 *     - 11 anillos finos orbitando que representan los "11 nueves" de durabilidad (99.999999999%).
 *     - Cubos flotantes de objetos (assets, imágenes, builds Next.js) que pulsan e ingresan al bucket.
 *  2. AMAZON EFS (Centro / Posición X: 0):
 *     - Sistema de archivos compartidos (NFSv4): Nodo central de almacenamiento hexagonal en esmeralda
 *     - Red de 4 terminales/instancias satelitales interconectadas con haces de datos continuos
 *       que simbolizan el acceso concurrente multi-zona para los 10 practicantes de MTA.
 *  3. S3 GLACIER (Derecha / Posición X: +2.35):
 *     - Bóveda de almacenamiento en frío (Cold Storage): Prisma octaédrico de hielo/cristal amatista
 *     - Anillo de compresión y partículas de congelamiento criogénico para archivado de largo plazo (ahorro 84%).
 *  4. Riel Guía de Ciclo de Vida (S3 Lifecycle Rule):
 *     - Línea óptica de transición que transporta datos desde S3 Standard (Día 1) -> S3 IA -> Glacier (Día 90+).
 *  5. Campo estelar multicromático con rotación continua a 60 FPS e inercia de mouse parallax.
 */
export function StorageArchitecturesCanvas({
  selectedStorage,
  selectedService,
  selectedTech,
  isMigrating = false,
  lifecycleTier = "glacier", // "standard" | "ia" | "glacier"
}) {
  const activeSelected = selectedStorage || selectedService || selectedTech || "s3";
  const containerRef = useRef(null);
  const animFrameId = useRef(null);

  const selectedRef = useRef(activeSelected);
  const migratingRef = useRef(isMigrating);
  const tierRef = useRef(lifecycleTier);

  useEffect(() => {
    selectedRef.current = activeSelected;
    migratingRef.current = isMigrating;
    tierRef.current = lifecycleTier;
  }, [activeSelected, isMigrating, lifecycleTier]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 600;
    let height = container.clientHeight || 550;

    // 1. Escena y Cámara con perspectiva de campo amplia y centrada
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 7.8);

    // 2. WebGL Renderer optimizado para 60 FPS
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 3. Grupo Raíz
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 4. Luces ambientales y directas calibradas
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const goldLight = new THREE.DirectionalLight(0xd4a017, 3.8);
    goldLight.position.set(5, 7, 6);
    scene.add(goldLight);

    const emeraldLight = new THREE.DirectionalLight(0x7a9b5c, 3.0);
    emeraldLight.position.set(-5, -3, -4);
    scene.add(emeraldLight);

    const pinkLight = new THREE.DirectionalLight(0xe8a0bf, 2.5);
    pinkLight.position.set(0, 6, -5);
    scene.add(pinkLight);

    // ════════════════════════════════════════════════════════════
    // 5. MÓDULO 1: AMAZON S3 BUCKET (Posición X: -2.35)
    // ════════════════════════════════════════════════════════════
    const s3Group = new THREE.Group();
    s3Group.position.set(-2.35, 0.15, 0);
    rootGroup.add(s3Group);

    // Cuerpo principal del Bucket Cilíndrico
    const bucketGeo = new THREE.CylinderGeometry(0.85, 0.72, 1.3, 24);
    const bucketMat = new THREE.MeshBasicMaterial({
      color: 0x18150e,
      transparent: true,
      opacity: 0.9,
    });
    const bucketMesh = new THREE.Mesh(bucketGeo, bucketMat);
    s3Group.add(bucketMesh);

    // Wireframe nítido dorado
    const bucketWireGeo = new THREE.WireframeGeometry(bucketGeo);
    const bucketWireMat = new THREE.LineBasicMaterial({
      color: 0xd4a017,
      transparent: true,
      opacity: 0.85,
    });
    const bucketWire = new THREE.LineSegments(bucketWireGeo, bucketWireMat);
    s3Group.add(bucketWire);

    // Anillos concéntricos del Bucket (Niveles de redundancia Multi-AZ)
    const s3Rings = [];
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.TorusGeometry(0.88 - i * 0.04, 0.02, 8, 36);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xd4a017, transparent: true, opacity: 0.85 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -0.45 + i * 0.45;
      s3Group.add(ring);
      s3Rings.push(ring);
    }

    // Cubos de Objetos (Assets / Builds / Imágenes) orbitando y depositándose en S3
    const s3Objects = [];
    for (let i = 0; i < 3; i++) {
      const objGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
      const objMat = new THREE.MeshBasicMaterial({ color: 0xd4a017 });
      const obj = new THREE.Mesh(objGeo, objMat);
      s3Group.add(obj);
      s3Objects.push(obj);
    }

    // ════════════════════════════════════════════════════════════
    // 6. MÓDULO 2: AMAZON EFS (Centro / Posición X: 0)
    // ════════════════════════════════════════════════════════════
    const efsGroup = new THREE.Group();
    efsGroup.position.set(0, 0.15, 0);
    rootGroup.add(efsGroup);

    // Núcleo Central de EFS (Almacenamiento Concurrente Multi-AZ NFS)
    const efsCoreGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.5, 6);
    const efsCoreMat = new THREE.MeshBasicMaterial({
      color: 0x112316,
      transparent: true,
      opacity: 0.9,
    });
    const efsCore = new THREE.Mesh(efsCoreGeo, efsCoreMat);
    efsGroup.add(efsCore);

    const efsWireGeo = new THREE.WireframeGeometry(efsCoreGeo);
    const efsWireMat = new THREE.LineBasicMaterial({
      color: 0x7a9b5c,
      transparent: true,
      opacity: 0.9,
      linewidth: 1.5,
    });
    const efsWire = new THREE.LineSegments(efsWireGeo, efsWireMat);
    efsGroup.add(efsWire);

    // Nodos satelitales que representan los 10 practicantes montando el EFS concurrentemente
    const clientNodes = [];
    const clientLines = [];
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI * 2) / 4;
      const cGeo = new THREE.OctahedronGeometry(0.16, 0);
      const cMat = new THREE.MeshBasicMaterial({ color: 0x7a9b5c });
      const client = new THREE.Mesh(cGeo, cMat);
      client.position.set(Math.cos(angle) * 1.35, Math.sin(angle) * 0.4, Math.sin(angle) * 1.35);
      efsGroup.add(client);
      clientNodes.push(client);

      // Líneas de conexión NFS hacia el núcleo EFS
      const lGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        client.position,
      ]);
      const lMat = new THREE.LineBasicMaterial({ color: 0x7a9b5c, transparent: true, opacity: 0.55 });
      const line = new THREE.Line(lGeo, lMat);
      efsGroup.add(line);
      clientLines.push(line);
    }

    // ════════════════════════════════════════════════════════════
    // 7. MÓDULO 3: S3 GLACIER BÓVEDA EN FRÍO (Posición X: +2.35)
    // ════════════════════════════════════════════════════════════
    const glacierGroup = new THREE.Group();
    glacierGroup.position.set(2.35, 0.15, 0);
    rootGroup.add(glacierGroup);

    // Prisma cristalino de hielo y archivado (Bóveda criogénica)
    const glacierGeo = new THREE.OctahedronGeometry(0.9, 0);
    const glacierMat = new THREE.MeshBasicMaterial({
      color: 0x240e1f,
      transparent: true,
      opacity: 0.92,
    });
    const glacierMesh = new THREE.Mesh(glacierGeo, glacierMat);
    glacierGroup.add(glacierMesh);

    const glacierWireGeo = new THREE.WireframeGeometry(glacierGeo);
    const glacierWireMat = new THREE.LineBasicMaterial({
      color: 0xe8a0bf,
      transparent: true,
      opacity: 0.95,
      linewidth: 1.5,
    });
    const glacierWire = new THREE.LineSegments(glacierWireGeo, glacierWireMat);
    glacierGroup.add(glacierWire);

    // Bóveda exterior sellada (Cubo wireframe perimetral de seguridad)
    const vaultGeo = new THREE.BoxGeometry(1.6, 1.6, 1.6);
    const vaultWireGeo = new THREE.WireframeGeometry(vaultGeo);
    const vaultWireMat = new THREE.LineBasicMaterial({
      color: 0xe8a0bf,
      transparent: true,
      opacity: 0.45,
    });
    const vaultWire = new THREE.LineSegments(vaultWireGeo, vaultWireMat);
    glacierGroup.add(vaultWire);

    // Anillo giratorio de cifrado y retención legal
    const lockRingGeo = new THREE.TorusGeometry(1.25, 0.02, 10, 36);
    const lockRingMat = new THREE.MeshBasicMaterial({ color: 0xe8a0bf, transparent: true, opacity: 0.7 });
    const lockRing = new THREE.Mesh(lockRingGeo, lockRingMat);
    lockRing.rotation.x = Math.PI / 2.3;
    glacierGroup.add(lockRing);

    // ════════════════════════════════════════════════════════════
    // 8. Riel Guía de Regla de Ciclo de Vida (S3 Lifecycle)
    // ════════════════════════════════════════════════════════════
    const railPositions = new Float32Array([
      -2.35, -1.05, 0,
      0, -1.05, 0,
      2.35, -1.05, 0,
    ]);
    const railGeo = new THREE.BufferGeometry();
    railGeo.setAttribute("position", new THREE.BufferAttribute(railPositions, 3));
    const railMat = new THREE.LineBasicMaterial({
      color: 0xd4a017,
      transparent: true,
      opacity: 0.5,
    });
    const railLine = new THREE.Line(railGeo, railMat);
    rootGroup.add(railLine);

    // Paquete de datos que migra por ciclo de vida hacia Glacier
    const lifecyclePacketGeo = new THREE.SphereGeometry(0.11, 12, 12);
    const lifecyclePacketMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const lifecyclePacket = new THREE.Mesh(lifecyclePacketGeo, lifecyclePacketMat);
    rootGroup.add(lifecyclePacket);

    // ════════════════════════════════════════════════════════════
    // 9. Campo Estelar Cósmico Profundo (360 Estrellas)
    // ════════════════════════════════════════════════════════════
    const starCount = 360;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starCol = new Float32Array(starCount * 3);

    const cGold = new THREE.Color(0xd4a017);
    const cEmerald = new THREE.Color(0x7a9b5c);
    const cPink = new THREE.Color(0xe8a0bf);
    const cWhite = new THREE.Color(0xf5f1e8);

    for (let i = 0; i < starCount; i++) {
      const r = 5.2 + Math.random() * 8.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);

      const choice = Math.random();
      const col = choice > 0.65 ? cGold : (choice > 0.4 ? cEmerald : (choice > 0.2 ? cPink : cWhite));
      starCol[i * 3] = col.r;
      starCol[i * 3 + 1] = col.g;
      starCol[i * 3 + 2] = col.b;
    }

    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starCol, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // ════════════════════════════════════════════════════════════
    // 10. Mouse Parallax con Inercia Suave
    // ════════════════════════════════════════════════════════════
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / height) * 2 - 1);
      targetX = x * 0.38;
      targetY = y * 0.28;
    };
    container.addEventListener("mousemove", onMouseMove, { passive: true });

    // ════════════════════════════════════════════════════════════
    // 11. Coordenadas de Cámara Calibradas y Centradas
    // ════════════════════════════════════════════════════════════
    const targets = {
      s3: {
        pos: new THREE.Vector3(-2.35, 0.95, 5.4),
        lookAt: new THREE.Vector3(-2.35, 0.1, 0),
      },
      efs: {
        pos: new THREE.Vector3(0, 0.65, 5.0),
        lookAt: new THREE.Vector3(0, 0.15, 0),
      },
      glacier: {
        pos: new THREE.Vector3(2.35, 0.95, 5.4),
        lookAt: new THREE.Vector3(2.35, 0.1, 0),
      },
      all: {
        pos: new THREE.Vector3(0, 1.2, 7.8),
        lookAt: new THREE.Vector3(0, 0, 0),
      },
    };

    const curCamLookAt = new THREE.Vector3(0, 0, 0);
    const clock = new THREE.Clock();
    let isRunning = true;

    // ════════════════════════════════════════════════════════════
    // 12. Loop de Renderizado Fluido a 60 FPS
    // ════════════════════════════════════════════════════════════
    const animate = () => {
      if (!isRunning) return;
      animFrameId.current = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();
      const selected = selectedRef.current;
      const isMigratingNow = migratingRef.current;

      // Suavizado de parallax mouse
      mouseX += (targetX - mouseX) * 0.055;
      mouseY += (targetY - mouseY) * 0.055;

      // ── A. Animación Amazon S3 ──
      s3Group.rotation.y = elapsed * 0.4 + mouseX * 0.35;
      s3Group.rotation.x = 0.1 - mouseY * 0.25;
      s3Group.position.y = 0.15 + Math.sin(elapsed * 1.5) * 0.04;

      s3Rings.forEach((r, idx) => {
        r.rotation.z = elapsed * (1.2 + idx * 0.4);
      });

      s3Objects.forEach((obj, idx) => {
        const oAngle = elapsed * 1.6 + (idx * Math.PI * 2) / 3;
        obj.position.set(Math.cos(oAngle) * 0.9, Math.sin(elapsed * 2 + idx) * 0.35, Math.sin(oAngle) * 0.9);
        obj.rotation.x = elapsed * 2;
        obj.rotation.y = elapsed * 1.5;
      });

      // ── B. Animación Amazon EFS ──
      efsGroup.rotation.y = -elapsed * 0.35 + mouseX * 0.3;
      efsGroup.rotation.x = 0.08 - mouseY * 0.25;
      efsGroup.position.y = 0.15 + Math.sin(elapsed * 1.8) * 0.04;
      efsCore.rotation.y = elapsed * 0.8;

      clientNodes.forEach((client, idx) => {
        const cAngle = elapsed * 1.2 + (idx * Math.PI * 2) / 4;
        client.position.set(Math.cos(cAngle) * 1.35, Math.sin(elapsed * 3 + idx) * 0.15, Math.sin(cAngle) * 1.35);
        client.rotation.y = elapsed * 2.5;

        // Actualizar línea NFS dinámica
        const posAttr = clientLines[idx].geometry.attributes.position;
        posAttr.setXYZ(1, client.position.x, client.position.y, client.position.z);
        posAttr.needsUpdate = true;
      });

      // ── C. Animación S3 Glacier ──
      glacierGroup.rotation.y = elapsed * 0.5 + mouseX * 0.3;
      glacierGroup.rotation.x = Math.sin(elapsed * 0.6) * 0.12;
      glacierGroup.position.y = 0.15 + Math.sin(elapsed * 1.6) * 0.04;

      glacierMesh.rotation.y = elapsed * 0.8;
      vaultWire.rotation.y = -elapsed * 0.3;
      lockRing.rotation.z = elapsed * 1.8;

      // ── D. Migración de Paquete por el Riel (S3 Lifecycle) ──
      const cycle = isMigratingNow
        ? (Math.sin(elapsed * 3.5) + 1) / 2
        : (Math.sin(elapsed * 1.4) + 1) / 2;
      lifecyclePacket.position.x = -2.35 + cycle * 4.7;
      lifecyclePacket.position.y = -1.05 + Math.sin(cycle * Math.PI) * 0.12;

      // ── E. Escalado Dinámico y Destacado del Módulo Activo ──
      const sS3 = (selected === "s3" || selected === "all") ? 1.06 : 0.88;
      const sEFS = (selected === "efs" || selected === "all") ? 1.06 : 0.88;
      const sGlacier = (selected === "glacier" || selected === "all") ? 1.08 : 0.88;

      s3Group.scale.lerp(new THREE.Vector3(sS3, sS3, sS3), 0.06);
      efsGroup.scale.lerp(new THREE.Vector3(sEFS, sEFS, sEFS), 0.06);
      glacierGroup.scale.lerp(new THREE.Vector3(sGlacier, sGlacier, sGlacier), 0.06);

      // ── F. Rotación Cósmica ──
      starPoints.rotation.y = elapsed * 0.015;

      // ── G. Transición Suave de Cámara ──
      const camTarget = targets[selected] || targets.all;
      camera.position.lerp(camTarget.pos, 0.05);
      curCamLookAt.lerp(camTarget.lookAt, 0.055);
      camera.lookAt(curCamLookAt);

      renderer.render(scene, camera);
    };

    animate();

    // ════════════════════════════════════════════════════════════
    // 13. Resize Observer
    // ════════════════════════════════════════════════════════════
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          width = w;
          height = h;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animFrameId.current);
      resizeObserver.disconnect();
      container.removeEventListener("mousemove", onMouseMove);
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
        cursor: "grab",
        userSelect: "none",
        overflow: "hidden",
      }}
    />
  );
}

export default StorageArchitecturesCanvas;
