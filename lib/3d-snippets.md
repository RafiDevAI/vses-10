# 3D Optimization Code Snippets

## 1. useGLTF with Draco Loader Setup

\`\`\`typescript
import { useGLTF } from '@react-three/drei'
import { useEffect } from 'react'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

// Setup Draco loader globally (do this once in your app)
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
dracoLoader.setDecoderConfig({ type: 'js' })

// Use in component
function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url, true, true, (loader) => {
    if (loader instanceof GLTFLoader) {
      loader.setDRACOLoader(dracoLoader)
    }
  })
  
  return <primitive object={scene} />
}

// Preload models
useGLTF.preload('/models/model1.glb')
useGLTF.preload('/models/model2.glb')
\`\`\`

## 2. Suspense + Lazy Import Pattern

\`\`\`typescript
import { Suspense, lazy } from 'react'
import { Loader2 } from 'lucide-react'

// Lazy load heavy 3D component
const Heavy3DScene = lazy(() => import('@/components/3d/heavy-scene'))

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  )
}

export function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Heavy3DScene />
    </Suspense>
  )
}
\`\`\`

## 3. Background Preloader Function

\`\`\`typescript
import { useGLTF } from '@react-three/drei'

const MODEL_URLS = [
  '/models/model1.glb',
  '/models/model2.glb',
  '/models/model3.glb',
]

export function preloadModels() {
  // Preload in background after initial render
  if (typeof window !== 'undefined') {
    requestIdleCallback(() => {
      MODEL_URLS.forEach(url => {
        useGLTF.preload(url)
      })
    }, { timeout: 2000 })
  }
}

// Call in layout or main component
useEffect(() => {
  preloadModels()
}, [])
\`\`\`

## 4. LOD Implementation in R3F

\`\`\`typescript
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'

function LODModel({ position = [0, 0, 0] }) {
  const groupRef = useRef()
  const [lod, setLod] = useState(0)
  
  useFrame(({ camera }) => {
    if (!groupRef.current) return
    
    const distance = camera.position.distanceTo(
      new Vector3(...position)
    )
    
    // Adjust LOD based on distance
    if (distance < 10) setLod(0)      // High detail
    else if (distance < 25) setLod(1) // Medium detail
    else setLod(2)                     // Low detail
  })

  return (
    <group ref={groupRef} position={position}>
      {lod === 0 && <HighDetailModel />}
      {lod === 1 && <MediumDetailModel />}
      {lod === 2 && <LowDetailModel />}
    </group>
  )
}
\`\`\`

## 5. Memoized Component Pattern

\`\`\`typescript
import { memo } from 'react'

const Planet = memo(({ position, color, size }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}, (prev, next) => {
  // Only re-render if these props change
  return (
    prev.position === next.position &&
    prev.color === next.color &&
    prev.size === next.size
  )
})
\`\`\`
