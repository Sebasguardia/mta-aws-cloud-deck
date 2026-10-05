// src/components/three/NetworkSecurityCanvas.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * NetworkSecurityCanvas — Visualizador 3D para el Slide 20:
 * "Seguridad Avanzada de Red y Acceso Seguro (Defense in Depth: SG + NACL + Bastion)"
 *
 * Renderiza:
 * 1. Campo estelar cósmico profundo de 500 estrellas.
 * 2. Tres capas espaciales (Zonas concéntricas / plataformas):
 *    - Capa Externa (Pública): Internet Gateway + Bastion Host (t2.micro jump box).
 *    - Capa Intermedia (Subred Privada App): Instancias EC2 protegidas por Security Group (`sg-app`).
 *    - Capa Núcleo (Subred Privada BD): Base de Datos RDS PostgreSQL protegida por `sg-db`.
 * 3. Escudo perimetral de Network ACL (Octaedro transparente con wireframe).
 * 4. Animación interactiva según securityMode:
 *    - "blocked_attack": Paquete rojo que intenta ingresar directamente al puerto 5432 y es desintegrado / rebotado con onda expansiva roja en el escudo NACL/SG.
 *    - "authorized_bastion": Paquete verde que ingresa por el Bastion Host, pasa el túnel SSH/SSM y conecta de forma segura a la base de datos.
 *    - "normal_web": Paquete cian que viaja desde Internet hacia el ALB y el backend en el puerto 443/3000.
 */
