"use client";
import {
  Activity,
  Briefcase,
  Camera,
  Cloud,
  Globe,
  Laptop,
  MapPin,
  Network,
  Power,
  Route,
  Server,
  X,
} from "lucide-react";
import { useState } from "react";

export const NetworkTopology = () => {
  const [activeNode, setActiveNode] = useState(null);

  // Modals
  const [showMonitorModal, setShowMonitorModal] = useState(false);
  const [showNvrModal, setShowNvrModal] = useState(false);
  const [selectedNvr, setSelectedNvr] = useState(null); // 'A' or 'B'
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [selectedSwitch, setSelectedSwitch] = useState(null);
  const [showGatewayModal, setShowGatewayModal] = useState(false);
  const [activeNvrTab, setActiveNvrTab] = useState("storage");

  // --- GENERATE NODES (HELPER) ---
  // Kita membuat node secara manual agar posisinya presisi untuk topologi yang padat
  const initialNodes = [
    // ==========================================
    // SITE A (KALTARA) - Subnet 192.168.10.x
    // ==========================================
    // Cluster A1 (Cams 1-5 -> PoE A1)
    {
      id: "cam_a1",
      x: 80,
      y: 100,
      type: "camera",
      label: "Cam A1",
      ip: "192.168.10.101",
      location: "Pit A - Utara",
      status: "online",
      site: "A",
    },
    {
      id: "cam_a2",
      x: 80,
      y: 150,
      type: "camera",
      label: "Cam A2",
      ip: "192.168.10.102",
      location: "Pit A - Selatan",
      status: "online",
      site: "A",
    },
    {
      id: "cam_a3",
      x: 80,
      y: 200,
      type: "camera",
      label: "Cam A3",
      ip: "192.168.10.103",
      location: "Dump Truck Park",
      status: "online",
      site: "A",
    },
    {
      id: "cam_a4",
      x: 80,
      y: 250,
      type: "camera",
      label: "Cam A4",
      ip: "192.168.10.104",
      location: "Fuel Station A",
      status: "offline",
      site: "A",
    },
    {
      id: "cam_a5",
      x: 80,
      y: 300,
      type: "camera",
      label: "Cam A5",
      ip: "192.168.10.105",
      location: "Pos Security 1",
      status: "online",
      site: "A",
    },
    {
      id: "poe_a1",
      x: 250,
      y: 200,
      type: "switch",
      label: "PoE SW A1",
      ip: "192.168.10.2",
      detail: "Distribution Cluster A1",
      status: "online",
      site: "A",
    },

    // Cluster A2 (Cams 6-10 -> PoE A2)
    {
      id: "cam_a6",
      x: 80,
      y: 400,
      type: "camera",
      label: "Cam A6",
      ip: "192.168.10.106",
      location: "Jetty Loading",
      status: "online",
      site: "A",
    },
    {
      id: "cam_a7",
      x: 80,
      y: 450,
      type: "camera",
      label: "Cam A7",
      ip: "192.168.10.107",
      location: "Jetty Stockpile",
      status: "online",
      site: "A",
    },
    {
      id: "cam_a8",
      x: 80,
      y: 500,
      type: "camera",
      label: "Cam A8",
      ip: "192.168.10.108",
      location: "Conveyor Belt",
      status: "online",
      site: "A",
    },
    {
      id: "cam_a9",
      x: 80,
      y: 550,
      type: "camera",
      label: "Cam A9",
      ip: "192.168.10.109",
      location: "Power Plant",
      status: "online",
      site: "A",
    },
    {
      id: "cam_a10",
      x: 80,
      y: 600,
      type: "camera",
      label: "Cam A10",
      ip: "192.168.10.110",
      location: "Mess Hall A",
      status: "online",
      site: "A",
    },
    {
      id: "poe_a2",
      x: 250,
      y: 500,
      type: "switch",
      label: "PoE SW A2",
      ip: "192.168.10.3",
      detail: "Distribution Cluster A2",
      status: "online",
      site: "A",
    },

    // Site A Core & Server Room
    {
      id: "core_a",
      x: 450,
      y: 350,
      type: "router",
      label: "Core Switch A",
      ip: "192.168.10.1",
      detail: "Site A Backbone",
      status: "online",
      site: "A",
    },
    {
      id: "nvr_a",
      x: 600,
      y: 280,
      type: "nvr",
      label: "NVR Site A",
      ip: "192.168.10.10",
      detail: "Recording Server A",
      status: "online",
      site: "A",
    },
    {
      id: "gw_a",
      x: 600,
      y: 420,
      type: "gateway",
      label: "Gateway A",
      ip: "192.168.10.254",
      public_ip: "202.155.1.10",
      detail: "VPN Endpoint A",
      status: "online",
      site: "A",
    },

    // ==========================================
    // SITE B (KALSEL) - Subnet 192.168.20.x
    // ==========================================
    // Cluster B1 (Cams 1-5 -> PoE B1)
    {
      id: "cam_b1",
      x: 80,
      y: 800,
      type: "camera",
      label: "Cam B1",
      ip: "192.168.20.101",
      location: "Hauling Road KM5",
      status: "online",
      site: "B",
    },
    {
      id: "cam_b2",
      x: 80,
      y: 850,
      type: "camera",
      label: "Cam B2",
      ip: "192.168.20.102",
      location: "Hauling Road KM10",
      status: "online",
      site: "B",
    },
    {
      id: "cam_b3",
      x: 80,
      y: 900,
      type: "camera",
      label: "Cam B3",
      ip: "192.168.20.103",
      location: "Bridge A",
      status: "online",
      site: "B",
    },
    {
      id: "cam_b4",
      x: 80,
      y: 950,
      type: "camera",
      label: "Cam B4",
      ip: "192.168.20.104",
      location: "Bridge B",
      status: "offline",
      site: "B",
    },
    {
      id: "cam_b5",
      x: 80,
      y: 1000,
      type: "camera",
      label: "Cam B5",
      ip: "192.168.20.105",
      location: "Security Post B",
      status: "online",
      site: "B",
    },
    {
      id: "poe_b1",
      x: 250,
      y: 900,
      type: "switch",
      label: "PoE SW B1",
      ip: "192.168.20.2",
      detail: "Distribution Cluster B1",
      status: "online",
      site: "B",
    },

    // Cluster B2 (Cams 6-10 -> PoE B2)
    {
      id: "cam_b6",
      x: 80,
      y: 1100,
      type: "camera",
      label: "Cam B6",
      ip: "192.168.20.106",
      location: "Warehouse B",
      status: "online",
      site: "B",
    },
    {
      id: "cam_b7",
      x: 80,
      y: 1150,
      type: "camera",
      label: "Cam B7",
      ip: "192.168.20.107",
      location: "Workshop Heavy",
      status: "online",
      site: "B",
    },
    {
      id: "cam_b8",
      x: 80,
      y: 1200,
      type: "camera",
      label: "Cam B8",
      ip: "192.168.20.108",
      location: "Explosive Storage",
      status: "online",
      site: "B",
    },
    {
      id: "cam_b9",
      x: 80,
      y: 1250,
      type: "camera",
      label: "Cam B9",
      ip: "192.168.20.109",
      location: "Admin Office",
      status: "online",
      site: "B",
    },
    {
      id: "cam_b10",
      x: 80,
      y: 1300,
      type: "camera",
      label: "Cam B10",
      ip: "192.168.20.110",
      location: "Main Gate B",
      status: "online",
      site: "B",
    },
    {
      id: "poe_b2",
      x: 250,
      y: 1200,
      type: "switch",
      label: "PoE SW B2",
      ip: "192.168.20.3",
      detail: "Distribution Cluster B2",
      status: "online",
      site: "B",
    },

    // Site B Core & Server Room
    {
      id: "core_b",
      x: 450,
      y: 1050,
      type: "router",
      label: "Core Switch B",
      ip: "192.168.20.1",
      detail: "Site B Backbone",
      status: "online",
      site: "B",
    },
    {
      id: "nvr_b",
      x: 600,
      y: 980,
      type: "nvr",
      label: "NVR Site B",
      ip: "192.168.20.10",
      detail: "Recording Server B",
      status: "online",
      site: "B",
    },
    {
      id: "gw_b",
      x: 600,
      y: 1120,
      type: "gateway",
      label: "Gateway B",
      ip: "192.168.20.254",
      public_ip: "202.155.2.20",
      detail: "VPN Endpoint B",
      status: "online",
      site: "B",
    },

    // ==========================================
    // CLOUD & HEAD OFFICE
    // ==========================================
    {
      id: "cloud",
      x: 850,
      y: 700,
      type: "cloud",
      label: "ISP / WAN",
      detail: "Internet Backbone",
      status: "online",
    },
    {
      id: "laptop_bos",
      x: 1050,
      y: 700,
      type: "laptop",
      label: "Laptop Bos (JKT)",
      ip: "172.16.x.x",
      detail: "Central Monitoring",
      status: "online",
    },
  ];

  const initialConnections = [
    // --- SITE A CONNECTIONS ---
    // Cluster 1
    { from: "cam_a1", to: "poe_a1" },
    { from: "cam_a2", to: "poe_a1" },
    { from: "cam_a3", to: "poe_a1" },
    { from: "cam_a4", to: "poe_a1" },
    { from: "cam_a5", to: "poe_a1" },
    // Cluster 2
    { from: "cam_a6", to: "poe_a2" },
    { from: "cam_a7", to: "poe_a2" },
    { from: "cam_a8", to: "poe_a2" },
    { from: "cam_a9", to: "poe_a2" },
    { from: "cam_a10", to: "poe_a2" },
    // Backbone A
    { from: "poe_a1", to: "core_a", type: "fiber" },
    { from: "poe_a2", to: "core_a", type: "fiber" },
    { from: "core_a", to: "nvr_a" },
    { from: "core_a", to: "gw_a" },
    // Uplink A
    { from: "gw_a", to: "cloud", type: "wan" },

    // --- SITE B CONNECTIONS ---
    // Cluster 1
    { from: "cam_b1", to: "poe_b1" },
    { from: "cam_b2", to: "poe_b1" },
    { from: "cam_b3", to: "poe_b1" },
    { from: "cam_b4", to: "poe_b1" },
    { from: "cam_b5", to: "poe_b1" },
    // Cluster 2
    { from: "cam_b6", to: "poe_b2" },
    { from: "cam_b7", to: "poe_b2" },
    { from: "cam_b8", to: "poe_b2" },
    { from: "cam_b9", to: "poe_b2" },
    { from: "cam_b10", to: "poe_b2" },
    // Backbone B
    { from: "poe_b1", to: "core_b", type: "fiber" },
    { from: "poe_b2", to: "core_b", type: "fiber" },
    { from: "core_b", to: "nvr_b" },
    { from: "core_b", to: "gw_b" },
    // Uplink B
    { from: "gw_b", to: "cloud", type: "wan" },

    // --- HEAD OFFICE ---
    { from: "cloud", to: "laptop_bos", type: "wan" },
  ];

  const [nodes, setNodes] = useState(initialNodes);
  const [connections, setConnections] = useState(initialConnections);

  // --- LOGIC: TOGGLE STATUS (POWER ON/OFF) ---
  const toggleNodeStatus = (nodeId) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            status: node.status === "online" ? "offline" : "online",
          };
        }
        return node;
      })
    );
  };

  // --- LOGIC: GET PORT STATUS FOR SWITCH ---
  const getSwitchPorts = (switchId) => {
    const connectedDevices = connections
      .filter((c) => c.to === switchId)
      .map((c) => nodes.find((n) => n.id === c.from));

    // Simulate 8-16 port switch
    return Array(10)
      .fill(null)
      .map((_, i) => {
        const device = connectedDevices[i];
        return {
          id: i + 1,
          device: device,
          active: device ? device.status === "online" : false,
        };
      });
  };

  // --- RENDER HELPERS ---
  const renderIcon = (node) => {
    const isOffline = node.status === "offline";
    // Base Colors
    let colorClass = "text-slate-600";
    if (!isOffline) {
      if (node.type === "camera") colorClass = "text-red-600";
      else if (node.type === "switch") colorClass = "text-blue-600";
      else if (node.type === "router") colorClass = "text-purple-600";
      else if (node.type === "gateway") colorClass = "text-orange-600";
      else if (node.type === "nvr") colorClass = "text-slate-900";
      else if (node.type === "cloud") colorClass = "text-sky-500";
      else if (node.type === "laptop") colorClass = "text-indigo-600";
    } else {
      colorClass = "text-slate-300"; // Dimmed if offline
    }

    switch (node.type) {
      case "camera":
        return <Camera size={20} className={colorClass} />;
      case "switch":
        return <Network size={24} className={colorClass} />;
      case "router":
        return <Activity size={28} className={colorClass} />;
      case "gateway":
        return <Route size={28} className={colorClass} />;
      case "nvr":
        return <Server size={32} className={colorClass} />;
      case "cloud":
        return <Cloud size={40} className={colorClass} />;
      case "laptop":
        return <Laptop size={32} className={colorClass} />;
      default:
        return <div />;
    }
  };

  const getConnectionColor = (conn) => {
    const startNode = nodes.find((n) => n.id === conn.from);

    // Logic: If device is offline, line is grey/red
    if (startNode?.type === "camera") {
      return startNode.status === "online" ? "#22c55e" : "#ef4444";
    }
    if (startNode?.status === "offline") return "#94a3b8";

    if (conn.type === "fiber") return "#F59E0B"; // Orange Fiber
    if (conn.type === "wan") return "#0EA5E9"; // Blue Internet
    return "#64748b"; // Default Grey LAN
  };

  const handleNodeClick = (node) => {
    if (node.type === "laptop") setShowMonitorModal(true);
    if (node.type === "nvr") {
      setSelectedNvr(node.site);
      setShowNvrModal(true);
    }
    if (node.type === "switch") {
      setSelectedSwitch(node);
      setShowSwitchModal(true);
    }
    if (node.type === "gateway") setShowGatewayModal(true);
  };

  return (
    <div className="flex flex-col items-center bg-slate-50  p-6 font-sans">
      <div className="w-full max-w-7xl bg-white rounded-xl shadow-xl overflow-hidden relative flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center z-20 sticky top-0">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Globe className="text-blue-400" /> Enterprise Multi-Site CCTV
              System
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Full Topology: 20 Cameras, 4 Switches, 2 Sites, 1 Head Office.
            </p>
          </div>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>{" "}
              Site A (Online)
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>{" "}
              Site B (Online)
            </div>
          </div>
        </div>

        {/* Diagram Area - TALL CONTAINER FOR SCROLLING */}
        <div className="relative w-full h-[80vh] bg-slate-100 overflow-y-auto overflow-x-hidden border-b border-slate-300">
          {/* ZONES BACKGROUNDS */}
          {/* Site A Zone */}
          <div className="absolute left-4 top-4 w-[700px] h-[650px] bg-red-50/50 border-2 border-dashed border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 font-bold text-red-800 opacity-60 text-lg">
              <MapPin /> MINING SITE A (Kalimantan Timur)
            </div>
            <div className="text-xs text-red-600 ml-8 font-mono">
              Subnet: 192.168.10.0/24 | VLAN 10
            </div>
          </div>

          {/* Site B Zone */}
          <div className="absolute left-4 top-[750px] w-[700px] h-[650px] bg-blue-50/50 border-2 border-dashed border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 font-bold text-blue-800 opacity-60 text-lg">
              <MapPin /> MINING SITE B (Kalimantan Selatan)
            </div>
            <div className="text-xs text-blue-600 ml-8 font-mono">
              Subnet: 192.168.20.0/24 | VLAN 20
            </div>
          </div>

          {/* Head Office Zone */}
          <div className="fixed right-10 top-40 w-[250px] h-[300px] bg-white shadow-2xl border-l-4 border-indigo-500 rounded-lg p-4 z-30 hidden xl:block">
            <div className="flex items-center gap-2 font-bold text-indigo-800 mb-2">
              <Briefcase /> HEAD OFFICE
            </div>
            <div className="text-xs text-slate-500 mb-4">
              Jakarta Pusat
              <br />
              Monitoring Center
            </div>
            <div
              className="bg-indigo-50 p-2 rounded text-center cursor-pointer hover:bg-indigo-100 transition-colors"
              onClick={() => setShowMonitorModal(true)}
            >
              <Laptop className="mx-auto text-indigo-600 mb-1" />
              <span className="text-xs font-bold text-indigo-700">
                Buka Laptop Bos
              </span>
            </div>
            <div className="mt-4 text-[10px] text-slate-400">
              Status:{" "}
              <span className="text-green-500 font-bold">VPN Connected</span>
            </div>
          </div>

          {/* SVG CONNECTIONS */}
          <svg className="absolute inset-0 w-full h-[1500px] pointer-events-none z-10">
            {connections.map((conn, idx) => {
              const start = nodes.find((n) => n.id === conn.from);
              const end = nodes.find((n) => n.id === conn.to);
              if (!start || !end) return null;

              const isWan = conn.type === "wan";
              const strokeColor = getConnectionColor(conn);

              // Logic Path
              let d = "";
              if (isWan) {
                // Direct line for WAN
                d = `M ${start.x + 20} ${start.y + 10} L ${end.x} ${end.y}`;
              } else {
                // Bezier for LAN
                const midX = (start.x + end.x) / 2;
                d = `M ${start.x + 20} ${start.y + 15} C ${midX} ${
                  start.y + 15
                }, ${midX} ${end.y + 15}, ${end.x - 20} ${end.y + 15}`;
              }

              return (
                <g key={idx}>
                  <path
                    d={d}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={isWan ? 3 : 2}
                    strokeDasharray={isWan ? "5,5" : "0"}
                  />
                  {/* Animation Particle */}
                  {strokeColor !== "#94a3b8" && strokeColor !== "#ef4444" && (
                    <circle cx="0" cy="0" r="3" fill={strokeColor}>
                      <animateMotion
                        dur={isWan ? "3s" : "1.5s"}
                        repeatCount="indefinite"
                        path={d}
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>

          {/* NODES RENDER */}
          {nodes.map((node) => (
            <div
              key={node.id}
              onClick={() => handleNodeClick(node)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-20 hover:scale-110 group
                ${["camera"].includes(node.type) ? "w-16 h-14" : "w-28 h-20"}
                flex flex-col items-center justify-center p-2 rounded-lg shadow-md border-2 bg-white
                ${
                  node.status === "offline"
                    ? "border-slate-300 bg-slate-50 grayscale"
                    : "border-slate-400"
                }
                ${
                  activeNode === node.id
                    ? "scale-110 border-blue-500 z-30 shadow-xl"
                    : ""
                }
                `}
              style={{ left: node.x, top: node.y }}
              onMouseEnter={() => setActiveNode(node.id)}
              onMouseLeave={() => setActiveNode(null)}
            >
              {renderIcon(node)}
              <span className="text-[10px] font-bold mt-1 text-center leading-tight truncate w-full px-1">
                {node.label}
              </span>

              {/* Special Badges */}
              {[
                "monitor",
                "nvr",
                "gateway",
                "switch",
                "router",
                "laptop",
              ].includes(node.type) && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[8px] px-1.5 rounded-full animate-bounce shadow-lg">
                  KLIK
                </span>
              )}

              {/* Enhanced Tooltip */}
              {activeNode === node.id && (
                <div className="absolute left-full ml-3 top-0 bg-slate-800 text-white text-xs p-3 rounded w-48 z-50 shadow-xl border border-slate-600 pointer-events-none">
                  <div className="font-bold text-sm border-b border-slate-600 pb-1 mb-1">
                    {node.label}
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-400">IP:</span>
                    <span className="font-mono text-blue-300">{node.ip}</span>
                  </div>
                  <div className="text-slate-400 italic mb-2">
                    {node.detail || node.location}
                  </div>

                  {/* Interactive hint in tooltip (Visual only since pointer-events-none) */}
                  {node.type === "camera" && (
                    <div
                      className={`mt-1 px-2 py-1 rounded text-center font-bold ${
                        node.status === "online"
                          ? "bg-green-900 text-green-200"
                          : "bg-red-900 text-red-200"
                      }`}
                    >
                      Status: {node.status.toUpperCase()}
                    </div>
                  )}
                </div>
              )}

              {/* Power Button Overlay for Cameras */}
              {node.type === "camera" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleNodeStatus(node.id);
                  }}
                  className={`absolute -bottom-2 right-1/2 translate-x-1/2 p-1 rounded-full shadow-md hover:scale-110 transition-transform z-40
                        ${
                          node.status === "online"
                            ? "bg-red-500 text-white"
                            : "bg-green-500 text-white"
                        }
                    `}
                  title={
                    node.status === "online"
                      ? "Matikan Kamera"
                      : "Hidupkan Kamera"
                  }
                >
                  <Power size={10} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* --- MODAL: SWITCH PORT VIEW --- */}
        {showSwitchModal && selectedSwitch && (
          <div className="absolute inset-0 bg-slate-900/90 z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in">
            <div className="bg-slate-200 w-full max-w-3xl rounded border-4 border-slate-500 overflow-hidden shadow-2xl">
              <div className="bg-slate-800 text-white p-3 flex justify-between items-center">
                <h3 className="font-bold flex items-center gap-2">
                  <Network /> {selectedSwitch.label} Port Status
                </h3>
                <button onClick={() => setShowSwitchModal(false)}>
                  <X />
                </button>
              </div>
              <div className="p-8 flex justify-center">
                <div className="bg-slate-800 p-4 rounded shadow-inner inline-block border border-slate-600">
                  <div className="flex gap-2 mb-2">
                    <div className="text-xs text-slate-400 font-mono">
                      UPLINK
                    </div>
                    <div className="w-4 h-4 bg-orange-500 rounded animate-pulse"></div>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {getSwitchPorts(selectedSwitch.id).map((p) => (
                      <div key={p.id} className="flex flex-col items-center">
                        <div
                          className={`w-8 h-6 border-2 rounded ${
                            p.active
                              ? "border-green-500 bg-slate-900"
                              : "border-slate-600 bg-slate-900"
                          } relative mb-1`}
                        >
                          {p.active && (
                            <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-400 rounded-full shadow-[0_0_5px_lime]"></div>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">
                          {p.id}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL: LAPTOP BOS MONITORING --- */}
        {showMonitorModal && (
          <div className="absolute inset-0 bg-slate-900/95 z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in">
            <div className="bg-slate-300 w-full max-w-6xl rounded-lg shadow-2xl overflow-hidden h-[95%] flex flex-col border-8 border-slate-700">
              <div className="bg-black p-2 flex justify-between items-center text-slate-400 border-b border-slate-800">
                <span className="text-xs font-mono">
                  HONEYWELL MAXPRO VMS - HEAD OFFICE CLIENT
                </span>
                <button
                  onClick={() => setShowMonitorModal(false)}
                  className="hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex-1 bg-slate-900 p-4 flex gap-4 overflow-hidden">
                {/* Sidebar */}
                <div className="w-48 bg-slate-800 rounded p-2 text-xs text-slate-300 flex flex-col gap-2">
                  <div className="font-bold text-slate-500 mb-1">SITES</div>
                  <div className="p-2 bg-red-900/30 border border-red-900 rounded flex items-center gap-2">
                    <Server size={12} /> SITE A (10 Cam)
                  </div>
                  <div className="p-2 bg-blue-900/30 border border-blue-900 rounded flex items-center gap-2">
                    <Server size={12} /> SITE B (10 Cam)
                  </div>
                </div>
                {/* Video Wall */}
                <div className="flex-1 overflow-y-auto pr-2">
                  <div className="mb-4">
                    <h4 className="text-red-400 font-bold text-sm mb-2 flex items-center gap-2">
                      <MapPin size={14} /> SITE A - KALTARA LIVE FEED
                    </h4>
                    <div className="grid grid-cols-5 gap-1">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className="aspect-video bg-black border border-slate-700 relative group"
                        >
                          <span className="absolute top-1 left-1 text-[8px] text-white bg-black/50 px-1">
                            CAM A{i + 1}
                          </span>
                          {nodes.find((n) => n.id === `cam_a${i + 1}`)
                            ?.status === "online" ? (
                            <div className="w-full h-full flex items-center justify-center text-slate-700 text-[10px]">
                              VIDEO FEED
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-red-900 text-[10px] font-bold bg-red-950/20">
                              NO SIGNAL
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-blue-400 font-bold text-sm mb-2 flex items-center gap-2">
                      <MapPin size={14} /> SITE B - KALSEL LIVE FEED
                    </h4>
                    <div className="grid grid-cols-5 gap-1">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className="aspect-video bg-black border border-slate-700 relative"
                        >
                          <span className="absolute top-1 left-1 text-[8px] text-white bg-black/50 px-1">
                            CAM B{i + 1}
                          </span>
                          {nodes.find((n) => n.id === `cam_b${i + 1}`)
                            ?.status === "online" ? (
                            <div className="w-full h-full flex items-center justify-center text-slate-700 text-[10px]">
                              VIDEO FEED
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-red-900 text-[10px] font-bold bg-red-950/20">
                              NO SIGNAL
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL: GATEWAY & NVR (Reused Logic) --- */}
        {showGatewayModal && (
          <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded max-w-md">
              <h3 className="font-bold text-lg mb-2">Gateway Detail</h3>
              <p className="text-sm">
                Berfungsi sebagai VPN Endpoint untuk menghubungkan Site Tambang
                ke Head Office Jakarta dengan aman.
              </p>
              <button
                onClick={() => setShowGatewayModal(false)}
                className="mt-4 bg-slate-800 text-white px-4 py-2 rounded"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        {showNvrModal && (
          <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded max-w-md">
              <h3 className="font-bold text-lg mb-2">NVR Site {selectedNvr}</h3>
              <p className="text-sm">
                Menyimpan rekaman lokal untuk 10 Kamera di Site {selectedNvr}.
                Terhubung ke Head Office via Gateway.
              </p>
              <button
                onClick={() => setShowNvrModal(false)}
                className="mt-4 bg-slate-800 text-white px-4 py-2 rounded"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
