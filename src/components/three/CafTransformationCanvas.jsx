// src/components/three/CafTransformationCanvas.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Visualizador 3D Interactivo para Slide 09:
 * "AWS Cloud Adoption Framework (CAF) - Transformación de Arquitectura"
 *
 * Muestra el salto cuántico entre los dos estados:
 *  - Estado "Antes" (`isAfter === false`):
 *    - Modelo fragmentado y monocromático: 10 pequeñas terminales orbitando caóticamente
 *      un único cubo frágil (Hostinger) con enlaces inestables y desconectados.
 *  - Estado "Después" (`isAfter === true`):
 *    - Ecosistema Centralizado AWS:
 *      - Núcleo poliédrico dorado brillante (AWS Cloud Backbone / VPC).
 *      - Anillos concéntricos de gobernanza y seguridad (VPC / Route53 / CDN).
 *      - Las terminales se ordenan en una constelación de matriz hexagonal sincronizada
 *        con pulsos de luz ámbar/dorada y flujos de datos continuos.
 *
 * Directivas de animación y Three.js:
 *  - Interpolar suavemente las posiciones y colores mediante lerp para una transición fluida cuando cambia el toggle.
 *  - Mouse parallax inercial suave.
 *  - Destrucción y limpieza adecuada de recursos WebGL.
 */
