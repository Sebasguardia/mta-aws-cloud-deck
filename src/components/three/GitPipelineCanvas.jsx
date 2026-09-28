// src/components/three/GitPipelineCanvas.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Visualizador 3D Interactivo para Slide 07: Pipeline Git Manual & Despliegue Fallido.
 *
 * Mejoras de fluidez e interactividad:
 *  - Cero tirones / Cero recargas: Las props (`isActive`, `currentStep`, `isSimulating`, `hasFailed`)
 *    se sincronizan mediante `useRef`, de modo que el contexto WebGL permanece siempre vivo.
 *  - Enfoque Dinámico con Cámara Cinemática (Zoom y Pan al nodo activo):
 *    - Al seleccionar un paso (0 a 4) o avanzar durante la simulación, la cámara Three.js se desplaza
 *      suavemente mediante lerp hacia el nodo activo con zoom sutil para apreciarlo en detalle.
 *  - Modelos 3D de alta fidelidad:
 *    1. Laptop Dev (teclado + pantalla con terminal emisora).
 *    2. Rama Git (bifurcación con nodos de commit).
 *    3. Testing Local (sandbox cúbico con engranaje giratorio).
 *    4. GitHub Cloud (núcleo icosaedro con anillos orbitales concéntricos).
 *    5. Cohete/Servidor Hostinger (lanzadera con reactor que entra en colapso sísmico y alerta roja).
 *  - Commit viajero continuo con partículas de ráfaga y estela luminosa.
 */
