// src/components/three/CostOptimizationCanvas.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Visualizador 3D Interactivo para Slide 10:
 * "Arquitectura Económica y Balance Dinámico Pay-As-You-Go vs Costo Fijo"
 *
 * Simboliza el balance financiero y la telemetría de presupuesto en AWS:
 *  - Dos balancines / pilares técnicos wireframe:
 *    1. Pilar Izquierdo (Hostinger): Barra fija de altura constante en color neutro / gris industrial.
 *    2. Pilar Derecho (AWS Pay-As-You-Go): Barra elástica que escala dinámicamente según `simulatedUsers`.
 *       - Mientras simulatedUsers <= 1000: Base en verde oliva (#6E8E59) (Free Tier $0.00).
 *       - Cuando sube: Escala en dorado cálido (#D4A017).
 *       - Si supera el umbral de presupuesto ($10 USD / ~2500 reqs): Se torna en rojo alerta (#C6432B) con pulsos sísmicos.
 *  - Haz de datos y anillos de telemetría de AWS Budgets orbitando la columna elástica.
 *  - Parallax suave con mouse y optimización estricta de requestAnimationFrame.
 */
export function CostOptimizationCanvas({
  isActive = true,
  simulatedUsers = 500,
  isAlert = false,
}) {
  const containerRef = useRef(null);
  const animFrameId = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 9.8);

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

    // Plataforma base técnica / Grid de medición
    const gridGeo = new THREE.PlaneGeometry(8, 5, 16, 10);
    const gridWire = new THREE.WireframeGeometry(gridGeo);
    const gridMat = new THREE.LineBasicMaterial({
      color: 0x333333,
      transparent: true,
      opacity: 0.4,
    });
    const gridMesh = new THREE.LineSegments(gridWire, gridMat);
    gridMesh.rotation.x = -Math.PI / 2.3;
    gridMesh.position.y = -2.2;
    rootGroup.add(gridMesh);

    // ── 4. Pilar A: Costo Fijo Mensual (Hostinger $35 USD) ──
    const fixedHeight = 3.2;
    const fixedGeo = new THREE.BoxGeometry(1.4, fixedHeight, 1.4);
    const fixedWire = new THREE.WireframeGeometry(fixedGeo);
    const fixedMat = new THREE.LineBasicMaterial({
      color: 0x666666,
      transparent: true,
      opacity: 0.75,
      linewidth: 1.5,
    });
    const fixedPillar = new THREE.LineSegments(fixedWire, fixedMat);
    fixedPillar.position.set(-2.0, -2.2 + fixedHeight / 2, 0);
    rootGroup.add(fixedPillar);

    // Marcador de tope fijo de Hostinger (cruz técnica)
    const crossGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.5, 0, 0),
      new THREE.Vector3(0.5, 0, 0),
      new THREE.Vector3(0, -0.5, 0),
      new THREE.Vector3(0, 0.5, 0),
    ]);
    const crossMat = new THREE.LineBasicMaterial({ color: 0x888888 });
    const crossMesh = new THREE.Line(crossGeo, crossMat);
    crossMesh.position.set(-2.0, -2.2 + fixedHeight + 0.35, 0);
    rootGroup.add(crossMesh);

    // ── 5. Pilar B: AWS Pay-As-You-Go Elástico ──
    // Se modela con un grupo escalable en Y
    const awsGroup = new THREE.Group();
    awsGroup.position.set(2.0, -2.2, 0);
    rootGroup.add(awsGroup);

    const awsBaseGeo = new THREE.BoxGeometry(1.4, 1, 1.4);
    const awsWire = new THREE.WireframeGeometry(awsBaseGeo);
    const awsMat = new THREE.LineBasicMaterial({
      color: 0x6e8e59,
      transparent: true,
      opacity: 0.9,
      linewidth: 1.5,
    });
    const awsPillar = new THREE.LineSegments(awsWire, awsMat);
    awsPillar.position.y = 0.5; // punto de pivote en la base
    awsGroup.add(awsPillar);

    // Núcleo de ahorro dentro de la columna AWS (Icosaedro)
    const savingsGeo = new THREE.IcosahedronGeometry(0.5, 0);
    const savingsWire = new THREE.WireframeGeometry(savingsGeo);
    const savingsMat = new THREE.LineBasicMaterial({
      color: 0xd4a017,
      transparent: true,
      opacity: 0.85,
    });
    const savingsMesh = new THREE.LineSegments(savingsWire, savingsMat);
    awsGroup.add(savingsMesh);

    // Anillo de Alerta de Presupuesto AWS Budgets ($10 USD Umbral)
    const budgetRingGeo = new THREE.TorusGeometry(1.2, 0.02, 16, 48);
    const budgetRingWire = new THREE.WireframeGeometry(budgetRingGeo);
    const budgetRingMat = new THREE.LineBasicMaterial({
      color: 0xc6432b,
      transparent: true,
      opacity: 0.5,
    });
    const budgetRing = new THREE.LineSegments(budgetRingWire, budgetRingMat);
    budgetRing.rotation.x = Math.PI / 2;
    // La altura del umbral de $10 representa aproximadamente un 65% de la columna de Hostinger
    budgetRing.position.set(2.0, -2.2 + 2.1, 0);
    rootGroup.add(budgetRing);

    // ── 6. Nube de Partículas de Facturación / Peticiones de Usuarios ──
    const particleCount = 70;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = [];

    for (let i = 0; i < particleCount; i++) {
      const x = 0.5 + Math.random() * 3.0;
      const y = -2.2 + Math.random() * 4.5;
      const z = (Math.random() - 0.5) * 2.5;

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      particleSpeeds.push(0.015 + Math.random() * 0.035);
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xd4a017,
      size: 0.05,
      transparent: true,
      opacity: 0.7,
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

    // ── 9. Loop de animación continuo con interpolación reactiva ──
    const clock = new THREE.Clock();
    let isRunning = true;
    let currentScaleY = 0.4;

    const animate = () => {
      if (!isRunning) return;
      animFrameId.current = requestAnimationFrame(animate);

      if (!isActive) return;

      const elapsed = clock.getElapsedTime();

      // Mouse Parallax
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      rootGroup.rotation.y = elapsed * 0.15 + mouseX;
      rootGroup.rotation.x = Math.sin(elapsed * 0.3) * 0.04 - mouseY;

      // Cálculo de altura objetivo según usuarios simulados
      // 0 a 1000 usuarios = Free Tier (altura mínima 0.3)
      // 1000 a 5000 usuarios = Escala de 0.3 a 3.8
      let targetHeight = 0.4;
      if (simulatedUsers > 1000) {
        targetHeight = 0.4 + ((simulatedUsers - 1000) / 4000) * 3.4;
      }
      currentScaleY += (targetHeight - currentScaleY) * 0.08;

      awsGroup.scale.set(1, currentScaleY, 1);
      savingsMesh.position.y = currentScaleY + 0.4;
      savingsMesh.rotation.y = elapsed * 1.5;
      savingsMesh.rotation.x = elapsed * 0.8;

      // Color dinámico según alerta y estado de Free Tier
      if (isAlert) {
        // Alerta de exceso de presupuesto: Rojo alerta con sacudida
        awsMat.color.lerp(new THREE.Color(0xc6432b), 0.1);
        savingsMat.color.lerp(new THREE.Color(0xc6432b), 0.1);
        particleMat.color.lerp(new THREE.Color(0xc6432b), 0.1);

        const jitter = (Math.random() - 0.5) * 0.04;
        awsGroup.position.x = 2.0 + jitter;
      } else if (simulatedUsers <= 1000) {
        // Free Tier Activo ($0): Verde seguro
        awsMat.color.lerp(new THREE.Color(0x6e8e59), 0.1);
        savingsMat.color.lerp(new THREE.Color(0x6e8e59), 0.1);
        particleMat.color.lerp(new THREE.Color(0x6e8e59), 0.1);
        awsGroup.position.x = 2.0;
      } else {
        // Pay-As-You-Go Normal: Oro AWS
        awsMat.color.lerp(new THREE.Color(0xd4a017), 0.1);
        savingsMat.color.lerp(new THREE.Color(0xd4a017), 0.1);
        particleMat.color.lerp(new THREE.Color(0xd4a017), 0.1);
        awsGroup.position.x = 2.0;
      }

      budgetRing.rotation.z = elapsed * 0.4;

      // Partículas
      const posArray = particlePoints.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3 + 1] += particleSpeeds[i];
        if (posArray[i * 3 + 1] > 2.5) {
          posArray[i * 3 + 1] = -2.2;
        }
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
  }, [isActive, simulatedUsers, isAlert]);

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

export default CostOptimizationCanvas;
