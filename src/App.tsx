import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Stars, Float, Html, Text } from '@react-three/drei'
import { Suspense, useState, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

// Pokemon game price data (simulated global market data)
const pokemonGames = [
  { id: 1, name: "Pokemon Red", region: "JP", price: 45, marketValue: 89, year: 1996, color: "#DC143C", rarity: "Common" },
  { id: 2, name: "Pokemon Blue", region: "US", price: 52, marketValue: 95, year: 1996, color: "#4169E1", rarity: "Common" },
  { id: 3, name: "Pokemon Yellow", region: "EU", price: 78, marketValue: 120, year: 1998, color: "#FFD700", rarity: "Uncommon" },
  { id: 4, name: "Pokemon Gold", region: "JP", price: 35, marketValue: 85, year: 1999, color: "#B8860B", rarity: "Common" },
  { id: 5, name: "Pokemon Silver", region: "US", price: 42, marketValue: 82, year: 1999, color: "#C0C0C0", rarity: "Common" },
  { id: 6, name: "Pokemon Crystal", region: "JP", price: 180, marketValue: 350, year: 2000, color: "#00CED1", rarity: "Rare" },
  { id: 7, name: "Pokemon Ruby", region: "EU", price: 28, marketValue: 55, year: 2002, color: "#E0115F", rarity: "Common" },
  { id: 8, name: "Pokemon Sapphire", region: "JP", price: 25, marketValue: 52, year: 2002, color: "#0F52BA", rarity: "Common" },
  { id: 9, name: "Pokemon Emerald", region: "US", price: 95, marketValue: 145, year: 2004, color: "#50C878", rarity: "Uncommon" },
  { id: 10, name: "Pokemon FireRed", region: "JP", price: 38, marketValue: 68, year: 2004, color: "#FF4500", rarity: "Common" },
  { id: 11, name: "Pokemon LeafGreen", region: "EU", price: 42, marketValue: 72, year: 2004, color: "#32CD32", rarity: "Common" },
  { id: 12, name: "Pokemon Diamond", region: "US", price: 32, marketValue: 48, year: 2006, color: "#B9F2FF", rarity: "Common" },
  { id: 13, name: "Pokemon Pearl", region: "JP", price: 28, marketValue: 45, year: 2006, color: "#FDEEF4", rarity: "Common" },
  { id: 14, name: "Pokemon Platinum", region: "US", price: 125, marketValue: 165, year: 2008, color: "#E5E4E2", rarity: "Uncommon" },
  { id: 15, name: "Pokemon HeartGold", region: "JP", price: 145, marketValue: 280, year: 2009, color: "#CFB53B", rarity: "Rare" },
  { id: 16, name: "Pokemon SoulSilver", region: "EU", price: 135, marketValue: 260, year: 2009, color: "#AAA9AD", rarity: "Rare" },
  { id: 17, name: "Pokemon Black", region: "US", price: 55, marketValue: 75, year: 2010, color: "#1C1C1C", rarity: "Uncommon" },
  { id: 18, name: "Pokemon White", region: "JP", price: 48, marketValue: 70, year: 2010, color: "#FFFAFA", rarity: "Uncommon" },
]

interface GameData {
  id: number
  name: string
  region: string
  price: number
  marketValue: number
  year: number
  color: string
  rarity: string
}

function GameCartridge({ game, position, onSelect, isSelected }: {
  game: GameData,
  position: [number, number, number],
  onSelect: (game: GameData | null) => void,
  isSelected: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)

  const undervaluePercent = ((game.marketValue - game.price) / game.marketValue) * 100
  const glowIntensity = undervaluePercent / 100

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + game.id) * 0.1
      if (hovered || isSelected) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1)
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
      }
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={position}>
        <mesh
          ref={meshRef}
          onClick={(e) => {
            e.stopPropagation()
            onSelect(isSelected ? null : game)
          }}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHovered(true)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            setHovered(false)
            document.body.style.cursor = 'auto'
          }}
        >
          {/* Main cartridge body */}
          <boxGeometry args={[0.8, 1.2, 0.15]} />
          <meshStandardMaterial
            color={game.color}
            metalness={0.3}
            roughness={0.4}
            emissive={game.color}
            emissiveIntensity={hovered || isSelected ? 0.5 : glowIntensity * 0.3}
          />
        </mesh>

        {/* Cartridge notch */}
        <mesh position={[0, -0.5, 0.08]}>
          <boxGeometry args={[0.5, 0.2, 0.05]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.3} />
        </mesh>

        {/* Label */}
        <mesh position={[0, 0.15, 0.08]}>
          <boxGeometry args={[0.65, 0.7, 0.02]} />
          <meshStandardMaterial color="#f5f5f5" metalness={0.1} roughness={0.8} />
        </mesh>

        {/* Undervalue indicator ring */}
        {undervaluePercent > 30 && (
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.7, 0.03, 8, 32]} />
            <meshStandardMaterial
              color={undervaluePercent > 50 ? "#00ff88" : "#ffff00"}
              emissive={undervaluePercent > 50 ? "#00ff88" : "#ffff00"}
              emissiveIntensity={0.8}
              transparent
              opacity={0.8}
            />
          </mesh>
        )}

        {/* Price tag floating */}
        {(hovered || isSelected) && (
          <Html position={[0, 1.2, 0]} center distanceFactor={10}>
            <div className="bg-black/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-cyan-400/50 whitespace-nowrap">
              <p className="text-cyan-400 font-bold text-sm">{game.name}</p>
              <p className="text-white/80 text-xs">Current: ${game.price}</p>
              <p className="text-emerald-400 text-xs">Value: ${game.marketValue}</p>
              <p className="text-yellow-400 text-xs font-semibold">
                {undervaluePercent.toFixed(0)}% Under
              </p>
            </div>
          </Html>
        )}
      </group>
    </Float>
  )
}

