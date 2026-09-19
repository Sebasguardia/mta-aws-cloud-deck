// src/components/three/GitPipelineCanvas.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Visualizador 3D Interactivo para Slide 07: Pipeline Git Manual & Despliegue Fallido.
 *
 * Figuras 3D representativas y reconocibles:
 *  1. Laptop / Computadora del Dev:
 *     Base de teclado rectangular + pantalla desplegada con marco y wireframe.
 *  2. Rama Git (Branch / Split):
 *     Estructura de bifurcación tipo árbol (tronco 'main' y bifurcación 'feature-branch' con nodos de commit).
 *  3. Testing Local (Terminal de pruebas):
 *     Cubo de pruebas con engranaje / prisma rotatorio de build local.
 *  4. Repositorio Remoto GitHub:
 *     Esfera geodésica / nube con anillos orbitales concéntricos de sincronización.
 *  5. Despliegue / Servidor Producción (Cohete/Torre):
 *     Cohete estilizado en wireframe (cuerpo cónico, aletas y reactor) posado sobre una base de servidor que colapsa con ❌.
 *
 * Movimiento Continuo de la Partícula (Commit):
 *  - En simulación, viaja de forma estrictamente continua (0.0 → 0.25 → 0.5 → 0.75 → 1.0) sin reiniciar al origen.
 *  - Tasa de refresco sincronizada a 60fps con lerp suave sin tirones.
 */
