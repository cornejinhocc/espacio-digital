"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Field() {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  const nodes = useMemo(() => Array.from({ length: 78 }, () => ({
    p: new THREE.Vector3((Math.random()-.5)*16, (Math.random()-.5)*9, (Math.random()-.5)*9),
    s: .018 + Math.random()*.05,
  })), []);

  const lineGeometry = useMemo(() => {
    const positions: number[] = [];
    for (let i=0;i<nodes.length;i++) for (let j=i+1;j<nodes.length;j++) {
      if (nodes[i].p.distanceTo(nodes[j].p) < 2.55) {
        positions.push(...nodes[i].p.toArray(), ...nodes[j].p.toArray());
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions,3));
    return g;
  }, [nodes]);

  const particles = useMemo(() => {
    const a = new Float32Array(1800*3);
    for (let i=0;i<1800;i++) {
      a[i*3]=(Math.random()-.5)*20;
      a[i*3+1]=(Math.random()-.5)*12;
      a[i*3+2]=(Math.random()-.5)*12;
    }
    return a;
  }, []);

  const particleGeometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(particles,3));
    return g;
  }, [particles]);

  useFrame(({ clock }) => {
    const t=clock.elapsedTime;
    if (!group.current) return;
    group.current.rotation.y=t*.016;
    group.current.rotation.x=Math.sin(t*.12)*.025;
    group.current.position.x += (pointer.x*.55-group.current.position.x)*.025;
    group.current.position.y += (pointer.y*.3-group.current.position.y)*.025;
  });

  return (
    <group ref={group}>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#c8ff32" transparent opacity={.14} depthWrite={false}/>
      </lineSegments>
      {nodes.map((n,i)=><mesh key={i} position={n.p}>
        <sphereGeometry args={[n.s,8,8]}/>
        <meshBasicMaterial color="#c8ff32" transparent opacity={.8}/>
      </mesh>)}
      <points geometry={particleGeometry}>
        <pointsMaterial color="#c8ff32" size={.02} transparent opacity={.26} sizeAttenuation depthWrite={false}/>
      </points>
    </group>
  );
}

export function DigitalField() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <Canvas camera={{position:[0,0,13],fov:55}} dpr={[1,1.5]} gl={{alpha:true,antialias:true,powerPreference:"high-performance"}}>
        <Field/>
      </Canvas>
      <div className="absolute inset-0 grid-bg opacity-30"/>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_12%,rgba(7,7,7,.15)_48%,#070707_92%)]"/>
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#070707] via-[#070707]/60 to-transparent"/>
    </div>
  );
}