function Scene({ onSelect, selectedGame }: {
  onSelect: (game: GameData | null) => void,
  selectedGame: GameData | null
}) {
  const gamePositions = useMemo(() => {
    return pokemonGames.map((game, i) => {
      const angle = (i / pokemonGames.length) * Math.PI * 2
      const radius = 4 + (i % 3) * 1.5
      const y = Math.sin(i * 0.5) * 1.5
      return [
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * radius
      ] as [number, number, number]
    })
  }, [])

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ff00ff" />
      <pointLight position={[10, -5, 10]} intensity={0.5} color="#00ffff" />

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Central platform */}
      <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[8, 10, 0.5, 64]} />
        <meshStandardMaterial
          color="#0a0a0a"
          metalness={0.9}
          roughness={0.1}
          emissive="#1a1a2e"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Floating ring */}
      <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[7, 0.05, 16, 100]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={1}
        />
      </mesh>

      {/* Central pillar light */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 4, 16]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={2}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Title text */}
      <Text
        position={[0, 3.5, 0]}
        fontSize={0.6}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/pressstart2p/v15/e3t4euO8T-267oIAQAu6jDQyK3nVivM.woff2"
      >
        POKEMON PRICE SCANNER
      </Text>

      {pokemonGames.map((game, i) => (
        <GameCartridge
          key={game.id}
          game={game}
          position={gamePositions[i]}
          onSelect={onSelect}
          isSelected={selectedGame?.id === game.id}
        />
      ))}

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={20}
        maxPolarAngle={Math.PI / 1.5}
        autoRotate
        autoRotateSpeed={0.5}
      />
      <Environment preset="night" />
    </>
  )
}