export function GitPipelineCanvas({ isActive = true, currentStep = 0, isSimulating = false, hasFailed = false }) {
  const containerRef = useRef(null);
  const animFrameId = useRef(null);
  const simProgressRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 650;
    const height = container.clientHeight || 550;

    // 1. Scene & Camera con amplio margen para evitar cualquier corte
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 9.8);

    // 2. Renderer optimizado con alto rendimiento
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
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Coordenadas calculadas y escaladas para que todos los modelos quepan con margen holgado
    const nodePositions = [
      new THREE.Vector3(-2.8, 1.0, 0),    // 1. Laptop
      new THREE.Vector3(-1.4, -0.6, 0),   // 2. Rama Git
      new THREE.Vector3(0, 1.0, 0),       // 3. Testing Local
      new THREE.Vector3(1.4, -0.6, 0),    // 4. GitHub Cloud
      new THREE.Vector3(2.8, 1.0, 0),     // 5. Cohete/Prod
    ];

    const nodes = [];

    // ── NODO 1: Laptop de Desarrollador ──
    const laptopGroup = new THREE.Group();
    // Base de la laptop
    const baseGeo = new THREE.BoxGeometry(0.9, 0.08, 0.7);
    const baseMat = new THREE.LineBasicMaterial({ color: 0xd4a017, transparent: true, opacity: 0.85 });
    const baseMesh = new THREE.LineSegments(new THREE.WireframeGeometry(baseGeo), baseMat);
    laptopGroup.add(baseMesh);
    // Pantalla inclinada
    const screenGeo = new THREE.BoxGeometry(0.9, 0.65, 0.05);
    const screenMat = new THREE.LineBasicMaterial({ color: 0xf5f1e8, transparent: true, opacity: 0.9 });
    const screenMesh = new THREE.LineSegments(new THREE.WireframeGeometry(screenGeo), screenMat);
    screenMesh.position.set(0, 0.32, -0.32);
    screenMesh.rotation.x = -0.22;
    laptopGroup.add(screenMesh);
    laptopGroup.position.copy(nodePositions[0]);
    mainGroup.add(laptopGroup);
    nodes.push(laptopGroup);

    // ── NODO 2: Rama Git (Branch / Split) ──
    const branchGroup = new THREE.Group();
    // Tronco principal 'main'
    const mainStemGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8);
    const stemMat = new THREE.LineBasicMaterial({ color: 0x888888, transparent: true, opacity: 0.8 });
    const stemMesh = new THREE.LineSegments(new THREE.WireframeGeometry(mainStemGeo), stemMat);
    stemMesh.rotation.z = Math.PI / 4;
    branchGroup.add(stemMesh);
    // Rama bifurcada 'feature'
    const branchStemGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 8);
    const branchMat = new THREE.LineBasicMaterial({ color: 0xd4a017, transparent: true, opacity: 0.9 });
    const branchMesh = new THREE.LineSegments(new THREE.WireframeGeometry(branchStemGeo), branchMat);
    branchMesh.rotation.z = -Math.PI / 4;
    branchMesh.position.set(0.15, 0.15, 0);
    branchGroup.add(branchMesh);
    // Commit dots en la rama
    const dot1 = new THREE.Mesh(new THREE.OctahedronGeometry(0.12, 0), new THREE.MeshBasicMaterial({ color: 0xd4a017, wireframe: true }));
    dot1.position.set(-0.35, -0.35, 0);
    branchGroup.add(dot1);
    const dot2 = new THREE.Mesh(new THREE.OctahedronGeometry(0.14, 0), new THREE.MeshBasicMaterial({ color: 0xf5f1e8, wireframe: true }));
    dot2.position.set(0.35, 0.35, 0);
    branchGroup.add(dot2);
    branchGroup.position.copy(nodePositions[1]);
    mainGroup.add(branchGroup);
    nodes.push(branchGroup);

    // ── NODO 3: Testing Local (Engranaje / Sandbox) ──
    const testGroup = new THREE.Group();
    const sandboxGeo = new THREE.BoxGeometry(0.85, 0.85, 0.85);
    const sandboxMat = new THREE.LineBasicMaterial({ color: 0x4a5d3a, transparent: true, opacity: 0.85 });
    const sandboxMesh = new THREE.LineSegments(new THREE.WireframeGeometry(sandboxGeo), sandboxMat);
    testGroup.add(sandboxMesh);
    // Engranaje central giratorio
    const gearGeo = new THREE.TorusGeometry(0.32, 0.06, 6, 12);
    const gearMat = new THREE.MeshBasicMaterial({ color: 0xd4a017, wireframe: true });
    const gearMesh = new THREE.Mesh(gearGeo, gearMat);
    testGroup.add(gearMesh);
    testGroup.position.copy(nodePositions[2]);
    mainGroup.add(testGroup);
    nodes.push(testGroup);

    // ── NODO 4: Repositorio Remoto GitHub (Esfera + Anillos Orbitales) ──
    const githubGroup = new THREE.Group();
    const repoCoreGeo = new THREE.IcosahedronGeometry(0.48, 1);
    const repoCoreMat = new THREE.LineBasicMaterial({ color: 0xf5f1e8, transparent: true, opacity: 0.85 });
    const repoMesh = new THREE.LineSegments(new THREE.WireframeGeometry(repoCoreGeo), repoCoreMat);
    githubGroup.add(repoMesh);
    // Anillo orbital exterior
    const ringGeo = new THREE.RingGeometry(0.65, 0.72, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xd4a017, side: THREE.DoubleSide, wireframe: true });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    githubGroup.add(ringMesh);
    githubGroup.position.copy(nodePositions[3]);
    mainGroup.add(githubGroup);
    nodes.push(githubGroup);

    // ── NODO 5: Cohete de Despliegue / Servidor Hostinger ──
    const rocketGroup = new THREE.Group();
    // Cuerpo del cohete
    const rocketBodyGeo = new THREE.ConeGeometry(0.35, 1.2, 8);
    const rocketMat = new THREE.LineBasicMaterial({ color: 0xc6432b, transparent: true, opacity: 0.9 });
    const rocketMesh = new THREE.LineSegments(new THREE.WireframeGeometry(rocketBodyGeo), rocketMat);
    rocketGroup.add(rocketMesh);
    // Aletas laterales
    const finGeo = new THREE.BoxGeometry(0.9, 0.2, 0.05);
    const finMesh = new THREE.LineSegments(new THREE.WireframeGeometry(finGeo), rocketMat);
    finMesh.position.y = -0.4;
    rocketGroup.add(finMesh);
    // Base de lanzamiento / servidor
    const launchPadGeo = new THREE.CylinderGeometry(0.5, 0.6, 0.25, 8);
    const launchPadMesh = new THREE.LineSegments(new THREE.WireframeGeometry(launchPadGeo), rocketMat);
    launchPadMesh.position.y = -0.65;
    rocketGroup.add(launchPadMesh);
    rocketGroup.position.copy(nodePositions[4]);
    mainGroup.add(rocketGroup);
    nodes.push(rocketGroup);

    // ── Circuito Guía (Curva Spline de Conexión) ──
    const trackCurve = new THREE.CatmullRomCurve3(nodePositions);
    const trackPoints = trackCurve.getPoints(70);
    const trackGeo = new THREE.BufferGeometry().setFromPoints(trackPoints);
    const trackMat = new THREE.LineBasicMaterial({ color: 0x383838, transparent: true, opacity: 0.5 });
    const trackLine = new THREE.Line(trackGeo, trackMat);
    mainGroup.add(trackLine);

    // ── Partícula del Commit (Esfera de datos viajera) ──
    const packetGeo = new THREE.SphereGeometry(0.14, 16, 16);
    const packetMat = new THREE.MeshBasicMaterial({ color: 0xd4a017, wireframe: true });
    const packet = new THREE.Mesh(packetGeo, packetMat);
    mainGroup.add(packet);

    // Halo luminoso alrededor del commit
    const packetGlowGeo = new THREE.SphereGeometry(0.24, 12, 12);
    const packetGlowMat = new THREE.MeshBasicMaterial({ color: 0xd4a017, wireframe: true, transparent: true, opacity: 0.4 });
    const packetGlow = new THREE.Mesh(packetGlowGeo, packetGlowMat);
    packet.add(packetGlow);

    // Parallax del mouse
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.35;
      targetY = y * 0.2;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

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

    // Bucle de Render de Alto Rendimiento (60fps lerp sin tirones)
    let clock = new THREE.Clock();
    let isRunning = true;
    let targetProgress = 0;

    const animate = () => {
      if (!isRunning) return;
      animFrameId.current = requestAnimationFrame(animate);

      if (!isActive) return;

      const elapsed = clock.getElapsedTime();

      // Mouse Parallax Suave
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;
      mainGroup.rotation.y = mouseX;
      mainGroup.rotation.x = -mouseY;

      // Rotaciones armónicas de cada modelo
      laptopGroup.rotation.y = Math.sin(elapsed * 0.6) * 0.2;
      branchGroup.rotation.y = elapsed * 0.5;
      gearMesh.rotation.z = elapsed * 1.5;
      testGroup.rotation.y = elapsed * 0.4;
      repoMesh.rotation.y = elapsed * 0.7;
      ringMesh.rotation.z = -elapsed * 0.9;
      rocketMesh.rotation.y = elapsed * 0.8;

      // Escala del nodo activo con lerp suave
      nodes.forEach((node, idx) => {
        const isTarget = currentStep === idx;
        const targetScale = isTarget ? 1.3 : 1.0;
        node.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
      });

      // Avance fluido y continuo de la partícula sin reiniciarse
      if (isSimulating) {
        // En simulación controlada: avanza progresivamente según currentStep (0 a 4)
        targetProgress = Math.min(Math.max(currentStep / 4, 0), 1);
        simProgressRef.current += (targetProgress - simProgressRef.current) * 0.06;
      } else {
        // En reposo: la partícula viaja suavemente en ciclo continuo
        simProgressRef.current = (elapsed * 0.18) % 1;
      }

      const clampedT = Math.min(Math.max(simProgressRef.current, 0), 1);
      const point = trackCurve.getPointAt(clampedT);
      packet.position.copy(point);

      // Comportamiento ante Fallo en Producción
      if (hasFailed) {
        packetMat.color.setHex(0xc6432b);
        packetGlowMat.color.setHex(0xc6432b);
        // Shake sísmico en el cohete/servidor
        rocketGroup.position.x = nodePositions[4].x + (Math.random() - 0.5) * 0.08;
        rocketGroup.position.y = nodePositions[4].y + (Math.random() - 0.5) * 0.08;
        rocketGroup.scale.set(1.4, 1.4, 1.4);
      } else {
        packetMat.color.setHex(0xd4a017);
        packetGlowMat.color.setHex(0xd4a017);
        rocketGroup.position.copy(nodePositions[4]);
      }

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
  }, [isActive, currentStep, isSimulating, hasFailed]);

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
