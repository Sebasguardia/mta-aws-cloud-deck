// src/components/three/DatabaseArchitecturesCanvas.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Visualizador 3D Ultra-Fluido e Interactivo para Slide 16:
 * "Bases de Datos Administradas en AWS: Amazon RDS vs Amazon Aurora vs DynamoDB"
 *
 * Características gráficas del modelo 3D:
 *  1. AMAZON RDS (PostgreSQL 16) Multi-AZ (Izquierda / Posición X: -2.35):
 *     - Torre cilíndrica de base de datos relacional de 3 discos concéntricos
 *     - Anillo orbital Multi-AZ de replicación síncrona en tiempo real con nodo Standby espejo
 *     - Red de tablas relacionales unidas por claves foráneas (FK) con pulso ACID verde esmeralda.
 *  2. AMAZON AURORA SERVERLESS v2 (Centro / Posición X: 0):
 *     - Matriz de almacenamiento distribuida en 6 copias repartidas en 3 Zonas de Disponibilidad (AZs)
 *     - Núcleo estelar poliédrico auto-reparable que escala elásticamente en segundos
 *     - Haces de replicación paralela y anillos orbitales dorados de alto throughput (3x PostgreSQL).
 *  3. AMAZON DYNAMODB NoSQL (Derecha / Posición X: +2.35):
 *     - Tabla de partición plana con matriz de cubos clave-valor (KV) y documentos JSON
 *     - Dispersión horizontal elástica que representa la escalabilidad sin límites a latencia < 10ms.
 *  4. Riel de Datos Transaccional (SQL Engine / Write-Read Path):
 *     - Conexión óptica que muestra el flujo de transacciones ACID y consultas JOIN con partículas de telemetría.
 *  5. Campo estelar multicromático con rotación continua a 60 FPS e inercia de mouse parallax.
 */
