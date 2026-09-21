// src/components/three/CloudArchitectureHeroCanvas.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Visualizador 3D Hero para Slide 12:
 * "Arquitectura de Red Perimetral y Capas AWS (Hero Conceptual)"
 *
 * Renderiza la arquitectura de seguridad y enrutamiento por capas espaciales (Z-depth):
 *  1. Capa Externa Global: Amazon CloudFront (CDN Edge) - Gran Toroide / Anillo orbital con pulsos rápidos.
 *  2. Capa de Resolución: Amazon Route 53 (DNS Global) - Esfera reticular de coordenadas planetarias.
 *  3. Perímetro Aislado: Amazon VPC (10.0.0.0/16 CIDR) - Gran cubo transparente con rejilla de subredes.
 *  4. Firewall Perimetral: Security Groups (Firewall L4) - Escudo facetado protector (Octaedro).
 *  5. Núcleo Seguro: Base de Datos ERP (RDS Subred Privada) - Cilindro facetado con núcleo de oro.
 *
 * Dinámica Interactiva:
 *  - Recibe `activeStep` (0 = Reposo, 1..6 = Nodo activo durante simulación de paquete).
 *  - Paquete de petición HTTP viajero con estela de partículas doradas que recorre las capas.
 *  - Al iluminarse cada capa, su geometría cambia de color y pulsa con ondas concéntricas.
 *  - Parallax inercial suave con mouse.
 */
