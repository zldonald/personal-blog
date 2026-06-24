'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

type NodeType = 'default' | 'outcome' | 'milestone' | 'dependency';

interface Node {
  id: string;
  label: string;
  type?: NodeType;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

interface Edge {
  source: string;
  target: string;
}

interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

const graphDataSets: Record<string, GraphData> = {
  'org-structure': {
    nodes: [
      { id: 'founder', label: 'Founder', type: 'outcome' },
      { id: 'product', label: 'Product', type: 'milestone' },
      { id: 'eng', label: 'Engineering', type: 'default' },
      { id: 'gtm', label: 'Go-to-Market', type: 'milestone' },
      { id: 'ops', label: 'Operations', type: 'default' },
      { id: 'advisors', label: 'Advisors', type: 'dependency' },
    ],
    edges: [
      { source: 'founder', target: 'product' },
      { source: 'founder', target: 'gtm' },
      { source: 'founder', target: 'ops' },
      { source: 'founder', target: 'advisors' },
      { source: 'product', target: 'eng' },
      { source: 'gtm', target: 'ops' },
    ],
  },
  'product-vision': {
    nodes: [
      { id: 'taste-api', label: 'Taste API', type: 'outcome' },
      { id: 'ai-products', label: 'AI Products', type: 'milestone' },
      { id: 'frontier-labs', label: 'Frontier Labs', type: 'milestone' },
      { id: 'content-teams', label: 'Content Teams', type: 'default' },
      { id: 'publishers', label: 'Publishers', type: 'default' },
      { id: 'enterprise', label: 'Enterprise', type: 'dependency' },
      { id: 'human-voice', label: 'Human Voice', type: 'outcome' },
      { id: 'writers', label: 'Writers', type: 'default' },
      { id: 'agencies', label: 'Agencies', type: 'default' },
    ],
    edges: [
      { source: 'taste-api', target: 'ai-products' },
      { source: 'taste-api', target: 'frontier-labs' },
      { source: 'ai-products', target: 'content-teams' },
      { source: 'ai-products', target: 'enterprise' },
      { source: 'frontier-labs', target: 'publishers' },
      { source: 'human-voice', target: 'writers' },
      { source: 'human-voice', target: 'agencies' },
      { source: 'writers', target: 'content-teams' },
    ],
  },
  'page-links': {
    nodes: [
      { id: 'manifesto', label: 'Manifesto', type: 'outcome' },
      { id: 'funding', label: 'Funding', type: 'milestone' },
      { id: 'us-plan', label: 'US Plan', type: 'default' },
      { id: 'company', label: 'Company', type: 'default' },
      { id: 'work', label: 'Work to Date', type: 'milestone' },
      { id: 'market', label: 'Market', type: 'dependency' },
    ],
    edges: [
      { source: 'manifesto', target: 'company' },
      { source: 'manifesto', target: 'market' },
      { source: 'funding', target: 'us-plan' },
      { source: 'funding', target: 'work' },
      { source: 'company', target: 'funding' },
      { source: 'us-plan', target: 'market' },
      { source: 'work', target: 'market' },
    ],
  },
  'milestones': {
    nodes: [
      { id: 'idea', label: 'Idea', type: 'default' },
      { id: 'mvp', label: 'MVP', type: 'milestone' },
      { id: 'traction', label: 'Traction', type: 'milestone' },
      { id: 'seed', label: 'Seed Round', type: 'outcome' },
      { id: 'us-entry', label: 'US Entry', type: 'outcome' },
      { id: 'scale', label: 'Scale', type: 'outcome' },
    ],
    edges: [
      { source: 'idea', target: 'mvp' },
      { source: 'mvp', target: 'traction' },
      { source: 'traction', target: 'seed' },
      { source: 'seed', target: 'us-entry' },
      { source: 'us-entry', target: 'scale' },
    ],
  },
};

const nodeStyles: Record<NodeType, { fill: string; stroke: string; shape: 'circle' | 'diamond' | 'square' | 'hexagon' }> = {
  default: { fill: '#A8C5B5', stroke: '#5B8A72', shape: 'circle' },
  outcome: { fill: '#5B8A72', stroke: '#3D6B54', shape: 'diamond' },
  milestone: { fill: '#E8C4A0', stroke: '#D4A574', shape: 'square' },
  dependency: { fill: '#E5C1C1', stroke: '#C9A0A0', shape: 'hexagon' },
};

interface GraphViewProps {
  dataId?: string;
  width?: number;
  height?: number;
}

export function GraphView({ dataId = 'org-structure', width = 600, height = 350 }: GraphViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const selectedRef = useRef<string | null>(null);
  const hoveredRef = useRef<string | null>(null);
  const animationRef = useRef<number | null>(null);
  const initializedRef = useRef(false);

  // Only use state for the status bar display
  const [selectedDisplay, setSelectedDisplay] = useState<{ id: string; label: string } | null>(null);

  const data = graphDataSets[dataId] || graphDataSets['org-structure'];

  const getDescendants = useCallback((nodeId: string, edges: Edge[]): Set<string> => {
    const descendants = new Set<string>();
    const queue = [nodeId];
    while (queue.length > 0) {
      const current = queue.shift()!;
      edges.forEach((edge) => {
        if (edge.source === current && !descendants.has(edge.target)) {
          descendants.add(edge.target);
          queue.push(edge.target);
        }
      });
    }
    return descendants;
  }, []);

  const getPathEdges = useCallback((nodeId: string, edges: Edge[]): Set<string> => {
    const pathEdges = new Set<string>();
    const descendants = getDescendants(nodeId, edges);
    edges.forEach((edge) => {
      if (edge.source === nodeId || descendants.has(edge.source)) {
        pathEdges.add(`${edge.source}-${edge.target}`);
      }
    });
    return pathEdges;
  }, [getDescendants]);

  const drawShape = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    shape: 'circle' | 'diamond' | 'square' | 'hexagon'
  ) => {
    ctx.beginPath();
    switch (shape) {
      case 'circle':
        ctx.arc(x, y, size, 0, Math.PI * 2);
        break;
      case 'diamond':
        ctx.moveTo(x, y - size * 1.3);
        ctx.lineTo(x + size * 1.1, y);
        ctx.lineTo(x, y + size * 1.3);
        ctx.lineTo(x - size * 1.1, y);
        ctx.closePath();
        break;
      case 'square':
        const half = size * 0.9;
        ctx.rect(x - half, y - half, half * 2, half * 2);
        break;
      case 'hexagon':
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 6;
          const px = x + size * Math.cos(angle);
          const py = y + size * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        break;
    }
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const clickedNode = nodesRef.current.find((node) => {
      if (node.x === undefined || node.y === undefined) return false;
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 20;
    });

    if (clickedNode && clickedNode.type === 'outcome') {
      if (selectedRef.current === clickedNode.id) {
        selectedRef.current = null;
        setSelectedDisplay(null);
      } else {
        selectedRef.current = clickedNode.id;
        setSelectedDisplay({ id: clickedNode.id, label: clickedNode.label });
      }
    } else {
      selectedRef.current = null;
      setSelectedDisplay(null);
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const hovered = nodesRef.current.find((node) => {
      if (node.x === undefined || node.y === undefined) return false;
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 20;
    });

    hoveredRef.current = hovered?.id || null;
    canvas.style.cursor = hovered?.type === 'outcome' ? 'pointer' : 'default';
  }, []);