export function GitPipelineCanvas({
  isActive = true,
  currentStep = 0,
  isSimulating = false,
  hasFailed = false,
}) {
  const containerRef = useRef(null);
  const animFrameId = useRef(null);
  const simProgressRef = useRef(0);

  const isActiveRef = useRef(isActive);
  const currentStepRef = useRef(currentStep);
  const isSimulatingRef = useRef(isSimulating);
  const hasFailedRef = useRef(hasFailed);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    isSimulatingRef.current = isSimulating;
  }, [isSimulating]);

  useEffect(() => {
    hasFailedRef.current = hasFailed;
  }, [hasFailed]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 650;
    const height = container.clientHeight || 550;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 9.2);

    // 2. Renderer optimizado de alto rendimiento
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

    // Coordenadas calculadas y calibradas de los 5 nodos
    const nodePositions = [
      new THREE.Vector3(-2.8, 1.0, 0),   // 1. Laptop Dev
      new THREE.Vector3(-1.4, -0.6, 0),  // 2. Rama Git
      new THREE.Vector3(0, 1.0, 0),      // 3. Testing Local
      new THREE.Vector3(1.4, -0.6, 0),   // 4. GitHub Cloud
      new THREE.Vector3(2.8, 1.0, 0),    // 5. Cohete/Servidor Prod
    ];

    const nodes = [];

    // ── NODO 1: Laptop de Desarrollador ──
    const laptopGroup = new THREE.Group();
    const baseGeo = new THREE.BoxGeometry(0.9, 0.08, 0.7);
    const baseMat = new THREE.LineBasicMaterial({ color: 0xd4a017, transparent: true, opacity: 0.85 });
    const baseMesh = new THREE.LineSegments(new THREE.WireframeGeometry(baseGeo), baseMat);
    laptopGroup.add(baseMesh);
    
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
    const mainStemGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8);
    const stemMat = new THREE.LineBasicMaterial({ color: 0x888888, transparent: true, opacity: 0.8 });
    const stemMesh = new THREE.LineSegments(new THREE.WireframeGeometry(mainStemGeo), stemMat);
    stemMesh.rotation.z = Math.PI / 4;
    branchGroup.add(stemMesh);
    
    const branchStemGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 8);
    const branchMat = new THREE.LineBasicMaterial({ color: 0xd4a017, transparent: true, opacity: 0.9 });
    const branchMesh = new THREE.LineSegments(new THREE.WireframeGeometry(branchStemGeo), branchMat);
    branchMesh.rotation.z = -Math.PI / 4;
    branchMesh.position.set(0.15, 0.15, 0);
    branchGroup.add(branchMesh);
   
    const dot1 = new THREE.Mesh(new THREE.OctahedronGeometry(0.12, 0), new THREE.MeshBasicMaterial({ color: 0xd4a017, wireframe: true }));
    dot1.position.set(-0.35, -0.35, 0);
    branchGroup.add(dot1);
    const dot2 = new THREE.Mesh(new THREE.OctahedronGeometry(0.14, 0), new THREE.MeshBasicMaterial({ color: 0xf5f1e8, wireframe: true }));
    dot2.position.set(0.35, 0.35, 0);
    branchGroup.add(dot2);
    branchGroup.position.copy(nodePositions[1]);
    mainGroup.add(branchGroup);
    nodes.push(branchGroup);

     // ── NODO 3: Testing Local (Sandbox + Engranaje giratorio) ──
    const testGroup = new THREE.Group();
    const sandboxGeo = new THREE.BoxGeometry(0.85, 0.85, 0.85);
    const sandboxMat = new THREE.LineBasicMaterial({ color: 0x4a5d3a, transparent: true, opacity: 0.85 });
    const sandboxMesh = new THREE.LineSegments(new THREE.WireframeGeometry(sandboxGeo), sandboxMat);
    testGroup.add(sandboxMesh);
    
    const gearGeo = new THREE.TorusGeometry(0.32, 0.06, 6, 12);
    const gearMat = new THREE.MeshBasicMaterial({ color: 0xd4a017, wireframe: true });
    const gearMesh = new THREE.Mesh(gearGeo, gearMat);
    testGroup.add(gearMesh);
    testGroup.position.copy(nodePositions[2]);
    mainGroup.add(testGroup);
    nodes.push(testGroup);

    // ── NODO 4: Repositorio Remoto GitHub (Icosaedro + Anillo Orbital) ──
    const githubGroup = new THREE.Group();
    const repoCoreGeo = new THREE.IcosahedronGeometry(0.48, 1);
    const repoCoreMat = new THREE.LineBasicMaterial({ color: 0xf5f1e8, transparent: true, opacity: 0.85 });
    const repoMesh = new THREE.LineSegments(new THREE.WireframeGeometry(repoCoreGeo), repoCoreMat);
    githubGroup.add(repoMesh);
    
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
    const rocketBodyGeo = new THREE.ConeGeometry(0.35, 1.2, 8);
    const rocketMat = new THREE.LineBasicMaterial({ color: 0xc6432b, transparent: true, opacity: 0.9 });
    const rocketMesh = new THREE.LineSegments(new THREE.WireframeGeometry(rocketBodyGeo), rocketMat);
    rocketGroup.add(rocketMesh);
    
    const finGeo = new THREE.BoxGeometry(0.9, 0.2, 0.05);
    const finMesh = new THREE.LineSegments(new THREE.WireframeGeometry(finGeo), rocketMat);
    finMesh.position.y = -0.4;
    rocketGroup.add(finMesh);
    
    const launchPadGeo = new THREE.CylinderGeometry(0.5, 0.6, 0.25, 8);
    const launchPadMesh = new THREE.LineSegments(new THREE.WireframeGeometry(launchPadGeo), rocketMat);
    launchPadMesh.position.y = -0.65;
    rocketGroup.add(launchPadMesh);
    rocketGroup.position.copy(nodePositions[4]);
    mainGroup.add(rocketGroup);
    nodes.push(rocketGroup);

    // ── Halos de Selección en cada nodo (Anillo perimetral pulsante) ──
    const nodeAuras = [];
    nodePositions.forEach((pos) => {
      const auraGeo = new THREE.TorusGeometry(0.75, 0.015, 6, 28);
      const auraMat = new THREE.LineBasicMaterial({
        color: 0xd4a017,
        transparent: true,
        opacity: 0,
      });
      const aura = new THREE.LineSegments(new THREE.WireframeGeometry(auraGeo), auraMat);
      aura.rotation.x = Math.PI / 2;
      aura.position.copy(pos);
      mainGroup.add(aura);
      nodeAuras.push({ mesh: aura, mat: auraMat });
    });

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

    container.addEventListener("mousemove", handleMouseMove, { passive: true });

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

    // Posición objetivo de la cámara para enfocar el nodo activo con zoom suave
    const targetCamPos = new THREE.Vector3(0, 0, 9.2);

    const animate = () => {
      if (!isRunning) return;
      animFrameId.current = requestAnimationFrame(animate);

      if (!isActiveRef.current) return;

      const elapsed = clock.getElapsedTime();
      const currentStep = currentStepRef.current;
      const isSimulating = isSimulatingRef.current;
      const hasFailed = hasFailedRef.current;

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

      // ── Enfoque de Cámara con Zoom Cinemático al Nodo Activo ──
      const activeNodePos = nodePositions[currentStep] || nodePositions[0];
      // Si estamos inspeccionando un nodo en específico o simulando:
      // Pan sutil hacia el nodo y zoom de z: 9.2 a z: 7.8
      targetCamPos.x = activeNodePos.x * 0.45;
      targetCamPos.y = activeNodePos.y * 0.35;
      targetCamPos.z = 7.8;

      camera.position.lerp(targetCamPos, 0.06);

      // Escala y Resaltado del nodo activo con lerp suave
      nodes.forEach((node, idx) => {
        const isTarget = currentStep === idx;
       const targetScale = isTarget ? 1.35 : 0.95;
        node.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);

        // Halo perimetral del nodo
        const aura = nodeAuras[idx];
        if (aura) {
          if (isTarget) {
            aura.mat.opacity = 0.55 + Math.sin(elapsed * 4) * 0.25;
            aura.mat.color.setHex(idx === 4 && hasFailed ? 0xc6432b : 0xd4a017);
            const aScale = 1.1 + Math.sin(elapsed * 3) * 0.08;
            aura.mesh.scale.set(aScale, aScale, aScale);
          } else {
            aura.mat.opacity = 0;
          }
        }
      });

      // Avance fluido y continuo de la partícula sin reiniciarse
      if (isSimulating) {
        // En simulación controlada: avanza progresivamente según currentStep (0 a 4)
        targetProgress = Math.min(Math.max(currentStep / 4, 0), 1);
        simProgressRef.current += (targetProgress - simProgressRef.current) * 0.08;
      } else {
        // En reposo: la partícula viaja suavemente en ciclo continuo
         simProgressRef.current = (elapsed * 0.16) % 1;
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
        rocketGroup.scale.set(1.45, 1.45, 1.45);
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
      container.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []); // Sin dependencias para garantizar 0 reinicios de WebGL

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

export default GitPipelineCanvas;