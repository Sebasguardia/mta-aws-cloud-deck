// src/components/three/ComputeArchitecturesCanvas.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Visualizador 3D Ultra-Fluido y Detallado para Slide 14:
 * "Cómputo Elástico y Serverless: Amazon EC2 vs AWS Lambda vs Docker/ECS"
 *
 * Mejoras de fidelidad visual y rendimiento:
 *  - Disposición armónica y centrada de los 3 modelos (EC2, Lambda, Docker/ECS).
 *  - Enfoque centrado y ángulo de cámara equilibrado (sin cortar elementos laterales).
 *  - Materiales ricos: Mallas semitransparentes con bordes Wireframe luminosos y halos de energía.
 *  - EC2: Servidor Blade detallado con disipadores térmicos dorados, bahía frontal con 6 LEDs animados,
 *         disco SSD EBS gp3 con plato magnético giratorio y cabezal de lectura.
 *  - Lambda: Núcleo FaaS con icosaedro central flotante de cristal amatista/oro, doble anillo orbital
 *            con nodos de eventos giratorios (EventBridge / S3 / API Gateway) y pulso elástico.
 *  - Docker / ECS: Bloque de contenedor industrial segmentado con 4 contenedores cúbicos coordinados
 *                  y microservicios orbitando en esferas de luz verde esmeralda.
 *  - Bus óptico inferior con partículas luminosas y riel guía.
 *  - Campo estelar profundo multicromático con animación suave de 60fps con requestAnimationFrame y DeltaTime.
 */