function InfoPanel({ game }: { game: GameData | null }) {
  if (!game) return null

  const undervaluePercent = ((game.marketValue - game.price) / game.marketValue) * 100
  const savings = game.marketValue - game.price

  return (
    <div className="absolute top-4 right-4 md:top-8 md:right-8 w-72 md:w-80 bg-black/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-4 md:p-6 shadow-2xl shadow-cyan-500/20">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-12 h-16 rounded-lg shadow-lg"
          style={{ backgroundColor: game.color }}
        />
        <div>
          <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">{game.name}</h2>
          <p className="text-cyan-400 text-sm">{game.region} Region • {game.year}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Current Price</span>
          <span className="text-white font-bold text-xl">${game.price}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Market Value</span>
          <span className="text-emerald-400 font-bold text-xl">${game.marketValue}</span>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Potential Savings</span>
          <span className="text-yellow-400 font-bold text-xl">${savings}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Undervalue</span>
          <span className={`font-bold text-xl ${undervaluePercent > 50 ? 'text-emerald-400' : 'text-yellow-400'}`}>
            {undervaluePercent.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/10">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
          game.rarity === 'Rare' ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50' :
          game.rarity === 'Uncommon' ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50' :
          'bg-gray-500/30 text-gray-300 border border-gray-500/50'
        }`}>
          {game.rarity}
        </span>
      </div>

      <button className="w-full mt-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl text-white font-bold text-sm hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 shadow-lg shadow-cyan-500/25">
        VIEW LISTINGS →
      </button>
    </div>
  )
}

function TopDealsPanel() {
  const sortedGames = useMemo(() => {
    return [...pokemonGames]
      .map(g => ({ ...g, undervalue: ((g.marketValue - g.price) / g.marketValue) * 100 }))
      .sort((a, b) => b.undervalue - a.undervalue)
      .slice(0, 5)
  }, [])

  return (
    <div className="absolute top-4 left-4 md:top-8 md:left-8 w-64 md:w-72 bg-black/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4 md:p-5 shadow-2xl shadow-purple-500/20">
      <h3 className="text-purple-400 font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
        Top Undervalued
      </h3>

      <div className="space-y-3">
        {sortedGames.map((game, i) => (
          <div key={game.id} className="flex items-center gap-3 group cursor-pointer">
            <span className="text-2xl font-black text-white/20 group-hover:text-purple-400 transition-colors w-6">
              {i + 1}
            </span>
            <div
              className="w-3 h-4 rounded-sm shadow-sm"
              style={{ backgroundColor: game.color }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate group-hover:text-purple-300 transition-colors">
                {game.name}
              </p>
              <p className="text-gray-500 text-xs">{game.region}</p>
            </div>
            <span className="text-emerald-400 font-bold text-sm">
              {game.undervalue.toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function RegionFilter() {
  const [activeRegion, setActiveRegion] = useState<string>('ALL')
  const regions = ['ALL', 'JP', 'US', 'EU']

  return (
    <div className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 flex gap-2 bg-black/60 backdrop-blur-lg rounded-full p-2 border border-white/10">
      {regions.map(region => (
        <button
          key={region}
          onClick={() => setActiveRegion(region)}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
            activeRegion === region
              ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {region}
        </button>
      ))}
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-50">
      <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      <p className="mt-6 text-cyan-400 font-mono text-sm tracking-widest animate-pulse">
        SCANNING GLOBAL MARKETS...
      </p>
    </div>
  )
}

export default function App() {
  const [selectedGame, setSelectedGame] = useState<GameData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative font-sans">
      {isLoading && <LoadingScreen />}

      <Canvas
        camera={{ position: [0, 3, 12], fov: 60 }}
        onCreated={() => setTimeout(() => setIsLoading(false), 1500)}
      >
        <Suspense fallback={null}>
          <Scene onSelect={setSelectedGame} selectedGame={selectedGame} />
        </Suspense>
      </Canvas>

      {!isLoading && (
        <>
          <TopDealsPanel />
          <InfoPanel game={selectedGame} />
          <RegionFilter />

          {/* Instructions */}
          <div className="absolute bottom-28 md:bottom-32 left-1/2 -translate-x-1/2 text-center">
            <p className="text-gray-500 text-xs md:text-sm font-mono">
              Click a cartridge to view details • Drag to rotate • Scroll to zoom
            </p>
          </div>
        </>
      )}

      {/* Footer */}
      <footer className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-gray-600 text-xs font-mono">
          Requested by <span className="text-gray-500">@0xsnibbler</span> · Built by <span className="text-gray-500">@clonkbot</span>
        </p>
      </footer>
    </div>
  )
}
