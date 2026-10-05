// src/components/three/AutoScalingArchitectureCanvas.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * AutoScalingArchitectureCanvas — Visualizador 3D interactivo para el Slide 19:
 * "Arquitectura Dinámica y Alta Disponibilidad (ALB + Auto Scaling Multi-AZ)"
 *
 * Renderiza:
 * 1. Application Load Balancer (ALB): Toroide / Nodo central luminoso superior.
 * 2. Dos Zonas de Disponibilidad (us-east-1a en la izquierda, us-east-1b en la derecha).
 * 3. Instancias EC2 dinámicas representadas por servidores Blade facetados con luces de estado.
 * 4. Nube de tráfico (partículas) que el ALB enruta hacia las instancias saludables.
 * 5. Si simulatedState === "fail_zone_a", la zona A se torna carmesí / alarmada y el 100% de partículas se desvía a la Zona B.
 */
export function AutoScalingArchitectureCanvas({
  isActive = true,
  trafficMode = "normal", // "normal" | "peak" | "fail_zone_a"
}) {
  const containerRef = useRef(null);
  const animFrameId = useRef(null);
  const trafficModeRef = useRef(trafficMode);

  useEffect(() => {
    trafficModeRef.current = trafficMode;
  }, [trafficMode]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 550;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    // Cámara perfectamente alineada al centro del grupo
    camera.position.set(0, 0.8, 8.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    const rootGroup = new THREE.Group();
    // Elevamos el rootGroup a y = 0.9 para que el conjunto (ALB arriba y servidores abajo) quede centrado
    rootGroup.position.set(0, 0.10, 0);
    scene.add(rootGroup);

    // Iluminación
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xd4a017, 2.0);
    dirLight.position.set(5, 8, 6);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x00c853, 1.8, 15);
    pointLight.position.set(0, 2, 2);
    scene.add(pointLight);

    // --- 1. Campo Estelar Cósmico Profundo (500 Estrellas bien visibles) ---
    const starCount = 500;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starCol = new Float32Array(starCount * 3);

    const cGold = new THREE.Color(0xd4a017);
    const cEmerald = new THREE.Color(0x00c853);
    const cCyan = new THREE.Color(0x38bdf8);
    const cWhite = new THREE.Color(0xffffff);

    for (let i = 0; i < starCount; i++) {
      const r = 3.5 + Math.random() * 8.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);

      const choice = Math.random();
      const col = choice > 0.6 ? cGold : (choice > 0.35 ? cEmerald : (choice > 0.15 ? cCyan : cWhite));
      starCol[i * 3] = col.r;
      starCol[i * 3 + 1] = col.g;
      starCol[i * 3 + 2] = col.b;
    }

    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starCol, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // --- 2. Nodo Superior: Application Load Balancer (ALB) ---
    const albGroup = new THREE.Group();
    // Centrado más bajo respecto a la cámara (y = 1.35)
    albGroup.position.set(0, 1.35, 0);

    const albRingGeo = new THREE.TorusGeometry(0.78, 0.08, 20, 60);
    const albRingMat = new THREE.MeshStandardMaterial({
      color: 0xd4a017,
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0xd4a017,
      emissiveIntensity: 0.8,
    });
    const albRing = new THREE.Mesh(albRingGeo, albRingMat);
    albRing.rotation.x = Math.PI / 2.3;
    albGroup.add(albRing);

    // Segundo anillo orbital exterior sutil
    const albOuterGeo = new THREE.TorusGeometry(1.05, 0.02, 16, 48);
    const albOuterMat = new THREE.MeshBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.45 });
    const albOuterRing = new THREE.Mesh(albOuterGeo, albOuterMat);
    albOuterRing.rotation.x = Math.PI / 2.6;
    albGroup.add(albOuterRing);

    const albCoreGeo = new THREE.OctahedronGeometry(0.42, 1);
    const albCoreMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.15,
      metalness: 0.95,
      emissive: 0xd4a017,
      emissiveIntensity: 1.1,
    });
    const albCore = new THREE.Mesh(albCoreGeo, albCoreMat);
    albGroup.add(albCore);
    rootGroup.add(albGroup);

    // --- 3. Plataformas de Zona de Disponibilidad (us-east-1a y us-east-1b) ---
    const zoneMatA = new THREE.MeshStandardMaterial({
      color: 0x141414,
      roughness: 0.4,
      metalness: 0.6,
      transparent: true,
      opacity: 0.85,
    });
    const zoneMatB = new THREE.MeshStandardMaterial({
      color: 0x141414,
      roughness: 0.4,
      metalness: 0.6,
      transparent: true,
      opacity: 0.85,
    });

    const zoneGeo = new THREE.BoxGeometry(2.3, 0.14, 1.9);
    const platformA = new THREE.Mesh(zoneGeo, zoneMatA);
    platformA.position.set(-1.85, -1.05, 0);
    rootGroup.add(platformA);

    const platformB = new THREE.Mesh(zoneGeo, zoneMatB);
    platformB.position.set(1.85, -1.05, 0);
    rootGroup.add(platformB);

    // Marcos de alambre para las Zonas
    const edgesGeo = new THREE.EdgesGeometry(zoneGeo);
    const wireMatA = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.8 });
    const wireMatB = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.8 });
    const wireA = new THREE.LineSegments(edgesGeo, wireMatA);
    platformA.add(wireA);
    const wireB = new THREE.LineSegments(edgesGeo, wireMatB);
    platformB.add(wireB);

    // --- 4. Instancias EC2 (Servidores Blade con Disipadores) ---
    function createServerMesh(color = 0x00c853) {
      const server = new THREE.Group();
      const bodyGeo = new THREE.BoxGeometry(0.55, 0.85, 0.45);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0x161618,
        roughness: 0.3,
        metalness: 0.8,
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      server.add(body);

      // Wireframe dorado fino alrededor del servidor
      const sWireGeo = new THREE.WireframeGeometry(bodyGeo);
      const sWireMat = new THREE.LineBasicMaterial({ color: 0xd4a017, transparent: true, opacity: 0.5 });
      const sWire = new THREE.LineSegments(sWireGeo, sWireMat);
      server.add(sWire);

      // Led frontal indicador
      const ledGeo = new THREE.BoxGeometry(0.38, 0.08, 0.05);
      const ledMat = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 1.4,
      });
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(0, 0.22, 0.23);
      server.add(led);

      return { group: server, bodyMat, ledMat, sWireMat };
    }

    // Instancia fija Zona A
    const sA1 = createServerMesh(0x00c853);
    sA1.group.position.set(-2.25, -0.55, 0);
    rootGroup.add(sA1.group);

    // Instancia secundaria Zona A (Auto-Scaling en pico)
    const sA2 = createServerMesh(0x00c853);
    sA2.group.position.set(-1.45, -0.55, 0);
    rootGroup.add(sA2.group);

    // Instancia fija Zona B
    const sB1 = createServerMesh(0x00c853);
    sB1.group.position.set(1.45, -0.55, 0);
    rootGroup.add(sB1.group);

    // Instancia secundaria Zona B (Auto-Scaling en pico)
    const sB2 = createServerMesh(0x00c853);
    sB2.group.position.set(2.25, -0.55, 0);
    rootGroup.add(sB2.group);

    // --- 5. Partículas de Tráfico HTTP ---
    const particleCount = 140;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    const pSpeeds = new Float32Array(particleCount);
    const pTargets = new Float32Array(particleCount); // 0 = Zona A, 1 = Zona B

    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 0.4;
      pPositions[i * 3 + 1] = 1.45 - Math.random() * 0.3;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
      pSpeeds[i] = 0.018 + Math.random() * 0.024;
      pTargets[i] = Math.random() > 0.5 ? 1 : 0;
    }

    pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xd4a017,
      size: 0.065,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(pGeo, pMat);
    rootGroup.add(particleSystem);

    // Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / height - 0.5) * 2;
    };
    container.addEventListener("mousemove", handleMouseMove);

    // Loop de renderizado
    let clock = new THREE.Clock();
    let isRunning = true;

    function animate() {
      if (!isRunning) return;
      animFrameId.current = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();
      const mode = trafficModeRef.current;

      // Rotación suave del ALB y campo estelar
      albRing.rotation.z = elapsed * 0.7;
      albOuterRing.rotation.z = -elapsed * 0.4;
      albCore.rotation.y = elapsed * 0.95;
      albCore.rotation.x = elapsed * 0.55;

      starPoints.rotation.y = elapsed * 0.025;
      starPoints.rotation.x = elapsed * 0.012;

      // Parallax inercial suave
      rootGroup.rotation.y += (mouseX * 0.3 - rootGroup.rotation.y) * 0.05;
      rootGroup.rotation.x += (-mouseY * 0.18 - rootGroup.rotation.x) * 0.05;

      // Lógica de visibilidad y color según estado
      if (mode === "normal") {
        // En normal: 1 servidor por zona
        sA2.group.scale.set(0.001, 0.001, 0.001);
        sB2.group.scale.set(0.001, 0.001, 0.001);
        sA1.group.scale.set(1, 1, 1);
        sB1.group.scale.set(1, 1, 1);

        wireMatA.color.setHex(0x38bdf8);
        wireMatB.color.setHex(0x38bdf8);
        sA1.ledMat.color.setHex(0x00c853);
        sA1.ledMat.emissive.setHex(0x00c853);
        pMat.color.setHex(0xd4a017);
      } else if (mode === "peak") {
        // En pico: Auto-Scaling despierta las instancias 2 en ambas zonas
        sA1.group.scale.set(1, 1, 1);
        sA2.group.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        sB1.group.scale.set(1, 1, 1);
        sB2.group.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);

        wireMatA.color.setHex(0x00c853);
        wireMatB.color.setHex(0x00c853);
        sA1.ledMat.color.setHex(0x00c853);
        sA2.ledMat.color.setHex(0x00c853);
        sB1.ledMat.color.setHex(0x00c853);
        sB2.ledMat.color.setHex(0x00c853);
        pMat.color.setHex(0x00c853);
      } else if (mode === "fail_zone_a") {
        // Simulación de Falla: Zona A en rojo, se apaga; Zona B absorbe el 100%
        sA1.group.scale.set(1, 1, 1);
        sA2.group.scale.set(0.001, 0.001, 0.001);
        sB1.group.scale.set(1, 1, 1);
        sB2.group.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1); // Zona B escala para compensar

        wireMatA.color.setHex(0xef4444);
        wireMatB.color.setHex(0x00c853);
        sA1.ledMat.color.setHex(0xef4444);
        sA1.ledMat.emissive.setHex(0xef4444);
        sB1.ledMat.color.setHex(0x00c853);
        sB2.ledMat.color.setHex(0x00c853);
        pMat.color.setHex(0x38bdf8);
      }

      // Animación de partículas de tráfico fluyendo desde el ALB hacia las plataformas
      const pos = particleSystem.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const targetZone = mode === "fail_zone_a" ? 1 : pTargets[i]; // Si falla A, todo va a B (targetZone = 1)
        const targetX = targetZone === 0 ? -1.85 : 1.85;

        pos[i * 3 + 1] -= pSpeeds[i] * (mode === "peak" ? 1.7 : 1.0);
        pos[i * 3] += (targetX - pos[i * 3]) * 0.038;

        // Reiniciar cuando llega a la plataforma inferior (-0.95)
        if (pos[i * 3 + 1] < -0.95) {
          pos[i * 3] = (Math.random() - 0.5) * 0.35;
          pos[i * 3 + 1] = 1.35 - Math.random() * 0.15;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 0.35;
          pTargets[i] = Math.random() > 0.5 ? 1 : 0;
        }
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    }

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 550;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animFrameId.current);
      container.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
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
        minHeight: "420px",
        position: "relative",
        overflow: "hidden",
      }}
    />
  );
}

export default AutoScalingArchitectureCanvas;
