import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { Grave } from '../App';

interface Tombstone3DProps {
  grave: Grave;
  isNight: boolean;
  hasWeeds: boolean;
  onCleanWeeds: () => void;
}

// 3D墓碑主体组件
function TombstoneModel({ grave, isNight }: { grave: Grave; isNight: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  // 创建墓碑形状（圆顶矩形碑）- 使用圆弧绘制更圆润的顶部
  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    const width = 2.2;
    const height = 3.2;
    const arcHeight = 0.8; // 圆弧的高度

    // 从左下角开始绘制
    shape.moveTo(-width/2, 0);
    // 左边竖线
    shape.lineTo(-width/2, height);

    // 使用圆弧绘制圆润的顶部
    shape.absarc(0, height, width/2, Math.PI, 0, true);

    // 右边竖线
    shape.lineTo(width/2, 0);
    // 底边闭合
    shape.lineTo(-width/2, 0);

    return shape;
  }, []);

  // 挤出设置
  const extrudeSettings = useMemo(() => ({
    steps: 1,
    depth: 0.3,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 3
  }), []);

  // 石头纹理材质
  const stoneMaterial = useMemo(() => {
    const texture = new THREE.CanvasTexture(createStoneTexture());
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);

    return new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.9,
      metalness: 0.1,
      normalScale: new THREE.Vector2(0.5, 0.5),
    });
  }, []);

  // 夜间发光效果
  useFrame((state) => {
    if (meshRef.current && isNight) {
      const intensity = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.3;
      (meshRef.current.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0x4444ff);
      (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
    } else if (meshRef.current) {
      (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0;
    }
  });

  return (
    <group>
      {/* 墓碑主体 - 向后偏移使正面在z=0 */}
      <mesh ref={meshRef} castShadow receiveShadow position={[0, 0, -0.15]}>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <primitive object={stoneMaterial} attach="material" />
      </mesh>

      {/* ===== 墓碑文字 - 竖排阴刻效果 ===== */}

      {/* R.I.P - 阴影层（横排保持不变） */}
      <Text
        position={[0, 4, 0.21]}
        fontSize={0.15}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        R.I.P
      </Text>
      {/* R.I.P - 主文字 */}
      <Text
        position={[0, 4, 0.215]}
        fontSize={0.15}
        color="#787476"
        anchorX="center"
        anchorY="middle"
      >
        R.I.P
      </Text>

      {/* 墓主名称 - 竖排（每个字一行） */}
      <Text
        position={[0, 2.2, 0.21]}
        fontSize={0.38}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        lineHeight={1.1}
        textAlign="center"
      >
        {`${grave.title.split('').join('\n')}\n之\n墓`}
      </Text>
      <Text
        position={[0, 2.2, 0.215]}
        fontSize={0.38}
        color={isNight ? "#e0e7ff" : "#ffffff"}
        anchorX="center"
        anchorY="middle"
        lineHeight={1.1}
        textAlign="center"
      >
        {`${grave.title.split('').join('\n')}\n之\n墓`}
      </Text>

      {/* 生卒年 - 竖排（左侧） */}
      <Text
        position={[-0.75, 2.0, 0.21]}
        fontSize={0.1}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        lineHeight={1.2}
        textAlign="center"
      >
        {`生\n于\n${(grave.bornDate || '未知').split('').join('\n')}`}
      </Text>
      <Text
        position={[-0.75, 2.0, 0.215]}
        fontSize={0.1}
        color="#787476"
        anchorX="center"
        anchorY="middle"
        lineHeight={1.2}
        textAlign="center"
      >
        {`生\n于\n${(grave.bornDate || '未知').split('').join('\n')}`}
      </Text>

      {/* 卒年 - 竖排（左侧偏下） */}
      <Text
        position={[-0.55, 2.0, 0.21]}
        fontSize={0.1}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        lineHeight={1.2}
        textAlign="center"
      >
        {`卒\n于\n${(grave.deathDate || '未知').split('').join('\n')}`}
      </Text>
      <Text
        position={[-0.55, 2.0, 0.215]}
        fontSize={0.1}
        color="#787476"
        anchorX="center"
        anchorY="middle"
        lineHeight={1.2}
        textAlign="center"
      >
        {`卒\n于\n${(grave.deathDate || '未知').split('').join('\n')}`}
      </Text>

      {/* 立碑人和日期 - 竖排（右侧） */}
      <Text
        position={[0.65, 2.0, 0.21]}
        fontSize={0.1}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        lineHeight={1.2}
        textAlign="center"
      >
        {grave.erector ? `${grave.erector.split('').join('\n')}\n立` : ''}
      </Text>
      <Text
        position={[0.65, 2.0, 0.215]}
        fontSize={0.1}
        color="#787476"
        anchorX="center"
        anchorY="middle"
        lineHeight={1.2}
        textAlign="center"
      >
        {grave.erector ? `${grave.erector.split('').join('\n')}\n立` : ''}
      </Text>

      {/* 立碑日期 - 竖排（右侧） */}
      <Text
        position={[0.85, 2.0, 0.21]}
        fontSize={0.1}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        lineHeight={1.2}
        textAlign="center"
      >
        {(grave.createDate || '').split('').join('\n')}
      </Text>
      <Text
        position={[0.85, 2.0, 0.215]}
        fontSize={0.1}
        color="#787476"
        anchorX="center"
        anchorY="middle"
        lineHeight={1.2}
        textAlign="center"
      >
        {(grave.createDate || '').split('').join('\n')}
      </Text>

      {/* 墓座 */}
      <mesh position={[0, -0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.5, 0.6]} />
        <meshStandardMaterial color="#1c1917" roughness={0.8} />
      </mesh>

      {/* 土堆背景 - 后移到墓碑后面 */}
      <mesh position={[0, -0.8, -3.2]} rotation={[0, 0, 0]} receiveShadow castShadow>
        <sphereGeometry args={[2.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
        <meshStandardMaterial color="#292524" roughness={0.95} />
      </mesh>

      {/* 地面 */}
      <mesh position={[0, -0.52, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#0c0a09" roughness={1} />
      </mesh>
    </group>
  );
}

// 创建石头纹理
function createStoneTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // 基础灰色
  ctx.fillStyle = '#101010';
  ctx.fillRect(0, 0, 256, 256);

  // 添加噪点纹理
  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const brightness = Math.random() * 40 + 20;
    ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, 0.3)`;
    ctx.fillRect(x, y, 2, 2);
  }

  // 添加裂纹
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    ctx.strokeStyle = `rgba(0, 0, 0, ${Math.random() * 0.3})`;
    ctx.lineWidth = Math.random() * 2 + 1;
    const startX = Math.random() * 256;
    const startY = Math.random() * 256;
    ctx.moveTo(startX, startY);
    for (let j = 0; j < 5; j++) {
      ctx.lineTo(
        startX + (Math.random() - 0.5) * 50,
        startY + (Math.random() - 0.5) * 50
      );
    }
    ctx.stroke();
  }

  return canvas;
}

// 供品 3D 模型组件
function Offerings({ offerings }: { offerings: { type: string; id: number }[] }) {
  const incenseCount = offerings.filter(o => o.type === 'incense').length;
  const flowersCount = offerings.filter(o => o.type === 'flowers').length;
  const wineCount = offerings.filter(o => o.type === 'wine').length;

  return (
    <group position={[0, 0, 1.5]}>
      {/* 香炉 */}
      {incenseCount > 0 && (
        <group position={[0, 0, 0]}>
          {/* 香炉底座 */}
          <mesh position={[0, 0.08, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.18, 0.15, 16]} />
            <meshStandardMaterial color="#1c1917" roughness={0.7} metalness={0.1} />
          </mesh>
          {/* 香烛 */}
          {Array.from({ length: Math.min(incenseCount, 3) }).map((_, i) => (
            <group key={i} position={[(i - 1) * 0.08, 0.15, 0]}>
              {/* 香棒 */}
              <mesh position={[0, 0.12, 0]}>
                <cylinderGeometry args={[0.008, 0.008, 0.24, 8]} />
                <meshStandardMaterial color="#44403c" />
              </mesh>
              {/* 香头火光 */}
              <pointLight position={[0, 0.25, 0]} intensity={0.5} color="#ff6600" distance={0.5} />
              <mesh position={[0, 0.25, 0]}>
                <sphereGeometry args={[0.015, 8, 8]} />
                <meshBasicMaterial color="#ff6600" />
              </mesh>
              {/* 烟雾 */}
              <Smoke position={[0, 0.25, 0]} delay={i * 0.3} />
            </group>
          ))}
        </group>
      )}

      {/* 鲜花 */}
      {flowersCount > 0 && (
        <group position={[-0.5, 0, 0]}>
          {Array.from({ length: Math.min(flowersCount, 3) }).map((_, i) => (
            <Flower key={i} position={[i * 0.12, 0, i * 0.08]} rotation={[0, i * 0.3, 0]} />
          ))}
        </group>
      )}

      {/* 酒杯 */}
      {wineCount > 0 && (
        <group position={[0.5, 0, 0]}>
          {Array.from({ length: Math.min(wineCount, 2) }).map((_, i) => (
            <WineCup key={i} position={[i * 0.18, 0, 0]} />
          ))}
        </group>
      )}
    </group>
  );
}

// 烟雾粒子
function Smoke({ position, delay = 0 }: { position: [number, number, number]; delay?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime + delay;
      meshRef.current.position.y = position[1] + Math.sin(time * 1.5) * 0.15 + 0.3;
      meshRef.current.position.x = position[0] + Math.sin(time * 0.8) * 0.05;
      meshRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.3);
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity =
        Math.abs(Math.sin(time * 1.5)) * 0.4 + 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshBasicMaterial color="#78716c" transparent opacity={0.3} />
    </mesh>
  );
}

// 花朵
function Flower({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* 花瓣 */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 5) * Math.PI * 2) * 0.05,
            0.1,
            Math.sin((i / 5) * Math.PI * 2) * 0.05
          ]}
          rotation={[Math.PI / 2, 0, (i / 5) * Math.PI * 2]}
        >
          <circleGeometry args={[0.04, 16]} />
          <meshStandardMaterial color="#78716c" side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* 花心 */}
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#57534e" />
      </mesh>
      {/* 茎 */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.1, 8]} />
        <meshStandardMaterial color="#44403c" />
      </mesh>
    </group>
  );
}

// 酒杯
function WineCup({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* 杯身 */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.06, 0.05, 0.12, 16]} />
        <meshStandardMaterial
          color="#292524"
          transparent
          opacity={0.7}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
      {/* 酒液 */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.055, 0.048, 0.08, 16]} />
        <meshStandardMaterial color="#44403c" roughness={0.3} />
      </mesh>
    </group>
  );
}

// 杂草组件
function Weeds({ onCleanWeeds }: { onCleanWeeds: () => void }) {
  const grassPositions = useMemo(() => {
    // 在土堆周围随机生成杂草位置
    const positions: [number, number, number][] = [];
    for (let i = 0; i < 15; i++) {
      const angle = (Math.PI / 180) * (Math.random() * 180 - 90); // -90 to 90 度
      const radius = 1.5 + Math.random() * 0.8;
      const x = Math.cos(angle) * radius;
      const z = -Math.abs(Math.sin(angle) * radius) - 0.3; // 只在土堆前方和侧面
      const y = 0.05;
      positions.push([x, y, z]);
    }
    return positions;
  }, []);

  return (
    <group onClick={(e) => { e.stopPropagation(); onCleanWeeds(); }}>
      {grassPositions.map((pos, i) => (
        <Grass key={i} position={pos} delay={i * 0.1} />
      ))}
    </group>
  );
}

// 单株杂草
function Grass({ position, delay }: { position: [number, number, number]; delay: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime + delay;
      meshRef.current.rotation.z = Math.sin(time * 1.5) * 0.1;
    }
  });

  const height = 0.15 + Math.random() * 0.15;
  const color = Math.random() > 0.5 ? "#3f6212" : "#4d7c0f";

  return (
    <group position={position} ref={meshRef}>
      {/* 草叶 */}
      <mesh position={[0, height / 2, 0]}>
        <coneGeometry args={[0.02, height, 3]} />
        <meshStandardMaterial color={color} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* 第二片草叶 */}
      <mesh position={[0.01, height / 2 - 0.02, 0]} rotation={[0, Math.PI / 3, 0.2]}>
        <coneGeometry args={[0.015, height * 0.8, 3]} />
        <meshStandardMaterial color={color} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// 主组件
export default function Tombstone3D({ grave, isNight, hasWeeds, onCleanWeeds }: Tombstone3DProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 2, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        className="bg-transparent"
      >
        {/* 环境光 */}
        <ambientLight intensity={isNight ? 0.3 : 0.5} />

        {/* 主光源 */}
        <directionalLight
          position={[5, 8, 5]}
          intensity={isNight ? 0.6 : 1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={20}
          shadow-camera-left={-5}
          shadow-camera-right={5}
          shadow-camera-top={5}
          shadow-camera-bottom={-5}
        />

        {/* 夜间蓝色补光 */}
        {isNight && (
          <pointLight position={[0, 2, 3]} intensity={0.8} color="#4466ff" />
        )}

        {/* 墓碑模型 */}
        <TombstoneModel grave={grave} isNight={isNight} />

        {/* 供品 */}
        <Offerings offerings={grave.offerings} />

        {/* 杂草 */}
        {hasWeeds && <Weeds onCleanWeeds={onCleanWeeds} />}

        {/* 环境贴图 */}
        <Environment preset={isNight ? "night" : "sunset"} />

        {/* 轨道控制器 */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={4}
          maxDistance={10}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 6}
          target={[0, 1.8, 0]}
        />
      </Canvas>
    </div>
  );
}