export function ComputeArchitecturesCanvas({
  selectedCompute,
  selectedService,
  selectedTech,
  isExecuting = false,
}) {
  const activeSelected = selectedCompute || selectedService || selectedTech || "ec2";
  const containerRef = useRef(null);
  const animFrameId = useRef(null);

  const selectedRef = useRef(activeSelected);
  const executingRef = useRef(isExecuting);

  useEffect(() => {
    selectedRef.current = activeSelected;
    executingRef.current = isExecuting;
  }, [activeSelected, isExecuting]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 600;
    let height = container.clientHeight || 550;

    // 1. Escena y Cámara con perspectiva de campo amplia y centrada
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 8.4);

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
    // 5. MÓDULO 1: AMAZON EC2 + EBS gp3 (Posición X: -2.35)
    // ════════════════════════════════════════════════════════════
    const ec2Group = new THREE.Group();
    ec2Group.position.set(-2.35, 0.15, 0);
    rootGroup.add(ec2Group);

    // Chasis principal del servidor Blade
    const ec2BoxGeo = new THREE.BoxGeometry(1.65, 0.65, 1.9);
    const ec2BoxMat = new THREE.MeshBasicMaterial({
      color: 0x141416,
      transparent: true,
      opacity: 0.9,
    });
    const ec2Box = new THREE.Mesh(ec2BoxGeo, ec2BoxMat);
    ec2Group.add(ec2Box);

    // Wireframe nítido dorado
    const ec2WireGeo = new THREE.WireframeGeometry(ec2BoxGeo);
    const ec2WireMat = new THREE.LineBasicMaterial({
      color: 0xd4a017,
      transparent: true,
      opacity: 0.85,
    });
    const ec2Wire = new THREE.LineSegments(ec2WireGeo, ec2WireMat);
    ec2Group.add(ec2Wire);

    // Disipadores térmicos dorados superiores
    for (let i = 0; i < 4; i++) {
      const sinkGeo = new THREE.BoxGeometry(0.04, 0.15, 1.4);
      const sinkMat = new THREE.MeshBasicMaterial({ color: 0xd4a017, transparent: true, opacity: 0.7 });
      const sink = new THREE.Mesh(sinkGeo, sinkMat);
      sink.position.set(-0.45 + i * 0.3, 0.38, 0);
      ec2Group.add(sink);
    }

    // Carátula frontal oscura
    const faceplateGeo = new THREE.BoxGeometry(1.67, 0.62, 0.05);
    const faceplateMat = new THREE.MeshBasicMaterial({ color: 0x0a0a0c });
    const faceplate = new THREE.Mesh(faceplateGeo, faceplateMat);
    faceplate.position.set(0, 0, 0.96);
    ec2Group.add(faceplate);

    // LEDs frontales de telemetría
    const ec2Leds = [];
    for (let i = 0; i < 6; i++) {
      const ledGeo = new THREE.SphereGeometry(0.038, 8, 8);
      const ledMat = new THREE.MeshBasicMaterial({ color: i < 4 ? 0x7a9b5c : 0xd4a017 });
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(-0.55 + i * 0.22, -0.05, 0.99);
      ec2Group.add(led);
      ec2Leds.push(led);
    }

    // Disco EBS gp3 montado debajo del servidor
    const ebsDiskGroup = new THREE.Group();
    ebsDiskGroup.position.set(0, -0.62, 0);
    ec2Group.add(ebsDiskGroup);

    const ebsBaseGeo = new THREE.CylinderGeometry(0.72, 0.72, 0.22, 28);
    const ebsBaseMat = new THREE.MeshBasicMaterial({ color: 0x1a1a1e });
    const ebsBase = new THREE.Mesh(ebsBaseGeo, ebsBaseMat);
    ebsDiskGroup.add(ebsBase);

    const ebsRingGeo = new THREE.TorusGeometry(0.85, 0.025, 12, 36);
    const ebsRingMat = new THREE.MeshBasicMaterial({ color: 0xd4a017, transparent: true, opacity: 0.9 });
    const ebsRing = new THREE.Mesh(ebsRingGeo, ebsRingMat);
    ebsRing.rotation.x = Math.PI / 2;
    ebsDiskGroup.add(ebsRing);

    // Anillo interior de lectura / escritura EBS
    const ebsInnerRingGeo = new THREE.TorusGeometry(0.5, 0.02, 8, 24);
    const ebsInnerRingMat = new THREE.MeshBasicMaterial({ color: 0x7a9b5c, transparent: true, opacity: 0.85 });
    const ebsInnerRing = new THREE.Mesh(ebsInnerRingGeo, ebsInnerRingMat);
    ebsInnerRing.rotation.x = Math.PI / 2;
    ebsDiskGroup.add(ebsInnerRing);

    // ════════════════════════════════════════════════════════════
    // 6. MÓDULO 2: AWS LAMBDA SERVERLESS (Centro / Posición X: 0)
    // ════════════════════════════════════════════════════════════
    const lambdaGroup = new THREE.Group();
    lambdaGroup.position.set(0, 0.15, 0);
    rootGroup.add(lambdaGroup);

    // Núcleo energético Serverless (Icosaedro doble facetado amatista/oro)
    const lambdaCoreGeo = new THREE.IcosahedronGeometry(0.88, 0);
    const lambdaCoreMat = new THREE.MeshBasicMaterial({
      color: 0x2e0f22,
      transparent: true,
      opacity: 0.92,
    });
    const lambdaCore = new THREE.Mesh(lambdaCoreGeo, lambdaCoreMat);
    lambdaGroup.add(lambdaCore);

    const lambdaWireGeo = new THREE.WireframeGeometry(lambdaCoreGeo);
    const lambdaWireMat = new THREE.LineBasicMaterial({
      color: 0xe8a0bf,
      transparent: true,
      opacity: 0.95,
      linewidth: 1.5,
    });
    const lambdaWire = new THREE.LineSegments(lambdaWireGeo, lambdaWireMat);
    lambdaGroup.add(lambdaWire);

    // Núcleo interior pequeño de alta energía
    const innerCoreGeo = new THREE.OctahedronGeometry(0.42, 0);
    const innerCoreMat = new THREE.MeshBasicMaterial({ color: 0xffe6f0, wireframe: true });
    const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    lambdaGroup.add(innerCore);

    // Anillo orbital 1: Disparo por eventos (S3 / EventBridge)
    const ring1Geo = new THREE.TorusGeometry(1.35, 0.022, 12, 48);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0xe8a0bf, transparent: true, opacity: 0.75 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    lambdaGroup.add(ring1);

    // Anillo orbital 2 inclinado 65 grados
    const ring2 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring2.rotation.x = Math.PI / 2.5;
    ring2.rotation.y = Math.PI / 6;
    lambdaGroup.add(ring2);

    // Satélites de eventos orbitando alrededor del núcleo Lambda
    const eventSatellites = [];
    for (let i = 0; i < 3; i++) {
      const satGeo = new THREE.SphereGeometry(0.065, 8, 8);
      const satMat = new THREE.MeshBasicMaterial({ color: i === 0 ? 0xd4a017 : (i === 1 ? 0xe8a0bf : 0x7a9b5c) });
      const sat = new THREE.Mesh(satGeo, satMat);
      lambdaGroup.add(sat);
      eventSatellites.push(sat);
    }

    // ════════════════════════════════════════════════════════════
    // 7. MÓDULO 3: DOCKER CONTAINERS + ECS (Posición X: +2.35)
    // ════════════════════════════════════════════════════════════
    const ecsGroup = new THREE.Group();
    ecsGroup.position.set(2.35, 0.15, 0);
    rootGroup.add(ecsGroup);

    // Contenedor principal segmentado (4 sub-bloques de microservicios)
    const containerBlocks = [];
    const subBoxGeo = new THREE.BoxGeometry(0.68, 0.68, 0.68);
    const offsets = [
      [-0.4, 0.4, 0],
      [0.4, 0.4, 0],
      [-0.4, -0.4, 0],
      [0.4, -0.4, 0],
    ];

    offsets.forEach(([ox, oy, oz], idx) => {
      const subMat = new THREE.MeshBasicMaterial({
        color: 0x112316,
        transparent: true,
        opacity: 0.88,
      });
      const subMesh = new THREE.Mesh(subBoxGeo, subMat);
      subMesh.position.set(ox, oy, oz);
      ecsGroup.add(subMesh);

      const subWireGeo = new THREE.WireframeGeometry(subBoxGeo);
      const subWireMat = new THREE.LineBasicMaterial({
        color: idx % 2 === 0 ? 0x7a9b5c : 0xd4a017,
        transparent: true,
        opacity: 0.85,
      });
      const subWire = new THREE.LineSegments(subWireGeo, subWireMat);
      subMesh.add(subWire);
      containerBlocks.push(subMesh);
    });

    // Marco exterior englobante de Docker Compose / ECS Task
    const ecsFrameGeo = new THREE.BoxGeometry(1.68, 1.68, 1.1);
    const ecsFrameWireGeo = new THREE.WireframeGeometry(ecsFrameGeo);
    const ecsFrameWireMat = new THREE.LineBasicMaterial({
      color: 0x7a9b5c,
      transparent: true,
      opacity: 0.6,
      linewidth: 1.5,
    });
    const ecsFrame = new THREE.LineSegments(ecsFrameWireGeo, ecsFrameWireMat);
    ecsGroup.add(ecsFrame);

    // Microservicios satelitales orbitando los contenedores
    const ecsTasks = [];
    for (let i = 0; i < 3; i++) {
      const tGeo = new THREE.OctahedronGeometry(0.16, 0);
      const tMat = new THREE.MeshBasicMaterial({ color: 0x7a9b5c });
      const task = new THREE.Mesh(tGeo, tMat);
      ecsGroup.add(task);
      ecsTasks.push(task);
    }

    // ════════════════════════════════════════════════════════════
    // 8. Riel de Datos Óptico y Bus de Eventos Interconectado
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

    // Paquete de invocación de datos que viaja en el riel
    const pulsePacketGeo = new THREE.SphereGeometry(0.11, 12, 12);
    const pulsePacketMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const pulsePacket = new THREE.Mesh(pulsePacketGeo, pulsePacketMat);
    rootGroup.add(pulsePacket);

    // Halo luminoso alrededor del paquete
    const haloGeo = new THREE.RingGeometry(0.14, 0.22, 16);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0xd4a017, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = Math.PI / 2;
    pulsePacket.add(halo);

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
    // Puntos de enfoque equilibrados sin esconder ni recortar los otros módulos
    const targets = {
      ec2: {
        pos: new THREE.Vector3(-2.35, 0.95, 5.4),
        lookAt: new THREE.Vector3(-2.35, 0.1, 0),
      },
      lambda: {
        pos: new THREE.Vector3(0, 0.65, 5.0),
        lookAt: new THREE.Vector3(0, 0.15, 0),
      },
      containers: {
        pos: new THREE.Vector3(2.35, 0.95, 5.4),
        lookAt: new THREE.Vector3(2.35, 0.1, 0),
      },
      beanstalk: {
        pos: new THREE.Vector3(0, 1.25, 7.0),
        lookAt: new THREE.Vector3(0, 0.1, 0),
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
    // 12. Loop de Renderizado Fluido y Reactivo a 60 FPS
    // ════════════════════════════════════════════════════════════
    const animate = () => {
      if (!isRunning) return;
      animFrameId.current = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();
      const selected = selectedRef.current;
      const executing = executingRef.current;

      // Suavizado de parallax mouse
      mouseX += (targetX - mouseX) * 0.055;
      mouseY += (targetY - mouseY) * 0.055;

      // ── A. Animación EC2 + EBS ──
      ec2Group.rotation.y = Math.sin(elapsed * 0.45) * 0.2 + mouseX * 0.35;
      ec2Group.rotation.x = 0.12 - mouseY * 0.25;
      ec2Group.position.y = 0.15 + Math.sin(elapsed * 1.4) * 0.04;

      ebsRing.rotation.z = elapsed * 2.8;
      ebsInnerRing.rotation.z = -elapsed * 3.6;

      ec2Leds.forEach((led, idx) => {
        led.material.opacity = 0.35 + Math.sin(elapsed * 7.5 + idx * 1.4) * 0.65;
      });

      // ── B. Animación Lambda Serverless ──
      lambdaGroup.rotation.y = elapsed * 0.65 + mouseX * 0.25;
      lambdaGroup.rotation.x = Math.sin(elapsed * 0.5) * 0.12;
      lambdaGroup.position.y = 0.15 + Math.sin(elapsed * 1.8) * 0.05;

      ring1.rotation.z = elapsed * 1.4;
      ring2.rotation.y = -elapsed * 1.1;
      innerCore.rotation.x = elapsed * 1.8;
      innerCore.rotation.y = elapsed * 1.5;

      // Pulso del núcleo FaaS: si está ejecutando, pulsa con alta energía
      const lambdaPulse = executing
        ? 1.12 + Math.sin(elapsed * 16) * 0.18
        : 1.0 + Math.sin(elapsed * 2.2) * 0.05;
      lambdaCore.scale.setScalar(lambdaPulse);

      // Satélites de eventos orbitando
      eventSatellites.forEach((sat, idx) => {
        const sAngle = elapsed * 1.6 + (idx * Math.PI * 2) / 3;
        sat.position.set(Math.cos(sAngle) * 1.35, Math.sin(sAngle) * 0.45, Math.sin(sAngle) * 1.35);
      });

      // ── C. Animación Docker Containers & ECS ──
      ecsGroup.rotation.y = -elapsed * 0.35 + mouseX * 0.35;
      ecsGroup.rotation.x = 0.08 - mouseY * 0.25;
      ecsGroup.position.y = 0.15 + Math.sin(elapsed * 1.5) * 0.04;

      containerBlocks.forEach((block, idx) => {
        block.position.z = Math.sin(elapsed * 2.0 + idx * 1.2) * 0.06;
      });

      ecsTasks.forEach((task, idx) => {
        const tAngle = elapsed * 1.8 + (idx * Math.PI * 2) / 3;
        task.position.set(Math.cos(tAngle) * 0.95, Math.sin(tAngle * 2) * 0.25, Math.sin(tAngle) * 0.95);
        task.rotation.y = elapsed * 2.2;
      });

      // ── D. Paquete en Tránsito por el Bus Óptico ──
      const cycle = (Math.sin(elapsed * 1.6) + 1) / 2; // Rango 0..1
      pulsePacket.position.x = -2.35 + cycle * 4.7;
      pulsePacket.position.y = -1.05 + Math.sin(cycle * Math.PI) * 0.12;

      // ── E. Escalado Dinámico y Destacado del Módulo Activo ──
      const sEC2 = (selected === "ec2" || selected === "all") ? 1.06 : 0.88;
      const sLambda = (selected === "lambda" || selected === "all") ? 1.08 : 0.88;
      const sECS = (selected === "containers" || selected === "all") ? 1.06 : 0.88;

      ec2Group.scale.lerp(new THREE.Vector3(sEC2, sEC2, sEC2), 0.06);
      lambdaGroup.scale.lerp(new THREE.Vector3(sLambda, sLambda, sLambda), 0.06);
      ecsGroup.scale.lerp(new THREE.Vector3(sECS, sECS, sECS), 0.06);

      // ── F. Rotación Cósmica ──
      starPoints.rotation.y = elapsed * 0.015;

      // ── G. Transición Suave y Elástica de Cámara ──
      const camTarget = targets[selected] || targets.all;
      camera.position.lerp(camTarget.pos, 0.05);
      curCamLookAt.lerp(camTarget.lookAt, 0.055);
      camera.lookAt(curCamLookAt);

      renderer.render(scene, camera);
    };

    animate();

    // ════════════════════════════════════════════════════════════
    // 13. Observador de Redimensionamiento Responsivo
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

export default ComputeArchitecturesCanvas;
