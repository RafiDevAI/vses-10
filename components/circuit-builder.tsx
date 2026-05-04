// @ts-nocheck
"use client"

import { useState, useRef, useEffect } from "react"
import { Zap, Trash2, Save, FolderOpen, Plus, ZoomIn, ZoomOut, Play, Square, Info } from "lucide-react"

const CircuitBuilder = () => {
  const canvasRef = useRef(null)

  const defaultCircuit = {
    components: [
      // Power Sources
      {
        id: "comp-1",
        type: "battery",
        x: 150,
        y: 200,
        label: "Battery",
        state: "normal",
        powered: false,
        diagnostic: null,
      },
      {
        id: "comp-2",
        type: "ac-source",
        x: 150,
        y: 500,
        label: "AC Source",
        state: "normal",
        powered: false,
        diagnostic: null,
      },

      // DC Circuit Branch 1: Battery → Switch → Resistor → Bulb
      {
        id: "comp-3",
        type: "switch",
        x: 320,
        y: 150,
        label: "Switch 1",
        state: "on",
        powered: false,
        diagnostic: null,
      },
      {
        id: "comp-4",
        type: "resistor",
        x: 480,
        y: 150,
        label: "Resistor 1",
        state: "normal",
        powered: false,
        diagnostic: null,
      },
      {
        id: "comp-5",
        type: "bulb",
        x: 640,
        y: 150,
        label: "Light Bulb",
        state: "normal",
        powered: false,
        diagnostic: null,
      },

      // DC Circuit Branch 2: Battery → Switch → Fuse → Fan
      {
        id: "comp-6",
        type: "switch",
        x: 320,
        y: 250,
        label: "Switch 2",
        state: "on",
        powered: false,
        diagnostic: null,
      },
      {
        id: "comp-7",
        type: "fuse",
        x: 480,
        y: 250,
        label: "Fuse 1",
        state: "normal",
        powered: false,
        diagnostic: null,
      },
      {
        id: "comp-8",
        type: "fan",
        x: 640,
        y: 250,
        label: "Fan",
        state: "normal",
        powered: false,
        diagnostic: null,
      },

      // AC Circuit Branch 1: AC Source → Switch → Resistor → Kettle
      {
        id: "comp-9",
        type: "switch",
        x: 320,
        y: 450,
        label: "Switch 3",
        state: "on",
        powered: false,
        diagnostic: null,
      },
      {
        id: "comp-10",
        type: "resistor",
        x: 480,
        y: 450,
        label: "Resistor 2",
        state: "normal",
        powered: false,
        diagnostic: null,
      },
      {
        id: "comp-11",
        type: "kettle",
        x: 640,
        y: 450,
        label: "Kettle",
        state: "normal",
        powered: false,
        diagnostic: null,
      },

      // AC Circuit Branch 2: AC Source → Switch → Fuse → TV
      {
        id: "comp-12",
        type: "switch",
        x: 320,
        y: 550,
        label: "Switch 4",
        state: "on",
        powered: false,
        diagnostic: null,
      },
      {
        id: "comp-13",
        type: "fuse",
        x: 480,
        y: 550,
        label: "Fuse 2",
        state: "normal",
        powered: false,
        diagnostic: null,
      },
      {
        id: "comp-14",
        type: "tv",
        x: 640,
        y: 550,
        label: "TV",
        state: "normal",
        powered: false,
        diagnostic: null,
      },

      // Return junction points
      {
        id: "comp-15",
        type: "resistor",
        x: 780,
        y: 200,
        label: "Return 1",
        state: "normal",
        powered: false,
        diagnostic: null,
      },
      {
        id: "comp-16",
        type: "resistor",
        x: 780,
        y: 500,
        label: "Return 2",
        state: "normal",
        powered: false,
        diagnostic: null,
      },
    ],
    wires: [
      // DC Circuit - Battery positive to both switches
      {
        id: "wire-1",
        from: { compId: "comp-1", pin: 1 },
        to: { compId: "comp-3", pin: 0 },
        waypoints: [
          { x: 230, y: 200 },
          { x: 230, y: 150 },
        ],
      },
      {
        id: "wire-2",
        from: { compId: "comp-1", pin: 1 },
        to: { compId: "comp-6", pin: 0 },
        waypoints: [
          { x: 230, y: 200 },
          { x: 230, y: 250 },
        ],
      },

      // DC Branch 1: Switch → Resistor → Bulb
      { id: "wire-3", from: { compId: "comp-3", pin: 1 }, to: { compId: "comp-4", pin: 0 }, waypoints: [] },
      { id: "wire-4", from: { compId: "comp-4", pin: 1 }, to: { compId: "comp-5", pin: 0 }, waypoints: [] },

      // DC Branch 2: Switch → Fuse → Fan
      { id: "wire-5", from: { compId: "comp-6", pin: 1 }, to: { compId: "comp-7", pin: 0 }, waypoints: [] },
      { id: "wire-6", from: { compId: "comp-7", pin: 1 }, to: { compId: "comp-8", pin: 0 }, waypoints: [] },

      // DC branches converge to return resistor
      {
        id: "wire-7",
        from: { compId: "comp-5", pin: 1 },
        to: { compId: "comp-15", pin: 0 },
        waypoints: [
          { x: 710, y: 150 },
          { x: 710, y: 200 },
        ],
      },
      {
        id: "wire-8",
        from: { compId: "comp-8", pin: 1 },
        to: { compId: "comp-15", pin: 0 },
        waypoints: [
          { x: 710, y: 250 },
          { x: 710, y: 200 },
        ],
      },

      // DC return to battery
      {
        id: "wire-9",
        from: { compId: "comp-15", pin: 1 },
        to: { compId: "comp-1", pin: 0 },
        waypoints: [
          { x: 850, y: 200 },
          { x: 850, y: 80 },
          { x: 80, y: 80 },
          { x: 80, y: 200 },
        ],
      },

      // AC Circuit - AC Source positive to both switches
      {
        id: "wire-10",
        from: { compId: "comp-2", pin: 1 },
        to: { compId: "comp-9", pin: 0 },
        waypoints: [
          { x: 230, y: 500 },
          { x: 230, y: 450 },
        ],
      },
      {
        id: "wire-11",
        from: { compId: "comp-2", pin: 1 },
        to: { compId: "comp-12", pin: 0 },
        waypoints: [
          { x: 230, y: 500 },
          { x: 230, y: 550 },
        ],
      },

      // AC Branch 1: Switch → Resistor → Kettle
      { id: "wire-12", from: { compId: "comp-9", pin: 1 }, to: { compId: "comp-10", pin: 0 }, waypoints: [] },
      { id: "wire-13", from: { compId: "comp-10", pin: 1 }, to: { compId: "comp-11", pin: 0 }, waypoints: [] },

      // AC Branch 2: Switch → Fuse → TV
      { id: "wire-14", from: { compId: "comp-12", pin: 1 }, to: { compId: "comp-13", pin: 0 }, waypoints: [] },
      { id: "wire-15", from: { compId: "comp-13", pin: 1 }, to: { compId: "comp-14", pin: 0 }, waypoints: [] },

      // AC branches converge to return resistor
      {
        id: "wire-16",
        from: { compId: "comp-11", pin: 1 },
        to: { compId: "comp-16", pin: 0 },
        waypoints: [
          { x: 710, y: 450 },
          { x: 710, y: 500 },
        ],
      },
      {
        id: "wire-17",
        from: { compId: "comp-14", pin: 1 },
        to: { compId: "comp-16", pin: 0 },
        waypoints: [
          { x: 710, y: 550 },
          { x: 710, y: 500 },
        ],
      },

      // AC return to AC source
      {
        id: "wire-18",
        from: { compId: "comp-16", pin: 1 },
        to: { compId: "comp-2", pin: 0 },
        waypoints: [
          { x: 850, y: 500 },
          { x: 850, y: 620 },
          { x: 80, y: 620 },
          { x: 80, y: 500 },
        ],
      },
    ],
    currentType: "DC",
  }

  const [components, setComponents] = useState(defaultCircuit.components)
  const [wires, setWires] = useState(defaultCircuit.wires)
  const [selectedComponent, setSelectedComponent] = useState(null)
  const [draggingComponent, setDraggingComponent] = useState(null)
  const [connectingFrom, setConnectingFrom] = useState(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [currentType, setCurrentType] = useState(defaultCircuit.currentType)
  const [zoom, setZoom] = useState(1)
  const [hoveredComponent, setHoveredComponent] = useState(null)
  const [nextId, setNextId] = useState(17) // Updated to 17 since we now have 16 components
  const [fanRotations, setFanRotations] = useState({})
  const [hoveredWire, setHoveredWire] = useState(null)
  const [showReplaceMenu, setShowReplaceMenu] = useState(false)
  const [replaceMenuPosition, setReplaceMenuPosition] = useState({ x: 0, y: 0 })
  const [draggingWaypoint, setDraggingWaypoint] = useState(null)
  const [selectedWire, setSelectedWire] = useState(null)

  const componentTypes = [
    { id: "battery", name: "Battery", color: "bg-green-600", pins: 2, isPowerSource: true, powerType: "DC" },
    { id: "ac-source", name: "AC Source", color: "bg-yellow-600", pins: 2, isPowerSource: true, powerType: "AC" },
    { id: "bulb", name: "Light Bulb", color: "bg-yellow-300", pins: 2 },
    { id: "fan", name: "Fan", color: "bg-blue-400", pins: 2 },
    { id: "kettle", name: "Kettle", color: "bg-red-400", pins: 2 },
    { id: "tv", name: "TV", color: "bg-purple-500", pins: 2 },
    { id: "switch", name: "Switch", color: "bg-gray-500", pins: 2 },
    { id: "resistor", name: "Resistor", color: "bg-orange-500", pins: 2 },
    { id: "fuse", name: "Fuse", color: "bg-red-600", pins: 2 },
  ]

  const handleDragStart = (e, type) => {
    e.dataTransfer.effectAllowed = "copy"
    e.dataTransfer.setData("componentType", type.id)
  }

  const handleCanvasDrop = (e) => {
    e.preventDefault()
    const rect = canvasRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom
    const y = (e.clientY - rect.top) / zoom
    const typeId = e.dataTransfer.getData("componentType")
    const type = componentTypes.find((t) => t.id === typeId)

    if (type) {
      const newComponent = {
        id: `comp-${nextId}`,
        type: type.id,
        x,
        y,
        label: `${type.name} ${nextId}`,
        state: type.id === "switch" ? "off" : "normal",
        powered: false,
        diagnostic: null,
      }
      setNextId(nextId + 1)
      setComponents([...components, newComponent])
    }
  }

  const handleComponentMouseDown = (e, comp) => {
    if (e.button === 2) {
      e.preventDefault()
      e.stopPropagation()
      setSelectedComponent(comp.id)
      setReplaceMenuPosition({ x: e.clientX, y: e.clientY })
      setShowReplaceMenu(true)
      return
    }
    e.stopPropagation()
    setSelectedComponent(comp.id)
    setDraggingComponent({ id: comp.id })
    setShowReplaceMenu(false)
  }

  const handleCanvasMouseMove = (e) => {
    if (draggingComponent) {
      const rect = canvasRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / zoom
      const y = (e.clientY - rect.top) / zoom

      setComponents(components.map((c) => (c.id === draggingComponent.id ? { ...c, x, y } : c)))
    }
    if (draggingWaypoint) {
      const rect = canvasRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / zoom
      const y = (e.clientY - rect.top) / zoom

      setWires(
        wires.map((w) => {
          if (w.id === draggingWaypoint.wireId) {
            const newWaypoints = [...(w.waypoints || [])]
            newWaypoints[draggingWaypoint.index] = { x, y }
            return { ...w, waypoints: newWaypoints }
          }
          return w
        }),
      )
    }
  }

  const handleCanvasMouseUp = () => {
    setDraggingComponent(null)
    setDraggingWaypoint(null)
  }

  const handlePinClick = (comp, pinIndex) => {
    if (connectingFrom) {
      if (connectingFrom.compId !== comp.id) {
        const newWire = {
          id: `wire-${Date.now()}`,
          from: connectingFrom,
          to: { compId: comp.id, pin: pinIndex },
          waypoints: [], // Initialize with empty waypoints array
        }
        setWires([...wires, newWire])
      }
      setConnectingFrom(null)
    } else {
      setConnectingFrom({ compId: comp.id, pin: pinIndex })
    }
  }

  const addWaypointToWire = (wireId, x, y) => {
    setWires(
      wires.map((w) => {
        if (w.id === wireId) {
          const waypoints = w.waypoints || []
          return { ...w, waypoints: [...waypoints, { x, y }] }
        }
        return w
      }),
    )
    setSelectedWire(wireId)
  }

  const removeWaypoint = (wireId, index) => {
    setWires(
      wires.map((w) => {
        if (w.id === wireId) {
          const waypoints = [...(w.waypoints || [])]
          waypoints.splice(index, 1)
          return { ...w, waypoints }
        }
        return w
      }),
    )
  }

  const toggleSwitch = (compId) => {
    setComponents(components.map((c) => (c.id === compId ? { ...c, state: c.state === "on" ? "off" : "on" } : c)))
  }

  const deleteSelected = () => {
    if (selectedComponent) {
      setComponents(components.filter((c) => c.id !== selectedComponent))
      setWires(wires.filter((w) => w.from.compId !== selectedComponent && w.to.compId !== selectedComponent))
      setSelectedComponent(null)
      setShowReplaceMenu(false)
    }
  }

  const replaceComponent = (newType) => {
    if (selectedComponent) {
      setComponents(
        components.map((c) =>
          c.id === selectedComponent
            ? {
              ...c,
              type: newType,
              label: `${componentTypes.find((t) => t.id === newType).name} ${c.id.split("-")[1]}`,
            }
            : c,
        ),
      )
      setShowReplaceMenu(false)
    }
  }

  const deleteWire = (wireId) => {
    setWires(wires.filter((w) => w.id !== wireId))
    setHoveredWire(null)
    setSelectedWire(null)
  }

  const clearCircuit = () => {
    setComponents([])
    setWires([])
    setIsSimulating(false)
    setFanRotations({})
  }

  const loadDefaultCircuit = () => {
    setComponents(defaultCircuit.components)
    setWires(defaultCircuit.wires)
    setCurrentType(defaultCircuit.currentType)
    setIsSimulating(false)
    setFanRotations({})
    setNextId(17) // Updated to match new component count
  }

  const saveCircuit = () => {
    const data = { components, wires, currentType }
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "circuit.json"
    a.click()
  }

  const loadCircuit = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const data = JSON.parse(event.target.result)
        setComponents(data.components)
        setWires(data.wires)
        setCurrentType(data.currentType)
      }
      reader.readAsText(file)
    }
  }

  const getPinPosition = (comp, pinIndex) => {
    const offset = 35
    return pinIndex === 0 ? { x: comp.x - offset, y: comp.y } : { x: comp.x + offset, y: comp.y }
  }

  const generateWirePath = (fromPos, toPos, waypoints = []) => {
    if (waypoints.length === 0) {
      return `M ${fromPos.x} ${fromPos.y} L ${toPos.x} ${toPos.y}`
    }

    let path = `M ${fromPos.x} ${fromPos.y}`

    // Create smooth curves through waypoints
    const allPoints = [fromPos, ...waypoints, toPos]

    for (let i = 0; i < allPoints.length - 1; i++) {
      const current = allPoints[i]
      const next = allPoints[i + 1]

      if (i === 0 || i === allPoints.length - 2) {
        // First and last segments use quadratic curves for smoother connection
        const midX = (current.x + next.x) / 2
        const midY = (current.y + next.y) / 2
        path += ` Q ${current.x} ${current.y}, ${midX} ${midY}`
        if (i === allPoints.length - 2) {
          path += ` Q ${next.x} ${next.y}, ${next.x} ${next.y}`
        }
      } else {
        path += ` L ${next.x} ${next.y}`
      }
    }

    return path
  }

  // COMPLETELY NEW CIRCUIT SIMULATION LOGIC
  const simulateCircuit = () => {
    // Step 1: Find power sources that match current type
    const activePowerSources = components.filter((c) => {
      const type = componentTypes.find((t) => t.id === c.type)
      return type?.isPowerSource && type.powerType === currentType
    })

    // Start with everything off
    const newComponents = components.map((c) => ({
      ...c,
      powered: false,
      diagnostic: null,
    }))

    // If no power sources, diagnose all components
    if (activePowerSources.length === 0) {
      newComponents.forEach((comp) => {
        const type = componentTypes.find((t) => t.id === comp.type)
        if (!type?.isPowerSource) {
          comp.diagnostic = {
            issues: [`No ${currentType} power source in the circuit`],
            fixes: [`Add a ${currentType === "DC" ? "Battery" : "AC Source"} to the canvas`],
          }
        }
      })
      setComponents(newComponents)
      return
    }

    // Mark power sources as powered
    activePowerSources.forEach((powerSource) => {
      const psComp = newComponents.find((c) => c.id === powerSource.id)
      if (psComp) psComp.powered = true
    })

    // Step 2: For each component, check if it's in a complete circuit
    newComponents.forEach((comp) => {
      const type = componentTypes.find((t) => t.id === comp.type)
      if (type?.isPowerSource) return // Skip power sources

      // CRITICAL CHECK 1: Must have EXACTLY 2 wires
      const componentWires = wires.filter((w) => w.from.compId === comp.id || w.to.compId === comp.id)

      if (componentWires.length < 2) {
        comp.diagnostic = {
          issues: componentWires.length === 0 ? ["No wires connected"] : ["Only 1 wire connected - need 2 wires"],
          fixes: ["Connect wires to both yellow pins"],
        }
        return
      }

      // CRITICAL CHECK 2: Must be in a complete circuit with power source
      let isInCompleteCircuit = false

      activePowerSources.forEach((ps) => {
        if (checkCompleteCircuit(ps.id, comp.id)) {
          isInCompleteCircuit = true
        }
      })

      if (isInCompleteCircuit) {
        comp.powered = true
        comp.diagnostic = null
      } else {
        comp.diagnostic = {
          issues: ["Not in a complete circuit loop"],
          fixes: [
            "Make sure wires create a loop: Power → Component → back to Power",
            "Check that all connections are complete",
          ],
        }
      }
    })

    setComponents(newComponents)
  }

  // Check if component is in a COMPLETE circuit with power source
  const checkCompleteCircuit = (powerSourceId, componentId) => {
    // Must have at least 3 wires for a minimal circuit (source-comp-source)
    if (wires.length < 2) return false

    // Build a map of which components each wire connects
    const wireMap = new Map()

    wires.forEach((wire) => {
      const comp1 = wire.from.compId
      const comp2 = wire.to.compId

      // Check if there's an open switch blocking this wire
      const fromComp = components.find((c) => c.id === comp1)
      const toComp = components.find((c) => c.id === comp2)

      if (fromComp?.type === "switch" && fromComp.state === "off") return
      if (toComp?.type === "switch" && toComp.state === "off") return

      if (!wireMap.has(comp1)) wireMap.set(comp1, [])
      if (!wireMap.has(comp2)) wireMap.set(comp2, [])

      wireMap.get(comp1).push(comp2)
      wireMap.get(comp2).push(comp1)
    })

    // Check if we can reach the component from power source
    const canReachComponent = bfs(powerSourceId, componentId, wireMap)
    if (!canReachComponent) return false

    // Check if we can return to power source from component
    // But we must take a DIFFERENT path (not just backtrack)
    const canReturnToPower = bfsWithoutBacktrack(componentId, powerSourceId, wireMap, powerSourceId)

    return canReturnToPower
  }

  // Simple BFS to check if target is reachable
  const bfs = (start, target, graph) => {
    if (start === target) return true

    const visited = new Set()
    const queue = [start]
    visited.add(start)

    while (queue.length > 0) {
      const current = queue.shift()

      const neighbors = graph.get(current) || []
      for (const neighbor of neighbors) {
        if (neighbor === target) return true

        if (!visited.has(neighbor)) {
          visited.add(neighbor)
          queue.push(neighbor)
        }
      }
    }

    return false
  }

  // BFS that checks for a return path (ensuring a loop exists)
  const bfsWithoutBacktrack = (start, target, graph, mustInclude) => {
    const visited = new Set()
    const queue = [[start, new Set([start])]]

    while (queue.length > 0) {
      const [current, path] = queue.shift()

      if (current === target && path.size > 2) {
        // Found target with a path longer than 2 nodes
        return true
      }

      const neighbors = graph.get(current) || []
      for (const neighbor of neighbors) {
        if (!path.has(neighbor)) {
          const newPath = new Set(path)
          newPath.add(neighbor)
          queue.push([neighbor, newPath])
        }
      }
    }

    return false
  }

  useEffect(() => {
    if (isSimulating) {
      simulateCircuit()
      const interval = setInterval(simulateCircuit, 500)
      return () => clearInterval(interval)
    } else {
      setComponents(components.map((c) => ({ ...c, powered: false, diagnostic: null })))
      setFanRotations({})
    }
  }, [isSimulating, wires, components.map((c) => `${c.id}-${c.state}`).join(",")])

  useEffect(() => {
    if (isSimulating) {
      const interval = setInterval(() => {
        setFanRotations((prev) => {
          const newRotations = { ...prev }
          components.forEach((comp) => {
            if (comp.type === "fan" && comp.powered) {
              newRotations[comp.id] = ((newRotations[comp.id] || 0) + 10) % 360
            }
          })
          return newRotations
        })
      }, 50)
      return () => clearInterval(interval)
    }
  }, [isSimulating, components])

  const renderComponent = (comp) => {
    const isActive = isSimulating && comp.powered

    switch (comp.type) {
      case "battery":
        return (
          <svg width="70" height="70" viewBox="0 0 70 70">
            <rect x="15" y="10" width="40" height="50" fill="#2d5016" stroke="#000" strokeWidth="2" rx="3" />
            <rect x="28" y="5" width="14" height="8" fill="#2d5016" stroke="#000" strokeWidth="2" />
            <line x1="25" y1="30" x2="45" y2="30" stroke="#fff" strokeWidth="3" />
            <line x1="25" y1="40" x2="45" y2="40" stroke="#fff" strokeWidth="3" />
            <line x1="35" y1="35" x2="35" y2="45" stroke="#fff" strokeWidth="3" />
            <text x="35" y="25" fontSize="10" fill="#fff" textAnchor="middle">
              DC
            </text>
          </svg>
        )

      case "ac-source":
        return (
          <svg width="70" height="70" viewBox="0 0 70 70">
            <circle cx="35" cy="35" r="30" fill="#fbbf24" stroke="#000" strokeWidth="2" />
            <path d="M 15 35 Q 25 25, 35 35 T 55 35" stroke="#000" strokeWidth="3" fill="none" />
            <text x="35" y="50" fontSize="10" fill="#000" textAnchor="middle" fontWeight="bold">
              AC
            </text>
          </svg>
        )

      case "bulb":
        return (
          <svg width="70" height="70" viewBox="0 0 70 70">
            <circle cx="35" cy="30" r="20" fill={isActive ? "#fff59d" : "#e0e0e0"} stroke="#000" strokeWidth="2" />
            {isActive && (
              <>
                <circle cx="35" cy="30" r="25" fill="#fff59d" opacity="0.3" />
                <circle cx="35" cy="30" r="30" fill="#fff59d" opacity="0.1" />
                <line x1="35" y1="5" x2="35" y2="15" stroke="#fff59d" strokeWidth="2" />
                <line x1="35" y1="45" x2="35" y2="55" stroke="#fff59d" strokeWidth="2" />
                <line x1="10" y1="30" x2="20" y2="30" stroke="#fff59d" strokeWidth="2" />
                <line x1="50" y1="30" x2="60" y2="30" stroke="#fff59d" strokeWidth="2" />
              </>
            )}
            <path d="M 28 48 L 28 55 L 42 55 L 42 48" fill="#757575" stroke="#000" strokeWidth="2" />
            <rect x="30" y="55" width="10" height="5" fill="#424242" stroke="#000" strokeWidth="1" />
            <line x1="30" y1="35" x2="40" y2="25" stroke="#000" strokeWidth="1" />
            <line x1="30" y1="25" x2="40" y2="35" stroke="#000" strokeWidth="1" />
          </svg>
        )

      case "fan":
        const rotation = fanRotations[comp.id] || 0
        return (
          <svg width="70" height="70" viewBox="0 0 70 70">
            <circle cx="35" cy="35" r="32" fill="#e3f2fd" stroke="#1976d2" strokeWidth="2" />
            <g transform={`rotate(${isActive ? rotation : 0}, 35, 35)`}>
              <ellipse cx="35" cy="15" rx="8" ry="15" fill="#1976d2" />
              <ellipse cx="35" cy="55" rx="8" ry="15" fill="#1976d2" />
              <ellipse cx="15" cy="35" rx="15" ry="8" fill="#1976d2" />
              <ellipse cx="55" cy="35" rx="15" ry="8" fill="#1976d2" />
            </g>
            <circle cx="35" cy="35" r="6" fill="#0d47a1" />
          </svg>
        )

      case "kettle":
        return (
          <svg width="70" height="70" viewBox="0 0 70 70">
            <path
              d="M 15 25 L 15 50 Q 15 60, 25 60 L 45 60 Q 55 60, 55 50 L 55 25 Z"
              fill="#d32f2f"
              stroke="#000"
              strokeWidth="2"
            />
            <rect x="20" y="20" width="30" height="8" fill="#b71c1c" stroke="#000" strokeWidth="1" />
            <ellipse cx="60" cy="35" rx="5" ry="8" fill="#d32f2f" stroke="#000" strokeWidth="2" />
            <path d="M 25 15 Q 35 10, 45 15" stroke="#000" strokeWidth="2" fill="none" />
            {isActive && (
              <>
                <path d="M 28 10 Q 30 5, 32 10" stroke="#9e9e9e" strokeWidth="1.5" fill="none" opacity="0.7" />
                <path d="M 35 8 Q 37 3, 39 8" stroke="#9e9e9e" strokeWidth="1.5" fill="none" opacity="0.7" />
                <path d="M 42 10 Q 44 5, 46 10" stroke="#9e9e9e" strokeWidth="1.5" fill="none" opacity="0.7" />
              </>
            )}
          </svg>
        )

      case "tv":
        return (
          <svg width="70" height="70" viewBox="0 0 70 70">
            <rect
              x="10"
              y="15"
              width="50"
              height="35"
              fill={isActive ? "#1e88e5" : "#424242"}
              stroke="#000"
              strokeWidth="2"
              rx="2"
            />
            {isActive && <rect x="13" y="18" width="44" height="29" fill="#64b5f6" opacity="0.8" />}
            <rect x="15" y="52" width="40" height="6" fill="#616161" stroke="#000" strokeWidth="1" rx="1" />
            <rect x="28" y="58" width="14" height="4" fill="#757575" />
            <circle cx="55" cy="25" r="2" fill="#f44336" />
            <circle cx="55" cy="32" r="2" fill="#4caf50" />
          </svg>
        )

      case "switch":
        const isClosed = comp.state === "on"
        return (
          <svg width="70" height="70" viewBox="0 0 70 70">
            <rect x="10" y="28" width="50" height="14" fill="#757575" stroke="#000" strokeWidth="2" rx="2" />
            <circle cx="18" cy="35" r="4" fill="#424242" />
            <circle cx="52" cy="35" r="4" fill="#424242" />
            <line
              x1="18"
              y1="35"
              x2={isClosed ? "52" : "35"}
              y2={isClosed ? "35" : "20"}
              stroke="#ffa726"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx={isClosed ? "35" : "35"} cy={isClosed ? "35" : "20"} r="3" fill="#ff9800" />
            <text x="35" y="55" fontSize="8" fill="#000" textAnchor="middle" fontWeight="bold">
              {isClosed ? "CLOSED" : "OPEN"}
            </text>
          </svg>
        )

      case "resistor":
        return (
          <svg width="70" height="70" viewBox="0 0 70 70">
            <rect x="15" y="25" width="40" height="20" fill="#ff9800" stroke="#000" strokeWidth="2" />
            <rect x="20" y="28" width="5" height="14" fill="#6d4c41" />
            <rect x="30" y="28" width="5" height="14" fill="#fdd835" />
            <rect x="40" y="28" width="5" height="14" fill="#6d4c41" />
            <rect x="50" y="28" width="5" height="14" fill="#fdd835" />
            <line x1="5" y1="35" x2="15" y2="35" stroke="#000" strokeWidth="2" />
            <line x1="55" y1="35" x2="65" y2="35" stroke="#000" strokeWidth="2" />
          </svg>
        )

      case "fuse":
        return (
          <svg width="70" height="70" viewBox="0 0 70 70">
            <rect x="15" y="28" width="40" height="14" fill="#ffeb3b" stroke="#000" strokeWidth="2" rx="7" />
            <line x1="20" y1="35" x2="50" y2="35" stroke="#d32f2f" strokeWidth="2" />
            <circle cx="15" cy="35" r="3" fill="#9e9e9e" />
            <circle cx="55" cy="35" r="3" fill="#9e9e9e" />
          </svg>
        )

      default:
        return null
    }
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <div className="bg-white shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="text-yellow-500" size={32} />
          <h1 className="text-2xl font-bold text-gray-800">Circuit Builder</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
            <span className="text-sm font-medium">Current Type:</span>
            <button
              onClick={() => setCurrentType("DC")}
              className={`px-3 py-1 rounded font-semibold text-sm transition ${currentType === "DC" ? "bg-green-500 text-white" : "bg-gray-300 hover:bg-gray-400"
                }`}
            >
              DC
            </button>
            <button
              onClick={() => setCurrentType("AC")}
              className={`px-3 py-1 rounded font-semibold text-sm transition ${currentType === "AC" ? "bg-yellow-500 text-white" : "bg-gray-300 hover:bg-gray-400"
                }`}
            >
              AC
            </button>
          </div>

          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition ${isSimulating ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
              } text-white`}
          >
            {isSimulating ? <Square size={18} /> : <Play size={18} />}
            {isSimulating ? "Stop" : "Simulate"}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-white shadow-lg p-4 overflow-y-auto">
          <h2 className="text-lg font-bold mb-4 text-gray-800">Components</h2>
          <div className="space-y-2">
            {componentTypes.map((type) => (
              <div
                key={type.id}
                draggable
                onDragStart={(e) => handleDragStart(e, type)}
                className={`${type.color} p-3 rounded-lg cursor-move hover:opacity-80 transition text-white font-medium`}
              >
                {type.name}
              </div>
            ))}
          </div>

          <div className="mt-6 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2">
              <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold mb-1">Circuit Rules:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Need power source (Battery/AC)</li>
                  <li>• Connect wires to both pins</li>
                  <li>• Create complete loop circuit</li>
                  <li className="font-semibold text-blue-700">• Click wire to select & see bends</li>
                  <li className="font-semibold text-blue-700">• Double-click wire to add bend</li>
                  <li className="font-semibold text-blue-700">• Drag blue dots to organize</li>
                  <li className="font-semibold text-blue-700">• Right-click blue dot to remove</li>
                  <li>• Right-click component to replace</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="bg-white shadow p-3 flex items-center gap-2 justify-between">
            <div className="flex gap-2">
              <button
                onClick={clearCircuit}
                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2"
              >
                <Plus size={18} />
                New
              </button>
              <button
                onClick={loadDefaultCircuit}
                className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center gap-2"
              >
                <Zap size={18} />
                Default
              </button>
              <button
                onClick={saveCircuit}
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
              >
                <Save size={18} />
                Save
              </button>
              <label className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2 cursor-pointer">
                <FolderOpen size={18} />
                Load
                <input type="file" accept=".json" onChange={loadCircuit} className="hidden" />
              </label>
            </div>

            <div className="flex gap-2">
              <button
                onClick={deleteSelected}
                disabled={!selectedComponent}
                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 flex items-center gap-2"
              >
                <Trash2 size={18} />
                Delete
              </button>
              <button
                onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                <ZoomIn size={18} />
              </button>
              <button
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                <ZoomOut size={18} />
              </button>
            </div>
          </div>

          <div
            ref={canvasRef}
            onDrop={handleCanvasDrop}
            onDragOver={(e) => e.preventDefault()}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onClick={() => setShowReplaceMenu(false)}
            onContextMenu={(e) => e.preventDefault()}
            className="flex-1 relative overflow-auto bg-white"
            style={{
              backgroundImage: "radial-gradient(circle, #ddd 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          >
            <svg className="absolute inset-0 pointer-events-none" style={{ width: "100%", height: "100%" }}>
              {wires.map((wire) => {
                const fromComp = components.find((c) => c.id === wire.from.compId)
                const toComp = components.find((c) => c.id === wire.to.compId)
                if (!fromComp || !toComp) return null

                const fromPos = getPinPosition(fromComp, wire.from.pin)
                const toPos = getPinPosition(toComp, wire.to.pin)

                const isPowered = isSimulating && fromComp.powered && toComp.powered
                const isHovered = hoveredWire === wire.id
                const showWaypoints = isHovered || selectedWire === wire.id

                const scaledFromPos = { x: fromPos.x * zoom, y: fromPos.y * zoom }
                const scaledToPos = { x: toPos.x * zoom, y: toPos.y * zoom }
                const scaledWaypoints = (wire.waypoints || []).map((wp) => ({ x: wp.x * zoom, y: wp.y * zoom }))
                const wirePath = generateWirePath(scaledFromPos, scaledToPos, scaledWaypoints)

                return (
                  <g key={wire.id}>
                    <path
                      d={wirePath}
                      stroke={isPowered ? "#fbbf24" : "#6b7280"}
                      strokeWidth={isPowered ? 4 : 3}
                      fill="none"
                      className={isPowered ? "animate-pulse" : ""}
                    />
                    <path
                      d={wirePath}
                      stroke="transparent"
                      strokeWidth="20"
                      fill="none"
                      className="pointer-events-auto cursor-pointer"
                      onMouseEnter={() => setHoveredWire(wire.id)}
                      onMouseLeave={() => setHoveredWire(null)}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedWire(wire.id === selectedWire ? null : wire.id)
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation()
                        const rect = canvasRef.current.getBoundingClientRect()
                        const x = (e.clientX - rect.left) / zoom
                        const y = (e.clientY - rect.top) / zoom
                        addWaypointToWire(wire.id, x, y)
                      }}
                    />
                    {showWaypoints && (
                      <path
                        d={wirePath}
                        stroke="#3b82f6"
                        strokeWidth="5"
                        fill="none"
                        className="pointer-events-none"
                        opacity="0.5"
                      />
                    )}
                    {showWaypoints &&
                      (wire.waypoints || []).map((waypoint, idx) => (
                        <g key={`waypoint-${idx}`}>
                          <circle
                            cx={waypoint.x * zoom}
                            cy={waypoint.y * zoom}
                            r="8"
                            fill="#3b82f6"
                            stroke="#fff"
                            strokeWidth="3"
                            className="pointer-events-auto cursor-move hover:scale-125 transition-transform"
                            onMouseDown={(e) => {
                              e.stopPropagation()
                              setDraggingWaypoint({ wireId: wire.id, index: idx })
                            }}
                            onContextMenu={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              removeWaypoint(wire.id, idx)
                            }}
                          />
                          <circle
                            cx={waypoint.x * zoom}
                            cy={waypoint.y * zoom}
                            r="12"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2"
                            className="pointer-events-none animate-ping"
                            opacity="0.4"
                          />
                        </g>
                      ))}
                  </g>
                )
              })}
            </svg>

            <div style={{ transform: `scale(${zoom})`, transformOrigin: "0 0" }}>
              {components.map((comp) => {
                return (
                  <div key={comp.id}>
                    <div
                      onMouseDown={(e) => handleComponentMouseDown(e, comp)}
                      onMouseEnter={() => setHoveredComponent(comp)}
                      onMouseLeave={() => setHoveredComponent(null)}
                      onClick={() => comp.type === "switch" && toggleSwitch(comp.id)}
                      className={`absolute cursor-move transition-all ${selectedComponent === comp.id ? "ring-4 ring-blue-600 rounded-lg" : ""
                        }`}
                      style={{
                        left: comp.x - 35,
                        top: comp.y - 35,
                        width: 70,
                        height: 70,
                      }}
                    >
                      {renderComponent(comp)}
                    </div>

                    {[0, 1].map((pinIndex) => {
                      const pinPos = getPinPosition(comp, pinIndex)
                      return (
                        <div
                          key={`${comp.id}-pin-${pinIndex}`}
                          onClick={() => handlePinClick(comp, pinIndex)}
                          className="absolute w-4 h-4 bg-yellow-500 rounded-full cursor-pointer border-2 border-white hover:scale-150 transition pointer-events-auto z-10"
                          style={{
                            left: pinPos.x - 8,
                            top: pinPos.y - 8,
                            boxShadow:
                              connectingFrom?.compId === comp.id && connectingFrom?.pin === pinIndex
                                ? "0 0 10px #fbbf24"
                                : "",
                          }}
                        />
                      )
                    })}

                    <div
                      className="absolute text-xs font-semibold bg-white px-2 py-1 rounded shadow pointer-events-none"
                      style={{
                        left: comp.x - 40,
                        top: comp.y + 45,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {comp.label}
                    </div>
                  </div>
                )
              })}
            </div>

            {hoveredComponent && isSimulating && (
              <div className="absolute bottom-4 right-4 bg-white/95 p-2 rounded-lg shadow-lg max-w-xs z-20 border border-gray-200">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div
                    className={`w-2 h-2 rounded-full ${hoveredComponent.powered ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
                  ></div>
                  <h3 className="font-semibold text-sm text-gray-800">{hoveredComponent.label}</h3>
                </div>

                {hoveredComponent.powered ? (
                  <div className="bg-green-50 border border-green-200 rounded p-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-sm">✅</span>
                      <span className="font-semibold text-xs text-green-800">WORKING</span>
                    </div>
                    <p className="text-xs text-green-700">Receiving power through complete circuit.</p>
                  </div>
                ) : (
                  hoveredComponent.diagnostic && (
                    <div className="space-y-2">
                      <div className="bg-red-50 border border-red-200 rounded p-2">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-sm">⚠️</span>
                          <span className="font-semibold text-xs text-red-800">NOT WORKING</span>
                        </div>

                        {hoveredComponent.diagnostic.issues.length > 0 && (
                          <div className="mb-1.5">
                            <p className="text-xs font-semibold text-red-700 mb-0.5">Problem:</p>
                            {hoveredComponent.diagnostic.issues.map((issue, idx) => (
                              <p key={idx} className="text-xs text-red-600 mb-0.5">
                                • {issue}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>

                      {hoveredComponent.diagnostic.fixes.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded p-2">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-xs">💡</span>
                            <span className="font-semibold text-xs text-blue-800">Fix:</span>
                          </div>
                          {hoveredComponent.diagnostic.fixes.map((fix, idx) => (
                            <p key={idx} className="text-xs text-blue-700 mb-0.5">
                              {idx + 1}. {fix}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            )}

            {showReplaceMenu && selectedComponent && (
              <div
                className="fixed bg-white rounded-lg shadow-2xl border-2 border-gray-300 p-3 z-50"
                style={{
                  left: replaceMenuPosition.x,
                  top: replaceMenuPosition.y,
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-sm font-bold text-gray-700 mb-2 pb-2 border-b">Replace Component With:</div>
                <div className="space-y-1">
                  {componentTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => replaceComponent(type.id)}
                      className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm font-medium transition flex items-center gap-2`}
                    >
                      <div className={`w-4 h-4 rounded ${type.color}`}></div>
                      {type.name}
                    </button>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t">
                  <button
                    onClick={deleteSelected}
                    className="w-full text-left px-3 py-2 rounded bg-red-50 hover:bg-red-100 text-sm font-medium text-red-700 transition flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete Component
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CircuitBuilder