export function CloudArchitectureHeroCanvas({
  isActive = true,
  activeStep = 0,
}) {
  const containerRef = useRef(null);
  const animFrameId = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;

    // 1. Escena y Cámara con perspectiva amplia para evitar recortes
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 10.5);

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

    // ── Capa 1: Amazon CloudFront (CDN Edge) ──
    const cloudfrontGeo = new THREE.TorusGeometry(3.6, 0.025, 16, 64);
    const cloudfrontWire = new THREE.WireframeGeometry(cloudfrontGeo);
    const cloudfrontMat = new THREE.LineBasicMaterial({
      color: 0xd4a017,
      transparent: true,
      opacity: 0.4,
    });
    const cloudfrontMesh = new THREE.LineSegments(cloudfrontWire, cloudfrontMat);
    cloudfrontMesh.rotation.x = Math.PI / 2.3;
    rootGroup.add(cloudfrontMesh);

    // ── Capa 2: Amazon Route 53 (DNS) ──
    const route53Geo = new THREE.IcosahedronGeometry(2.8, 1);
    const route53Wire = new THREE.WireframeGeometry(route53Geo);
    const route53Mat = new THREE.LineBasicMaterial({
      color: 0x6e8e59,
      transparent: true,
      opacity: 0.25,
    });
    const route53Mesh = new THREE.LineSegments(route53Wire, route53Mat);
    rootGroup.add(route53Mesh);

    // ── Capa 3: Amazon VPC (Red Privada Aislada) ──
    const vpcGeo = new THREE.BoxGeometry(3.2, 3.2, 3.2);
    const vpcWire = new THREE.WireframeGeometry(vpcGeo);
    const vpcMat = new THREE.LineBasicMaterial({
      color: 0x888888,
      transparent: true,
      opacity: 0.35,
      linewidth: 1.5,
    });
    const vpcMesh = new THREE.LineSegments(vpcWire, vpcMat);
    rootGroup.add(vpcMesh);

    // Subredes internas dentro de la VPC (Planos divisores)
    const subnetGeo = new THREE.PlaneGeometry(3.0, 3.0);
    const subnetWire = new THREE.WireframeGeometry(subnetGeo);
    const subnetMat = new THREE.LineBasicMaterial({
      color: 0x444444,
      transparent: true,
      opacity: 0.2,
    });
    const subnetMesh = new THREE.LineSegments(subnetWire, subnetMat);
    subnetMesh.rotation.x = Math.PI / 2;
    rootGroup.add(subnetMesh);

    // ── Capa 4: Security Groups (Firewall L4) ──
    const sgGeo = new THREE.OctahedronGeometry(1.4, 0);
    const sgWire = new THREE.WireframeGeometry(sgGeo);
    const sgMat = new THREE.LineBasicMaterial({
      color: 0xd4a017,
      transparent: true,
      opacity: 0.6,
    });
    const sgMesh = new THREE.LineSegments(sgWire, sgMat);
    rootGroup.add(sgMesh);

    // ── Capa 5: ERP Database (Subred Privada / RDS Core) ──
    const dbGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.9, 16);
    const dbWire = new THREE.WireframeGeometry(dbGeo);
    const dbMat = new THREE.LineBasicMaterial({
      color: 0xf5f1e8,
      transparent: true,
      opacity: 0.85,
    });
    const dbMesh = new THREE.LineSegments(dbWire, dbMat);
    rootGroup.add(dbMesh);

    // ── 6. Paquete de Petición HTTP Viajero (Packet Particle) ──
    const packetGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const packetMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
    });
    const packetMesh = new THREE.Mesh(packetGeo, packetMat);
    packetMesh.position.set(0, 0, 4.8); // Inicia en el cliente exterior
    rootGroup.add(packetMesh);

    // Posiciones clave del paquete por cada paso
    // 0: Reposo exterior
    // 1: Origen (navegador)
    // 2: CloudFront Edge
    // 3: Route 53 DNS
    // 4: Amazon VPC Perímetro
    // 5: Security Groups
    // 6: Base de datos privada
    // 7: 200 OK (retorno al usuario)
    const waypoints = [
      new THREE.Vector3(0, 0, 4.8),     // 0: Idle
      new THREE.Vector3(0, 0, 4.4),     // 1: Client
      new THREE.Vector3(0, 1.8, 3.2),   // 2: CloudFront
      new THREE.Vector3(1.6, -0.6, 2.2),// 3: Route 53
      new THREE.Vector3(-1.1, 0.8, 1.1),// 4: VPC
      new THREE.Vector3(0.6, -0.3, 0.5),// 5: Security Groups
      new THREE.Vector3(0, 0, 0),       // 6: Database Core
      new THREE.Vector3(0, 0, 4.4),     // 7: 200 OK response
    ];

    // ── 7. Nube de Datos en Tráfico (70 puntos) ──
    const trafficCount = 70;
    const trafficGeo = new THREE.BufferGeometry();
    const trafficPos = new Float32Array(trafficCount * 3);
    const trafficVel = [];

    for (let i = 0; i < trafficCount; i++) {
      const rad = 1.2 + Math.random() * 2.8;
      const angle = Math.random() * Math.PI * 2;
      trafficPos[i * 3] = Math.cos(angle) * rad;
      trafficPos[i * 3 + 1] = (Math.random() - 0.5) * 3.5;
      trafficPos[i * 3 + 2] = Math.sin(angle) * rad;

      trafficVel.push({
        angle,
        rad,
        speed: 0.01 + Math.random() * 0.02,
      });
    }

    trafficGeo.setAttribute("position", new THREE.BufferAttribute(trafficPos, 3));
    const trafficMat = new THREE.PointsMaterial({
      color: 0xd4a017,
      size: 0.045,
      transparent: true,
      opacity: 0.55,
    });
    const trafficPoints = new THREE.Points(trafficGeo, trafficMat);
    rootGroup.add(trafficPoints);

    // ── 8. Parallax con el ratón ──
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

    // ── 9. Resize Observer ──
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

    // ── 10. Loop de Animación ──
    const clock = new THREE.Clock();
    let isRunning = true;
    const packetCurrent = new THREE.Vector3(0, 0, 4.8);

    const animate = () => {
      if (!isRunning) return;
      animFrameId.current = requestAnimationFrame(animate);

      if (!isActive) return;

      const elapsed = clock.getElapsedTime();

      // Parallax
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      rootGroup.position.set(0, 0, 0);
      rootGroup.rotation.y = elapsed * 0.18 + mouseX;
      rootGroup.rotation.x = Math.sin(elapsed * 0.3) * 0.04 - mouseY;

      // Rotaciones armónicas de las capas
      cloudfrontMesh.rotation.z = elapsed * 0.3;
      route53Mesh.rotation.y = -elapsed * 0.2;
      vpcMesh.rotation.y = elapsed * 0.12;
      vpcMesh.rotation.x = elapsed * 0.08;
      sgMesh.rotation.y = elapsed * 0.6;
      sgMesh.rotation.z = elapsed * 0.4;
      dbMesh.rotation.y = elapsed * 1.0;

      // Resaltar capa según activeStep
      if (activeStep === 2) {
        // CloudFront activo
        cloudfrontMat.color.setHex(0xf5f1e8);
        cloudfrontMat.opacity = 0.9;
      } else {
        cloudfrontMat.color.setHex(0xd4a017);
        cloudfrontMat.opacity = 0.4;
      }

      if (activeStep === 3) {
        // Route 53 activo
        route53Mat.color.setHex(0xf5f1e8);
        route53Mat.opacity = 0.8;
      } else {
        route53Mat.color.setHex(0x6e8e59);
        route53Mat.opacity = 0.25;
      }

      if (activeStep === 4) {
        // VPC activa
        vpcMat.color.setHex(0xd4a017);
        vpcMat.opacity = 0.8;
      } else {
        vpcMat.color.setHex(0x888888);
        vpcMat.opacity = 0.35;
      }

      if (activeStep === 5) {
        // Security Groups activo
        sgMat.color.setHex(0x6e8e59);
        sgMat.opacity = 0.95;
      } else {
        sgMat.color.setHex(0xd4a017);
        sgMat.opacity = 0.6;
      }

      if (activeStep === 6) {
        // Database activo
        dbMat.color.setHex(0x6e8e59);
        dbMat.opacity = 1.0;
      } else {
        dbMat.color.setHex(0xf5f1e8);
        dbMat.opacity = 0.85;
      }

      // Desplazamiento del paquete HTTP
      const targetWaypoint = waypoints[activeStep] || waypoints[0];
      packetCurrent.lerp(targetWaypoint, 0.08);
      packetMesh.position.copy(packetCurrent);

      if (activeStep > 0) {
        packetMesh.visible = true;
        const packetPulse = 1 + Math.sin(elapsed * 12) * 0.25;
        packetMesh.scale.set(packetPulse, packetPulse, packetPulse);
        if (activeStep > 6) {
          packetMat.color.setHex(0x6e8e59); // Verde de 200 OK
        } else {
          packetMat.color.setHex(0xd4a017); // Dorado de paquete en vuelo
        }
      } else {
        packetMesh.visible = false;
      }

      // Tráfico de partículas
      const posArray = trafficPoints.geometry.attributes.position.array;
      for (let i = 0; i < trafficCount; i++) {
        const pv = trafficVel[i];
        pv.angle += pv.speed;
        posArray[i * 3] = Math.cos(pv.angle) * pv.rad;
        posArray[i * 3 + 2] = Math.sin(pv.angle) * pv.rad;
      }
      trafficPoints.geometry.attributes.position.needsUpdate = true;

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
  }, [isActive, activeStep]);

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

export default CloudArchitectureHeroCanvas;
