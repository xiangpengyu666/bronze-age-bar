'use client';

import { Suspense, useRef, useEffect, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Environment } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';

interface Props {
  url: string;
  className?: string;
  interactive?: boolean;
}

function Model({
  url,
  controlsRef,
}: {
  url: string;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}) {
  // drei's useGLTF auto-wires Meshopt + Draco decoders for compressed GLBs.
  const { scene } = useGLTF(url);
  // CLONE per instance: useGLTF returns a SHARED scene cached across all
  // mounts of the same URL. Mutating `scene.position` to recenter the model
  // pollutes that cache — on the second mount, Box3.setFromObject sees the
  // already-centered scene, computes center=(0,0,0), and re-applies a no-op
  // offset, leaving the model in its original (uncentered) world position.
  // Owning a per-instance clone makes the centering math idempotent.
  const cloned = useMemo(() => scene.clone(true), [scene]);
  const ref = useRef<THREE.Group>(null);
  const { camera, invalidate } = useThree();

  useEffect(() => {
    // Compute world-space bounding box of the clone (whose initial position
    // is whatever the GLB defined — usually identity).
    cloned.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(cloned);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    // Translate the clone so its bbox center sits at world origin — that's
    // where OrbitControls.target points, giving a stable orbit pivot.
    cloned.position.sub(center);
    const maxDim = Math.max(size.x, size.y, size.z);
    const dist = maxDim * 2.4;
    camera.position.set(dist, dist * 0.6, dist);
    camera.lookAt(0, 0, 0);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.near = dist / 100;
      camera.far = dist * 10;
      camera.updateProjectionMatrix();
    }
    // After moving the camera, OrbitControls' cached spherical (distance +
    // angles relative to target) is stale. update() reanchors the orbit
    // state from current camera + target.
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
    invalidate();
  }, [cloned, camera, controlsRef, invalidate]);

  return <primitive ref={ref} object={cloned} />;
}

function Loader() {
  return (
    <Html center>
      <div className="text-bronze-light text-xs animate-pulse">Loading…</div>
    </Html>
  );
}

export default function ModelViewer({
  url,
  className = '',
  interactive = true,
}: Props) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [2, 1.4, 2], fov: 40 }}
        // Cap DPR to 1.5 — full-DPR (often 2 or 3) on a high-res display
        // doubles/triples per-pixel work for marginal visual gain on a 3D
        // model that's also rotating. 1.5 is the sweet spot.
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        // Render only when something invalidates (initial frame + each
        // OrbitControls interaction). With this off, an idle ModelViewer
        // costs ~0% CPU instead of 60fps × the full Three.js render cost.
        frameloop="demand"
        style={{ background: 'transparent' }}
      >
        {/* Bronze is metallic=1; without an environment cubemap there's
            nothing for the surface to reflect, so the material reads as flat
            black regardless of lighting intensity. Environment provides IBL
            reflections that make the bronze actually look like bronze.
            We can afford it now — only one Canvas is alive at a time
            (modal-gated), so the HDR is downloaded once and cached. */}
        <hemisphereLight args={['#fff5e0', '#1a0f08', 0.4]} />
        <directionalLight position={[5, 8, 5]} intensity={1.4} />
        <directionalLight position={[-4, -2, -3]} intensity={0.5} color="#b87333" />
        <directionalLight position={[0, -3, 4]} intensity={0.35} color="#fff5e0" />
        <Suspense fallback={<Loader />}>
          <Environment preset="warehouse" />
          <Model url={url} controlsRef={controlsRef} />
        </Suspense>
        {interactive && (
          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            mouseButtons={{
              LEFT: undefined as unknown as THREE.MOUSE,
              MIDDLE: THREE.MOUSE.ROTATE,
              RIGHT: undefined as unknown as THREE.MOUSE,
            }}
            enableZoom
            zoomSpeed={0.6}
            target={[0, 0, 0]}
          />
        )}
      </Canvas>
    </div>
  );
}