export function NetworkSecurityCanvas({
  isActive = true,
  securityMode = "blocked_attack", // "blocked_attack" | "authorized_bastion" | "normal_web"
}) {
  const containerRef = useRef(null);
  const animFrameId = useRef(null);
  const securityModeRef = useRef(securityMode);

  useEffect(() => {
    securityModeRef.current = securityMode;
  }, [securityMode]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 550;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
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
    rootGroup.position.set(0, 0.45, 0);
    scene.add(rootGroup);

    // Iluminación
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xd4a017, 2.0);
    dirLight.position.set(5, 8, 6);
    scene.add(dirLight);

    const shieldLight = new THREE.PointLight(0x00c853, 2.0, 15);
    shieldLight.position.set(0, 1, 0);
    scene.add(shieldLight);

    // --- 1. Campo Estelar Cósmico Profundo (500 Estrellas) ---
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

    // --- 2. Plataformas en Capas Escalonadas (Defensa en Profundidad) ---
    // Capa 1: Pública (Superior / Entrada)
    const pubGeo = new THREE.CylinderGeometry(2.8, 3.0, 0.12, 32);
    const pubMat = new THREE.MeshStandardMaterial({
      color: 0x141416,
      roughness: 0.5,
      metalness: 0.7,
      transparent: true,
      opacity: 0.85,
    });
    const pubPlatform = new THREE.Mesh(pubGeo, pubMat);
    pubPlatform.position.set(0, -1.2, 0);
    rootGroup.add(pubPlatform);

    const pubWireGeo = new THREE.EdgesGeometry(pubGeo);
    const pubWireMat = new THREE.LineBasicMaterial({ color: 0xd4a017, transparent: true, opacity: 0.7 });
    const pubWire = new THREE.LineSegments(pubWireGeo, pubWireMat);
    pubPlatform.add(pubWire);

    // Capa 2: Privada App (Intermedia)
    const appGeo = new THREE.CylinderGeometry(1.9, 2.0, 0.14, 32);
    const appMat = new THREE.MeshStandardMaterial({
      color: 0x111b22,
      roughness: 0.4,
      metalness: 0.8,
      transparent: true,
      opacity: 0.88,
    });
    const appPlatform = new THREE.Mesh(appGeo, appMat);
    appPlatform.position.set(0, -0.6, 0);
    rootGroup.add(appPlatform);

    const appWireGeo = new THREE.EdgesGeometry(appGeo);
    const appWireMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75 });
    const appWire = new THREE.LineSegments(appWireGeo, appWireMat);
    appPlatform.add(appWire);

    // Capa 3: Privada Base de Datos (Núcleo Protegido)
    const dbGeo = new THREE.CylinderGeometry(1.0, 1.1, 0.18, 28);
    const dbMat = new THREE.MeshStandardMaterial({
      color: 0x102213,
      roughness: 0.3,
      metalness: 0.9,
      transparent: true,
      opacity: 0.92,
    });
    const dbPlatform = new THREE.Mesh(dbGeo, dbMat);
    dbPlatform.position.set(0, 0.05, 0);
    rootGroup.add(dbPlatform);

    const dbWireGeo = new THREE.EdgesGeometry(dbGeo);
    const dbWireMat = new THREE.LineBasicMaterial({ color: 0x00c853, transparent: true, opacity: 0.9 });
    const dbWire = new THREE.LineSegments(dbWireGeo, dbWireMat);
    dbPlatform.add(dbWire);

    // --- 3. Elementos Físicos de Infraestructura ---
    // A) Bastion Host en la Capa Pública (X: -1.6, Y: -0.85)
    const bastionGroup = new THREE.Group();
    bastionGroup.position.set(-1.8, -0.8, 0.4);

    const bastionBoxGeo = new THREE.BoxGeometry(0.42, 0.65, 0.38);
    const bastionBoxMat = new THREE.MeshStandardMaterial({ color: 0x1e1e24, roughness: 0.3, metalness: 0.8 });
    const bastionBox = new THREE.Mesh(bastionBoxGeo, bastionBoxMat);
    bastionGroup.add(bastionBox);

    const bWire = new THREE.LineSegments(new THREE.WireframeGeometry(bastionBoxGeo), new THREE.LineBasicMaterial({ color: 0xd4a017 }));
    bastionGroup.add(bWire);

    // Led indicador Bastion
    const bLed = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.06, 0.04), new THREE.MeshBasicMaterial({ color: 0xd4a017 }));
    bLed.position.set(0, 0.18, 0.2);
    bastionGroup.add(bLed);
    rootGroup.add(bastionGroup);

    // B) Servidor Backend EC2 en la Capa App (X: 0.8, Y: -0.2)
    const appServerGroup = new THREE.Group();
    appServerGroup.position.set(0.9, -0.2, 0.2);
    const appServerBox = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.7, 0.4), new THREE.MeshStandardMaterial({ color: 0x161c24 }));
    appServerGroup.add(appServerBox);
    const appServerWire = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.BoxGeometry(0.45, 0.7, 0.4)), new THREE.LineBasicMaterial({ color: 0x38bdf8 }));
    appServerGroup.add(appServerWire);
    rootGroup.add(appServerGroup);

    // C) Cilindro Base de Datos RDS en el Núcleo (X: 0, Y: 0.5)
    const rdsGroup = new THREE.Group();
    rdsGroup.position.set(0, 0.55, 0);

    const rdsCylGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.6, 24);
    const rdsCylMat = new THREE.MeshStandardMaterial({
      color: 0x142e1b,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x00c853,
      emissiveIntensity: 0.4,
    });
    const rdsCyl = new THREE.Mesh(rdsCylGeo, rdsCylMat);
    rdsGroup.add(rdsCyl);

    const rdsRing = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.03, 12, 32), new THREE.MeshBasicMaterial({ color: 0x00c853 }));
    rdsRing.rotation.x = Math.PI / 2;
    rdsGroup.add(rdsRing);
    rootGroup.add(rdsGroup);

    // --- 4. Escudo Protector Perimetral (NACL / Security Group Dome) ---
    const shieldGeo = new THREE.SphereGeometry(1.6, 24, 24, 0, Math.PI * 2, 0, Math.PI / 1.7);
    const shieldMat = new THREE.MeshStandardMaterial({
      color: 0x00c853,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
      wireframe: true,
    });
    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    shieldMesh.position.set(0, -0.4, 0);
    rootGroup.add(shieldMesh);

    // Anillo de pulso expansivo para impactos
    const impactRingGeo = new THREE.RingGeometry(0.2, 0.35, 32);
    const impactRingMat = new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide, transparent: true, opacity: 0 });
    const impactRing = new THREE.Mesh(impactRingGeo, impactRingMat);
    impactRing.position.set(0, 1.4, 1.3);
    rootGroup.add(impactRing);

    // --- 5. Paquete de Tráfico / Petición Interactiva ---
    const packetGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const packetMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const packetMesh = new THREE.Mesh(packetGeo, packetMat);
    rootGroup.add(packetMesh);

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
      const mode = securityModeRef.current;

      // Rotación del campo estelar
      starPoints.rotation.y = elapsed * 0.025;
      starPoints.rotation.x = elapsed * 0.012;

      // Rotación suave del anillo de base de datos y escudo
      rdsRing.rotation.z = elapsed * 0.8;
      shieldMesh.rotation.y = elapsed * 0.2;

      // Parallax inercial
      rootGroup.rotation.y += (mouseX * 0.3 - rootGroup.rotation.y) * 0.05;
      rootGroup.rotation.x += (-mouseY * 0.18 - rootGroup.rotation.x) * 0.05;

      // Comportamiento según el modo de seguridad
      if (mode === "blocked_attack") {
        // Ataque directo bloqueado en el perímetro
        shieldMat.color.setHex(0xef4444);
        shieldLight.color.setHex(0xef4444);
        packetMat.color.setHex(0xef4444);

        const cycle = (elapsed * 1.5) % 3; // ciclo de 3 segundos
        if (cycle < 1.6) {
          // Viaja desde el exterior (arriba-frente) hacia el escudo
          const t = cycle / 1.6;
          packetMesh.position.set(0, 3.2 - t * 1.8, 3.5 - t * 2.2);
          packetMesh.scale.set(1, 1, 1);
          impactRingMat.opacity = 0;
        } else {
          // Impacto y rebote / desintegración
          const expT = (cycle - 1.6) / 1.4;
          packetMesh.scale.set(Math.max(0.001, 1 - expT * 1.2), Math.max(0.001, 1 - expT * 1.2), Math.max(0.001, 1 - expT * 1.2));
          impactRingMat.opacity = Math.max(0, 0.9 - expT * 1.2);
          impactRing.scale.set(1 + expT * 3.5, 1 + expT * 3.5, 1);
        }
      } else if (mode === "authorized_bastion") {
        // Acceso autorizado por Bastion Host
        shieldMat.color.setHex(0x00c853);
        shieldLight.color.setHex(0x00c853);
        packetMat.color.setHex(0x00c853);
        impactRingMat.opacity = 0;

        const cycle = (elapsed * 1.2) % 3.5;
        if (cycle < 1.4) {
          // Fase 1: Practicante conecta al Bastion Host
          const t = cycle / 1.4;
          packetMesh.position.set(-2.8 + t * 1.0, 2.5 - t * 3.3, 2.0 - t * 1.6);
        } else if (cycle < 2.5) {
          // Fase 2: Túnel seguro desde Bastion al Backend
          const t = (cycle - 1.4) / 1.1;
          packetMesh.position.set(-1.8 + t * 2.7, -0.8 + t * 0.6, 0.4 - t * 0.2);
        } else {
          // Fase 3: Conexión autorizada a la Base de Datos
          const t = (cycle - 2.5) / 1.0;
          packetMesh.position.set(0.9 - t * 0.9, -0.2 + t * 0.75, 0.2 - t * 0.2);
        }
        packetMesh.scale.set(1, 1, 1);
      } else if (mode === "normal_web") {
        // Tráfico Web HTTPS legítimo hacia la Capa App
        shieldMat.color.setHex(0x38bdf8);
        shieldLight.color.setHex(0x38bdf8);
        packetMat.color.setHex(0x38bdf8);
        impactRingMat.opacity = 0;

        const cycle = (elapsed * 1.6) % 2.5;
        const t = cycle / 2.5;
        packetMesh.position.set(0, 3.0 - t * 3.2, 3.0 - t * 2.8);
        packetMesh.scale.set(1, 1, 1);
      }

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

export default NetworkSecurityCanvas;
