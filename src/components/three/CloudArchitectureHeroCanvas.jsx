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

  // Mantener activeStep en useRef mutable para no desmontar ni recrear la escena WebGL
  const activeStepRef = useRef(activeStep);
  useEffect(() => {
    activeStepRef.current = activeStep;
  }, [activeStep]);

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

    // ── 6. Paquete de Petición HTTP Viajero (Packet Particle con Halo) ──
    const packetGeo = new THREE.SphereGeometry(0.14, 16, 16);
    const packetMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
    });
    const packetMesh = new THREE.Mesh(packetGeo, packetMat);
    packetMesh.position.set(0, 0, 4.8); // Inicia en el cliente exterior
    rootGroup.add(packetMesh);

    // Halo secundario de paquete
    const haloGeo = new THREE.IcosahedronGeometry(0.25, 0);
    const haloWire = new THREE.WireframeGeometry(haloGeo);
    const haloMat = new THREE.LineBasicMaterial({
      color: 0xd4a017,
      transparent: true,
      opacity: 0.6,
    });
    const haloMesh = new THREE.LineSegments(haloWire, haloMat);
    packetMesh.add(haloMesh);

    // Posiciones clave del paquete por cada paso
    // 0: Reposo exterior
    // 1: Origen (navegador del usuario)
    // 2: CloudFront Edge (Torus exterior)
    // 3: Route 53 DNS (Icosaedro)
    // 4: Amazon VPC Perímetro (Cubo)
    // 5: Security Groups (Octaedro)
    // 6: Base de datos privada RDS (Cilindro central)
    // 7: 200 OK (retorno al usuario)
    // Waypoints espaciales del paquete HTTP
    const waypoints = [
      new THREE.Vector3(0, 0, 4.8),      // 0: Idle
      new THREE.Vector3(0, -0.2, 4.2),   // 1: Client
      new THREE.Vector3(0, 1.8, 3.2),    // 2: CloudFront
      new THREE.Vector3(1.6, -0.6, 2.2), // 3: Route 53
      new THREE.Vector3(-1.1, 0.8, 1.1), // 4: VPC
      new THREE.Vector3(0.6, -0.3, 0.5), // 5: Security Groups
      new THREE.Vector3(0, 0, 0),        // 6: Database Core
      new THREE.Vector3(0, 0, 4.4),      // 7: 200 OK response
    ];

    // Posiciones dinámicas de CÁMARA (Zoom cinematográfico) según cada paso
    const cameraWaypoints = [
      { pos: new THREE.Vector3(0, 0.5, 10.5), target: new THREE.Vector3(0, 0, 0) },        // 0: Vista panorámica general
      { pos: new THREE.Vector3(0, 0.2, 7.8), target: new THREE.Vector3(0, -0.2, 4.2) },     // 1: Acercamiento al Cliente
      { pos: new THREE.Vector3(0.8, 2.4, 6.2), target: new THREE.Vector3(0, 1.8, 3.2) },   // 2: Zoom a CloudFront Edge Torus
      { pos: new THREE.Vector3(2.4, -0.3, 5.0), target: new THREE.Vector3(1.6, -0.6, 2.2) },// 3: Zoom a Route 53 DNS Icosahedron
      { pos: new THREE.Vector3(-1.9, 1.3, 4.2), target: new THREE.Vector3(-1.1, 0.8, 1.1) },// 4: Zoom perimetral al Cubo VPC
      { pos: new THREE.Vector3(1.3, -0.1, 3.2), target: new THREE.Vector3(0.6, -0.3, 0.5) },// 5: Zoom al Firewall Octaedro SG
      { pos: new THREE.Vector3(0, 0.4, 2.4), target: new THREE.Vector3(0, 0, 0) },          // 6: Ultra-zoom al Núcleo de Base de Datos RDS
      { pos: new THREE.Vector3(0, 0.8, 9.8), target: new THREE.Vector3(0, 0, 0) },          // 7: Gran apertura panorámica 200 OK
    ];

    // Vector mutable para la interpolación de la cámara
    const currentCamLookAt = new THREE.Vector3(0, 0, 0);

    // ── 7. Campo Estelar Cósmico Profundo (Starfield de 600 estrellas centelleantes) ──
    const starCount = 650;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starVel = [];

    const goldColor = new THREE.Color(0xd4a017);
    const whiteColor = new THREE.Color(0xf5f1e8);
    const oliveColor = new THREE.Color(0x6e8e59);
    const blueColor = new THREE.Color(0x88ccff);

    for (let i = 0; i < starCount; i++) {
      // Distribución esférica y volumétrica amplia para profundidad espacial
      const radius = 3.5 + Math.random() * 12.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = radius * Math.cos(phi);

      // Colores de estrellas (doradas AWS, blancas y azules estelares)
      const randType = Math.random();
      const col = randType > 0.6 ? goldColor : randType > 0.3 ? whiteColor : randType > 0.15 ? blueColor : oliveColor;
      starColors[i * 3] = col.r;
      starColors[i * 3 + 1] = col.g;
      starColors[i * 3 + 2] = col.b;

      starVel.push({
        origX: starPos[i * 3],
        origY: starPos[i * 3 + 1],
        origZ: starPos[i * 3 + 2],
        speed: 0.0005 + Math.random() * 0.0015,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }

    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints); // Agregamos a la escena para fondo cósmico inmersivo

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

    // ── 10. Loop de Animación Continuo y Fluido ──
    const clock = new THREE.Clock();
    let isRunning = true;
    const packetCurrent = new THREE.Vector3(0, 0, 4.8);

    const animate = () => {
      if (!isRunning) return;
      animFrameId.current = requestAnimationFrame(animate);

      if (!isActive) return;

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const currentStep = activeStepRef.current;

      // Parallax inercial
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      rootGroup.position.set(0, 0, 0);
      rootGroup.rotation.y = elapsed * 0.18 + mouseX;
      rootGroup.rotation.x = Math.sin(elapsed * 0.3) * 0.04 - mouseY;

      // Rotaciones armónicas continuas de las capas
      cloudfrontMesh.rotation.z = elapsed * 0.3;
      route53Mesh.rotation.y = -elapsed * 0.2;
      vpcMesh.rotation.y = elapsed * 0.12;
      vpcMesh.rotation.x = elapsed * 0.08;
      sgMesh.rotation.y = elapsed * 0.6;
      sgMesh.rotation.z = elapsed * 0.4;
      dbMesh.rotation.y = elapsed * 1.0;
      haloMesh.rotation.y = elapsed * 2.0;

      // Resaltar capa suavemente con lerp de color y opacidad según currentStep
      const targetCfColor = currentStep === 2 ? new THREE.Color(0xf5f1e8) : new THREE.Color(0xd4a017);
      cloudfrontMat.color.lerp(targetCfColor, 0.1);
      cloudfrontMat.opacity = THREE.MathUtils.lerp(cloudfrontMat.opacity, currentStep === 2 ? 0.95 : 0.4, 0.1);

      const targetR53Color = currentStep === 3 ? new THREE.Color(0xf5f1e8) : new THREE.Color(0x6e8e59);
      route53Mat.color.lerp(targetR53Color, 0.1);
      route53Mat.opacity = THREE.MathUtils.lerp(route53Mat.opacity, currentStep === 3 ? 0.85 : 0.25, 0.1);

      const targetVpcColor = currentStep === 4 ? new THREE.Color(0xd4a017) : new THREE.Color(0x888888);
      vpcMat.color.lerp(targetVpcColor, 0.1);
      vpcMat.opacity = THREE.MathUtils.lerp(vpcMat.opacity, currentStep === 4 ? 0.85 : 0.35, 0.1);

      const targetSgColor = currentStep === 5 ? new THREE.Color(0x6e8e59) : new THREE.Color(0xd4a017);
      sgMat.color.lerp(targetSgColor, 0.1);
      sgMat.opacity = THREE.MathUtils.lerp(sgMat.opacity, currentStep === 5 ? 0.95 : 0.6, 0.1);

      const targetDbColor = currentStep === 6 ? new THREE.Color(0x6e8e59) : new THREE.Color(0xf5f1e8);
      dbMat.color.lerp(targetDbColor, 0.1);
      dbMat.opacity = THREE.MathUtils.lerp(dbMat.opacity, currentStep === 6 ? 1.0 : 0.85, 0.1);

      // Desplazamiento fluido del paquete HTTP con Lerp
      const targetWaypoint = waypoints[currentStep] || waypoints[0];
      packetCurrent.lerp(targetWaypoint, 0.1);
      packetMesh.position.copy(packetCurrent);

      if (currentStep > 0) {
        packetMesh.visible = true;
        const packetPulse = 1 + Math.sin(elapsed * 12) * 0.25;
        packetMesh.scale.set(packetPulse, packetPulse, packetPulse);
        if (currentStep > 6) {
          packetMat.color.lerp(new THREE.Color(0x6e8e59), 0.15); // Verde de 200 OK
          haloMat.color.lerp(new THREE.Color(0x6e8e59), 0.15);
        } else {
          packetMat.color.lerp(new THREE.Color(0xd4a017), 0.15); // Dorado en vuelo
          haloMat.color.lerp(new THREE.Color(0xf5f1e8), 0.15);
        }
      } else {
        packetMesh.visible = false;
      }

      // Interpolación fluida de la Cámara 3D (Efecto ZOOM CINEMATOGRÁFICO que SIGUE la rotación de la bola/malla)
      const targetCamDef = cameraWaypoints[currentStep] || cameraWaypoints[0];
      
      // Calculamos la posición del objetivo y de la cámara proyectada con la rotación actual de rootGroup
      const rotY = rootGroup.rotation.y;
      const rotX = rootGroup.rotation.x;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      // Rotar vector objetivo alrededor de Y para seguir la rotación del grupo
      const origTarget = targetCamDef.target;
      const rotatedTarget = new THREE.Vector3(
        origTarget.x * cosY + origTarget.z * sinY,
        origTarget.y,
        -origTarget.x * sinY + origTarget.z * cosY
      );

      // Rotar la posición relativa de la cámara respecto al objetivo para que orbite junto con el objeto
      const relCamPos = targetCamDef.pos.clone().sub(origTarget);
      const rotatedRelCam = new THREE.Vector3(
        relCamPos.x * cosY + relCamPos.z * sinY,
        relCamPos.y,
        -relCamPos.x * sinY + relCamPos.z * cosY
      );

      const dynamicCamPos = rotatedTarget.clone().add(rotatedRelCam);

      // Si estamos en reposo (paso 0), mantenemos la cámara fija en perspectiva para que se vea la rotación frontal
      const finalCamPos = currentStep === 0 ? targetCamDef.pos : dynamicCamPos;
      const finalLookAt = currentStep === 0 ? targetCamDef.target : rotatedTarget;

      // Lerp continuo y elástico hacia la posición y lookAt orbital
      camera.position.lerp(finalCamPos, 0.05);
      currentCamLookAt.lerp(finalLookAt, 0.06);
      camera.lookAt(currentCamLookAt);

      // Giro lento del campo estelar de fondo
      starPoints.rotation.y = elapsed * 0.02;
      starPoints.rotation.x = Math.sin(elapsed * 0.03) * 0.01;

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

export default CloudArchitectureHeroCanvas;