  const handleMouseLeave = useCallback(() => {
    hoveredRef.current = null;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { nodes, edges } = data;

    // Only initialize positions once
    if (!initializedRef.current || nodesRef.current.length !== nodes.length) {
      nodesRef.current = nodes.map((node, i) => ({
        ...node,
        x: width / 2 + Math.cos((i / nodes.length) * Math.PI * 2) * Math.min(width, height) * 0.3,
        y: height / 2 + Math.sin((i / nodes.length) * Math.PI * 2) * Math.min(width, height) * 0.3,
        vx: 0,
        vy: 0,
      }));
      initializedRef.current = true;
    }

    const nodeMap = new Map(nodesRef.current.map((n) => [n.id, n]));

    function draw() {
      if (!ctx) return;

      ctx.fillStyle = '#FAF8F5';
      ctx.fillRect(0, 0, width, height);

      const selected = selectedRef.current;
      const hovered = hoveredRef.current;

      const highlightedNodes = selected
        ? new Set([selected, ...getDescendants(selected, edges)])
        : null;
      const highlightedEdges = selected
        ? getPathEdges(selected, edges)
        : null;

      // Draw edges
      edges.forEach((edge) => {
        const source = nodeMap.get(edge.source);
        const target = nodeMap.get(edge.target);
        if (!source || !target || source.x === undefined || source.y === undefined || target.x === undefined || target.y === undefined) return;

        const edgeKey = `${edge.source}-${edge.target}`;
        const isHighlighted = highlightedEdges?.has(edgeKey);
        const isDimmed = highlightedEdges && !isHighlighted;

        if (isHighlighted) {
          ctx.strokeStyle = '#5B8A72';
          ctx.lineWidth = 2.5;
          ctx.globalAlpha = 1;
        } else if (isDimmed) {
          ctx.strokeStyle = '#D4CFC7';
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.25;
        } else {
          ctx.strokeStyle = '#D4CFC7';
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = 0.8;
        }

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      // Draw nodes
      nodesRef.current.forEach((node) => {
        if (node.x === undefined || node.y === undefined) return;

        const type = node.type || 'default';
        const style = nodeStyles[type];
        const isSelected = node.id === selected;
        const isHovered = node.id === hovered;
        const isInPath = highlightedNodes?.has(node.id);
        const isDimmed = highlightedNodes && !isInPath;

        const baseSize = isSelected ? 14 : isHovered ? 12 : 10;
        const alpha = isDimmed ? 0.2 : 1;

        ctx.globalAlpha = alpha;

        if (isSelected && type === 'outcome') {
          ctx.save();
          ctx.shadowColor = '#5B8A72';
          ctx.shadowBlur = 20;
          ctx.fillStyle = style.fill;
          drawShape(ctx, node.x, node.y, baseSize + 4, style.shape);
          ctx.fill();
          ctx.restore();
        }

        ctx.fillStyle = style.fill;
        ctx.strokeStyle = style.stroke;
        ctx.lineWidth = isSelected ? 3 : isHovered ? 2.5 : 2;

        drawShape(ctx, node.x, node.y, baseSize, style.shape);
        ctx.fill();
        ctx.stroke();

        if (isInPath && !isSelected) {
          ctx.strokeStyle = '#5B8A72';
          ctx.lineWidth = 2;
          ctx.setLineDash([3, 3]);
          drawShape(ctx, node.x, node.y, baseSize + 4, style.shape);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        ctx.fillStyle = isDimmed ? '#B0B0B0' : '#3D3D3D';
        ctx.font = `${isSelected ? 'bold 12px' : isInPath ? '12px' : '11px'} "JetBrains Mono", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(node.label, node.x, node.y + baseSize + 8);

        ctx.globalAlpha = 1;
      });

      drawLegend(ctx);
    }

    function drawLegend(ctx: CanvasRenderingContext2D) {
      const legendX = 12;
      let legendY = height - 72;
      const spacing = 16;

      ctx.globalAlpha = 0.9;
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      const legendItems: { type: NodeType; label: string }[] = [
        { type: 'outcome', label: 'Outcome (clickable)' },
        { type: 'milestone', label: 'Milestone' },
        { type: 'default', label: 'Standard' },
        { type: 'dependency', label: 'Dependency' },
      ];

      legendItems.forEach((item) => {
        const style = nodeStyles[item.type];
        ctx.fillStyle = style.fill;
        ctx.strokeStyle = style.stroke;
        ctx.lineWidth = 1.5;
        drawShape(ctx, legendX + 5, legendY, 5, style.shape);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#7A7A7A';
        ctx.fillText(item.label, legendX + 16, legendY);
        legendY += spacing;
      });

      ctx.globalAlpha = 1;
    }

    function simulate() {
      const centerX = width / 2;
      const centerY = height / 2;

      nodesRef.current.forEach((node) => {
        if (node.x === undefined || node.y === undefined) return;

        node.vx = (node.vx || 0) + (centerX - node.x) * 0.002;
        node.vy = (node.vy || 0) + (centerY - node.y) * 0.002;

        nodesRef.current.forEach((other) => {
          if (node === other || other.x === undefined || other.y === undefined) return;
          const dx = node.x! - other.x;
          const dy = node.y! - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = 1000 / (dist * dist);
          node.vx! += (dx / dist) * force;
          node.vy! += (dy / dist) * force;
        });
      });

      edges.forEach((edge) => {
        const source = nodeMap.get(edge.source);
        const target = nodeMap.get(edge.target);
        if (!source || !target || source.x === undefined || source.y === undefined || target.x === undefined || target.y === undefined) return;

        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (dist - 90) * 0.006;

        source.vx! += (dx / dist) * force;
        source.vy! += (dy / dist) * force;
        target.vx! -= (dx / dist) * force;
        target.vy! -= (dy / dist) * force;
      });

      nodesRef.current.forEach((node) => {
        if (node.x === undefined || node.y === undefined) return;
        node.vx = (node.vx || 0) * 0.88;
        node.vy = (node.vy || 0) * 0.88;
        node.x += node.vx;
        node.y += node.vy;

        node.x = Math.max(70, Math.min(width - 70, node.x));
        node.y = Math.max(35, Math.min(height - 85, node.y));
      });
    }

    function tick() {
      simulate();
      draw();
      animationRef.current = requestAnimationFrame(tick);
    }

    tick();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [data, width, height, drawShape, getDescendants, getPathEdges]);

  return (
    <div className="graph-container">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ display: 'block', width: '100%', height: 'auto' }}
      />
      {selectedDisplay && (
        <div style={{
          padding: '0.625rem 1rem',
          background: '#F5F2ED',
          borderTop: '1px solid #EDEAE4',
          fontSize: '0.8125rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span style={{
            display: 'inline-block',
            width: 8,
            height: 8,
            background: '#5B8A72',
            transform: 'rotate(45deg)',
          }} />
          <span style={{ color: '#5B8A72', fontWeight: 600 }}>
            {selectedDisplay.label}
          </span>
          <span style={{ color: '#7A7A7A' }}>
            — showing downstream path
          </span>
        </div>
      )}
    </div>
  );
}