export function CafTransformationCanvas({ isActive = true, isAfter = false }) {
  const containerRef = useRef(null);
  const animFrameId = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 9.6);

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

    // 4. Núcleo Central de Infraestructura (Pasa de Cubo Hostinger a Dodecaedro AWS)
    const hostingerGeo = new THREE.BoxGeometry(1.6, 1.6, 1.6);
    const awsGeo = new THREE.DodecahedronGeometry(1.3, 0);

    const coreWireGeo = new THREE.WireframeGeometry(hostingerGeo);
    const coreMat = new THREE.LineBasicMaterial({
      color: 0x666666,
      transparent: true,
      opacity: 0.85,
      linewidth: 1.5,
    });
    const coreMesh = new THREE.LineSegments(coreWireGeo, coreMat);
    rootGroup.add(coreMesh);

    // Núcleo interno de energía
    const innerCoreGeo = new THREE.OctahedronGeometry(0.7, 0);
    const innerCoreWire = new THREE.WireframeGeometry(innerCoreGeo);
    const innerCoreMat = new THREE.LineBasicMaterial({
      color: 0x888888,
      transparent: true,
      opacity: 0.9,
    });
    const innerCoreMesh = new THREE.LineSegments(innerCoreWire, innerCoreMat);
    rootGroup.add(innerCoreMesh);

    // Anillo de Gobierno / VPC (Visible con fuerza en After)
    const vpcRingGeo = new THREE.TorusGeometry(3.0, 0.02, 16, 64);
    const vpcRingWire = new THREE.WireframeGeometry(vpcRingGeo);
    const vpcRingMat = new THREE.LineBasicMaterial({
      color: 0xd4a017,
      transparent: true,
      opacity: 0.15,
    });
    const vpcRing = new THREE.LineSegments(vpcRingWire, vpcRingMat);
    vpcRing.rotation.x = Math.PI / 2.2;
    rootGroup.add(vpcRing);

    // Segundo anillo orbital exterior
    const outerRingGeo = new THREE.TorusGeometry(3.6, 0.015, 16, 64);
    const outerRingWire = new THREE.WireframeGeometry(outerRingGeo);
    const outerRingMat = new THREE.LineBasicMaterial({
      color: 0x6e8e59,
      transparent: true,
      opacity: 0.1,
    });
    const outerRing = new THREE.LineSegments(outerRingWire, outerRingMat);
    outerRing.rotation.x = Math.PI / 3;
    rootGroup.add(outerRing);

    // 5. Los 10 Nodos del Colectivo de Ingeniería (10 Laptops / 10 Usuarios IAM)
    const nodeCount = 10;
    const nodes = [];
    const nodeGeo = new THREE.BoxGeometry(0.35, 0.35, 0.35);
    const nodeWire = new THREE.WireframeGeometry(nodeGeo);

    // Coordenadas calculadas para ambos estados
    for (let i = 0; i < nodeCount; i++) {
      // Estado Fragmentado (Antes): Posiciones dispersas, caóticas y asimétricas
      const angleBefore = (i / nodeCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const radiusBefore = 2.1 + (i % 3) * 0.7;
      const yBefore = (Math.random() - 0.5) * 2.8;
      const posBefore = new THREE.Vector3(
        Math.cos(angleBefore) * radiusBefore,
        yBefore,
        Math.sin(angleBefore) * radiusBefore
      );

      // Estado Centralizado AWS (Después): Anillo coordinado en órbita armónica
      const angleAfter = (i / nodeCount) * Math.PI * 2;
      const radiusAfter = 2.8;
      const yAfter = Math.sin(angleAfter * 2) * 0.45;
      const posAfter = new THREE.Vector3(
        Math.cos(angleAfter) * radiusAfter,
        yAfter,
        Math.sin(angleAfter) * radiusAfter
      );

      const mat = new THREE.LineBasicMaterial({
        color: 0x666666,
        transparent: true,
        opacity: 0.7,
      });
      const mesh = new THREE.LineSegments(nodeWire, mat);
      mesh.position.copy(posBefore);
      rootGroup.add(mesh);

      // Línea de enlace hacia el núcleo central
      const linkGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        mesh.position.clone(),
      ]);
      const linkMat = new THREE.LineBasicMaterial({
        color: 0x444444,
        transparent: true,
        opacity: 0.25,
      });
      const linkLine = new THREE.Line(linkGeo, linkMat);
      rootGroup.add(linkLine);

      nodes.push({
        mesh,
        mat,
        linkLine,
        linkMat,
        posBefore,
        posAfter,
        currentPos: posBefore.clone(),
        index: i,
      });
    }

    // 6. Nube de paquetes de datos (60 partículas)
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVel = [];

    for (let i = 0; i < particleCount; i++) {
      const rad = 1.4 + Math.random() * 2.2;
      const angle = Math.random() * Math.PI * 2;
      particlePositions[i * 3] = Math.cos(angle) * rad;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 3;
      particlePositions[i * 3 + 2] = Math.sin(angle) * rad;
      particleVel.push({
        angle,
        rad,
        speed: 0.01 + Math.random() * 0.02,
      });
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x777777,
      size: 0.05,
      transparent: true,
      opacity: 0.5,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particlePoints);

    // 7. Parallax del mouse suave
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetMouseX = nx * 0.4;
      targetMouseY = ny * 0.25;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // 8. Resize Observer
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

    // 9. Loop de Animación con Lerp continuo
    const clock = new THREE.Clock();
    let isRunning = true;
    let transitionProgress = isAfter ? 1 : 0;

    const animate = () => {
      if (!isRunning) return;
      animFrameId.current = requestAnimationFrame(animate);

      if (!isActive) return;

      const elapsed = clock.getElapsedTime();

      // Mouse Parallax
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Transición matemática suave entre Before (0) y After (1)
      const targetProg = isAfter ? 1 : 0;
      transitionProgress += (targetProg - transitionProgress) * 0.08;

      rootGroup.position.set(0, 0, 0);
      rootGroup.rotation.y = elapsed * (0.15 + transitionProgress * 0.2) + mouseX;
      rootGroup.rotation.x = Math.sin(elapsed * 0.3) * 0.05 - mouseY;

      // Interpolación de materiales del Núcleo
      if (transitionProgress > 0.5) {
        // Enfoque AWS Dorado
        coreMat.color.lerp(new THREE.Color(0xd4a017), 0.1);
        coreMat.opacity = 0.85;
        innerCoreMat.color.lerp(new THREE.Color(0x6e8e59), 0.1);
        vpcRingMat.opacity = 0.55 * transitionProgress;
        outerRingMat.opacity = 0.4 * transitionProgress;
        particleMat.color.lerp(new THREE.Color(0xd4a017), 0.1);
      } else {
        // Enfoque Monocromático Fragmentado (Antes)
        coreMat.color.lerp(new THREE.Color(0x666666), 0.1);
        coreMat.opacity = 0.5;
        innerCoreMat.color.lerp(new THREE.Color(0x888888), 0.1);
        vpcRingMat.opacity = 0.1;
        outerRingMat.opacity = 0.05;
        particleMat.color.lerp(new THREE.Color(0x777777), 0.1);
      }

      coreMesh.rotation.y = elapsed * 0.5;
      coreMesh.rotation.x = elapsed * 0.3;
      innerCoreMesh.rotation.y = -elapsed * 0.8;
      innerCoreMesh.rotation.z = elapsed * 0.4;
      vpcRing.rotation.z = elapsed * 0.25;
      outerRing.rotation.z = -elapsed * 0.15;

      // Animar y desplazar los 10 nodos entre su estado disperso y estado sincronizado
      nodes.forEach((node) => {
        const dest = new THREE.Vector3().lerpVectors(
          node.posBefore,
          node.posAfter,
          transitionProgress
        );
        node.currentPos.lerp(dest, 0.1);
        node.mesh.position.copy(node.currentPos);

        // Flotación micro-inercial
        node.mesh.position.y += Math.sin(elapsed * 2 + node.index) * 0.04;
        node.mesh.rotation.y = elapsed * (0.8 + node.index * 0.1);

        if (transitionProgress > 0.5) {
          node.mat.color.lerp(new THREE.Color(0xd4a017), 0.1);
          node.linkMat.color.lerp(new THREE.Color(0xd4a017), 0.1);
          node.linkMat.opacity = 0.45;
        } else {
          node.mat.color.lerp(new THREE.Color(0x555555), 0.1);
          node.linkMat.color.lerp(new THREE.Color(0x333333), 0.1);
          node.linkMat.opacity = 0.15;
        }

        // Actualizar geometría de línea de enlace
        const linkPositions = node.linkLine.geometry.attributes.position.array;
        linkPositions[3] = node.mesh.position.x;
        linkPositions[4] = node.mesh.position.y;
        linkPositions[5] = node.mesh.position.z;
        node.linkLine.geometry.attributes.position.needsUpdate = true;
      });

      // Partículas
      const posArray = particlePoints.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const pv = particleVel[i];
        pv.angle += pv.speed * (1 + transitionProgress * 1.5);
        posArray[i * 3] = Math.cos(pv.angle) * pv.rad;
        posArray[i * 3 + 2] = Math.sin(pv.angle) * pv.rad;
      }
      particlePoints.geometry.attributes.position.needsUpdate = true;

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
  }, [isActive, isAfter]);

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

export default CafTransformationCanvas;
