// src/components/three/CloudWatchRadarCanvas.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * CloudWatchRadarCanvas — Visualizador 3D para el Slide 21:
 * "Monitoreo, Auditoría y FinOps (CloudWatch + Tagging + Trusted Advisor)"
 *
 * Renderiza:
 * 1. Campo estelar cósmico de 500 estrellas.
 * 2. Núcleo central holográfico: Radar de Telemetría CloudWatch (Dodecaedro dorado con anillos orbitales concéntricos).
 * 3. Nodos satelitales que representan los 3 Proyectos / Clientes etiquetados con Cost Allocation Tags:
 *    - Nodo 1: Workspace MTA (ERP interno - Oro)
 *    - Nodo 2: Strato Studio (Multimedia de alta demanda - Cian)
 *    - Nodo 3: VIISION (Landing & Apps - Esmeralda)
 * 4. Haces de telemetría y pulsos de datos que fluyen hacia el radar central.
 * 5. Si alarmTriggered === true: El núcleo cambia a rojo carmesí parpadeante y emite ondas de choque de alerta SNS.
 */
export function CloudWatchRadarCanvas({
  isActive = true,
  selectedTag = "all", // "all" | "workspace" | "strato" | "viision"
  alarmTriggered = false,
}) {
  const containerRef = useRef(null);
  const animFrameId = useRef(null);
  const selectedTagRef = useRef(selectedTag);
  const alarmRef = useRef(alarmTriggered);

  useEffect(() => {
    selectedTagRef.current = selectedTag;
  }, [selectedTag]);

  useEffect(() => {
    alarmRef.current = alarmTriggered;
  }, [alarmTriggered]);

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
    rootGroup.position.set(0, 0.15, 0);
    scene.add(rootGroup);

    // Iluminación
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xd4a017, 2.0);
    dirLight.position.set(5, 8, 6);
    scene.add(dirLight);

    const centerLight = new THREE.PointLight(0x38bdf8, 2.2, 15);
    centerLight.position.set(0, 0, 0);
    scene.add(centerLight);

    // --- 1. Campo Estelar (500 Estrellas) ---
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

    // --- 2. Núcleo Central: Radar de Telemetría CloudWatch ---
    const coreGroup = new THREE.Group();
    rootGroup.add(coreGroup);

    const dodecaGeo = new THREE.DodecahedronGeometry(0.85, 0);
    const dodecaMat = new THREE.MeshStandardMaterial({
      color: 0x101b2b,
      roughness: 0.2,
      metalness: 0.9,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.6,
    });
    const coreMesh = new THREE.Mesh(dodecaGeo, dodecaMat);
    coreGroup.add(coreMesh);

    const dodecaWire = new THREE.LineSegments(
      new THREE.WireframeGeometry(dodecaGeo),
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 })
    );
    coreGroup.add(dodecaWire);

    // Anillos de radar concéntricos
    const ring1Geo = new THREE.TorusGeometry(1.6, 0.03, 16, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 2.2;
    coreGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.3, 0.03, 16, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xd4a017, transparent: true, opacity: 0.45 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 1.7;
    ring2.rotation.y = Math.PI / 5;
    coreGroup.add(ring2);

    // Onda expansiva de alarma
    const waveGeo = new THREE.RingGeometry(0.4, 0.6, 32);
    const waveMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    });
    const alarmWave = new THREE.Mesh(waveGeo, waveMat);
    alarmWave.rotation.x = Math.PI / 2;
    coreGroup.add(alarmWave);

    // --- 3. Nodos de Proyectos Taggeados ---
    function createProjectNode(color, pos) {
      const node = new THREE.Group();
      node.position.copy(pos);

      const boxGeo = new THREE.OctahedronGeometry(0.38, 0);
      const boxMat = new THREE.MeshStandardMaterial({
        color: 0x141416,
        metalness: 0.8,
        roughness: 0.3,
        emissive: color,
        emissiveIntensity: 0.7,
      });
      const mesh = new THREE.Mesh(boxGeo, boxMat);
      node.add(mesh);

      const wire = new THREE.LineSegments(
        new THREE.WireframeGeometry(boxGeo),
        new THREE.LineBasicMaterial({ color: color })
      );
      node.add(wire);

      // Línea de rayo hacia el centro
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(-pos.x, -pos.y, -pos.z),
      ]);
      const lineMat = new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.4 });
      const ray = new THREE.Line(lineGeo, lineMat);
      node.add(ray);

      return { group: node, mesh, wire, lineMat, color };
    }

    // Nodo 1: Workspace MTA (Oro)
    const nodeWorkspace = createProjectNode(0xd4a017, new THREE.Vector3(-2.6, 1.2, 0.5));
    rootGroup.add(nodeWorkspace.group);

    // Nodo 2: Strato Studio (Cian)
    const nodeStrato = createProjectNode(0x38bdf8, new THREE.Vector3(2.6, 1.1, -0.4));
    rootGroup.add(nodeStrato.group);

    // Nodo 3: VIISION (Esmeralda)
    const nodeViision = createProjectNode(0x00c853, new THREE.Vector3(0, -2.1, 0.8));
    rootGroup.add(nodeViision.group);

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
      const tag = selectedTagRef.current;
      const isAlarm = alarmRef.current;

      // Rotación suave del campo estelar
      starPoints.rotation.y = elapsed * 0.025;
      starPoints.rotation.x = elapsed * 0.012;

      // Rotación del radar central y anillos
      coreMesh.rotation.y = elapsed * 0.5;
      coreMesh.rotation.x = elapsed * 0.3;
      ring1.rotation.z = elapsed * 0.7;
      ring2.rotation.z = -elapsed * 0.5;

      // Parallax inercial
      rootGroup.rotation.y += (mouseX * 0.3 - rootGroup.rotation.y) * 0.05;
      rootGroup.rotation.x += (-mouseY * 0.18 - rootGroup.rotation.x) * 0.05;

      // Comportamiento de Alarma vs Normal
      if (isAlarm) {
        dodecaMat.emissive.setHex(0xef4444);
        centerLight.color.setHex(0xef4444);
        dodecaWire.material.color.setHex(0xef4444);
        ring1Mat.color.setHex(0xef4444);

        // Onda expansiva rápida de alarma SNS
        const waveProgress = (elapsed * 2.5) % 1;
        alarmWave.scale.set(1 + waveProgress * 6.5, 1 + waveProgress * 6.5, 1);
        waveMat.opacity = Math.max(0, 1 - waveProgress);
      } else {
        dodecaMat.emissive.setHex(0x38bdf8);
        centerLight.color.setHex(0x38bdf8);
        dodecaWire.material.color.setHex(0x38bdf8);
        ring1Mat.color.setHex(0x38bdf8);
        waveMat.opacity = 0;
      }

      // Filtrado visual por etiqueta seleccionada
      const applyFilter = (nodeObj, key) => {
        const isSelected = tag === "all" || tag === key;
        const targetScale = isSelected ? 1 : 0.45;
        nodeObj.group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        nodeObj.lineMat.opacity = isSelected ? 0.7 : 0.15;
      };

      applyFilter(nodeWorkspace, "workspace");
      applyFilter(nodeStrato, "strato");
      applyFilter(nodeViision, "viision");

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

export default CloudWatchRadarCanvas;
