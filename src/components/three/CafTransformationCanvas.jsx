// src/components/three/CafTransformationCanvas.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Visualizador 3D Interactivo para Slide 09:
 * "AWS Cloud Adoption Framework (CAF) - Transformación de Arquitectura"
 *
 * Mejoras de rendimiento y fluidez:
 *  - Cero reinicios / Cero recargas: `isActive` e `isAfter` se gestionan mediante `useRef`,
 *    manteniendo el contexto WebGL activo de forma continua durante toda la presentación.
 *  - Transición cinemática fluida (Morphing en vivo):
 *    - Cuando se conmuta el toggle "Antes" vs "Después", los 10 nodos se desplazan suavemente
 *      con aceleración/desaceleración lerp entre su distribución caótica fragmentada (Antes)
 *      y la matriz hexagonal orbital coordinada por el VPC de AWS (Después).
 *    - El núcleo central transmuta gradualmente de cubo gris Hostinger a dodecaedro dorado AWS
 *      con doble halo orbital pulsante.
 */
export function CafTransformationCanvas({ isActive = true, isAfter = false }) {
  const containerRef = useRef(null);
  const animFrameId = useRef(null);

  const isActiveRef = useRef(isActive);
  const isAfterRef = useRef(isAfter);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    isAfterRef.current = isAfter;
  }, [isAfter]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 9.2);

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

    // 4. Núcleo Central de Infraestructura:
    // Modelo Hostinger (Cubo monocromático)
    const hostingerGeo = new THREE.BoxGeometry(1.65, 1.65, 1.65);
    const hostingerMat = new THREE.LineBasicMaterial({
      color: 0x666666,
      transparent: true,
      opacity: 0.85,
      linewidth: 1.5,
    });
    const hostingerMesh = new THREE.LineSegments(new THREE.WireframeGeometry(hostingerGeo), hostingerMat);
    rootGroup.add(hostingerMesh);

    // Modelo AWS (Dodecaedro dorado que emerge en After)
    const awsGeo = new THREE.DodecahedronGeometry(1.35, 0);
    const awsMat = new THREE.LineBasicMaterial({
      color: 0xd4a017,
      transparent: true,
      opacity: 0.0,
      linewidth: 1.5,
    });
    const awsMesh = new THREE.LineSegments(new THREE.WireframeGeometry(awsGeo), awsMat);
    rootGroup.add(awsMesh);

    // Núcleo interno de energía (Octaedro)
    const innerCoreGeo = new THREE.OctahedronGeometry(0.72, 0);
    const innerCoreMat = new THREE.LineBasicMaterial({
      color: 0x888888,
      transparent: true,
      opacity: 0.9,
    });
    const innerCoreMesh = new THREE.LineSegments(new THREE.WireframeGeometry(innerCoreGeo), innerCoreMat);
    rootGroup.add(innerCoreMesh);

    // Anillo de Gobierno / VPC (Visible en After)
    const vpcRingGeo = new THREE.TorusGeometry(3.0, 0.018, 16, 64);
    const vpcRingMat = new THREE.LineBasicMaterial({
      color: 0xd4a017,
      transparent: true,
      opacity: 0.1,
    });
    const vpcRing = new THREE.LineSegments(new THREE.WireframeGeometry(vpcRingGeo), vpcRingMat);
    vpcRing.rotation.x = Math.PI / 2.2;
    rootGroup.add(vpcRing);

    // Segundo anillo orbital exterior
    const outerRingGeo = new THREE.TorusGeometry(3.6, 0.014, 16, 64);
    const outerRingMat = new THREE.LineBasicMaterial({
      color: 0x6e8e59,
      transparent: true,
      opacity: 0.05,
    });
    const outerRing = new THREE.LineSegments(new THREE.WireframeGeometry(outerRingGeo), outerRingMat);
    outerRing.rotation.x = Math.PI / 3;
    rootGroup.add(outerRing);

    // 5. Los 10 Nodos de los Practicantes / Desarrolladores
    const nodeCount = 10;
    const nodes = [];
    const nodeGeo = new THREE.BoxGeometry(0.38, 0.38, 0.38);
    const nodeWire = new THREE.WireframeGeometry(nodeGeo);

    // Posiciones pseudo-aleatorias fijas para el estado Before (para consistencia)
    const fixedRandomAngles = [0.2, 0.9, 1.45, 2.1, 2.8, 3.4, 4.0, 4.7, 5.3, 5.95];
    const fixedRadii = [2.2, 3.1, 2.0, 2.8, 2.3, 3.2, 2.1, 2.9, 2.4, 3.0];
    const fixedHeights = [-0.8, 1.2, -1.1, 0.7, -0.5, 1.0, -1.3, 0.4, -0.9, 1.1];

    for (let i = 0; i < nodeCount; i++) {
      // Estado Fragmentado (Antes): Posiciones asimétricas desconectadas
      const angleBefore = fixedRandomAngles[i];
      const radBefore = fixedRadii[i];
      const yBefore = fixedHeights[i];
      const posBefore = new THREE.Vector3(
        Math.cos(angleBefore) * radBefore,
        yBefore,
        Math.sin(angleBefore) * radBefore
      );

      // Estado Centralizado AWS (Después): Anillo ordenado y armónico
      const angleAfter = (i / nodeCount) * Math.PI * 2;
      const radiusAfter = 2.85;
      const yAfter = Math.sin(angleAfter * 2) * 0.4;
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

      // Halo perimetral en cada nodo
      const haloGeo = new THREE.TorusGeometry(0.32, 0.01, 6, 20);
      const haloMat = new THREE.LineBasicMaterial({
        color: 0x555555,
        transparent: true,
        opacity: 0.2,
      });
      const haloMesh = new THREE.LineSegments(new THREE.WireframeGeometry(haloGeo), haloMat);
      haloMesh.rotation.x = Math.PI / 2;
      mesh.add(haloMesh);

      // Línea de enlace hacia el núcleo central
      const linkGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        mesh.position.clone(),
      ]);
      const linkMat = new THREE.LineBasicMaterial({
        color: 0x444444,
        transparent: true,
        opacity: 0.2,
      });
      const linkLine = new THREE.Line(linkGeo, linkMat);
      rootGroup.add(linkLine);

      nodes.push({
        mesh,
        mat,
        haloMesh,
        haloMat,
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
      const rad = 1.3 + Math.random() * 2.3;
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
      targetMouseX = nx * 0.35;
      targetMouseY = ny * 0.2;
    };

    container.addEventListener("mousemove", handleMouseMove, { passive: true });

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

    // 9. Loop de Animación con Lerp continuo (Sin recarga de canvas)
    const clock = new THREE.Clock();
    let isRunning = true;
    let transitionProgress = isAfterRef.current ? 1.0 : 0.0;

    const animate = () => {
      if (!isRunning) return;
      animFrameId.current = requestAnimationFrame(animate);

      if (!isActiveRef.current) return;

      const elapsed = clock.getElapsedTime();
      const isAfter = isAfterRef.current;

      // Mouse Parallax
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Interpolación suave y continua de transitionProgress (0 = Antes, 1 = Después)
      const targetProg = isAfter ? 1.0 : 0.0;
      transitionProgress += (targetProg - transitionProgress) * 0.06;

      rootGroup.position.set(0, 0, 0);
      rootGroup.rotation.y = elapsed * (0.15 + transitionProgress * 0.22) + mouseX;
      rootGroup.rotation.x = Math.sin(elapsed * 0.3) * 0.05 - mouseY;

      // Transmutación visual del Núcleo:
      // Hostinger se desvanece y contrae / AWS emerge y brilla
      hostingerMat.opacity = Math.max(0, (1 - transitionProgress) * 0.85);
      hostingerMesh.scale.setScalar(1 - transitionProgress * 0.3);

      awsMat.opacity = Math.max(0, transitionProgress * 0.9);
      awsMesh.scale.setScalar(0.7 + transitionProgress * 0.3);

      // Núcleo interior
      innerCoreMat.color.lerpColors(
        new THREE.Color(0x777777),
        new THREE.Color(0x6e8e59),
        transitionProgress
      );

      // Anillos de gobernanza y VPC
      vpcRingMat.opacity = 0.55 * transitionProgress;
      outerRingMat.opacity = 0.4 * transitionProgress;

      // Partículas
      particleMat.color.lerpColors(
        new THREE.Color(0x777777),
        new THREE.Color(0xd4a017),
        transitionProgress
      );

      hostingerMesh.rotation.y = elapsed * 0.4;
      hostingerMesh.rotation.x = elapsed * 0.25;
      awsMesh.rotation.y = elapsed * 0.6;
      awsMesh.rotation.x = elapsed * 0.35;
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
        node.currentPos.lerp(dest, 0.08);
        node.mesh.position.copy(node.currentPos);

        // Flotación micro-inercial
        node.mesh.position.y += Math.sin(elapsed * 2 + node.index) * 0.04;
        node.mesh.rotation.y = elapsed * (0.8 + node.index * 0.1);

        // Transición de colores de nodos
        node.mat.color.lerpColors(
          new THREE.Color(0x555555),
          new THREE.Color(0xd4a017),
          transitionProgress
        );
        node.haloMat.color.lerpColors(
          new THREE.Color(0x333333),
          new THREE.Color(0x6e8e59),
          transitionProgress
        );
        node.haloMat.opacity = 0.2 + transitionProgress * 0.5;

        node.linkMat.color.lerpColors(
          new THREE.Color(0x333333),
          new THREE.Color(0xd4a017),
          transitionProgress
        );
        node.linkMat.opacity = 0.15 + transitionProgress * 0.35;

        // Actualizar geometría de línea de enlace
        const linkPositions = node.linkLine.geometry.attributes.position.array;
        linkPositions[3] = node.mesh.position.x;
        linkPositions[4] = node.mesh.position.y;
        linkPositions[5] = node.mesh.position.z;
        node.linkLine.geometry.attributes.position.needsUpdate = true;
      });

      // Partículas orbitales
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

export default CafTransformationCanvas;

