// src/components/three/CloudFormationPipelineCanvas.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * CloudFormationPipelineCanvas — Visualizador 3D para el Slide 22:
 * "Infraestructura como Código (IaC) & Despliegue Continuo (CI/CD)"
 *
 * Renderiza:
 * 1. Campo estelar cósmico profundo de 500 estrellas.
 * 2. Nodo Origen / Plantilla CloudFormation (Cubo facetado magenta/violeta con wireframe de código).
 * 3. Tubería / Riel de Pipeline CI/CD luminoso que conecta las 4 fases:
 *    - Source (Git Push) -> Build (Tests Jest) -> Deploy (CloudFormation Stack) -> Live (Infraestructura Activa).
 * 4. Animación interactiva según pipelineMode:
 *    - "automated": Flujo continuo y fluido de paquetes de datos verdes/violetas a través de los nodos del pipeline con 0% de discrepancia.
 *    - "manual_chaos": Visualización del proceso manual tradicional: errores intermitentes, paquetes rojos de fallo y discrepancias de configuración ("drift").
 */
export function CloudFormationPipelineCanvas({
  isActive = true,
  pipelineMode = "automated", // "automated" | "manual_chaos"
}) {
  const containerRef = useRef(null);
  const animFrameId = useRef(null);
  const modeRef = useRef(pipelineMode);

  useEffect(() => {
    modeRef.current = pipelineMode;
  }, [pipelineMode]);

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
    rootGroup.position.set(0, 0.40, 0);
    scene.add(rootGroup);

    // Iluminación
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xa78bfa, 2.2);
    dirLight.position.set(5, 8, 6);
    scene.add(dirLight);

    const centerLight = new THREE.PointLight(0xa78bfa, 2.0, 15);
    centerLight.position.set(0, 0, 0);
    scene.add(centerLight);

    // --- 1. Campo Estelar Cósmico (500 Estrellas) ---
    const starCount = 500;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starCol = new Float32Array(starCount * 3);

    const cViolet = new THREE.Color(0xa78bfa);
    const cEmerald = new THREE.Color(0x00c853);
    const cGold = new THREE.Color(0xd4a017);
    const cWhite = new THREE.Color(0xffffff);

    for (let i = 0; i < starCount; i++) {
      const r = 3.5 + Math.random() * 8.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);

      const choice = Math.random();
      const col = choice > 0.6 ? cViolet : (choice > 0.35 ? cEmerald : (choice > 0.15 ? cGold : cWhite));
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

    // --- 2. Riel de Pipeline CI/CD con Nodos de Etapa ---
    const stages = [
      { name: "Source", x: -2.7, color: 0xd4a017 },
      { name: "Build", x: -0.9, color: 0x38bdf8 },
      { name: "Stack", x: 0.9, color: 0xa78bfa },
      { name: "Deploy", x: 2.7, color: 0x00c853 },
    ];

    const stageNodes = [];

    stages.forEach((st) => {
      const nodeGroup = new THREE.Group();
      nodeGroup.position.set(st.x, 0, 0);

      // Bloque / Estación de proceso
      const boxGeo = new THREE.BoxGeometry(0.7, 0.7, 0.7);
      const boxMat = new THREE.MeshStandardMaterial({
        color: 0x141418,
        metalness: 0.85,
        roughness: 0.25,
        emissive: st.color,
        emissiveIntensity: 0.5,
      });
      const box = new THREE.Mesh(boxGeo, boxMat);
      nodeGroup.add(box);

      const wireGeo = new THREE.WireframeGeometry(boxGeo);
      const wireMat = new THREE.LineBasicMaterial({ color: st.color });
      const wire = new THREE.LineSegments(wireGeo, wireMat);
      nodeGroup.add(wire);

      // Anillo orbital decorativo
      const ringGeo = new THREE.TorusGeometry(0.55, 0.02, 12, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: st.color, transparent: true, opacity: 0.7 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2.5;
      nodeGroup.add(ring);

      rootGroup.add(nodeGroup);
      stageNodes.push({ group: nodeGroup, box, wire, ring, mat: boxMat, origColor: st.color });
    });

    // Línea de interconexión del Pipeline
    const linePoints = [
      new THREE.Vector3(-2.7, 0, 0),
      new THREE.Vector3(2.7, 0, 0),
    ];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
    const lineMat = new THREE.LineBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.5 });
    const pipelineLine = new THREE.Line(lineGeo, lineMat);
    rootGroup.add(pipelineLine);

    // --- 3. Paquete viajero del Pipeline ---
    const packetGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const packetMat = new THREE.MeshBasicMaterial({ color: 0x00c853 });
    const packet = new THREE.Mesh(packetGeo, packetMat);
    rootGroup.add(packet);

    // Halo alrededor del paquete
    const haloGeo = new THREE.RingGeometry(0.16, 0.24, 16);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0x00c853, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = Math.PI / 2;
    packet.add(halo);

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
      const mode = modeRef.current;

      // Rotación suave del campo estelar
      starPoints.rotation.y = elapsed * 0.025;
      starPoints.rotation.x = elapsed * 0.012;

      // Parallax inercial
      rootGroup.rotation.y += (mouseX * 0.3 - rootGroup.rotation.y) * 0.05;
      rootGroup.rotation.x += (-mouseY * 0.18 - rootGroup.rotation.x) * 0.05;

      // Rotación de los nodos del pipeline
      stageNodes.forEach((nd, i) => {
        nd.box.rotation.y = elapsed * 0.6 + i * 0.4;
        nd.box.rotation.x = elapsed * 0.3;
        nd.ring.rotation.z = elapsed * 0.8;
      });

      if (mode === "automated") {
        // Modo Automatizado (CloudFormation): Flujo suave y continuo de izquierda a derecha
        packetMat.color.setHex(0x00c853);
        haloMat.color.setHex(0x00c853);
        lineMat.color.setHex(0xa78bfa);

        stageNodes.forEach((nd) => {
          nd.mat.emissive.setHex(nd.origColor);
        });

        const cycle = (elapsed * 0.8) % 1;
        const currentX = -2.7 + cycle * 5.4;
        packet.position.set(currentX, 0, 0);
        packet.scale.set(1, 1, 1);
      } else {
        // Modo Caos Manual: El paquete falla a mitad de camino y se torna rojo
        packetMat.color.setHex(0xef4444);
        haloMat.color.setHex(0xef4444);
        lineMat.color.setHex(0xef4444);

        const cycle = (elapsed * 1.2) % 1;
        if (cycle < 0.6) {
          // Avanza con tropiezos hasta la etapa 2 o 3
          const currentX = -2.7 + cycle * 4.0;
          packet.position.set(currentX, Math.sin(cycle * 30) * 0.08, 0);
          packet.scale.set(1, 1, 1);
          stageNodes[2].mat.emissive.setHex(0xef4444);
        } else {
          // Fallo / Discrepancia detectada (parpadeo de error manual)
          packet.scale.set(0.001, 0.001, 0.001);
          stageNodes[2].mat.emissive.setHex(0xef4444);
        }
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

export default CloudFormationPipelineCanvas;