export function DatabaseArchitecturesCanvas({
  selectedEngine = "rds", // "rds" | "aurora" | "dynamodb"
  isExecutingQuery = false,
}) {
  const containerRef = useRef(null);
  const animFrameId = useRef(null);

  const selectedRef = useRef(selectedEngine);
  const executingRef = useRef(isExecutingQuery);

  useEffect(() => {
    selectedRef.current = selectedEngine;
    executingRef.current = isExecutingQuery;
  }, [selectedEngine, isExecutingQuery]);

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

    const emeraldLight = new THREE.DirectionalLight(0x7a9b5c, 3.2);
    emeraldLight.position.set(-5, -3, -4);
    scene.add(emeraldLight);

    const pinkLight = new THREE.DirectionalLight(0xe8a0bf, 2.5);
    pinkLight.position.set(0, 6, -5);
    scene.add(pinkLight);

    // ════════════════════════════════════════════════════════════
    // 5. MÓDULO 1: AMAZON RDS (PostgreSQL Multi-AZ) (X: -2.35)
    // ════════════════════════════════════════════════════════════
    const rdsGroup = new THREE.Group();
    rdsGroup.position.set(-2.35, 0.15, 0);
    rootGroup.add(rdsGroup);

    // Torre de 3 platos cilíndricos de base de datos relacional (RDBMS)
    const rdsDisks = [];
    for (let i = 0; i < 3; i++) {
      const dGeo = new THREE.CylinderGeometry(0.78, 0.78, 0.28, 28);
      const dMat = new THREE.MeshBasicMaterial({
        color: 0x112316,
        transparent: true,
        opacity: 0.9,
      });
      const disk = new THREE.Mesh(dGeo, dMat);
      disk.position.y = -0.42 + i * 0.42;
      rdsGroup.add(disk);

      const dWireGeo = new THREE.WireframeGeometry(dGeo);
      const dWireMat = new THREE.LineBasicMaterial({
        color: 0x7a9b5c,
        transparent: true,
        opacity: 0.85,
        linewidth: 1.5,
      });
      const dWire = new THREE.LineSegments(dWireGeo, dWireMat);
      disk.add(dWire);
      rdsDisks.push(disk);
    }

    // Anillo exterior de replicación síncrona Multi-AZ
    const rdsReplRingGeo = new THREE.TorusGeometry(1.22, 0.022, 10, 36);
    const rdsReplRingMat = new THREE.MeshBasicMaterial({ color: 0x7a9b5c, transparent: true, opacity: 0.75 });
    const rdsReplRing = new THREE.Mesh(rdsReplRingGeo, rdsReplRingMat);
    rdsReplRing.rotation.x = Math.PI / 2.3;
    rdsGroup.add(rdsReplRing);

    // Nodo espejo Standby Multi-AZ orbitando
    const standbyGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.24, 16);
    const standbyMat = new THREE.MeshBasicMaterial({ color: 0xd4a017 });
    const standbyNode = new THREE.Mesh(standbyGeo, standbyMat);
    rdsGroup.add(standbyNode);

    // ════════════════════════════════════════════════════════════
    // 6. MÓDULO 2: AMAZON AURORA SERVERLESS v2 (X: 0)
    // ════════════════════════════════════════════════════════════
    const auroraGroup = new THREE.Group();
    auroraGroup.position.set(0, 0.15, 0);
    rootGroup.add(auroraGroup);

    // Núcleo hiper-escalable de Aurora (Icosaedro poliédrico dorado con auto-scaling)
    const auroraCoreGeo = new THREE.IcosahedronGeometry(0.85, 0);
    const auroraCoreMat = new THREE.MeshBasicMaterial({
      color: 0x2a200a,
      transparent: true,
      opacity: 0.92,
    });
    const auroraCore = new THREE.Mesh(auroraCoreGeo, auroraCoreMat);
    auroraGroup.add(auroraCore);

    const auroraWireGeo = new THREE.WireframeGeometry(auroraCoreGeo);
    const auroraWireMat = new THREE.LineBasicMaterial({
      color: 0xd4a017,
      transparent: true,
      opacity: 0.95,
      linewidth: 1.5,
    });
    const auroraWire = new THREE.LineSegments(auroraWireGeo, auroraWireMat);
    auroraGroup.add(auroraWire);

    // Las 6 copias de almacenamiento distribuido repartidas en 3 AZs
    const auroraStorageNodes = [];
    for (let i = 0; i < 6; i++) {
      const sAngle = (i * Math.PI * 2) / 6;
      const sGeo = new THREE.OctahedronGeometry(0.14, 0);
      const sMat = new THREE.MeshBasicMaterial({ color: 0xd4a017 });
      const sNode = new THREE.Mesh(sGeo, sMat);
      sNode.position.set(Math.cos(sAngle) * 1.35, Math.sin(sAngle) * 0.45, Math.sin(sAngle) * 1.35);
      auroraGroup.add(sNode);
      auroraStorageNodes.push(sNode);
    }

    // Doble anillo orbital de throughput acelerado (3x)
    const auroraRing1Geo = new THREE.TorusGeometry(1.4, 0.02, 12, 48);
    const auroraRing1Mat = new THREE.MeshBasicMaterial({ color: 0xd4a017, transparent: true, opacity: 0.65 });
    const auroraRing1 = new THREE.Mesh(auroraRing1Geo, auroraRing1Mat);
    auroraRing1.rotation.x = Math.PI / 2.6;
    auroraGroup.add(auroraRing1);

    // ════════════════════════════════════════════════════════════
    // 7. MÓDULO 3: AMAZON DYNAMODB (NoSQL Clave-Valor) (X: +2.35)
    // ════════════════════════════════════════════════════════════
    const dynamoGroup = new THREE.Group();
    dynamoGroup.position.set(2.35, 0.15, 0);
    rootGroup.add(dynamoGroup);

    // Matriz de almacenamiento horizontal plano de particiones NoSQL
    const dynamoBaseGeo = new THREE.BoxGeometry(1.7, 0.18, 1.7);
    const dynamoBaseMat = new THREE.MeshBasicMaterial({
      color: 0x22101e,
      transparent: true,
      opacity: 0.9,
    });
    const dynamoBase = new THREE.Mesh(dynamoBaseGeo, dynamoBaseMat);
    dynamoGroup.add(dynamoBase);

    const dynamoBaseWireGeo = new THREE.WireframeGeometry(dynamoBaseGeo);
    const dynamoBaseWireMat = new THREE.LineBasicMaterial({
      color: 0xe8a0bf,
      transparent: true,
      opacity: 0.8,
    });
    const dynamoBaseWire = new THREE.LineSegments(dynamoBaseWireGeo, dynamoBaseWireMat);
    dynamoGroup.add(dynamoBaseWire);

    // Nodos de partición clave-valor (KV Items) dispersos en cuadrícula
    const kvItems = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const itemGeo = new THREE.BoxGeometry(0.24, 0.24, 0.24);
        const itemMat = new THREE.MeshBasicMaterial({
          color: (r + c) % 2 === 0 ? 0xe8a0bf : 0xd4a017,
        });
        const item = new THREE.Mesh(itemGeo, itemMat);
        item.position.set(-0.5 + c * 0.5, 0.25, -0.5 + r * 0.5);
        dynamoGroup.add(item);
        kvItems.push(item);
      }
    }

    // ════════════════════════════════════════════════════════════
    // 8. Riel de Datos Transaccional (SQL Query Bus)
    // ════════════════════════════════════════════════════════════
    const railPositions = new Float32Array([
      -2.35, -1.05, 0,
      0, -1.05, 0,
      2.35, -1.05, 0,
    ]);
    const railGeo = new THREE.BufferGeometry();
    railGeo.setAttribute("position", new THREE.BufferAttribute(railPositions, 3));
    const railMat = new THREE.LineBasicMaterial({
      color: 0x7a9b5c,
      transparent: true,
      opacity: 0.5,
    });
    const railLine = new THREE.Line(railGeo, railMat);
    rootGroup.add(railLine);

    // Paquete SQL en tránsito (Consulta ACID en reposo)
    const sqlPacketGeo = new THREE.SphereGeometry(0.11, 12, 12);
    const sqlPacketMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const sqlPacket = new THREE.Mesh(sqlPacketGeo, sqlPacketMat);
    rootGroup.add(sqlPacket);

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
      const col = choice > 0.65 ? cEmerald : (choice > 0.4 ? cGold : (choice > 0.2 ? cPink : cWhite));
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
      rds: {
        pos: new THREE.Vector3(-2.35, 0.95, 5.4),
        lookAt: new THREE.Vector3(-2.35, 0.1, 0),
      },
      aurora: {
        pos: new THREE.Vector3(0, 0.65, 5.0),
        lookAt: new THREE.Vector3(0, 0.15, 0),
      },
      dynamodb: {
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
      const isExecuting = executingRef.current;

      // Suavizado de parallax mouse
      mouseX += (targetX - mouseX) * 0.055;
      mouseY += (targetY - mouseY) * 0.055;

      // ── A. Animación Amazon RDS (PostgreSQL) ──
      rdsGroup.rotation.y = elapsed * 0.45 + mouseX * 0.35;
      rdsGroup.rotation.x = 0.12 - mouseY * 0.25;
      rdsGroup.position.y = 0.15 + Math.sin(elapsed * 1.5) * 0.04;

      rdsReplRing.rotation.z = elapsed * 2.2;
      const sAngle = elapsed * 2.2;
      standbyNode.position.set(Math.cos(sAngle) * 1.22, Math.sin(sAngle) * 0.5, Math.sin(sAngle) * 1.22);
      standbyNode.rotation.y = elapsed * 3;

      // ── B. Animación Amazon Aurora Serverless ──
      auroraGroup.rotation.y = -elapsed * 0.4 + mouseX * 0.3;
      auroraGroup.rotation.x = 0.08 - mouseY * 0.25;
      auroraGroup.position.y = 0.15 + Math.sin(elapsed * 1.8) * 0.04;

      auroraCore.rotation.y = elapsed * 0.8;
      auroraRing1.rotation.z = elapsed * 1.5;

      const auroraScale = isExecuting ? (1.15 + Math.sin(elapsed * 16) * 0.15) : (1.0 + Math.sin(elapsed * 2.0) * 0.05);
      auroraCore.scale.setScalar(auroraScale);

      auroraStorageNodes.forEach((sNode, idx) => {
        const nAngle = elapsed * 1.4 + (idx * Math.PI * 2) / 6;
        sNode.position.set(Math.cos(nAngle) * 1.35, Math.sin(elapsed * 3 + idx) * 0.15, Math.sin(nAngle) * 1.35);
        sNode.rotation.y = elapsed * 2.5;
      });

      // ── C. Animación DynamoDB NoSQL ──
      dynamoGroup.rotation.y = elapsed * 0.4 + mouseX * 0.3;
      dynamoGroup.rotation.x = 0.1 - mouseY * 0.25;
      dynamoGroup.position.y = 0.15 + Math.sin(elapsed * 1.6) * 0.04;

      kvItems.forEach((item, idx) => {
        item.position.y = 0.25 + Math.sin(elapsed * 3.0 + idx * 0.8) * 0.12;
        item.rotation.y = elapsed * 1.5;
      });

      // ── D. Paquete SQL en Tránsito por el Riel ──
      const cycle = (Math.sin(elapsed * 1.6) + 1) / 2;
      sqlPacket.position.x = -2.35 + cycle * 4.7;
      sqlPacket.position.y = -1.05 + Math.sin(cycle * Math.PI) * 0.12;

      // ── E. Escalado Dinámico del Módulo Activo ──
      const sRDS = selected === "rds" ? 1.16 : 0.88;
      const sAurora = selected === "aurora" ? 1.18 : 0.88;
      const sDynamo = selected === "dynamodb" ? 1.15 : 0.88;

      rdsGroup.scale.lerp(new THREE.Vector3(sRDS, sRDS, sRDS), 0.06);
      auroraGroup.scale.lerp(new THREE.Vector3(sAurora, sAurora, sAurora), 0.06);
      dynamoGroup.scale.lerp(new THREE.Vector3(sDynamo, sDynamo, sDynamo), 0.06);

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

export default DatabaseArchitecturesCanvas;
